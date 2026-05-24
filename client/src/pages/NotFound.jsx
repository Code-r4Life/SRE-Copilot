import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative mb-6 inline-block">
          <div className="text-[120px] font-display font-bold text-zinc-900 leading-none select-none">404</div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Zap size={40} className="text-accent" />
          </motion.div>
        </div>
        <h1 className="text-xl font-display font-semibold text-zinc-200 mb-2">Signal lost</h1>
        <p className="text-sm text-zinc-500 mb-7 max-w-xs mx-auto">
          The monitoring agent can't find this page. It might have been moved or the endpoint is down.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
