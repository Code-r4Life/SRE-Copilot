from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import asyncio

from database.db import create_connection

from scheduler.monitor import start_monitoring

from agent.llm_agent import run_llm_agent

app = FastAPI()

active_monitors = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():

    return {
        "message": "Backend Running"
    }


@app.post("/api/monitor")
async def monitor_api(data: dict):
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            INSERT INTO monitored_apis
            (name, endpoint, method, interval_seconds)
            VALUES (%s, %s, %s, %s)
            """,
            (
                data["name"],
                data["endpoint"],
                data["method"],
                data["interval"]
            )
        )
        db.commit()
        api_id = cursor.lastrowid
        api = {
            "id": api_id,
            "name": data["name"],
            "endpoint": data["endpoint"],
            "method": data["method"],
            "interval_seconds": data["interval"]
        }
        task = asyncio.create_task(start_monitoring(api))
        active_monitors[api_id] = {
            "task": task,
            "api": api
        }
        return {
            "success": True,
            "message": f"{data['name']} monitoring started"
        }
    finally:
        cursor.close()
        db.close()


@app.get("/api/dashboard")
def dashboard():
    db, cursor = create_connection()
    try:
        cursor.execute(
            "SELECT COUNT(*) as total FROM monitored_apis"
        )
        total_apis = cursor.fetchone()["total"]
        cursor.execute(
            "SELECT COUNT(*) as total FROM incidents"
        )
        incidents = cursor.fetchone()["total"]
        cursor.execute(
            "SELECT AVG(latency_ms) as avg_latency FROM request_logs"
        )
        latency = cursor.fetchone()["avg_latency"] or 0
        cursor.execute(
            """
            SELECT COUNT(*) as total, SUM(success) as success_count FROM request_logs
            """
        )
        result = cursor.fetchone()
        success_rate = 0
        if result["total"]:
            success_rate = (
                result["success_count"] /
                result["total"]
            ) * 100
        return {
            "total_apis": total_apis,
            "active_incidents": incidents,
            "avg_latency": round(latency, 2),
            "success_rate": round(success_rate, 2)
        }
    finally:
        cursor.close()
        db.close()


@app.get("/api/incidents")
def get_incidents():
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            SELECT * FROM incidents ORDER BY created_at DESC
            """
        )
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


@app.get("/api/anomalies")
def get_anomalies():
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            SELECT * FROM anomalies
            ORDER BY detected_at DESC
            """
    )
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()

@app.get("/api/rca/latest")
def latest_rca():

    db, cursor = create_connection()

    try:

        cursor.execute(
            """
            SELECT id
            FROM incidents
            ORDER BY created_at DESC
            LIMIT 1
            """
        )

        latest_incident = cursor.fetchone()

        if not latest_incident:

            return {
                "success": False,
                "message": "No incidents found"
            }

        incident_id = latest_incident["id"]

        result = run_llm_agent(incident_id)

        return result

    finally:

        cursor.close()
        db.close()    

@app.get("/api/rca/{incident_id}")
async def generate_rca(incident_id: int):
    result = run_llm_agent(incident_id)
    return result

@app.get("/api/apis")
def get_apis():
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            SELECT * FROM monitored_apis ORDER BY created_at DESC
            """
        )
        apis = cursor.fetchall()
        enriched = []
        for api in apis:
            cursor.execute(
                """
                SELECT * FROM request_logs WHERE api_id = %s ORDER BY timestamp DESC LIMIT 1
                """,
                (api["id"],)
            )
            latest = cursor.fetchone()
            api["latest_status"] = latest["status_code"] if latest else "N/A"
            api["latest_latency"] = latest["latency_ms"] if latest else 0
            api["is_active"] = api["id"] in active_monitors
            enriched.append(api)
        return enriched
    finally:
        cursor.close()
        db.close()

@app.post("/api/stop/{api_id}")
async def stop_monitoring(api_id: int):
    if api_id not in active_monitors:
        return {
            "success": False,
            "message": "Monitor not found"
        }
    active_monitors[api_id]["api"]["active"] = False
    active_monitors[api_id]["task"].cancel()
    del active_monitors[api_id]
    return {
        "success": True,
        "message": f"Monitoring stopped for API {api_id}"
    }