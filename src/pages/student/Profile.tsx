import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StreakCalendar from "@/components/shared/StreakCalendar";
import ProgressRing from "@/components/ui/ProgressRing";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { mockStudents, mockCourses } from "@/data/mockData";
import { User, Flame, Trophy, BookOpen, Code2, Calendar } from "lucide-react";

export default function Profile() {
  const student = mockStudents[0];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <ScrollReveal>
          <GlowCard glowColor="blue">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="font-heading text-2xl font-bold text-foreground">{student.name}</h1>
                <p className="text-muted-foreground">{student.email}</p>
                <p className="text-xs text-muted-foreground mt-1">Joined {student.joinDate}</p>
              </div>
              <div className="sm:ml-auto grid grid-cols-3 gap-6 text-center">
                <div>
                  <AnimatedCounter target={student.enrolledCourses.length} className="text-2xl font-bold text-primary" />
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
                <div>
                  <AnimatedCounter target={student.avgScore} decimals={1} suffix="%" className="text-2xl font-bold text-success" />
                  <p className="text-xs text-muted-foreground">Avg Score</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 text-warning" />
                    <AnimatedCounter target={student.streak} className="text-2xl font-bold text-warning" />
                  </div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                </div>
              </div>
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Streak Calendar */}
        <ScrollReveal>
          <GlowCard glowColor="cyan">
            <h3 className="font-heading font-semibold text-foreground mb-4">Activity Calendar</h3>
            <StreakCalendar data={student.activityData} />
          </GlowCard>
        </ScrollReveal>

        {/* Course Progress */}
        <ScrollReveal>
          <GlowCard glowColor="green">
            <h3 className="font-heading font-semibold text-foreground mb-4">Course Progress</h3>
            <div className="space-y-4">
              {Object.entries(student.courseProgress).map(([courseId, progress]) => {
                const course = mockCourses.find((c) => c.id === courseId);
                const pct = (progress.completed / progress.total) * 100;
                return (
                  <div key={courseId} className="flex items-center gap-4">
                    <ProgressRing progress={pct} size={50} strokeWidth={4}>
                      <span className="text-xs font-mono text-foreground">{Math.round(pct)}%</span>
                    </ProgressRing>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{course?.title || courseId}</p>
                      <p className="text-xs text-muted-foreground">{progress.completed}/{progress.total} lessons · Score: {progress.score}%</p>
                      <div className="h-1.5 bg-secondary rounded-full mt-1">
                        <div className="h-1.5 bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Certificates placeholder */}
        <ScrollReveal>
          <GlowCard glowColor="amber">
            <h3 className="font-heading font-semibold text-foreground mb-4">🎓 Certificates</h3>
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Complete a course to earn your first certificate!</p>
            </div>
          </GlowCard>
        </ScrollReveal>
      </div>
    </DashboardLayout>
  );
}
