import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { mockStudents, mockCourses, mockEngagementData, mockHourlyActivity } from "@/data/mockData";
import { TrendingUp, Users, BookOpen, FileText, AlertTriangle } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpiCards = [
  { label: "Daily Active Users", value: 423, icon: Users, color: "text-primary", glow: "blue" as const },
  { label: "Lessons Completed Today", value: 187, icon: BookOpen, color: "text-accent", glow: "cyan" as const },
  { label: "Tests Taken Today", value: 56, icon: FileText, color: "text-success", glow: "green" as const },
  { label: "New Enrollments", value: 34, icon: TrendingUp, color: "text-warning", glow: "amber" as const },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

export default function Analytics() {
  const atRiskStudents = mockStudents.filter((s) => s.status === "at-risk");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Analytics</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => (
            <ScrollReveal key={card.label} delay={i * 0.1}>
              <GlowCard glowColor={card.glow}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-secondary ${card.color}`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <AnimatedCounter target={card.value} className={`text-2xl font-bold ${card.color}`} />
                  </div>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Engagement Chart */}
        <ScrollReveal>
          <GlowCard glowColor="cyan">
            <h3 className="font-heading font-semibold text-foreground mb-4">Engagement Deep Dive</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockEngagementData}>
                  <defs>
                    <linearGradient id="colorDAU" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="enrollments" stroke="hsl(var(--primary))" fill="url(#colorDAU)" strokeWidth={2} name="Active Users" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Course Performance Table */}
        <ScrollReveal>
          <GlowCard glowColor="blue">
            <h3 className="font-heading font-semibold text-foreground mb-4">Course Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-xs text-muted-foreground">Course</th>
                    <th className="text-left p-3 text-xs text-muted-foreground">Enrolled</th>
                    <th className="text-left p-3 text-xs text-muted-foreground">Completion</th>
                    <th className="text-left p-3 text-xs text-muted-foreground">Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCourses.filter(c => c.status === "active").map((course) => (
                    <tr key={course.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="p-3 text-sm font-medium text-foreground">{course.title}</td>
                      <td className="p-3 text-sm text-muted-foreground">{course.enrolled}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-secondary rounded-full">
                            <div className="h-1.5 bg-primary rounded-full" style={{ width: `${course.avgCompletion}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{course.avgCompletion}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm font-mono text-foreground">{(course.avgCompletion * 1.1).toFixed(0)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* At-Risk Students */}
        <ScrollReveal>
          <GlowCard glowColor="red">
            <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              At-Risk Students
              <span className="text-xs px-2 py-0.5 rounded-full bg-info/20 text-info ml-2">AI-Powered Insight</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {atRiskStudents.map((student) => (
                <div key={student.id} className="p-4 rounded-lg bg-secondary/30 border border-destructive/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-destructive/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-destructive">{student.name.split(" ").map(w => w[0]).join("")}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{student.name}</p>
                      <p className="text-xs text-muted-foreground">Last active: {student.lastActive}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Avg score: {student.avgScore}% · Streak: {student.streak} days</p>
                  <div className="flex gap-2 mt-3">
                    <button className="text-xs px-3 py-1 rounded-lg bg-primary/20 text-primary hover:bg-primary/30">Send Nudge</button>
                    <button className="text-xs px-3 py-1 rounded-lg bg-secondary text-muted-foreground hover:text-foreground">Schedule Call</button>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Activity Heatmap */}
        <ScrollReveal>
          <GlowCard glowColor="purple">
            <h3 className="font-heading font-semibold text-foreground mb-4">Activity by Hour & Day</h3>
            <div className="overflow-x-auto">
              <div className="flex gap-0.5">
                <div className="flex flex-col gap-0.5 mr-1">
                  {days.map((d) => (
                    <span key={d} className="text-[10px] text-muted-foreground h-[14px] flex items-center w-8">{d}</span>
                  ))}
                </div>
                {hours.map((h) => (
                  <div key={h} className="flex flex-col gap-0.5">
                    {days.map((_, di) => {
                      const val = mockHourlyActivity.find((a) => a.day === di && a.hour === h)?.value || 0;
                      const opacity = val / 100;
                      return (
                        <div
                          key={`${h}-${di}`}
                          className="w-[14px] h-[14px] rounded-[2px] transition-colors"
                          style={{ backgroundColor: `hsl(var(--primary) / ${Math.max(0.05, opacity)})` }}
                          title={`${days[di]} ${h}:00 — ${val} activities`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex gap-1 mt-2 ml-10">
                {[0, 6, 12, 18, 23].map((h) => (
                  <span key={h} className="text-[10px] text-muted-foreground" style={{ marginLeft: h > 0 ? `${(h - (h > 0 ? [0, 6, 12, 18, 23][[0, 6, 12, 18, 23].indexOf(h) - 1] || 0 : 0)) * 15 - 15}px` : 0 }}>
                    {h}:00
                  </span>
                ))}
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
