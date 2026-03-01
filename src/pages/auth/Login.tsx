import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { mockTestimonials } from "@/data/mockData";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function Login() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % mockTestimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
    navigate(role === "admin" ? "/admin/dashboard" : "/student/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-background via-secondary to-background flex-col items-center justify-center p-12">
        {/* Animated background */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/5"
              style={{
                width: 200 + i * 100,
                height: 200 + i * 100,
                left: `${20 + i * 10}%`,
                top: `${10 + i * 15}%`,
              }}
              animate={{
                x: [0, 20, -10, 0],
                y: [0, -15, 10, 0],
                scale: [1, 1.05, 0.95, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center glow-blue">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-foreground">EduNest</h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground font-body mb-12"
          >
            Knowledge Engineered. Futures Built.
          </motion.p>

          {/* Testimonial */}
          <div className="h-40 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass rounded-xl p-6 max-w-md mx-auto"
              >
                <p className="text-sm text-foreground italic">"{mockTestimonials[testimonialIndex].quote}"</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {mockTestimonials[testimonialIndex].name[0]}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium text-foreground">{mockTestimonials[testimonialIndex].name}</p>
                    <p className="text-xs text-muted-foreground">{mockTestimonials[testimonialIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <AnimatedCounter target={2400} className="text-2xl font-bold text-primary" />
              <span className="text-2xl font-bold text-primary">+</span>
              <p className="text-xs text-muted-foreground mt-1">Students</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <AnimatedCounter target={180} className="text-2xl font-bold text-accent" />
              <span className="text-2xl font-bold text-accent">+</span>
              <p className="text-xs text-muted-foreground mt-1">Courses</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <AnimatedCounter target={98} suffix="%" className="text-2xl font-bold text-success" />
              <p className="text-xs text-muted-foreground mt-1">Completion</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="font-heading text-2xl font-bold text-foreground">EduNest</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">Sign in to continue your learning journey</p>

          {/* Role toggle */}
          <div className="glass rounded-lg p-1 flex mb-6">
            {(["student", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                  role === r
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "admin" ? "admin@edunest.com" : "student@example.com"}
                className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-sm relative overflow-hidden group"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            New here?{" "}
            <a href="/register" className="text-primary hover:underline">Contact your Admin for access</a>
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div className="flex -space-x-2">
              {["A", "P", "R", "S", "K"].map((letter, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
                >
                  <span className="text-[10px] font-bold text-primary">{letter}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Join 2,400+ learners</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
