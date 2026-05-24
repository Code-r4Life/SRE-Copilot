import { clsx } from "clsx";

const statusConfig = {
  healthy: { label: "Healthy", dot: "bg-success", text: "text-success", bg: "bg-success/10 border-success/20" },
  warning: { label: "Warning", dot: "bg-warn", text: "text-warn", bg: "bg-warn/10 border-warn/20" },
  critical: { label: "Critical", dot: "bg-danger", text: "text-danger", bg: "bg-danger/10 border-danger/20" },
  investigating: { label: "Investigating", dot: "bg-accent", text: "text-accent", bg: "bg-accent/10 border-accent/20" },
  resolved: { label: "Resolved", dot: "bg-success", text: "text-success", bg: "bg-success/10 border-success/20" },
  open: { label: "Open", dot: "bg-danger", text: "text-danger", bg: "bg-danger/10 border-danger/20" },
  high: { label: "High", dot: "bg-orange-400", text: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20" },
  medium: { label: "Medium", dot: "bg-warn", text: "text-warn", bg: "bg-warn/10 border-warn/20" },
  low: { label: "Low", dot: "bg-zinc-400", text: "text-zinc-400", bg: "bg-zinc-400/10 border-zinc-400/20" },
};

export default function APIStatusBadge({ status, size = "sm" }) {
  const config = statusConfig[status] || statusConfig.healthy;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bg,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      )}
    >
      <span className={clsx("relative flex h-1.5 w-1.5 rounded-full", config.dot)}>
        {(status === "critical" || status === "open") && (
          <span className={clsx("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", config.dot)} />
        )}
      </span>
      {config.label}
    </span>
  );
}
