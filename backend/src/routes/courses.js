const express = require("express");
const db = require("../db/connection");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function parseCourse(c) {
  return {
    ...c,
    tags: JSON.parse(c.tags || "[]"),
    lessonCount: c.lesson_count,
    avgCompletion: c.avg_completion,
    reviewCount: c.review_count,
    instructorAvatar: c.instructor_avatar,
  };
}

// GET /api/courses - list all courses
router.get("/", authenticate, (req, res) => {
  const { status, category, difficulty, search } = req.query;
  let query = "SELECT * FROM courses WHERE 1=1";
  const params = [];

  if (status) { query += " AND status = ?"; params.push(status); }
  if (category) { query += " AND category = ?"; params.push(category); }
  if (difficulty) { query += " AND difficulty = ?"; params.push(difficulty); }
  if (search) { query += " AND (title LIKE ? OR description LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }

  query += " ORDER BY created_at DESC";
  const courses = db.prepare(query).all(...params);
  res.json(courses.map(parseCourse));
});

// GET /api/courses/:id - get single course with lessons
router.get("/:id", authenticate, (req, res) => {
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const lessons = db.prepare("SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index").all(req.params.id);

  // If student, mark which lessons they've completed
  let lessonsWithCompletion = lessons;
  if (req.user.role === "student") {
    const completed = db.prepare(
      "SELECT lesson_id FROM lesson_completions WHERE student_id = ? AND course_id = ?"
    ).all(req.user.id, req.params.id).map(r => r.lesson_id);

    lessonsWithCompletion = lessons.map(l => ({ ...l, completed: completed.includes(l.id) }));
  }

  res.json({ ...parseCourse(course), lessons: lessonsWithCompletion });
});

// POST /api/courses - create course (admin only)
router.post("/", authenticate, requireAdmin, (req, res) => {
  const { title, category, description, difficulty, instructor, thumbnail, duration, status, tags } = req.body;
  if (!title || !category || !difficulty || !instructor) {
    return res.status(400).json({ error: "title, category, difficulty, instructor are required" });
  }
  const id = `c-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  db.prepare(`
    INSERT INTO courses (id, title, category, description, difficulty, instructor, thumbnail, duration, status, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, category, description || "", difficulty, instructor, thumbnail || "", duration || "", status || "draft", JSON.stringify(tags || []));

  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(id);
  res.status(201).json(parseCourse(course));
});

// PUT /api/courses/:id - update course (admin only)
router.put("/:id", authenticate, requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT id FROM courses WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Course not found" });

  const { title, category, description, difficulty, instructor, thumbnail, duration, status, tags } = req.body;
  db.prepare(`
    UPDATE courses SET title=?, category=?, description=?, difficulty=?, instructor=?,
      thumbnail=?, duration=?, status=?, tags=?, updated_at=datetime('now')
    WHERE id=?
  `).run(title, category, description, difficulty, instructor, thumbnail, duration, status, JSON.stringify(tags || []), req.params.id);

  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  res.json(parseCourse(course));
});

// DELETE /api/courses/:id (admin only)
router.delete("/:id", authenticate, requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT id FROM courses WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Course not found" });
  db.prepare("DELETE FROM courses WHERE id = ?").run(req.params.id);
  res.json({ message: "Course deleted" });
});

// POST /api/courses/:id/enroll - enroll student
router.post("/:id/enroll", authenticate, (req, res) => {
  const course = db.prepare("SELECT * FROM courses WHERE id = ?").get(req.params.id);
  if (!course) return res.status(404).json({ error: "Course not found" });

  const existing = db.prepare(
    "SELECT id FROM enrollments WHERE student_id = ? AND course_id = ?"
  ).get(req.user.id, req.params.id);

  if (existing) return res.status(409).json({ error: "Already enrolled" });

  const id = `enr-${Date.now()}`;
  db.prepare(`
    INSERT INTO enrollments (id, student_id, course_id, completed_lessons, total_lessons, score)
    VALUES (?, ?, ?, 0, ?, 0)
  `).run(id, req.user.id, req.params.id, course.lesson_count);

  // Increment enrolled count
  db.prepare("UPDATE courses SET enrolled = enrolled + 1 WHERE id = ?").run(req.params.id);

  res.status(201).json({ message: "Enrolled successfully" });
});

// POST /api/courses/:id/lessons/:lessonId/complete - mark lesson complete
router.post("/:id/lessons/:lessonId/complete", authenticate, (req, res) => {
  const { id: courseId, lessonId } = req.params;
  const studentId = req.user.id;

  const existing = db.prepare(
    "SELECT id FROM lesson_completions WHERE student_id = ? AND lesson_id = ?"
  ).get(studentId, lessonId);

  if (!existing) {
    const compId = `lc-${Date.now()}`;
    db.prepare(`
      INSERT INTO lesson_completions (id, student_id, lesson_id, course_id)
      VALUES (?, ?, ?, ?)
    `).run(compId, studentId, lessonId, courseId);

    // Update enrollment progress
    db.prepare(`
      UPDATE enrollments SET completed_lessons = completed_lessons + 1
      WHERE student_id = ? AND course_id = ?
    `).run(studentId, courseId);

    // Log activity
    const today = new Date().toISOString().split("T")[0];
    db.prepare(`
      INSERT INTO student_activity (id, student_id, date, count)
      VALUES (?, ?, ?, 1)
      ON CONFLICT(student_id, date) DO UPDATE SET count = count + 1
    `).run(`act-${Date.now()}`, studentId, today);
  }

  res.json({ message: "Lesson marked complete" });
});

module.exports = router;
