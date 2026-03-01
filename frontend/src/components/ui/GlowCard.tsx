import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  glowColor?: "blue" | "cyan" | "green" | "amber" | "red" | "purple";
  children: React.ReactNode;
  className?: string;
}

const glowClasses: Record<string, string> = {
  blue: "hover:glow-blue hover:border-primary/30",
  cyan: "hover:glow-cyan hover:border-accent/30",
  green: "hover:glow-green hover:border-success/30",
  amber: "hover:glow-amber hover:border-warning/30",
  red: "hover:glow-red hover:border-destructive/30",
  purple: "hover:glow-purple hover:border-info/30",
};

export default function GlowCard({ glowColor = "blue", className, children }: GlowCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass rounded-xl p-6 transition-all duration-300",
        glowClasses[glowColor],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
