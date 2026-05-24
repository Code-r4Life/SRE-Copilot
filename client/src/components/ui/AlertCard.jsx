import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Activity, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const sevColors = {
  critical: { bar: "bg-danger", text: "text-danger", bg: "bg-danger/10" },
  high: { bar: "bg-orange-400", text: "text-orange-400", bg: "bg-orange-400/10" },
  medium: { bar: "bg-warn", text: "text-warn", bg: "bg-warn/10" },
  low: { bar: "bg-zinc-500", text: "text-zinc-400", bg: "bg-zinc-800" },
};

export default function AlertCard({ anomaly, index = 0 }) {
  const c = sevColors[anomaly.severity] || sevColors.medium;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Link to={`/api/${anomaly.apiId}`}>
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group">
          <div className={clsx("p-2 rounded-lg", c.bg)}>
            <Activity size={13} className={c.text} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors truncate">
              {anomaly.api}
            </p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{anomaly.message}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className={clsx("text-xs font-mono font-medium", c.text)}>{anomaly.value}</span>
              <span className="text-xs text-zinc-600">baseline {anomaly.baseline}</span>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="text-xs text-zinc-600">{anomaly.ts}</span>
            <ChevronRight size={12} className="text-zinc-700 group-hover:text-zinc-500 transition-colors" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
