from datetime import timedelta
from database.db import create_connection


def run_incident_engine():

    db, cursor = create_connection()

    print("[INCIDENT ENGINE] Running...")

    # FETCH RECENT ANOMALIES
    cursor.execute(
        """
        SELECT * FROM anomalies ORDER BY detected_at DESC LIMIT 100
        """
    )

    anomalies = cursor.fetchall()

    for anomaly in anomalies:

        api_id = anomaly["api_id"]

        anomaly_type = anomaly["anomaly_type"]

        severity = anomaly["severity"]

        message = anomaly["message"]

        detected_at = anomaly["detected_at"]

        # CHECK FOR EXISTING INCIDENT
        cursor.execute(
            """
            SELECT * FROM incidents WHERE api_id = %s AND title = %s AND created_at >= %s ORDER BY created_at DESC LIMIT 1
            """,
            (
                api_id,
                anomaly_type,
                detected_at - timedelta(minutes=5)
            )
        )

        existing_incident = cursor.fetchone()

        # INCIDENT EXISTS
        if existing_incident:

            cursor.execute(
                """
                UPDATE incidents
                SET occurrence_count = occurrence_count + 1
                WHERE id = %s
                """,
                (
                    existing_incident["id"],
                )
            )

            db.commit()

            print(
                f"[INCIDENT UPDATED] "
                f"{anomaly_type}"
            )

        # CREATE NEW INCIDENT
        else:

            summary = f"""
            Incident Type:
            {anomaly_type}

            Severity:
            {severity}

            Latest Observation:
            {message}
            """

            cursor.execute(
                """
                INSERT INTO incidents
                (api_id, title, summary, severity,occurrence_count)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (
                    api_id,
                    anomaly_type,
                    summary,
                    severity,
                    1
                )
            )

            db.commit()

            print(
                f"[NEW INCIDENT] "
                f"{anomaly_type}"
            )

    db.close()
    print("[INCIDENT ENGINE] Completed")