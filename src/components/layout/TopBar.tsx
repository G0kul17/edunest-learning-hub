import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { mockNotifications } from "@/data/mockData";
import { Bell, Search, Settings, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SettingsModal from "./SettingsModal";

export default function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside — no full-page overlay needed
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate("/login");
  };

  const handleSettings = () => {
    setShowUserMenu(false);
    setShowSettings(true);
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <header className="h-16 glass border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
        {/* Left */}
        <div>
          <h2 className="text-foreground font-heading font-semibold">
            {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </h2>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        </div>

        {/* Center — Search */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground text-sm hover:border-primary/30 transition-colors">
            <Search className="w-4 h-4" />
            <span>Search...</span>
            <kbd className="ml-4 text-xs bg-background/50 px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifications((v) => !v);
                setShowUserMenu(false);
              }}
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
                  className="absolute right-0 top-12 w-80 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-[60]"
                >
                  <div className="p-4 border-b border-border">
                    <h3 className="font-heading font-semibold text-foreground">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {mockNotifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer ${!n.read ? "bg-primary/5" : ""}`}
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

          {/* ── Avatar + Dropdown ── */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="user-menu-btn"
              onClick={() => {
                setShowUserMenu((v) => !v);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary select-none">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium text-foreground leading-none">{user?.name?.split(" ")[0]}</p>
                <p className="text-[10px] text-muted-foreground capitalize">{user?.role}</p>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-56 bg-background border border-border rounded-xl shadow-2xl overflow-hidden z-[60]"
                >
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-border bg-secondary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary select-none">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-1.5">
                    <button
                      onClick={handleSettings}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-secondary transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                        <Settings className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <span>Settings</span>
                    </button>

                    <div className="my-1 border-t border-border/60" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-md bg-destructive/10 flex items-center justify-center">
                        <LogOut className="w-3.5 h-3.5 text-destructive" />
                      </div>
                      <span>Log Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </>
  );
}
