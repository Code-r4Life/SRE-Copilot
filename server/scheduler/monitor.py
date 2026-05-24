import asyncio
import httpx
import time
import os

from datetime import datetime

from database.db import create_connection

from intelligence.run_pipeline import run_intelligence_pipeline

LOG_DIR = "logs"

os.makedirs(LOG_DIR, exist_ok=True)


async def start_monitoring(api):
    api["active"] = True

    db, cursor = create_connection()

    api_id = api["id"]

    name = api["name"]

    endpoint = api["endpoint"]

    method = api["method"]

    interval = api["interval_seconds"]

    safe_name = name.lower().replace(" ", "-")

    log_file = os.path.join(
        LOG_DIR,
        f"{safe_name}.log"
    )

    try:

        while api["active"]:

            start_time = time.time()

            try:

                async with httpx.AsyncClient(timeout=15) as client:

                    response = await client.request(
                        method=method,
                        url=endpoint
                    )

                    latency = round(
                        (time.time() - start_time) * 1000,
                        2
                    )

                    success = response.is_success

                    # STORE LOG
                    cursor.execute(
                        """
                        INSERT INTO request_logs
                        (api_id, status_code, latency_ms, success)
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            api_id,
                            str(response.status_code),
                            latency,
                            success
                        )
                    )

                    db.commit()

                    asyncio.create_task(run_intelligence_pipeline())

                    # ANOMALY DETECTION
                    if latency > 3000:

                        cursor.execute(
                            """
                            INSERT INTO anomalies
                            (api_id, anomaly_type, severity, message)
                            VALUES (%s, %s, %s, %s)
                            """,
                            (
                                api_id,
                                "HIGH_LATENCY",
                                "HIGH",
                                f"Latency spike: {latency}ms"
                            )
                        )

                        db.commit()

                    if str(response.status_code).startswith("5"):

                        cursor.execute(
                            """
                            INSERT INTO anomalies
                            (api_id, anomaly_type, severity, message)
                            VALUES (%s, %s, %s, %s)
                            """,
                            (
                                api_id,
                                "SERVER_ERROR",
                                "CRITICAL",
                                f"Server error: {response.status_code}"
                            )
                        )

                        db.commit()

                    # FILE LOGGING
                    log_entry = f'''
                        [{datetime.now()}]
                        Endpoint: {endpoint}
                        Status: {response.status_code}
                        Latency: {latency}ms
                        Success: {success}
                        --------------------------------------------------
                        '''

                    with open(log_file, "a") as f:
                        f.write(log_entry)

                    print(f"[MONITORING] {name}")

            except Exception as e:

                db.ping(reconnect=True)

                latency = round(
                    (time.time() - start_time) * 1000,
                    2
                )

                error_message = str(e)

                print(f"[ERROR] {error_message}")

                try:

                    # STORE FAILED REQUEST
                    cursor.execute(
                        """
                        INSERT INTO request_logs
                        (
                            api_id,
                            status_code,
                            latency_ms,
                            success,
                            error_message
                        )
                        VALUES (%s, %s, %s, %s, %s)
                        """,
                        (
                            api_id,
                            "ERROR",
                            latency,
                            False,
                            error_message
                        )
                    )

                    db.commit()

                    # STORE ANOMALY
                    cursor.execute(
                        """
                        INSERT INTO anomalies
                        (
                            api_id,
                            anomaly_type,
                            severity,
                            message
                        )
                        VALUES (%s, %s, %s, %s)
                        """,
                        (
                            api_id,
                            "CONNECTION_FAILURE",
                            "CRITICAL",
                            error_message
                        )
                    )

                    db.commit()

                except Exception as db_error:

                    print(f"[DB ERROR] {db_error}")

                # FILE LOGGING
                log_entry = f'''
            [{datetime.now()}]
            Endpoint: {endpoint}
            Status: ERROR
            Latency: {latency}ms
            Success: False
            Error: {error_message}
            --------------------------------------------------
            '''

                with open(log_file, "a") as f:
                    f.write(log_entry)

            await asyncio.sleep(interval)

    except asyncio.CancelledError:
        print(f"[STOPPED] {name}")
        db.close()
        raise