import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Clock,
  Layers,
  ChevronRight,
} from "lucide-react";

import APIStatusBadge from "../ui/APIStatusBadge";

import { clsx } from "clsx";


const severityBorder = {
  CRITICAL: "hover:border-danger/40",
  HIGH: "hover:border-orange-400/40",
  MEDIUM: "hover:border-warn/40",
  LOW: "hover:border-zinc-500/40",
};


export default function IncidentCard({
  incident,
  index = 0,
}) {

  const severity =
    incident.severity?.toUpperCase() || "LOW";


  return (

    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.07
      }}
    >

      <Link to={`/incident/${incident.id}`}>

        <div
          className={clsx(
            `
              glass rounded-xl p-4
              border border-zinc-800
              transition-all group
            `,
            severityBorder[severity]
          )}
        >

          <div className="flex items-start justify-between gap-3">

            <div className="flex-1 min-w-0">

              {/* BADGES */}

              <div className="flex items-center gap-2 mb-2 flex-wrap">

                <APIStatusBadge
                  status={severity.toLowerCase()}
                />

              </div>


              {/* TITLE */}

              <p
                className="
                  text-sm font-medium text-zinc-200
                  group-hover:text-white
                  transition-colors leading-snug
                "
              >
                {incident.title}
              </p>


              {/* SUMMARY */}

              <p
                className="
                  text-xs text-zinc-500
                  mt-1.5 line-clamp-2
                "
              >
                {incident.summary || "No summary available"}
              </p>


              {/* META */}

              <div className="flex items-center gap-4 mt-3 flex-wrap">

                <span
                  className="
                    flex items-center gap-1.5
                    text-xs text-zinc-600
                  "
                >
                  <Clock size={11} />

                  {
                    new Date(
                      incident.created_at || Date.now()
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }

                </span>


                <span
                  className="
                    flex items-center gap-1.5
                    text-xs text-zinc-600
                  "
                >
                  <Layers size={11} />

                  {
                    incident.occurrence_count || 0
                  } events

                </span>


                <span className="text-xs text-zinc-600">

                  API ID:
                  {" "}
                  {incident.api_id}

                </span>

              </div>

            </div>


            <ChevronRight
              size={16}
              className="
                text-zinc-600
                group-hover:text-zinc-400
                shrink-0 mt-1
                transition-colors
              "
            />

          </div>

        </div>

      </Link>

    </motion.div>
  );
}