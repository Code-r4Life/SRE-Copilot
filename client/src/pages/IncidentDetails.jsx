import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles, Clock, AlertTriangle, CheckCircle, Zap,
  Users, Rocket, Activity, ChevronRight, ExternalLink
} from "lucide-react";
import { clsx } from "clsx";

import PageHeader from "../components/ui/PageHeader";
import APIStatusBadge from "../components/ui/APIStatusBadge";
import { incidents } from "../data/incidents";
import { apis } from "../data/apis";

const eventIcons = {
  deploy: Rocket,
  anomaly: Activity,
  alert: AlertTriangle,
  ai: Sparkles,
  escalation: Zap,
  human: Users,
  action: CheckCircle,
  recovery: CheckCircle,
};

const eventColors = {
  deploy: "text-zinc-400 border-zinc-700 bg-zinc-800",
  anomaly: "text-warn border-warn/30 bg-warn/10",
  alert: "text-danger border-danger/30 bg-danger/10",
  ai: "text-accent border-accent/30 bg-accent/10",
  escalation: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  human: "text-zinc-300 border-zinc-600 bg-zinc-800",
  action: "text-success border-success/30 bg-success/10",
  recovery: "text-success border-success/30 bg-success/10",
};

export default function IncidentDetails() {
  const { id } = useParams();
  const incident = incidents.find((i) => i.id === id) || incidents[0];
  const affectedApis = incident.affectedApis.map((apiId) => apis.find((a) => a.id === apiId)).filter(Boolean);

  return (
    <div className="space-y-6 max-w-[1200px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Incidents" }, { label: incident.id }]}
        title={incident.title}
        actions={
          <div className="flex items-center gap-2">
            <APIStatusBadge status={incident.severity} size="md" />
            <APIStatusBadge status={incident.status} size="md" />
          </div>
        }
      />

      {/* Overview cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Duration", value: incident.duration, icon: Clock },
          { label: "Total Errors", value: incident.errorCount.toLocaleString(), icon: AlertTriangle },
          { label: "Affected APIs", value: affectedApis.length, icon: Activity },
          { label: "Started", value: new Date(incident.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), icon: Zap },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon size={13} className="text-zinc-600" />
              <p className="text-xs text-zinc-500">{card.label}</p>
            </div>
            <p className="text-2xl font-display font-semibold text-zinc-100 tabular-nums">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: AI RCA */}
        <div className="lg:col-span-2 space-y-5">
          {/* AI RCA Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 border border-accent/25 relative overflow-hidden"
          >
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-accent/15 border border-accent/25">
                  <Sparkles size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">AI Root Cause Analysis</p>
                  <p className="text-xs text-zinc-500">Powered by SRE Copilot Agent</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-xs font-medium text-accent">{incident.aiRca.confidence}% confidence</span>
                </div>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-6">{incident.aiRca.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Root Causes</p>
                  <ul className="space-y-2">
                    {incident.aiRca.causes.map((cause, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <span className="text-danger shrink-0 mt-0.5">→</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Recommendations</p>
                  <ul className="space-y-2">
                    {incident.aiRca.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <CheckCircle size={11} className="text-success shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-600 mb-2">Related metrics</p>
                <div className="flex flex-wrap gap-1.5">
                  {incident.aiRca.relatedMetrics.map((m) => (
                    <span key={m} className="text-xs font-mono px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-sm font-semibold text-zinc-200 mb-5">Incident Timeline</h3>
            <div className="space-y-0">
              {incident.timeline.map((event, i) => {
                const Icon = eventIcons[event.type] || Zap;
                const colors = eventColors[event.type] || eventColors.anomaly;
                const isLast = i === incident.timeline.length - 1;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.06 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={clsx("flex items-center justify-center w-7 h-7 rounded-full border shrink-0", colors)}>
                        <Icon size={12} />
                      </div>
                      {!isLast && <div className="w-px flex-1 bg-zinc-800 my-1" />}
                    </div>
                    <div className={clsx("pb-5", isLast && "pb-0")}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono text-zinc-500">{event.ts}</span>
                      </div>
                      <p className="text-sm text-zinc-300">{event.event}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Affected APIs */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Affected APIs</h3>
            <div className="space-y-2.5">
              {affectedApis.map((api) => (
                <Link
                  key={api.id}
                  to={`/api/${api.id}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors group"
                >
                  <div>
                    <p className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">{api.name}</p>
                    <APIStatusBadge status={api.status} />
                  </div>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-zinc-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Grouped Failures */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Grouped Failures</h3>
            <div className="space-y-3">
              {incident.groupedFailures.map((f) => (
                <div key={f.code}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-zinc-400">{f.code}</span>
                    <span className="text-zinc-500">{f.count.toLocaleString()} ({f.pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${f.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="h-full rounded-full bg-danger"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-3">Description</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{incident.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
