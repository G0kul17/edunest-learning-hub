import React from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StreakCalendar from "@/components/shared/StreakCalendar";
import CourseCard from "@/components/shared/CourseCard";
import { mockStudents, mockCourses, mockTests } from "@/data/mockData";
import { Flame, BookOpen, FileText, ClipboardList, Code2, Sparkles, Calendar, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const student = mockStudents[0]; // Current student
  const navigate = useNavigate();
  const inProgressCourses = mockCourses.filter((c) => student.enrolledCourses.includes(c.id));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero */}
        <ScrollReveal>
          <GlowCard glowColor="amber" className="relative overflow-hidden">
            <div className="absolute top-4 right-4 text-6xl opacity-10">🔥</div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Welcome back, {student.name.split(" ")[0]}!{" "}
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-block"
              >
                🔥
              </motion.span>
            </h2>
            <p className="text-muted-foreground mt-1">You're on a {student.streak}-day streak! Keep it going!</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <AnimatedCounter target={inProgressCourses.length} className="text-2xl font-bold text-primary" />
                <p className="text-xs text-muted-foreground mt-1">Courses</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={2} className="text-2xl font-bold text-accent" />
                <p className="text-xs text-muted-foreground mt-1">Tests This Week</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={1} className="text-2xl font-bold text-destructive" />
                <p className="text-xs text-muted-foreground mt-1">Due Assignments</p>
              </div>
              <div className="text-center">
                <AnimatedCounter target={47} className="text-2xl font-bold text-success" />
                <p className="text-xs text-muted-foreground mt-1">Problems Solved</p>
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Streak Calendar */}
        <ScrollReveal>
          <GlowCard glowColor="blue">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-foreground">Your Learning Streak 🔥</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-sm">
                  <Flame className="w-4 h-4 text-warning" /> {student.streak} days
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  ⚡ Best: {student.longestStreak} days
                </span>
              </div>
            </div>
            <StreakCalendar data={student.activityData} />
          </GlowCard>
        </ScrollReveal>

        {/* Continue Learning */}
        <ScrollReveal>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-semibold text-foreground">Pick up where you left off →</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {inProgressCourses.map((course, i) => {
              const progress = student.courseProgress[course.id];
              const pct = progress ? (progress.completed / progress.total) * 100 : 0;
              return (
                <ScrollReveal key={course.id} delay={i * 0.1}>
                  <CourseCard
                    course={course}
                    enrolled
                    progress={pct}
                    onClick={() => navigate(`/student/courses/${course.id}/lesson/${course.lessons[progress?.completed || 0]?.id || course.lessons[0].id}`)}
                  />
                </ScrollReveal>
              );
            })}
          </div>
        </ScrollReveal>

        {/* AI Recommendations */}
        <ScrollReveal>
          <GlowCard glowColor="purple">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-info" />
              <h3 className="font-heading font-semibold text-foreground">Recommended for You</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-info/20 text-info">AI Powered</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Based on your progress in Python and performance on recursion topics</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mockCourses.filter((c) => !student.enrolledCourses.includes(c.id)).slice(0, 3).map((course) => (
                <div key={course.id} className="p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-foreground">{course.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{course.category} · {course.difficulty}</p>
                  <p className="text-xs text-info mt-2">You excel in loops — try this next!</p>
                </div>
              ))}
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Upcoming Schedule */}
        <ScrollReveal>
          <GlowCard glowColor="cyan">
            <h3 className="font-heading font-semibold text-foreground mb-4">📅 Upcoming Schedule</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Daily Test — JavaScript Basics</p>
                  <p className="text-xs text-muted-foreground">Today 4:00 PM</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Assignment Due — Binary Trees</p>
                  <p className="text-xs text-muted-foreground">Tomorrow</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Course-End Exam — Python</p>
                  <p className="text-xs text-muted-foreground">Friday 6:00 PM</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
