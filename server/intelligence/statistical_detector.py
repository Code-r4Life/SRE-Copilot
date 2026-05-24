import statistics

from database.db import create_connection

def run_statistical_detection():

    db, cursor = create_connection()

    # GET ALL MONITORED APIs
    cursor.execute(
        """
        SELECT * FROM monitored_apis
        """
    )

    apis = cursor.fetchall()

    for api in apis:

        api_id = api["id"]

        # FETCH RECENT LOGS
        cursor.execute(
            """
            SELECT * FROM request_logs WHERE api_id = %s ORDER BY timestamp DESC LIMIT 30
            """,
            (api_id,)
        )

        logs = cursor.fetchall()

        # NEED SUFFICIENT DATA
        if len(logs) < 10:
            continue

        # LATENCIES
        latencies = [
            log["latency_ms"]
            for log in logs
            if log["latency_ms"] is not None
        ]

        if len(latencies) < 5:
            continue

        latest_latency = latencies[0]

        avg_latency = statistics.mean(latencies)

        std_dev = statistics.stdev(latencies)

        # AVOID DIVISION BY ZERO
        if std_dev == 0:
            continue

        # Z-SCORE
        z_score = (
            latest_latency - avg_latency
        ) / std_dev

        print(
            f"[STATS] API={api_id} "
            f"AVG={round(avg_latency,2)} "
            f"STD={round(std_dev,2)} "
            f"Z={round(z_score,2)}"
        )

        # HIGH LATENCY SPIKE
        if z_score > 2.5:

            cursor.execute(
                """
                INSERT INTO anomalies
                (api_id, anomaly_type, severity, message)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    api_id,
                    "STATISTICAL_LATENCY_SPIKE",
                    "HIGH",
                    f"""
                    Statistical latency anomaly detected.

                    Current latency:
                    {latest_latency}ms

                    Average latency:
                    {round(avg_latency,2)}ms

                    Z-score:
                    {round(z_score,2)}
                    """
                )
            )

            db.commit()

            print(
                f"[ANOMALY] "
                f"Latency spike detected "
                f"for API {api_id}"
            )

        # FAILURE RATE ANALYSIS
        failures = [
            log for log in logs
            if not log["success"]
        ]

        failure_rate = (
            len(failures) / len(logs)
        ) * 100

        print(
            f"[FAILURE RATE] API={api_id} "
            f"{round(failure_rate,2)}%"
        )

        # HIGH FAILURE RATE
        if failure_rate > 40:

            cursor.execute(
                """
                INSERT INTO anomalies
                (api_id, anomaly_type, severity, message)
                VALUES (%s, %s, %s, %s)
                """,
                (
                    api_id,
                    "HIGH_FAILURE_RATE",
                    "CRITICAL",
                    f"""
                    Failure rate anomaly detected.

                    Failure rate:
                    {round(failure_rate,2)}%
                    """
                )
            )

            db.commit()

            print(
                f"[ANOMALY] "
                f"Failure spike detected "
                f"for API {api_id}"
            )

    db.close()