import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Globe, Clock, Activity, TrendingUp, Sparkles, Tag,
  AlertTriangle, CheckCircle, ChevronRight, Code
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import ChartCard from "../components/ui/ChartCard";
import APIStatusBadge from "../components/ui/APIStatusBadge";
import StatCard from "../components/ui/StatCard";
import LatencyChart from "../components/charts/LatencyChart";
import ErrorRateChart from "../components/charts/ErrorRateChart";
import IncidentCard from "../components/incidents/IncidentCard";

import { apis, generateLatencyData, generateErrorRateData } from "../data/apis";
import { incidents, aiInsights } from "../data/incidents";

export default function APIDetails() {
  const { id } = useParams();
  const api = apis.find((a) => a.id === id) || apis[0];
  const latencyData = useMemo(() => generateLatencyData(api.id), [api.id]);
  const errorData = useMemo(() => generateErrorRateData(), []);
  const apiIncidents = incidents.filter((inc) => inc.affectedApis.includes(api.id));
  const apiInsights = aiInsights.filter((ins) => ins.apiId === api.id);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "APIs" }, { label: api.name }]}
        title={api.name}
        subtitle={api.endpoint}
        actions={
          <div className="flex items-center gap-2">
            <APIStatusBadge status={api.status} size="md" />
          </div>
        }
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Avg Latency" value={`${api.avgLatency}ms`} icon={Clock} accentColor="accent" index={0} />
        <StatCard title="P95 Latency" value={`${api.p95Latency}ms`} icon={Activity} accentColor="warn" index={1} />
        <StatCard title="Uptime" value={`${api.uptime}%`} icon={TrendingUp} accentColor="success" index={2} />
        <StatCard title="Error Rate" value={`${api.errorRate}%`} icon={AlertTriangle} accentColor="danger" index={3} />
      </div>

      {/* Endpoint info card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-zinc-600 mb-1">Method</p>
            <span className="text-xs font-mono font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20">
              {api.method}
            </span>
          </div>
          <div>
            <p className="text-xs text-zinc-600 mb-1">Owner</p>
            <p className="text-sm text-zinc-300">{api.owner}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 mb-1">Requests/min</p>
            <p className="text-sm font-mono text-zinc-300">{api.requestsPerMin.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 mb-1">P99 Latency</p>
            <p className="text-sm font-mono text-zinc-300">{api.p99Latency}ms</p>
          </div>
          <div>
            <p className="text-xs text-zinc-600 mb-1">Tags</p>
            <div className="flex gap-1.5">
              {api.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {api.description && (
          <p className="text-sm text-zinc-400 mt-4 pt-4 border-t border-zinc-800">{api.description}</p>
        )}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Latency Trend" subtitle="Avg + P95 over last 24h">
          <LatencyChart data={latencyData} />
        </ChartCard>
        <ChartCard title="Error Rate" subtitle="Last 24h">
          <ErrorRateChart data={errorData} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* AI Debugging Panel */}
        <div className="lg:col-span-2 space-y-4">
          {apiInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5 border border-accent/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-lg bg-accent/15">
                  <Sparkles size={14} className="text-accent" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-200">AI Debugging Analysis</h3>
                <span className="ml-auto text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                  {apiInsights[0].confidence}% confidence
                </span>
              </div>

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">{apiInsights[0].detail}</p>

              {apiInsights[0].incidentId && (() => {
                const inc = incidents.find((i) => i.id === apiInsights[0].incidentId);
                if (!inc) return null;
                return (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Possible Causes</p>
                      <ul className="space-y-1.5">
                        {inc.aiRca.causes.map((c, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                            <span className="text-danger mt-0.5 shrink-0">•</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recommended Fixes</p>
                      <ul className="space-y-1.5">
                        {inc.aiRca.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                            <CheckCircle size={11} className="text-success mt-0.5 shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* Incident history */}
          {apiIncidents.length > 0 && (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-800">
                <h3 className="text-sm font-semibold text-zinc-200">Incident History</h3>
              </div>
              <div className="p-4 space-y-3">
                {apiIncidents.map((inc, i) => (
                  <IncidentCard key={inc.id} incident={inc} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Request timeline / side info */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Response Distribution</h3>
            <div className="space-y-3">
              {[
                { code: "2xx Success", pct: 87.6, color: "bg-success" },
                { code: "4xx Client Error", pct: 8.8, color: "bg-warn" },
                { code: "5xx Server Error", pct: 3.6, color: "bg-danger" },
              ].map((item) => (
                <div key={item.code}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-zinc-400">{item.code}</span>
                    <span className="font-mono text-zinc-300">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-zinc-200 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              {[
                { label: "Monitored since", value: "Jan 3, 2024" },
                { label: "Last incident", value: apiIncidents[0] ? new Date(apiIncidents[0].startedAt).toLocaleDateString() : "Never" },
                { label: "Total incidents", value: apiIncidents.length },
                { label: "Avg recovery time", value: "38 min" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{s.label}</span>
                  <span className="text-zinc-300 font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
