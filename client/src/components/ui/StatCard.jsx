import { motion } from "framer-motion";
import { clsx } from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatCard({ title, value, trend, trendLabel, icon: Icon, accentColor = "accent", index = 0 }) {
  const isPositive = trend?.startsWith("+");
  const isNegative = trend?.startsWith("-");

  const colorMap = {
    accent: "text-accent",
    danger: "text-danger",
    warn: "text-warn",
    success: "text-success",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="glass rounded-2xl p-5 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{title}</span>
        {Icon && (
          <div className={clsx("p-2 rounded-xl bg-zinc-800/60 group-hover:bg-zinc-700/60 transition-colors", colorMap[accentColor])}>
            <Icon size={14} />
          </div>
        )}
      </div>

      <div className="flex items-end gap-3">
        <span className="text-3xl font-display font-semibold text-zinc-100 tabular-nums leading-none">
          {value}
        </span>
        {trend && (
          <div className={clsx(
            "flex items-center gap-0.5 text-xs font-medium pb-0.5",
            isNegative ? "text-danger" : isPositive ? "text-success" : "text-zinc-500"
          )}>
            {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {trendLabel && (
        <p className="text-xs text-zinc-600 mt-1.5">{trendLabel}</p>
      )}
    </motion.div>
  );
}
