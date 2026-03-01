import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Clock } from "lucide-react";
import ProgressRing from "@/components/ui/ProgressRing";
import type { Course } from "@/data/mockData";

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
  progress?: number;
  onClick?: () => void;
}

const categoryGradients: Record<string, string> = {
  Programming: "from-primary to-info",
  "Computer Science": "from-accent to-primary",
  Frontend: "from-success to-accent",
  "Data Science": "from-info to-primary",
  Design: "from-warning to-destructive",
};

const difficultyColors: Record<string, string> = {
  Beginner: "bg-success/20 text-success",
  Intermediate: "bg-warning/20 text-warning",
  Advanced: "bg-destructive/20 text-destructive",
};

export default function CourseCard({ course, enrolled = false, progress, onClick }: CourseCardProps) {
  const gradient = categoryGradients[course.category] || "from-primary to-accent";

  return (
    <motion.div
      whileHover={{ y: -6, rotateY: 2, rotateX: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="glass rounded-xl overflow-hidden cursor-pointer group hover:border-primary/20 transition-all duration-300"
      style={{ perspective: "1000px" }}
    >
      {/* Thumbnail */}
      <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-background/20" />
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[course.difficulty]}`}>
            {course.difficulty}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-background/30 text-foreground backdrop-blur-sm">
            {course.category}
          </span>
        </div>
        {progress !== undefined && (
          <div className="absolute top-3 right-3">
            <ProgressRing progress={progress} size={40} strokeWidth={3}>
              <span className="text-[10px] font-mono text-foreground">{Math.round(progress)}%</span>
            </ProgressRing>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>

        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {course.lessonCount} lessons
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {course.enrolled}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {course.duration}
          </span>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary">{course.instructor[0]}</span>
          </div>
          <span className="text-xs text-muted-foreground">{course.instructor}</span>
          <div className="ml-auto flex items-center gap-1">
            <span className="text-warning text-xs">★</span>
            <span className="text-xs text-foreground font-medium">{course.rating}</span>
          </div>
        </div>

        {/* CTA */}
        {enrolled && progress !== undefined ? (
          <button className="mt-3 w-full py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
            {progress >= 100 ? "Completed ✓" : "Continue Learning"}
          </button>
        ) : (
          <button className="mt-3 w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Enroll Now
          </button>
        )}
      </div>
    </motion.div>
  );
}
