import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { mockAssignments } from "@/data/mockData";
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function AssignmentManager() {
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const selected = mockAssignments.find((a) => a.id === selectedAssignment);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">Assignment Manager</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Create Assignment
          </button>
        </div>

        {/* Assignment Table */}
        <GlowCard glowColor="blue" className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Assignment</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Course</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Due Date</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Submitted</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAssignments.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.points} points</p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{a.courseName}</td>
                    <td className="p-4 text-sm text-muted-foreground">{a.dueDate}</td>
                    <td className="p-4 text-sm text-foreground">{a.submissions.length}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        a.status === "pending" ? "bg-warning/20 text-warning" :
                        a.status === "overdue" ? "bg-destructive/20 text-destructive" :
                        "bg-success/20 text-success"
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button onClick={() => setSelectedAssignment(a.id)} className="text-xs text-primary hover:underline">
                        View Submissions
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>

        {/* Submission Review */}
        {selected && (
          <ScrollReveal>
            <GlowCard glowColor="cyan">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Submissions — {selected.title}
              </h3>
              <div className="space-y-3">
                {selected.submissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No submissions yet</p>
                ) : (
                  selected.submissions.map((sub) => (
                    <div key={sub.id} className="p-4 rounded-lg bg-secondary/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{sub.studentName[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{sub.studentName}</p>
                            <p className="text-xs text-muted-foreground">Submitted {sub.submittedAt}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          sub.status === "graded" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <pre className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg overflow-x-auto font-mono">
                        {sub.content}
                      </pre>
                      {sub.score !== undefined && (
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-mono font-medium text-foreground">Score: {sub.score}/100</span>
                          {sub.feedback && <p className="text-xs text-muted-foreground">{sub.feedback}</p>}
                        </div>
                      )}
                      {sub.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <button className="px-3 py-1 text-xs rounded-lg bg-success/20 text-success hover:bg-success/30">Approve</button>
                          <button className="px-3 py-1 text-xs rounded-lg bg-warning/20 text-warning hover:bg-warning/30">Request Revision</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </GlowCard>
          </ScrollReveal>
        )}
      </div>
    </DashboardLayout>
  );
}
