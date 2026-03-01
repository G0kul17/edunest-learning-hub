import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, BookOpen, Users, FileText, ClipboardList,
  Code2, BarChart3, MessageSquare, Settings, LogOut,
  ChevronLeft, ChevronRight, Flame, User, GraduationCap
} from "lucide-react";

const adminNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { label: "Students", icon: Users, path: "/admin/students" },
  { label: "Tests & Quizzes", icon: FileText, path: "/admin/tests" },
  { label: "Assignments", icon: ClipboardList, path: "/admin/assignments" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
];

const studentNav = [
  { label: "Home", icon: LayoutDashboard, path: "/student/dashboard" },
  { label: "My Courses", icon: BookOpen, path: "/student/courses" },
  { label: "Tests", icon: FileText, path: "/student/tests/t1" },
  { label: "Assignments", icon: ClipboardList, path: "/student/assignments" },
  { label: "Code Arena", icon: Code2, path: "/student/coding-arena" },
  { label: "My Progress", icon: Flame, path: "/student/profile" },
  { label: "Forums", icon: MessageSquare, path: "/student/forum" },
];

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = role === "admin" ? adminNav : studentNav;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen glass border-r border-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        <GraduationCap className="w-8 h-8 text-primary shrink-0" />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="ml-3 font-heading font-bold text-lg text-foreground whitespace-nowrap overflow-hidden"
            >
              EduNest
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={cn("w-5 h-5 shrink-0", active && "text-primary")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-primary" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{role}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button onClick={logout} className="text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-secondary border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
