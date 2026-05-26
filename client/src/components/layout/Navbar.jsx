import { useState } from "react";
import { Bell, Menu, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  { id: 1, text: "Payment Gateway — P0 incident triggered", time: "2m ago", type: "critical" },
  { id: 2, text: "AI RCA complete: Stripe SDK identified", time: "6m ago", type: "ai" },
  { id: 3, text: "Auth Service latency elevated", time: "22m ago", type: "warning" },
];

export default function Navbar({ onMenuClick }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-14 border-b border-zinc-800 bg-surface/80 backdrop-blur flex items-center px-4 gap-3 shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
      >
        <Menu size={18} />
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* AI Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
          </span>
          <Sparkles size={12} className="text-accent" />
          <span className="text-xs font-medium text-accent">AI Agent Active</span>
        </div>

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl border border-zinc-800 shadow-xl z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-sm font-semibold text-zinc-200">Notifications</p>
                </div>
                <div className="divide-y divide-zinc-800/60">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-zinc-800/30 transition-colors cursor-pointer">
                      <p className="text-xs text-zinc-300">{n.text}</p>
                      <p className="text-xs text-zinc-600 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
