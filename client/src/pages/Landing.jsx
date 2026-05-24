import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Zap,
  Activity,
  Shield,
  Brain,
  Bell,
  Layers,
  ArrowRight,
  Globe,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-time API Monitoring",
    desc: "Continuous polling of all your endpoints with sub-30s detection latency.",
  },
  {
    icon: Brain,
    title: "AI-Generated RCA",
    desc: "Automated root cause analysis powered by LLMs trained on SRE patterns.",
  },
  {
    icon: Layers,
    title: "Incident Grouping",
    desc: "Cluster related failures across APIs to reduce alert noise by 80%.",
  },
  {
    icon: TrendingUp,
    title: "Latency Anomaly Detection",
    desc: "Statistical 3σ detection catches subtle degradation before users feel it.",
  },
  {
    icon: Bell,
    title: "Smart Alerting",
    desc: "Severity-based routing to Slack, PagerDuty, or email with context.",
  },
  {
    icon: Shield,
    title: "Failure Clustering",
    desc: "Identify patterns across incidents and prevent repeat failures.",
  },
];

const flowSteps = [
  {
    label: "API Endpoint",
    icon: Globe,
    color: "text-zinc-400 border-zinc-700",
  },
  {
    label: "Monitoring Agent",
    icon: Activity,
    color: "text-accent border-accent/40",
  },
  {
    label: "Anomaly Detection",
    icon: TrendingUp,
    color: "text-warn border-warn/40",
  },
  {
    label: "Smart AI Analysis",
    icon: Sparkles,
    color: "text-accent border-accent/40",
  },
  {
    label: "Alerts & RCA",
    icon: Bell,
    color: "text-success border-success/40",
  },
];

const mockApis = [
  {
    name: "Payment Gateway",
    status: "critical",
    latency: "1840ms",
    uptime: "97.2%",
  },
  {
    name: "Auth Service",
    status: "warning",
    latency: "340ms",
    uptime: "99.1%",
  },
  {
    name: "User Profile API",
    status: "healthy",
    latency: "89ms",
    uptime: "99.97%",
  },
];

export default function Landing() {
  return (
    <div className="h-screen overflow-hidden bg-obsidian">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-obsidian/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Zap size={14} className="text-accent" />
            </div>
            <span className="font-display font-semibold text-zinc-100">
              SRE Copilot
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="px-4 py-1.5 rounded-xl text-sm font-medium bg-accent text-obsidian hover:bg-accent/90 transition-colors"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="h-[calc(100vh-56px)] overflow-y-auto overflow-x-hidden mt-14 custom-scrollbar">
        {/* Hero */}
        <section className="pt-20 pb-20 px-5 relative">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Glow */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/10 mb-6"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
              </span>
              <span className="text-xs text-accent font-medium">
                AI Agent monitoring 6 APIs right now
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-zinc-100 leading-tight mb-5"
            >
              AI-Powered API Failure{" "}
              <span className="text-gradient">Detection Before Users</span>{" "}
              Complain
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8"
            >
              Monitor APIs, detect anomalies, group incidents, and receive
              AI-generated debugging insights in real time. No more war rooms —
              let the agent find the root cause.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium bg-accent text-obsidian hover:bg-accent/90 transition-colors text-sm"
              >
                Start Monitoring <ArrowRight size={15} />
              </Link>
              <Link
                to="/incident/inc-1"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors text-sm"
              >
                View Demo
              </Link>
            </motion.div>
          </div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-3xl mx-auto mt-14 relative"
          >
            <div className="glass rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
              <div className="flex items-center px-4 py-3 border-b border-zinc-800">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-danger/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-warn/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
                </div>
                <div className="flex-1 bg-zinc-800 rounded-lg px-3 py-0.5 text-xs text-zinc-600 max-w-48 mx-auto text-center">
                  sre.yourcompany.io/dashboard
                </div>
              </div>
              <div className="p-4 space-y-3">
                {/* Mini KPI cards */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "APIs", value: "6", color: "text-accent" },
                    { label: "Latency", value: "551ms", color: "text-warn" },
                    { label: "Incidents", value: "3", color: "text-danger" },
                    { label: "Success", value: "97.2%", color: "text-success" },
                  ].map((c) => (
                    <div
                      key={c.label}
                      className="bg-zinc-800/60 rounded-xl p-2.5 text-center"
                    >
                      <p className="text-xs text-zinc-600">{c.label}</p>
                      <p
                        className={`text-base font-display font-bold mt-0.5 ${c.color}`}
                      >
                        {c.value}
                      </p>
                    </div>
                  ))}
                </div>
                {/* Mini table */}
                <div className="bg-zinc-800/40 rounded-xl overflow-hidden">
                  {mockApis.map((api) => (
                    <div
                      key={api.name}
                      className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/60 last:border-0"
                    >
                      <span className="text-xs text-zinc-300">{api.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-zinc-500">
                          {api.latency}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            api.status === "critical"
                              ? "text-danger bg-danger/10"
                              : api.status === "warning"
                                ? "text-warn bg-warn/10"
                                : "text-success bg-success/10"
                          }`}
                        >
                          {api.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs text-accent uppercase tracking-widest mb-3">
                Capabilities
              </p>
              <h2 className="text-2xl font-display font-bold text-zinc-100">
                Everything you need for API observability
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                    <f.icon size={16} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-200 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Workflow */}
        <section className="py-20 px-5 border-y border-zinc-800/60">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs text-accent uppercase tracking-widest mb-3">
                How it works
              </p>
              <h2 className="text-2xl font-display font-bold text-zinc-100">
                AI Agent Workflow
              </h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {flowSteps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex flex-col items-center gap-2`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${step.color} bg-zinc-900`}
                    >
                      <step.icon size={18} />
                    </div>
                    <span className="text-xs text-zinc-500 text-center max-w-16">
                      {step.label}
                    </span>
                  </motion.div>
                  {i < flowSteps.length - 1 && (
                    <ChevronRight
                      size={16}
                      className="text-zinc-700 shrink-0 mb-9"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center glass rounded-3xl p-10 border border-zinc-800"
          >
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center mx-auto mb-5">
              <Zap size={20} className="text-accent" />
            </div>
            <h2 className="text-2xl font-display font-bold text-zinc-100 mb-3">
              Start monitoring in minutes
            </h2>
            <p className="text-sm text-zinc-400 mb-7">
              Add your first API and the AI agent starts watching immediately.
              No setup scripts, no YAML.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl font-medium bg-accent text-obsidian hover:bg-accent/90 transition-colors"
            >
              Open Dashboard <ArrowRight size={15} />
            </Link>
          </motion.div>
        </section>

        <footer className="border-t border-zinc-800 py-6 px-5 text-center">
          <p className="text-xs text-zinc-600">
            SRE Copilot — AI-powered observability
          </p>
        </footer>
      </div>
    </div>
  );
}
