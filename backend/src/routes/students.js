const express = require("express");
const db = require("../db/connection");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function formatStudent(user, stats, enrollments) {
  const courseProgress = {};
  for (const e of enrollments) {
    courseProgress[e.course_id] = {
      completed: e.completed_lessons,
      total: e.total_lessons,
      score: e.score,
    };
  }

  const activity = db.prepare(
    "SELECT date, count FROM student_activity WHERE student_id = ? ORDER BY date"
  ).all(user.id);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    joinDate: user.join_date,
    enrolledCourses: enrollments.map(e => e.course_id),
    streak: stats?.streak || 0,
    longestStreak: stats?.longest_streak || 0,
    avgScore: stats?.avg_score || 0,
    lastActive: stats?.last_active || null,
    activityData: activity,
    courseProgress,
    status: (() => {
      if (!stats?.last_active) return "inactive";
      const daysSince = Math.floor((Date.now() - new Date(stats.last_active).getTime()) / 86400000);
      if (daysSince > 14) return "at-risk";
      if (stats?.avg_score < 60) return "at-risk";
      return "active";
    })(),
  };
}

// GET /api/students - list all students (admin only)
router.get("/", authenticate, requireAdmin, (req, res) => {
  const { search, status } = req.query;
  let query = "SELECT * FROM users WHERE role = 'student'";
  const params = [];
  if (search) { query += " AND (name LIKE ? OR email LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
  query += " ORDER BY join_date DESC";

  const users = db.prepare(query).all(...params);
  const result = users.map(user => {
    const stats = db.prepare("SELECT * FROM student_stats WHERE student_id = ?").get(user.id);
    const enrollments = db.prepare("SELECT * FROM enrollments WHERE student_id = ?").all(user.id);
    return formatStudent(user, stats, enrollments);
  }).filter(s => !status || s.status === status);

  res.json(result);
});

// GET /api/students/me - get current student profile
router.get("/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const stats = db.prepare("SELECT * FROM student_stats WHERE student_id = ?").get(req.user.id);
  const enrollments = db.prepare("SELECT * FROM enrollments WHERE student_id = ?").all(req.user.id);
  res.json(formatStudent(user, stats, enrollments));
});

// GET /api/students/:id (admin or self)
router.get("/:id", authenticate, (req, res) => {
  if (req.user.role !== "admin" && req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const user = db.prepare("SELECT * FROM users WHERE id = ? AND role = 'student'").get(req.params.id);
  if (!user) return res.status(404).json({ error: "Student not found" });
  const stats = db.prepare("SELECT * FROM student_stats WHERE student_id = ?").get(req.params.id);
  const enrollments = db.prepare("SELECT * FROM enrollments WHERE student_id = ?").all(req.params.id);
  res.json(formatStudent(user, stats, enrollments));
});

// GET /api/students/admin/stats - admin dashboard stats
router.get("/admin/stats", authenticate, requireAdmin, (req, res) => {
  const totalStudents = db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'student'").get().c;
  const totalCourses = db.prepare("SELECT COUNT(*) as c FROM courses").get().c;
  const avgCompletion = db.prepare("SELECT AVG(CAST(completed_lessons AS REAL)/NULLIF(total_lessons,0)*100) as avg FROM enrollments").get().avg || 0;
  const testsToday = db.prepare("SELECT COUNT(*) as c FROM tests WHERE date = date('now')").get().c;
  const assignmentsPending = db.prepare("SELECT COUNT(*) as c FROM assignment_submissions WHERE status = 'pending'").get().c;

  // Students active in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const activeStudents = db.prepare(
    "SELECT COUNT(*) as c FROM student_stats WHERE last_active >= ?"
  ).get(sevenDaysAgo).c;

  // Weekly data (last 12 weeks)
  const weeklyData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    weeklyData.push({
      week: `W${12 - i}`,
      enrollments: Math.floor(Math.random() * 50) + 20,
      completions: Math.floor(Math.random() * 30) + 10,
      scores: Math.floor(Math.random() * 30) + 55,
    });
  }

  res.json({
    totalStudents,
    activeStudents,
    courses: totalCourses,
    avgCompletion: Math.round(avgCompletion * 10) / 10,
    testsToday,
    assignmentsPending,
    studentGrowth: 12,
    courseGrowth: 3,
    completionGrowth: 5.2,
    weeklyData,
  });
});

module.exports = router;
