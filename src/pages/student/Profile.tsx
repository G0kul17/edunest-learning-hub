import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GlowCard from "@/components/ui/GlowCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import StreakCalendar from "@/components/shared/StreakCalendar";
import ProgressRing from "@/components/ui/ProgressRing";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import SettingsModal from "@/components/layout/SettingsModal";
import { mockStudents, mockCourses } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { User, Flame, Trophy, Settings, LogOut } from "lucide-react";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  // Find student data from mock that matches the logged-in user (fallback to first student)
  const student = mockStudents.find((s) => s.id === user?.id) || mockStudents[0];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <ScrollReveal>
          <GlowCard glowColor="blue">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-2xl select-none">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  initials
                )}
              </div>

              <div className="text-center sm:text-left flex-1">
                <h1 className="font-heading text-2xl font-bold text-foreground">{user?.name}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                    {user?.role}
                  </span>
                  <span className="ml-2">· Joined {user?.joinDate}</span>
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:ml-4">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground hover:bg-secondary/80 hover:border-primary/30 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive hover:bg-destructive/20 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
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
                        <div className="h-1.5 bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlowCard>
        </ScrollReveal>

        {/* Certificates */}
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

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </DashboardLayout>
  );
}
