import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PageHeader({ title, subtitle, breadcrumbs = [], actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start justify-between mb-6"
    >
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1 mb-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} className="text-zinc-600" />}
                {crumb.href ? (
                  <Link to={crumb.href} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-xs text-zinc-400">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl font-display font-semibold text-zinc-100">{title}</h1>
        {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
