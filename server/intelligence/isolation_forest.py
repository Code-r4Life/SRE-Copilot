import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from database.db import create_connection


def run_isolation_forest_detection():

    db, cursor = create_connection()

    # FETCH LOGS
    cursor.execute(
        """
        SELECT * FROM request_logs ORDER BY timestamp DESC LIMIT 200
        """
    )

    logs = cursor.fetchall()

    if len(logs) < 20:

        print("[IF] Not enough data")

        return

    # CREATE DATAFRAME
    df = pd.DataFrame(logs)

    # FEATURE ENGINEERING
    df["status_numeric"] = df["status_code"].apply(
        lambda x: 500 if str(x) == "ERROR"
        else int(x) if str(x).isdigit()
        else 0
    )

    df["success_numeric"] = df["success"].astype(int)

    # FEATURES
    features = df[
        [
            "latency_ms",
            "status_numeric",
            "success_numeric"
        ]
    ].fillna(0)

    # MODEL
    model = IsolationForest(
        contamination=0.2,
        random_state=42
    )

    # TRAIN
    model.fit(features)

    # PREDICT
    predictions = model.predict(features)

    # SCORES
    scores = model.decision_function(features)

    df["prediction"] = predictions

    df["anomaly_score"] = scores

    # FILTER ANOMALIES
    anomalies = df[df["prediction"] == -1]

    print(
        f"[IF] Found "
        f"{len(anomalies)} anomalies"
    )

    # STORE ANOMALIES
    for _, row in anomalies.iterrows():

        severity = "MEDIUM"

        if row["latency_ms"] > 5000:
            severity = "HIGH"

        if (
            row["status_numeric"] >= 500
            or row["status_numeric"] == 500
        ):
            severity = "CRITICAL"

        cursor.execute(
            """
            INSERT INTO anomalies
            (api_id, anomaly_type, severity, message)
            VALUES (%s, %s, %s, %s)
            """,
            (
                int(row["api_id"]),
                "ISOLATION_FOREST_ANOMALY",
                severity,
                f"""
                    Abnormal API behavior detected.

                    Observed operational symptoms:
                    - Elevated latency detected
                    - Request instability observed
                    - Behavioral deviation from normal API traffic

                    Metrics:
                    - Latency: {row['latency_ms']}ms
                    - Status Code: {row['status_code']}
                    - Anomaly Score: {round(row['anomaly_score'],4)}
                """
            )
        )

        db.commit()

        print(
            f"[IF ANOMALY] "
            f"API={row['api_id']} "
            f"Score={round(row['anomaly_score'],4)}"
        )

    db.close()