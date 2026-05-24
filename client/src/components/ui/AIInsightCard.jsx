import { motion } from "framer-motion";
import { Sparkles, ChevronRight, AlertTriangle, Info, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { clsx } from "clsx";

const typeIcons = {
  rca: AlertTriangle,
  anomaly: Zap,
  prediction: Sparkles,
  status: Info,
};

const severityColors = {
  critical: "border-l-danger bg-danger/5",
  high: "border-l-orange-400 bg-orange-400/5",
  medium: "border-l-warn bg-warn/5",
  low: "border-l-zinc-600 bg-zinc-800/30",
};

const iconColors = {
  critical: "text-danger",
  high: "text-orange-400",
  medium: "text-warn",
  low: "text-zinc-400",
};

export default function AIInsightCard({ insight, index = 0 }) {
  const Icon = typeIcons[insight.type] || Sparkles;
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={clsx(
        "border-l-2 rounded-r-xl p-3.5 group cursor-pointer transition-all",
        severityColors[insight.severity]
      )}
    >
      <div className="flex items-start gap-3">
        <div className={clsx("mt-0.5 shrink-0", iconColors[insight.severity])}>
          <Icon size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-zinc-200 leading-snug">{insight.title}</p>
            {insight.incidentId && (
              <Link
                to={`/incident/${insight.incidentId}`}
                className="shrink-0 text-zinc-600 hover:text-accent transition-colors"
              >
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{insight.detail}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs text-zinc-600">{insight.ts}</span>
            <span className="flex items-center gap-1 text-xs text-accent">
              <Sparkles size={10} />
              {insight.confidence}% confidence
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
