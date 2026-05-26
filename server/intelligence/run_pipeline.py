import asyncio
import time

from intelligence.isolation_forest import run_isolation_forest_detection
from intelligence.statistical_detector import run_statistical_detection
from intelligence.incident_engine import run_incident_engine

_last_if_run = 0

async def run_intelligence_pipeline():
    global _last_if_run

    print("\n[PIPELINE] Running...\n")

    run_statistical_detection()

    # Run Isolation Forest only every 5 minutes to save memory
    if time.time() - _last_if_run > 300:
        run_isolation_forest_detection()
        _last_if_run = time.time()
        print("[PIPELINE] Isolation Forest ran")
    else:
        print("[PIPELINE] Isolation Forest skipped (cooldown)")

    run_incident_engine()

    print("\n[PIPELINE] Completed\n")


if __name__ == "__main__":
    asyncio.run(run_intelligence_pipeline())