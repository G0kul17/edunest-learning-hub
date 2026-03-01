import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  X, User, Mail, Lock, Eye, EyeOff, Camera, Save, CheckCircle, AlertCircle, Shield
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "profile" | "security";

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  // Profile fields
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarInitial, setAvatarInitial] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // State
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Sync when user changes
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const clearFeedback = () => setTimeout(() => setFeedback(null), 4000);

  const handleSaveProfile = async () => {
    if (!name.trim()) return setFeedback({ type: "error", message: "Name cannot be empty." });
    if (!email.trim() || !email.includes("@")) return setFeedback({ type: "error", message: "Please enter a valid email." });

    setSaving(true);
    const result = await updateUser({ name: name.trim(), email: email.trim() });
    setSaving(false);

    if (result.success) {
      setFeedback({ type: "success", message: "Profile updated successfully!" });
    } else {
      setFeedback({ type: "error", message: result.error || "Failed to update profile." });
    }
    clearFeedback();
  };

  const handleSavePassword = async () => {
    if (!currentPassword) return setFeedback({ type: "error", message: "Please enter your current password." });
    if (!newPassword) return setFeedback({ type: "error", message: "Please enter a new password." });
    if (newPassword.length < 6) return setFeedback({ type: "error", message: "New password must be at least 6 characters." });
    if (newPassword !== confirmPassword) return setFeedback({ type: "error", message: "New passwords do not match." });

    setSaving(true);
    const result = await updateUser({ currentPassword, newPassword });
    setSaving(false);

    if (result.success) {
      setFeedback({ type: "success", message: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setFeedback({ type: "error", message: result.error || "Failed to change password." });
    }
    clearFeedback();
  };

  // Get display avatar: initials from name
  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/30">
                <h2 className="font-heading font-bold text-lg text-foreground">Account Settings</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Bar */}
              <div className="flex border-b border-border px-6">
                {(["profile", "security"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setFeedback(null); }}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize -mb-px ${
                      tab === t
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "profile" ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-5">
                {/* ── Profile Tab ─────────────────────────────────── */}
                {tab === "profile" && (
                  <>
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-xl select-none">
                          {initials}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role} · Joined {user?.joinDate}</p>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Role (read-only) */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Role</label>
                      <div className="px-4 py-2.5 rounded-lg bg-secondary/30 border border-border text-muted-foreground text-sm capitalize flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        {user?.role}
                        <span className="ml-auto text-xs text-muted-foreground/60">Cannot be changed</span>
                      </div>
                    </div>

                    {/* Feedback */}
                    <FeedbackBanner feedback={feedback} />

                    {/* Save */}
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      {saving ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}

                {/* ── Security Tab ─────────────────────────────────── */}
                {tab === "security" && (
                  <>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-2">
                      <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      To change your password, you must first verify your current password.
                    </div>

                    {/* Current Password */}
                    <PasswordField
                      label="Current Password"
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      show={showCurrent}
                      onToggle={() => setShowCurrent(!showCurrent)}
                      placeholder="Enter current password"
                    />

                    {/* New Password */}
                    <PasswordField
                      label="New Password"
                      value={newPassword}
                      onChange={setNewPassword}
                      show={showNew}
                      onToggle={() => setShowNew(!showNew)}
                      placeholder="Min. 6 characters"
                    />

                    {/* Confirm */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`w-full pl-9 pr-4 py-2.5 rounded-lg bg-secondary/50 border text-foreground text-sm focus:outline-none focus:ring-1 transition-all ${
                            confirmPassword && confirmPassword !== newPassword
                              ? "border-destructive/50 focus:ring-destructive/20"
                              : "border-border focus:border-primary/50 focus:ring-primary/20"
                          }`}
                          placeholder="Re-enter new password"
                        />
                      </div>
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p className="text-xs text-destructive mt-1">Passwords do not match</p>
                      )}
                    </div>

                    {/* Feedback */}
                    <FeedbackBanner feedback={feedback} />

                    <button
                      onClick={handleSavePassword}
                      disabled={saving}
                      className="w-full py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      {saving ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      {saving ? "Changing..." : "Change Password"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FeedbackBanner({ feedback }: { feedback: { type: "success" | "error"; message: string } | null }) {
  if (!feedback) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
        feedback.type === "success"
          ? "bg-green-500/10 border border-green-500/20 text-green-400"
          : "bg-red-500/10 border border-red-500/20 text-red-400"
      }`}
    >
      {feedback.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      {feedback.message}
    </motion.div>
  );
}

function PasswordField({
  label, value, onChange, show, onToggle, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; placeholder: string;
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
