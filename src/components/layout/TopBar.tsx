import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { mockNotifications } from "@/data/mockData";
import { Bell, Search, User, LogOut, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopBar() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="h-16 glass border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left */}
      <div>
        <h2 className="text-foreground font-heading font-semibold">
          {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h2>
        <p className="text-xs text-muted-foreground">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Center — Search */}
      <div className="hidden md:flex items-center">
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground text-sm hover:border-primary/30 transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="ml-4 text-xs bg-background/50 px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 top-12 w-80 glass-strong rounded-xl shadow-2xl border border-border overflow-hidden"
              >
                <div className="p-4 border-b border-border">
                  <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto scrollbar-thin">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer ${
                        !n.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      {showNotifications && (
        <div className="fixed inset-0 z-[-1]" onClick={() => setShowNotifications(false)} />
      )}
    </header>
  );
}
