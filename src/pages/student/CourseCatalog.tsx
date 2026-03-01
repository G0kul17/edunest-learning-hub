import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CourseCard from "@/components/shared/CourseCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { mockCourses, mockStudents } from "@/data/mockData";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CourseCatalog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();
  const student = mockStudents[0];

  const categories = ["All", ...new Set(mockCourses.map((c) => c.category))];

  const filtered = mockCourses.filter((c) => {
    if (c.status !== "active") return false;
    if (category !== "All" && c.category !== category) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-bold text-foreground">Course Catalog</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => {
            const enrolled = student.enrolledCourses.includes(course.id);
            const progress = student.courseProgress[course.id];
            const pct = progress ? (progress.completed / progress.total) * 100 : undefined;
            return (
              <ScrollReveal key={course.id} delay={i * 0.05}>
                <CourseCard
                  course={course}
                  enrolled={enrolled}
                  progress={pct}
                  onClick={() => {
                    if (enrolled) {
                      navigate(`/student/courses/${course.id}/lesson/${course.lessons[0].id}`);
                    }
                  }}
                />
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
