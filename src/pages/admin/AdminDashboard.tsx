import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StreakCalendar from "@/components/shared/StreakCalendar";
import Leaderboard from "@/components/shared/Leaderboard";
import { mockAdminStats, mockStudents, mockLeaderboard, mockEngagementData, mockScoreDistribution, mockAssignments, mockTests } from "@/data/mockData";
import { Users, BookOpen, CheckCircle, Trophy, TrendingUp, Plus, FileText, ClipboardList, UserPlus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const statCards = [
  { label: "Total Students", value: 2847, suffix: "", icon: Users, trend: "+12%", glow: "blue" as const, color: "text-primary" },
  { label: "Active Courses", value: 24, suffix: "", icon: BookOpen, trend: "+3", glow: "cyan" as const, color: "text-accent" },
  { label: "Avg Completion", value: 78.4, suffix: "%", icon: CheckCircle, trend: "+5.2%", glow: "green" as const, color: "text-success", decimals: 1 },
  { label: "Tests Today", value: 6, suffix: "", icon: Trophy, trend: "", glow: "amber" as const, color: "text-warning" },
];

export default function AdminDashboard() {
  const activityData = mockStudents[0].activityData.slice(-90);
  const [fabOpen, setFabOpen] = React.useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <ScrollReveal key={card.label} delay={i * 0.1}>
              <GlowCard glowColor={card.glow}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <AnimatedCounter
                        target={card.value}
                        suffix={card.suffix}
                        decimals={card.decimals || 0}
                        className={`text-3xl font-bold ${card.color}`}
                      />
                      {card.trend && (
                        <span className="flex items-center text-xs text-success">
                          <TrendingUp className="w-3 h-3 mr-0.5" />
                          {card.trend}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Activity Heatmap */}
        <ScrollReveal>
          <GlowCard glowColor="blue">
            <h3 className="font-heading font-semibold text-foreground mb-4">Student Activity — Last 90 Days</h3>
            <StreakCalendar data={activityData} weeks={13} />
          </GlowCard>
        </ScrollReveal>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Engagement Chart */}
          <ScrollReveal className="lg:col-span-3">
            <GlowCard glowColor="cyan">
              <h3 className="font-heading font-semibold text-foreground mb-4">Course Engagement Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockEngagementData}>
                    <defs>
                      <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorComplete" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        backdropFilter: "blur(12px)",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Area type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" fill="url(#colorEnroll)" strokeWidth={2} />
                    <Area type="monotone" dataKey="completions" stroke="hsl(var(--success))" fill="url(#colorComplete)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlowCard>
          </ScrollReveal>

          {/* Score Distribution */}
          <ScrollReveal className="lg:col-span-2">
            <GlowCard glowColor="purple">
              <h3 className="font-heading font-semibold text-foreground mb-4">Score Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockScoreDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {mockScoreDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {mockScoreDistribution.map((d) => (
                  <span key={d.grade} className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.grade}
                  </span>
                ))}
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>

        {/* Leaderboard */}
        <ScrollReveal>
          <GlowCard glowColor="amber">
            <h3 className="font-heading font-semibold text-foreground mb-4">🏆 Top Performers This Week</h3>
            <Leaderboard data={mockLeaderboard} />
          </GlowCard>
        </ScrollReveal>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ScrollReveal>
            <GlowCard glowColor="blue">
              <h3 className="font-heading font-semibold text-foreground mb-4">📋 Pending Assignments</h3>
              <div className="space-y-3">
                {mockAssignments.filter((a) => a.status === "pending").map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.courseName} · Due {a.dueDate}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning">
                      {a.submissions.length} submitted
                    </span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </ScrollReveal>

          <ScrollReveal>
            <GlowCard glowColor="cyan">
              <h3 className="font-heading font-semibold text-foreground mb-4">📝 Recent Tests</h3>
              <div className="space-y-3">
                {mockTests.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.title}</p>
                      <p className="text-xs text-muted-foreground">{t.courseName} · {t.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      t.status === "completed" ? "bg-success/20 text-success" :
                      t.status === "live" ? "bg-primary/20 text-primary" :
                      "bg-warning/20 text-warning"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </GlowCard>
          </ScrollReveal>
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-24 right-24 z-40">
        <motion.button
          onClick={() => setFabOpen(!fabOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg"
        >
          <Plus className={`w-6 h-6 transition-transform ${fabOpen ? "rotate-45" : ""}`} />
        </motion.button>

        <motion.div
          initial={false}
          animate={fabOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          className="absolute bottom-14 right-0 space-y-2"
          style={{ pointerEvents: fabOpen ? "auto" : "none" }}
        >
          {[
            { icon: BookOpen, label: "Add Course" },
            { icon: FileText, label: "Create Test" },
            { icon: ClipboardList, label: "Post Assignment" },
            { icon: UserPlus, label: "Add Student" },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, x: 20 }}
              animate={fabOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg glass border border-border text-sm text-foreground hover:bg-primary/10 whitespace-nowrap"
            >
              <action.icon className="w-4 h-4 text-primary" />
              {action.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
