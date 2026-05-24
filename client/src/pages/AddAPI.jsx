import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, ChevronDown, Plus, CheckCircle, AlertTriangle,
  Loader2, Code2, Radio, Zap, Brain, Clock, Sparkles,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { clsx } from "clsx";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];
const INTERVALS = [
  { label: "Every 5s",   value: 5 },
  { label: "Every 10s",  value: 10 },
  { label: "Every 30s",  value: 30 },
  { label: "Every 1 min", value: 60 },
  { label: "Every 5 min", value: 300 },
  { label: "Every 10 min", value: 600 },
  { label: "Every 15 min", value: 900 },
  { label: "Every 30 min", value: 1800 },
];
const PRESETS = [
  { name: "Stripe Payment API", endpoint: "https://api.stripe.com/v1/charges", method: "GET" },
  { name: "GitHub Status",      endpoint: "https://api.github.com",            method: "GET" },
  { name: "Custom Endpoint",    endpoint: "",                                  method: "GET" },
];

const methodColors = {
  GET:    "text-success bg-success/10 border-success/20",
  POST:   "text-accent bg-accent/10 border-accent/20",
  PUT:    "text-warn bg-warn/10 border-warn/20",
  PATCH:  "text-warn bg-warn/10 border-warn/20",
  DELETE: "text-danger bg-danger/10 border-danger/20",
  HEAD:   "text-zinc-400 bg-zinc-800 border-zinc-700",
};

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2 cursor-default">
      {children}
      {required && <span className="text-accent ml-1">*</span>}
    </label>
  );
}

function InputBase({ className = "", ...props }) {
  return (
    <input
      className={clsx(
        "w-full bg-zinc-800/60 border border-zinc-700/70 rounded-xl px-4 py-2.5 text-sm text-zinc-200",
        "placeholder-zinc-600 focus:outline-none focus:border-accent/50 focus:bg-zinc-800 transition-all cursor-text",
        className
      )}
      {...props}
    />
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={clsx(
        "w-full bg-zinc-800/60 border border-zinc-700/70 rounded-xl px-4 py-2.5 text-sm text-zinc-200",
        "placeholder-zinc-600 focus:outline-none focus:border-accent/50 focus:bg-zinc-800 transition-all resize-none font-mono cursor-text",
        className
      )}
      {...props}
    />
  );
}

