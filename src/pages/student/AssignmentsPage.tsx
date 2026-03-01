import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { mockAssignments } from "@/data/mockData";
import { Upload, FileText, Code2, Link2 } from "lucide-react";

export default function AssignmentsPage() {
  const [tab, setTab] = useState<"pending" | "submitted" | "graded">("pending");
  const [showSubmitModal, setShowSubmitModal] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");

  const getAssignments = () => {
    switch (tab) {
      case "pending": return mockAssignments.filter((a) => a.status === "pending" || a.status === "overdue");
      case "submitted": return mockAssignments.filter((a) => a.submissions.some(s => s.status === "pending"));
      case "graded": return mockAssignments.filter((a) => a.submissions.some(s => s.status === "graded"));
    }
  };

  const assignments = getAssignments();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Assignments</h1>

        {/* Tabs */}
        <div className="flex gap-2">
          {(["pending", "submitted", "graded"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Assignment cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((a, i) => (
            <ScrollReveal key={a.id} delay={i * 0.05}>
              <GlowCard glowColor={a.status === "overdue" ? "red" : "blue"}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{a.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{a.courseName}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    a.status === "overdue" ? "bg-destructive/20 text-destructive" :
                    a.status === "graded" ? "bg-success/20 text-success" :
                    "bg-warning/20 text-warning"
                  }`}>
                    {a.status}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{a.description}</p>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Due: {a.dueDate}</span>
                  <span className="text-xs text-muted-foreground">{a.points} pts</span>
                </div>

                {tab === "pending" && (
                  <button
                    onClick={() => setShowSubmitModal(a.id)}
                    className="mt-3 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Submit Now
                  </button>
                )}

                {tab === "graded" && a.submissions.find(s => s.status === "graded") && (
                  <div className="mt-3 p-3 rounded-lg bg-success/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-success font-bold">
                        {a.submissions.find(s => s.status === "graded")?.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.submissions.find(s => s.status === "graded")?.feedback}
                    </p>
                  </div>
                )}
              </GlowCard>
            </ScrollReveal>
          ))}
        </div>

        {assignments.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">No {tab} assignments</div>
        )}

        {/* Submit Modal */}
        {showSubmitModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-strong rounded-xl p-6 max-w-lg w-full">
              <h2 className="font-heading font-semibold text-foreground mb-4">Submit Assignment</h2>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Paste your code or write your answer..."
                className="w-full h-40 bg-secondary/50 border border-border rounded-lg p-3 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              />
              <div className="mt-4 p-4 border-2 border-dashed border-border rounded-lg text-center text-sm text-muted-foreground">
                <Upload className="w-6 h-6 mx-auto mb-2" />
                Or drag & drop files here
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowSubmitModal(null)} className="flex-1 py-2 rounded-lg bg-secondary text-muted-foreground text-sm hover:text-foreground">
                  Cancel
                </button>
                <button onClick={() => setShowSubmitModal(null)} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
