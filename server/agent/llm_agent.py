import os
import json
from dotenv import load_dotenv

from langchain.agents import create_agent
from langchain.tools import tool
from langchain_groq import ChatGroq

from database.db import create_connection

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ==============================
# TOOLS
# ==============================

@tool
def get_incident_details(incident_id: int) -> dict:
    """
    Fetches full incident details and the associated monitored API
    information (name, endpoint, method) for a given incident ID.
    Use this first to understand what the incident is about.
    """
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            SELECT
                incidents.*,
                monitored_apis.name,
                monitored_apis.endpoint,
                monitored_apis.method
            FROM incidents
            JOIN monitored_apis ON incidents.api_id = monitored_apis.id
            WHERE incidents.id = %s
            """,
            (incident_id,)
        )
        incident = cursor.fetchone()
        if not incident:
            return {"error": f"No incident found with id {incident_id}"}
        return json.dumps(dict(incident), default=str)
    finally:
        cursor.close()
        db.close()


@tool
def get_recent_anomalies(api_id: int) -> list[dict]:
    """
    Fetches the 5 most recent anomalies for a given API ID.
    Returns anomaly type, severity, message, and detection timestamp.
    Use this to understand what signals preceded the incident.
    """
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            SELECT anomaly_type, severity, message, detected_at
            FROM anomalies
            WHERE api_id = %s
            ORDER BY detected_at DESC
            LIMIT 5
            """,
            (api_id,)
        )
        anomalies = cursor.fetchall()
        if not anomalies:
            return json.dumps(
                [{"info": "No recent anomalies found for this API."}],
                default=str
            )
        return json.dumps(
                [dict(a) for a in anomalies],
                default=str
            )
    finally:
        cursor.close()
        db.close()


@tool
def get_incident_history(api_id: int) -> list[dict]:
    """
    Fetches the 5 most recent past incidents for the same API.
    Use this to detect recurring failure patterns or trends.
    """
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            SELECT title, severity, occurrence_count, summary, created_at
            FROM incidents
            WHERE api_id = %s
            ORDER BY created_at DESC
            LIMIT 5
            """,
            (api_id,)
        )
        history = cursor.fetchall()
        if not history:
            return json.dumps(
                [{"info": "No incident history found for this API."}],
                default=str
            )
        return json.dumps(
                [dict(h) for h in history],
                default=str
            )
    finally:
        cursor.close()
        db.close()


@tool
def get_latency_stats(api_id: int) -> dict:
    """
    Computes latency statistics (avg, max, min) and failure rate
    from the last 100 request logs for a given API ID.
    Use this for performance degradation context during RCA.
    """
    db, cursor = create_connection()
    try:
        cursor.execute(
            """
            SELECT
                AVG(latency_ms)  AS avg_latency,
                MAX(latency_ms)  AS max_latency,
                MIN(latency_ms)  AS min_latency,
                COUNT(*)         AS total_requests,
                SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) AS failed_requests
            FROM (
                SELECT latency_ms, success
                FROM request_logs
                WHERE api_id = %s
                ORDER BY timestamp DESC
                LIMIT 100
            ) AS recent_logs
            """,
            (api_id,)
        )
        stats = cursor.fetchone()
        if not stats:
            return json.dumps(
                {"info": "No request logs found for this API."},
                default=str
            )
        result = dict(stats)
        total = result.get("total_requests") or 0
        failed = result.get("failed_requests") or 0
        result["failure_rate_percent"] = round((failed / total) * 100, 2) if total > 0 else 0.0
        return json.dumps(
            result,
            default=str
        )
    finally:
        cursor.close()
        db.close()


@tool
def get_recent_request_logs(api_id: int) -> list[dict]:
    """
    Fetches recent request logs for operational debugging context.
    Useful for identifying repeated status patterns,
    latency spikes, and request instability.
    """
    db, cursor = create_connection()
    try:
        cursor.execute(
            """SELECT status_code, latency_ms, success, error_message, timestamp FROM request_logs WHERE api_id = %s
               ORDER BY timestamp DESC LIMIT 10
            """,
            (api_id,)
        )
        logs = cursor.fetchall()
        return json.dumps(
            [dict(log) for log in logs],
            default=str
        )
    finally:
        cursor.close()
        db.close()


# ==============================
# LLM
# ==============================

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=GROQ_API_KEY,
    temperature=0.3,
    max_tokens=512
)

# ==============================
# AGENT
# ==============================

SYSTEM_PROMPT = """
You are an expert Site Reliability Engineer (SRE) and API infrastructure specialist.

Your job is to perform a thorough Root Cause Analysis (RCA) on API production incidents.

You have access to the following tools:
- get_incident_details    → fetch incident + API metadata
- get_recent_anomalies    → fetch recent anomaly signals for the API
- get_incident_history    → fetch past incidents to detect recurring patterns
- get_latency_stats       → fetch latency and failure rate statistics
- get_recent_request_logs → fetch latest operational logs

Always call ALL tools to gather full context before writing your analysis.
Be concise, technical, and actionable.

Structure your final response exactly as:

1. Root Cause Analysis
2. Probable Technical Reasons
3. Business Impact
4. Recommended Fixes
5. Prevention Strategies
6. Severity Assessment
"""

agent = create_agent(
    model=llm,
    tools=[
        get_incident_details,
        get_recent_anomalies,
        get_incident_history,
        get_latency_stats,
        get_recent_request_logs
    ],
    system_prompt=SYSTEM_PROMPT,
    name="sre_rca_agent"
)

# ==============================
# RUNNER
# ==============================

def run_llm_agent(incident_id: int) -> dict:
    try:
        result = agent.invoke({
            "messages": [{
                "role": "user",
                "content": (
                    f"Perform a full Root Cause Analysis for incident ID: {incident_id}. "
                    "Use all available tools to gather complete context before concluding."
                )
            }]
        })

        # Extract final AI message
        messages = result.get("messages", [])
        analysis = ""
        for msg in reversed(messages):
            if hasattr(msg, "content") and msg.content:
                analysis = msg.content
                break

        print("\n===== AI RCA =====\n")
        print(analysis)

        return {
            "success": True,
            "incident_id": incident_id,
            "analysis": analysis
        }

    except Exception as e:
        print(f"[LLM Agent] Error: {e}")
        return {
            "success": False,
            "message": str(e)
        }