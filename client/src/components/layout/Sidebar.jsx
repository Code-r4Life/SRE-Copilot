import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Globe, AlertTriangle,
  ChevronLeft, ChevronRight, Zap, X
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "APIs", href: "/api/api-1", icon: Globe },
  { label: "Incidents", href: "/incident/inc-1", icon: AlertTriangle },
  { label: "Add API", href: "/add-api", icon: Zap }
];

function NavItem({ item, collapsed }) {
  const { icon: Icon, label, href } = item;
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
          isActive
            ? "bg-zinc-800 text-white"
            : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60"
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute inset-0 bg-zinc-800 rounded-xl"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <Icon
            size={17}
            className={clsx(
              "relative z-10 shrink-0 transition-colors",
              isActive ? "text-accent" : "text-zinc-600 group-hover:text-zinc-400"
            )}
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="relative z-10 whitespace-nowrap overflow-hidden"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-zinc-800 z-50 flex flex-col lg:hidden"
          >
            <SidebarContent collapsed={false} onClose={onMobileClose} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
        className="hidden lg:flex flex-col h-full bg-surface border-r border-zinc-800 overflow-hidden shrink-0"
      >
        <SidebarContent collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
      </motion.aside>
    </>
  );
}

function SidebarContent({ collapsed, onCollapse, onClose }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo — clicks to landing page */}
      <Link
        to="/"
        className={clsx(
          "flex items-center gap-2.5 px-4 py-5 border-b border-zinc-800 hover:bg-zinc-800/40 transition-colors",
          collapsed && "justify-center"
        )}
      >
        <div className="relative shrink-0">
          <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Zap size={14} className="text-accent" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-success border border-surface" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm font-display font-semibold text-zinc-100 whitespace-nowrap">SRE Copilot</p>
              <p className="text-xs text-zinc-600">AI Monitoring</p>
            </motion.div>
          )}
        </AnimatePresence>
        {onClose && (
          <button
            onClick={(e) => { e.preventDefault(); onClose(); }}
            className="ml-auto text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </button>
        )}
      </Link>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => (
          <NavItem key={item.href} item={item} collapsed={collapsed} />
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      {onCollapse && (
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={onCollapse}
            className={clsx(
              "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-all cursor-pointer",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
          </button>
        </div>
      )}
    </div>
  );
}