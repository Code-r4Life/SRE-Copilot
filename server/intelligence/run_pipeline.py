import asyncio

from intelligence.isolation_forest import (
    run_isolation_forest_detection
)

from intelligence.statistical_detector import (
    run_statistical_detection
)

from intelligence.incident_engine import (
    run_incident_engine
)


async def run_intelligence_pipeline():

    print("\n[PIPELINE] Running...\n")

    run_statistical_detection()

    run_isolation_forest_detection()

    run_incident_engine()

    print("\n[PIPELINE] Completed\n")


if __name__ == "__main__":

    asyncio.run(
        run_intelligence_pipeline()
    )