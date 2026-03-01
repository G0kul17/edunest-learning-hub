import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StreakCalendar from "@/components/shared/StreakCalendar";
import { mockStudents, mockCourses } from "@/data/mockData";
import { Search, Download, ChevronDown, ChevronUp, Flame, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentTracker() {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const filtered = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold text-foreground">Student Tracker</h1>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors border border-border">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>

        {/* Table */}
        <GlowCard glowColor="blue" className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Student</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Courses</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Avg Score</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Streak</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-xs text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student) => (
                  <React.Fragment key={student.id}>
                    <tr
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => setExpanded(expanded === student.id ? null : student.id)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary">{student.name.split(" ").map(w => w[0]).join("")}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-foreground">{student.enrolledCourses.length}</td>
                      <td className="p-4">
                        <span className={`text-sm font-mono font-medium ${student.avgScore >= 80 ? "text-success" : student.avgScore >= 60 ? "text-warning" : "text-destructive"}`}>
                          {student.avgScore}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-sm text-warning">
                          <Flame className="w-3 h-3" /> {student.streak}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          student.status === "active" ? "bg-success/20 text-success" :
                          student.status === "at-risk" ? "bg-destructive/20 text-destructive" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="text-xs text-primary hover:underline">View</button>
                          <button className="text-muted-foreground hover:text-foreground">
                            <Mail className="w-4 h-4" />
                          </button>
                          {expanded === student.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    <AnimatePresence>
                      {expanded === student.id && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 bg-secondary/20 space-y-3">
                                {Object.entries(student.courseProgress).map(([courseId, progress]) => {
                                  const course = mockCourses.find((c) => c.id === courseId);
                                  return (
                                    <div key={courseId} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">{course?.title || courseId}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                          <div className="flex-1 h-1.5 bg-secondary rounded-full max-w-[200px]">
                                            <div className="h-1.5 bg-primary rounded-full" style={{ width: `${(progress.completed / progress.total) * 100}%` }} />
                                          </div>
                                          <span className="text-xs text-muted-foreground">{progress.completed}/{progress.total}</span>
                                        </div>
                                      </div>
                                      <span className={`text-sm font-mono ${progress.score >= 80 ? "text-success" : progress.score >= 60 ? "text-warning" : "text-destructive"}`}>
                                        {progress.score}%
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      </div>
    </DashboardLayout>
  );
}