// ─── RCA Text Formatter ──────────────────────────────────────────────────────
function FormattedRCA({ text }) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      elements.push(<div key={key++} className="h-3" />);
      continue;
    }

    const sectionMatch = line.match(/^(\*{0,2})(\d+)\.\s+(.+?)(\*{0,2})$/);
    if (sectionMatch) {
      const title = sectionMatch[3].replace(/\*/g, "").trim();
      const icons = [Brain, Zap, AlertTriangle, CheckCircle, Radio, Sparkles];
      const colors = ["text-accent", "text-warn", "text-danger", "text-success", "text-accent", "text-warn"];
      const bgColors = ["bg-accent/10 border-accent/20", "bg-warn/10 border-warn/20", "bg-danger/10 border-danger/20", "bg-success/10 border-success/20", "bg-accent/10 border-accent/20", "bg-warn/10 border-warn/20"];
      const idx = (parseInt(sectionMatch[2]) - 1) % icons.length;
      const Icon = icons[idx];
      elements.push(
        <div key={key++} className={clsx("flex items-center gap-2.5 px-3 py-2 rounded-xl border mt-4 mb-2", bgColors[idx])}>
          <Icon size={13} className={colors[idx]} />
          <p className={clsx("text-xs font-bold uppercase tracking-wider", colors[idx])}>{title}</p>
        </div>
      );
      continue;
    }

    const boldHeader = line.match(/^(\*{2}|#{2,3})\s*(.+?)(\*{2})?$/);
    if (boldHeader && !line.match(/^\d+\./)) {
      const title = boldHeader[2].replace(/\*/g, "").replace(/#/g, "").trim();
      elements.push(
        <p key={key++} className="text-xs font-bold text-zinc-300 uppercase tracking-wider mt-4 mb-2 border-b border-zinc-800 pb-1">
          {title}
        </p>
      );
      continue;
    }

    const bulletMatch = line.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      const content = bulletMatch[1].replace(/\*\*/g, "");
      elements.push(
        <div key={key++} className="flex items-start gap-2.5 py-0.5 pl-1">
          <span className="text-accent mt-1.5 shrink-0 text-[10px]">▸</span>
          <p className="text-sm text-zinc-300 leading-relaxed">{content}</p>
        </div>
      );
      continue;
    }

    const numberedItem = line.match(/^\d+\.\s+(.+)$/);
    if (numberedItem && !sectionMatch) {
      const content = numberedItem[1].replace(/\*\*/g, "");
      elements.push(
        <div key={key++} className="flex items-start gap-2.5 py-0.5 pl-1">
          <span className="text-accent mt-1.5 shrink-0 text-[10px]">▸</span>
          <p className="text-sm text-zinc-300 leading-relaxed">{content}</p>
        </div>
      );
      continue;
    }

    const clean = line.replace(/\*\*/g, "").replace(/`([^`]+)`/g, "$1");
    elements.push(
      <p key={key++} className="text-sm text-zinc-400 leading-relaxed">{clean}</p>
    );
  }

  return <div className="space-y-0.5">{elements}</div>;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function AddAPI() {
  const [form, setForm] = useState({ name: "", endpoint: "", method: "GET", interval: 5, headers: "", body: "" });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [liveApis, setLiveApis] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedRca, setSelectedRca] = useState(null);
  const [selectedApiName, setSelectedApiName] = useState("");
  const [anyStopped, setAnyStopped] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handlePreset = (p) => { set("name", p.name); set("endpoint", p.endpoint); set("method", p.method); };

  const fetchApis = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/apis");
      const data = await res.json();
      setLiveApis((prev) =>
        data.map((newApi) => {
          const existing = prev.find((p) => p.id === newApi.id);
          return {
            ...newApi,
            isStopped:  existing?.isStopped  || false,
            rcaLoading: existing?.rcaLoading || false,
            showRca:    existing?.showRca    || false,
          };
        })
      );
    } catch {}
  };

  const generateRca = async (apiId) => {
    const existingApi = liveApis.find((a) => a.id === apiId);
    if (existingApi?.rcaLoading || existingApi?.showRca) return;

    setLiveApis((prev) => prev.map((a) => a.id === apiId ? { ...a, rcaLoading: true } : a));

    try {
      const incidentsRes = await fetch("http://127.0.0.1:8000/api/incidents");
      const incidents = await incidentsRes.json();
      const latestIncident = incidents.find((i) => i.api_id === apiId);

      if (!latestIncident) {
        setSelectedRca(
          "No incidents have been generated yet.\n\n" +
          "• Not enough anomalies detected\n" +
          "• Monitoring stopped too early\n" +
          "• Incident pipeline has not completed yet\n\n" +
          "Keep monitoring longer and retry."
        );
        setSelectedApiName(existingApi?.name || "");
        setLiveApis((prev) => prev.map((a) => a.id === apiId ? { ...a, rcaLoading: false } : a));
        return;
      }

      const rcaRes = await fetch(`http://127.0.0.1:8000/api/rca/${latestIncident.id}`);
      const rca = await rcaRes.json();
      setSelectedRca(rca.analysis);
      setSelectedApiName(existingApi?.name || "");
      setLiveApis((prev) => prev.map((a) => a.id === apiId ? { ...a, rcaLoading: false, showRca: true } : a));
    } catch {
      setLiveApis((prev) => prev.map((a) => a.id === apiId ? { ...a, rcaLoading: false } : a));
    }
  };

  const stopMonitoring = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/stop/${id}`, { method: "POST" });
      setLiveApis((prev) => prev.map((a) => a.id === id ? { ...a, isStopped: true } : a));
      setAnyStopped(true);
    } catch {}
  };

  useEffect(() => {
    fetchApis();
    const timer = setInterval(fetchApis, 5000);
    return () => clearInterval(timer);
  }, []);

  const validateForm = () => {
    if (!form.name.trim()) return "API name is required.";
    if (!form.endpoint.trim()) return "Endpoint URL is required.";
    try { new URL(form.endpoint); } catch { return "Enter a valid URL."; }
    return null;
  };

  const handleSubmit = async () => {
    const err = validateForm();
    if (err) { setErrorMsg(err); setStatus("error"); return; }
    setStatus("loading"); setErrorMsg("");

    let parsedHeaders = {};
    try { if (form.headers.trim()) parsedHeaders = JSON.parse(form.headers); }
    catch { setErrorMsg("Headers must be valid JSON."); setStatus("error"); return; }

    const payload = { name: form.name.trim(), endpoint: form.endpoint.trim(), method: form.method, interval: Number(form.interval), headers: parsedHeaders, body: form.body };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server Error ${res.status}`);
      setStatus("success");
      await fetchApis();
      setTimeout(() => { setForm({ name: "", endpoint: "", method: "GET", interval: 5, headers: "", body: "" }); setStatus("idle"); }, 2000);
    } catch {
      setErrorMsg("Could not connect to backend."); setStatus("error");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <PageHeader
        title="Add API to Monitor"
        subtitle="Configure endpoints and let the AI monitoring agent analyze failures automatically"
      />

      {/* ── Wait notice ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 px-5 py-3.5 rounded-xl bg-accent/8 border border-accent/20"
      >
        <Clock size={15} className="text-accent shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-400 leading-relaxed">
          <span className="font-semibold text-accent">Tip:</span>{" "}
          For accurate and insightful AI Root Cause Analysis, allow at least{" "}
          <span className="text-zinc-200 font-medium">1–2 minutes</span> of monitoring before generating RCA.
          The longer the agent monitors, the richer the context — and the sharper the analysis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── LEFT: Form ──────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Presets */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button key={p.name} onClick={() => handlePreset(p)}
                  className="px-3 py-2 rounded-xl border border-zinc-700 text-xs text-zinc-400 hover:border-accent/40 hover:text-accent transition-all cursor-pointer">
                  {p.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Core form */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className="glass rounded-2xl p-5 space-y-5">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-accent" />
              <span className="text-sm font-semibold text-zinc-200">Endpoint Configuration</span>
            </div>

            <div>
              <FieldLabel required>API Name</FieldLabel>
              <InputBase value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Payment Gateway API" />
            </div>

            <div>
              <FieldLabel required>Endpoint URL</FieldLabel>
              <div className="flex gap-2">
                <div className="relative shrink-0">
                  <select value={form.method} onChange={(e) => set("method", e.target.value)}
                    className={clsx("appearance-none rounded-xl px-3 py-2.5 border text-xs font-semibold pr-7 focus:outline-none cursor-pointer", methodColors[form.method])}>
                    {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none" />
                </div>
                <InputBase value={form.endpoint} onChange={(e) => set("endpoint", e.target.value)} placeholder="https://api.example.com" />
              </div>
            </div>

            <div>
              <FieldLabel>Monitoring Interval</FieldLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {INTERVALS.map((opt) => (
                  <button key={opt.value} onClick={() => set("interval", opt.value)}
                    className={clsx("py-2 rounded-xl text-xs border transition-all cursor-pointer",
                      form.interval === opt.value
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300")}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Advanced */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl overflow-hidden">
            <button onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              <span className="flex items-center gap-2"><Code2 size={14} />Advanced Options</span>
              <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }}><ChevronDown size={14} /></motion.div>
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-zinc-800 space-y-4 pt-4">
                    <div><FieldLabel>Headers (JSON)</FieldLabel><Textarea rows={4} value={form.headers} onChange={(e) => set("headers", e.target.value)} placeholder={'{\n  "Authorization": "Bearer token"\n}'} /></div>
                    <div><FieldLabel>Body</FieldLabel><Textarea rows={4} value={form.body} onChange={(e) => set("body", e.target.value)} placeholder={'{\n  "key": "value"\n}'} /></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Status */}
          <AnimatePresence>
            {status === "error" && (
              <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm flex items-center gap-2">
                <AlertTriangle size={14} />{errorMsg}
              </motion.div>
            )}
            {status === "success" && (
              <motion.div key="ok" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
                <CheckCircle size={14} />Monitoring started successfully
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button onClick={handleSubmit} disabled={status === "loading"}
            whileHover={{ scale: status !== "loading" ? 1.01 : 1 }} whileTap={{ scale: 0.99 }}
            className={clsx("w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer",
              status === "loading" ? "bg-accent/20 border border-accent/30 text-accent cursor-wait" : "bg-accent text-black hover:bg-accent/90")}>
            {status === "loading" ? <><Loader2 size={16} className="animate-spin" />Starting Monitoring…</> : <><Plus size={16} />Start Monitoring</>}
          </motion.button>
        </div>

        {/* ── RIGHT: Panel ─────────────────────────────────────────── */}
        <div className="space-y-5 flex flex-col">
          <AnimatePresence mode="wait">

            {/* STATE A: "How it works" — shown until any API is stopped */}
            {!anyStopped && (
              <motion.div key="how-it-works"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Radio size={13} className="text-accent" />
                  <p className="text-xs font-semibold text-zinc-300">How monitoring works</p>
                </div>
                <ol className="space-y-3">
                  {[
                    "Agent continuously monitors endpoints at your chosen interval",
                    "Metrics, latency, and failures are stored in real-time",
                    "ML models (Isolation Forest + statistical) detect anomalies",
                    "AI generates intelligent Root Cause Analysis on demand",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-xs text-zinc-500 leading-relaxed">{text}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 pt-4 border-t border-zinc-800 flex items-start gap-2">
                  <Clock size={12} className="text-zinc-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Monitor for at least <span className="text-zinc-400">1–2 minutes</span> before generating RCA for the best results.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STATE B: RCA panel — shown after any API is stopped */}
            {anyStopped && (
              <motion.div key="rca-panel"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="glass rounded-2xl overflow-hidden border border-accent/20 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                <div className="relative px-5 py-4 border-b border-zinc-800/60 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-accent/15 border border-accent/25">
                    <Zap size={13} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">AI Root Cause Analysis</p>
                    <p className="text-xs text-zinc-500">SRE Copilot · Groq LLaMA 3.3</p>
                  </div>
                </div>
                <div className="relative p-5">
                  {selectedRca ? (
                    <div>
                      {selectedApiName && (
                        <div className="mb-4 pb-3 border-b border-zinc-800">
                          <p className="text-sm font-semibold text-zinc-200">{selectedApiName}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">AI-generated incident analysis</p>
                        </div>
                      )}
                      <div className="max-h-[38vh] overflow-y-auto pr-1">
                        <FormattedRCA text={selectedRca} />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center border border-dashed border-zinc-800 rounded-xl min-h-[200px] gap-3 px-4">
                      <Brain size={22} className="text-zinc-700" />
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        Stop monitoring an API below, then click{" "}
                        <span className="text-accent font-medium">Get RCA</span> to generate analysis.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live APIs — scrollable independently */}
          {liveApis.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-4">Live Monitoring</p>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                {liveApis.map((api) => (
                  <div key={api.id} className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700">
                    <div className="flex justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-zinc-200 truncate">{api.name}</p>
                        <p className="text-xs text-zinc-500 mt-0.5 break-all">{api.endpoint}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={clsx("w-1.5 h-1.5 rounded-full", api.isStopped ? "bg-red-400" : "bg-green-400 animate-pulse")} />
                          <span className="text-[11px] text-zinc-400">{api.isStopped ? "Stopped" : "Monitoring Active"}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-zinc-300">{api.latest_status}</p>
                        <p className="text-xs text-zinc-600">{api.latest_latency}ms</p>
                      </div>
                    </div>

                    {!api.isStopped ? (
                      <button onClick={() => stopMonitoring(api.id)}
                        className="mt-4 w-full py-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs font-semibold hover:bg-danger/20 transition-all cursor-pointer">
                        Stop Monitoring
                      </button>
                    ) : (
                      <button onClick={() => generateRca(api.id)} disabled={api.rcaLoading || api.showRca}
                        className="mt-4 w-full py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-xs font-semibold hover:bg-accent/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer">
                        {api.rcaLoading ? (
                          <><Loader2 size={11} className="animate-spin" />Generating RCA…</>
                        ) : api.showRca ? (
                          <><CheckCircle size={11} />RCA Generated</>
                        ) : (
                          <><Brain size={11} />Get RCA</>
                        )}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}