import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [enrollmentCode, setEnrollmentCode] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <GraduationCap className="w-8 h-8 text-primary" />
          <span className="font-heading text-2xl font-bold text-foreground">EduNest</span>
        </div>

        <div className="glass rounded-xl p-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-2 text-center">Create Account</h2>
          <p className="text-muted-foreground text-sm mb-6 text-center">Join EduNest to start learning</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Full Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Role</label>
              <div className="glass rounded-lg p-1 flex">
                {(["student", "admin"] as const).map((r) => (
                  <button key={r} type="button" onClick={() => setRole(r)} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all capitalize ${role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Enrollment Code</label>
              <input value={enrollmentCode} onChange={(e) => setEnrollmentCode(e.target.value)} placeholder="Enter code from your admin" className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-all" />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm relative overflow-hidden group">
              <span className="relative z-10">Register</span>
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
