const express = require("express");
const db = require("../db/connection");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function formatAssignment(a) {
  const submissions = db.prepare(`
    SELECT as2.*, u.name as student_name
    FROM assignment_submissions as2
    JOIN users u ON u.id = as2.student_id
    WHERE as2.assignment_id = ?
    ORDER BY as2.submitted_at DESC
  `).all(a.id);

  return {
    ...a,
    courseId: a.course_id,
    courseName: a.course_name,
    dueDate: a.due_date,
    submissionType: a.submission_type,
    submissions: submissions.map(s => ({
      id: s.id,
      studentId: s.student_id,
      studentName: s.student_name,
      submittedAt: s.submitted_at,
      content: s.content,
      score: s.score,
      feedback: s.feedback,
      status: s.status,
    })),
  };
}

// GET /api/assignments
router.get("/", authenticate, (req, res) => {
  const { courseId, status } = req.query;
  let query = "SELECT * FROM assignments WHERE 1=1";
  const params = [];
  if (courseId) { query += " AND course_id = ?"; params.push(courseId); }

  let assignments = db.prepare(query + " ORDER BY due_date ASC").all(...params);

  // For students, filter to only enrolled courses and add their submission status
  if (req.user.role === "student") {
    const enrolled = db.prepare("SELECT course_id FROM enrollments WHERE student_id = ?").all(req.user.id).map(e => e.course_id);
    assignments = assignments.filter(a => enrolled.includes(a.course_id));

    return res.json(assignments.map(a => {
      const mySubmission = db.prepare(
        "SELECT * FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?"
      ).get(a.id, req.user.id);

      const now = new Date();
      const dueDate = new Date(a.due_date);
      let studentStatus = "pending";
      if (mySubmission) {
        studentStatus = mySubmission.status === "graded" ? "graded" : "submitted";
      } else if (dueDate < now) {
        studentStatus = "overdue";
      }

      return {
        ...a,
        courseId: a.course_id,
        courseName: a.course_name,
        dueDate: a.due_date,
        submissionType: a.submission_type,
        status: studentStatus,
        mySubmission: mySubmission || null,
        submissions: mySubmission ? [mySubmission] : [],
      };
    }));
  }

  res.json(assignments.map(formatAssignment));
});

// GET /api/assignments/:id
router.get("/:id", authenticate, (req, res) => {
  const assignment = db.prepare("SELECT * FROM assignments WHERE id = ?").get(req.params.id);
  if (!assignment) return res.status(404).json({ error: "Assignment not found" });
  res.json(formatAssignment(assignment));
});

// POST /api/assignments (admin only)
router.post("/", authenticate, requireAdmin, (req, res) => {
  const { title, courseId, courseName, description, dueDate, points, submissionType } = req.body;
  if (!title || !courseId || !dueDate) {
    return res.status(400).json({ error: "title, courseId, dueDate are required" });
  }
  const id = `a-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  db.prepare(`
    INSERT INTO assignments (id, title, course_id, course_name, description, due_date, points, submission_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, courseId, courseName || "", description || "", dueDate, points || 100, submissionType || "text");

  const assignment = db.prepare("SELECT * FROM assignments WHERE id = ?").get(id);
  res.status(201).json(formatAssignment(assignment));
});

// PUT /api/assignments/:id (admin only)
router.put("/:id", authenticate, requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT id FROM assignments WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Assignment not found" });

  const { title, description, dueDate, points, status } = req.body;
  db.prepare(`
    UPDATE assignments SET title=?, description=?, due_date=?, points=?, status=?
    WHERE id=?
  `).run(title, description, dueDate, points, status, req.params.id);

  const assignment = db.prepare("SELECT * FROM assignments WHERE id = ?").get(req.params.id);
  res.json(formatAssignment(assignment));
});

// POST /api/assignments/:id/submit (student)
router.post("/:id/submit", authenticate, (req, res) => {
  const assignment = db.prepare("SELECT * FROM assignments WHERE id = ?").get(req.params.id);
  if (!assignment) return res.status(404).json({ error: "Assignment not found" });

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });

  const existing = db.prepare(
    "SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?"
  ).get(req.params.id, req.user.id);

  const user = db.prepare("SELECT name FROM users WHERE id = ?").get(req.user.id);
  const subId = `sub-${Date.now()}`;

  if (existing) {
    db.prepare(`
      UPDATE assignment_submissions SET content=?, status='pending', submitted_at=datetime('now')
      WHERE assignment_id=? AND student_id=?
    `).run(content, req.params.id, req.user.id);
  } else {
    db.prepare(`
      INSERT INTO assignment_submissions (id, assignment_id, student_id, student_name, content)
      VALUES (?, ?, ?, ?, ?)
    `).run(subId, req.params.id, req.user.id, user.name, content);
  }

  // Log activity
  const today = new Date().toISOString().split("T")[0];
  db.prepare(`
    INSERT INTO student_activity (id, student_id, date, count)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(student_id, date) DO UPDATE SET count = count + 1
  `).run(`act-${Date.now()}`, req.user.id, today);

  res.status(201).json({ message: "Submitted successfully" });
});

// POST /api/assignments/:id/submissions/:subId/grade (admin only)
router.post("/:id/submissions/:subId/grade", authenticate, requireAdmin, (req, res) => {
  const { score, feedback } = req.body;
  db.prepare(`
    UPDATE assignment_submissions SET score=?, feedback=?, status='graded'
    WHERE id=? AND assignment_id=?
  `).run(score, feedback || null, req.params.subId, req.params.id);

  res.json({ message: "Graded successfully" });
});

module.exports = router;
