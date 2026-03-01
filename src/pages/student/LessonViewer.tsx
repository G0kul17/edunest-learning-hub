import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mockCourses } from "@/data/mockData";
import { CheckCircle, Circle, Play, ChevronLeft, ChevronRight, FileText, Video } from "lucide-react";

export default function LessonViewer() {
  const { id, lessonId } = useParams();
  const navigate = useNavigate();
  const course = mockCourses.find((c) => c.id === id);
  const [notes, setNotes] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(
    new Set(course?.lessons.filter((l) => l.completed).map((l) => l.id) || [])
  );

  if (!course) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Course not found</div>;

  const currentLesson = course.lessons.find((l) => l.id === lessonId) || course.lessons[0];
  const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null;

  const progressPct = (completed.size / course.lessons.length) * 100;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left sidebar — lesson nav */}
      <aside className="w-72 glass border-r border-border h-screen sticky top-0 overflow-y-auto scrollbar-thin hidden lg:block">
        <div className="p-4 border-b border-border">
          <button onClick={() => navigate("/student/courses")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2">
            <ChevronLeft className="w-3 h-3" /> Back to courses
          </button>
          <h2 className="font-heading font-semibold text-foreground text-sm">{course.title}</h2>
          <div className="mt-2">
            <div className="h-1.5 bg-secondary rounded-full">
              <div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPct)}% complete</p>
          </div>
        </div>

        <nav className="p-2">
          {course.lessons.map((lesson, i) => {
            const isActive = lesson.id === currentLesson.id;
            const isDone = completed.has(lesson.id);
            return (
              <button
                key={lesson.id}
                onClick={() => navigate(`/student/courses/${id}/lesson/${lesson.id}`)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-success shrink-0" />
                ) : isActive ? (
                  <Play className="w-4 h-4 text-primary shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="truncate">{lesson.title}</p>
                  <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 max-w-4xl mx-auto">
        <motion.div
          key={currentLesson.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Video player placeholder */}
          <div className="aspect-video bg-secondary rounded-xl mb-6 flex items-center justify-center border border-border relative overflow-hidden">
            <div className="text-center">
              <Video className="w-12 h-12 text-muted-foreground mb-2 mx-auto" />
              <p className="text-sm text-muted-foreground">Video: {currentLesson.title}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{currentLesson.duration}</p>
            </div>
          </div>

          {/* Lesson info */}
          <h1 className="font-heading text-2xl font-bold text-foreground">{currentLesson.title}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Lesson {currentIndex + 1} of {course.lessons.length} · {currentLesson.type} · {currentLesson.duration}
          </p>

          {/* Mark complete */}
          <button
            onClick={() => {
              const next = new Set(completed);
              if (next.has(currentLesson.id)) next.delete(currentLesson.id);
              else next.add(currentLesson.id);
              setCompleted(next);
            }}
            className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              completed.has(currentLesson.id)
                ? "bg-success/20 text-success"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {completed.has(currentLesson.id) ? "✓ Completed" : "Mark as Complete"}
          </button>

          {/* Notes */}
          <div className="mt-8">
            <h3 className="font-heading font-semibold text-foreground mb-2">📝 Your Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Type your notes here... (auto-saved)"
              className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
            {prevLesson ? (
              <button
                onClick={() => navigate(`/student/courses/${id}/lesson/${prevLesson.id}`)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" /> {prevLesson.title}
              </button>
            ) : <div />}
            {nextLesson ? (
              <button
                onClick={() => navigate(`/student/courses/${id}/lesson/${nextLesson.id}`)}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                {nextLesson.title} <ChevronRight className="w-4 h-4" />
              </button>
            ) : <div />}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
