import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Globe,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import StatCard from "../components/ui/StatCard";
import ChartCard from "../components/ui/ChartCard";
import APIStatusBadge from "../components/ui/APIStatusBadge";
import AlertCard from "../components/ui/AlertCard";
import IncidentCard from "../components/incidents/IncidentCard";
import LatencyChart from "../components/charts/LatencyChart";
import ErrorRateChart from "../components/charts/ErrorRateChart";
import IncidentFrequencyChart from "../components/charts/IncidentFrequencyChart";
import PageHeader from "../components/ui/PageHeader";

import useDashboardData from "../hooks/useDashboardData";

import { stopMonitoring } from "../services/api";

export default function Dashboard() {

  const {
    stats,
    apis,
    incidents,
    anomalies,
    loading,
    reload,
  } = useDashboardData();


  // =========================
  // CHART DATA
  // =========================

  const latencyData = apis.map((api) => ({
    name: api.name,
    latency: api.latest_latency || 0,
  }));


  const errorData = incidents.map((incident, index) => ({
    name: `Incident ${index + 1}`,
    errors: incident.occurrence_count || 0,
  }));


  const incidentFreq = anomalies.reduce((acc, anomaly) => {

    const existing = acc.find(
      (item) => item.name === anomaly.severity
    );

    if (existing) {

      existing.value += 1;

    } else {

      acc.push({
        name: anomaly.severity,
        value: 1,
      });
    }

    return acc;

  }, []);


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="p-10 text-zinc-400">
        Loading dashboard...
      </div>
    );
  }


  return (
    <div className="space-y-6 max-w-[1600px]">

      {/* HEADER */}

      <PageHeader
        title="Overview"
        subtitle="Real-time observability across all monitored APIs"
        actions={
          <button
            className="
              flex items-center gap-1.5
              px-3 py-1.5
              rounded-xl
              bg-zinc-800
              text-zinc-400
              hover:text-zinc-200
              text-xs
              transition-colors
            "
          >
            <RefreshCw size={12} />
            Live
          </button>
        }
      />


      {/* KPI CARDS */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <StatCard
          title="APIs Monitored"
          value={stats?.total_apis || 0}
          trend="+1"
          trendLabel="Live"
          icon={Globe}
          accentColor="accent"
          index={0}
        />

        <StatCard
          title="Avg Latency"
          value={`${stats?.avg_latency || 0}ms`}
          trend="Live"
          trendLabel="Current"
          icon={Activity}
          accentColor="warn"
          index={1}
        />

        <StatCard
          title="Active Incidents"
          value={stats?.active_incidents || 0}
          trend="Detected"
          trendLabel="Current"
          icon={AlertTriangle}
          accentColor="danger"
          index={2}
        />

        <StatCard
          title="Success Rate"
          value={`${stats?.success_rate || 0}%`}
          trend="Healthy"
          trendLabel="Requests"
          icon={TrendingUp}
          accentColor="success"
          index={3}
        />

      </div>


      {/* API HEALTH TABLE */}

      <div className="glass rounded-2xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">

          <div>
            <h3 className="text-sm font-semibold text-zinc-200">
              API Health
            </h3>

            <p className="text-xs text-zinc-500 mt-0.5">
              Live status across all endpoints
            </p>
          </div>

          <Link
            to="/"
            className="
              text-xs text-accent
              hover:text-accent/80
              transition-colors
              flex items-center gap-1
            "
          >
            Refresh
            <ExternalLink size={11} />
          </Link>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-xs">

            <thead>

              <tr className="border-b border-zinc-800/60">

                {[
                  "API Name",
                  "Status",
                  "Latency",
                  "Actions",
                ].map((h) => (

                  <th
                    key={h}
                    className="
                      px-5 py-3 text-left
                      font-medium text-zinc-600
                      whitespace-nowrap
                    "
                  >
                    {h}
                  </th>

                ))}

              </tr>

            </thead>


            <tbody className="divide-y divide-zinc-800/40">

              {apis.map((api, i) => (

                <motion.tr
                  key={`${api.id}-${api.name}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="
                    hover:bg-zinc-800/30
                    transition-colors
                    group
                  "
                >

                  {/* NAME */}

                  <td className="px-5 py-3.5">

                    <Link
                      to={`/api/${api.id}`}
                      className="
                        font-medium text-zinc-300
                        group-hover:text-accent
                        transition-colors
                      "
                    >
                      {api.name}
                    </Link>

                    <p className="text-zinc-600 text-xs font-mono truncate max-w-[180px]">
                      {api.method}
                    </p>

                  </td>


                  {/* STATUS */}

                  <td className="px-5 py-3.5">

                    <APIStatusBadge
                      status={
                        api.latest_status >= 500
                          ? "critical"
                          : api.latest_status >= 400
                          ? "warning"
                          : "healthy"
                      }
                    />

                  </td>


                  {/* LATENCY */}

                  <td className="px-5 py-3.5">

                    <span
                      className={`
                        font-mono font-medium
                        ${
                          api.latest_latency > 1000
                            ? "text-danger"
                            : api.latest_latency > 400
                            ? "text-warn"
                            : "text-zinc-300"
                        }
                      `}
                    >
                      {api.latest_latency}ms
                    </span>

                  </td>


                  {/* ACTIONS */}

                  <td className="px-5 py-3.5">

                    {api.is_active && (

                      <button

                        onClick={async () => {

                          await stopMonitoring(api.id);

                          reload();
                        }}

                        className="
                          px-3 py-1
                          rounded-lg
                          bg-red-500/10
                          text-red-400
                          hover:bg-red-500/20
                          transition-colors
                        "
                      >
                        Stop
                      </button>

                    )}

                  </td>

                </motion.tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* INCIDENTS + ANOMALIES */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* INCIDENTS */}

        <div className="glass rounded-2xl overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">

            <div>

              <h3 className="text-sm font-semibold text-zinc-200">
                Active Incidents
              </h3>

              <p className="text-xs text-zinc-500 mt-0.5">
                {incidents.length} incidents
              </p>

            </div>

          </div>


          <div className="p-4 space-y-3">

            {incidents.map((inc, i) => (

              <IncidentCard
                key={inc.id}
                incident={inc}
                index={i}
              />

            ))}

          </div>

        </div>


        {/* ANOMALIES */}

        <div className="space-y-4">

          <div className="glass rounded-2xl overflow-hidden">

            <div className="px-5 py-4 border-b border-zinc-800">

              <h3 className="text-sm font-semibold text-zinc-200">
                Recent Anomalies
              </h3>

            </div>


            <div className="p-3 space-y-1">

              {anomalies.map((a, i) => (

                <AlertCard
                  key={a.id}
                  anomaly={a}
                  index={i}
                />

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}