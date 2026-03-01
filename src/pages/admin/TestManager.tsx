import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { mockTests } from "@/data/mockData";
import { Plus, Clock, Users, CheckCircle } from "lucide-react";

export default function TestManager() {
  const [tab, setTab] = useState<"daily" | "course-end" | "mock">("daily");

  const filtered = mockTests.filter((t) => t.type === tab);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">Test Manager</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Create Test
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["daily", "course-end", "mock"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.replace("-", " ")} Tests
            </button>
          ))}
        </div>

        {/* Test Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((test, i) => (
            <ScrollReveal key={test.id} delay={i * 0.05}>
              <GlowCard glowColor={test.status === "completed" ? "green" : test.status === "live" ? "blue" : "amber"}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{test.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{test.courseName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    test.status === "completed" ? "bg-success/20 text-success" :
                    test.status === "live" ? "bg-primary/20 text-primary" :
                    "bg-warning/20 text-warning"
                  }`}>
                    {test.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {test.duration} min
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {test.attempted}/{test.total}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4" />
                    {test.questionCount} Q
                  </div>
                </div>

                {test.status === "completed" && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Avg Score</span>
                      <span className="text-sm font-mono font-medium text-foreground">{test.avgScore}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full mt-1">
                      <div className="h-1.5 bg-primary rounded-full" style={{ width: `${test.avgScore}%` }} />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <button className="text-xs text-primary hover:underline">Edit</button>
                  <button className="text-xs text-primary hover:underline">View Results</button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Duplicate</button>
                </div>
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No {tab.replace("-", " ")} tests found</div>
        )}
      </div>
    </DashboardLayout>
  );
}
