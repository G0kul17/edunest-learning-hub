const express = require("express");
const db = require("../db/connection");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function formatTest(test, questions) {
  return {
    ...test,
    courseId: test.course_id,
    courseName: test.course_name,
    questionCount: test.question_count || questions.length,
    passMark: test.pass_mark,
    shuffleQuestions: !!test.shuffle_questions,
    showResultsImmediately: !!test.show_results_immediately,
    avgScore: test.avg_score,
    questions: questions.map(q => ({
      ...q,
      options: JSON.parse(q.options || "[]"),
      correctAnswer: isNaN(q.correct_answer) ? q.correct_answer : Number(q.correct_answer),
    })),
  };
}

// GET /api/tests
router.get("/", authenticate, (req, res) => {
  const { type, status, courseId } = req.query;
  let query = "SELECT * FROM tests WHERE 1=1";
  const params = [];
  if (type) { query += " AND type = ?"; params.push(type); }
  if (status) { query += " AND status = ?"; params.push(status); }
  if (courseId) { query += " AND course_id = ?"; params.push(courseId); }
  query += " ORDER BY date DESC";

  const tests = db.prepare(query).all(...params).map(t => {
    const questions = db.prepare("SELECT * FROM test_questions WHERE test_id = ? ORDER BY order_index").all(t.id);
    return formatTest(t, questions);
  });
  res.json(tests);
});

// GET /api/tests/:id
router.get("/:id", authenticate, (req, res) => {
  const test = db.prepare("SELECT * FROM tests WHERE id = ?").get(req.params.id);
  if (!test) return res.status(404).json({ error: "Test not found" });
  const questions = db.prepare("SELECT * FROM test_questions WHERE test_id = ? ORDER BY order_index").all(req.params.id);

  // Check if student already submitted
  let submission = null;
  if (req.user.role === "student") {
    submission = db.prepare(
      "SELECT * FROM test_submissions WHERE test_id = ? AND student_id = ?"
    ).get(req.params.id, req.user.id);
    if (submission) {
      submission.answers = JSON.parse(submission.answers || "{}");
    }
  }

  const formatted = formatTest(test, questions);

  // Don't send correct answers unless test is completed or student already submitted
  if (req.user.role === "student" && !submission && test.status !== "completed") {
    formatted.questions = formatted.questions.map(q => {
      const { correctAnswer, explanation, ...rest } = q;
      return rest;
    });
  }

  res.json({ ...formatted, mySubmission: submission });
});

// POST /api/tests - create test (admin only)
router.post("/", authenticate, requireAdmin, (req, res) => {
  const { title, courseId, courseName, type, duration, date, passMark, status, shuffleQuestions, showResultsImmediately, questions } = req.body;
  if (!title || !courseId || !type) {
    return res.status(400).json({ error: "title, courseId, type are required" });
  }

  const id = `t-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  db.prepare(`
    INSERT INTO tests (id, title, course_id, course_name, type, duration, date, pass_mark, status, shuffle_questions, show_results_immediately, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, courseId, courseName || "", type, duration || 30, date || new Date().toISOString().split("T")[0], passMark || 60, status || "upcoming", shuffleQuestions ? 1 : 0, showResultsImmediately ? 1 : 0, 0);

  if (questions && Array.isArray(questions)) {
    const insertQ = db.prepare(`
      INSERT INTO test_questions (id, test_id, text, type, options, correct_answer, points, hint, explanation, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    questions.forEach((q, idx) => {
      const qId = `q-${Date.now()}-${idx}`;
      insertQ.run(qId, id, q.text, q.type, JSON.stringify(q.options || []), String(q.correctAnswer), q.points || 5, q.hint || null, q.explanation || null, idx + 1);
    });
  }

  const test = db.prepare("SELECT * FROM tests WHERE id = ?").get(id);
  const qs = db.prepare("SELECT * FROM test_questions WHERE test_id = ? ORDER BY order_index").all(id);
  res.status(201).json(formatTest(test, qs));
});

// PUT /api/tests/:id (admin only)
router.put("/:id", authenticate, requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT id FROM tests WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Test not found" });

  const { title, status, duration, date, passMark, shuffleQuestions, showResultsImmediately } = req.body;
  db.prepare(`
    UPDATE tests SET title=?, status=?, duration=?, date=?, pass_mark=?, shuffle_questions=?, show_results_immediately=?
    WHERE id=?
  `).run(title, status, duration, date, passMark, shuffleQuestions ? 1 : 0, showResultsImmediately ? 1 : 0, req.params.id);

  const test = db.prepare("SELECT * FROM tests WHERE id = ?").get(req.params.id);
  const questions = db.prepare("SELECT * FROM test_questions WHERE test_id = ? ORDER BY order_index").all(req.params.id);
  res.json(formatTest(test, questions));
});

// POST /api/tests/:id/submit - student submits test
router.post("/:id/submit", authenticate, (req, res) => {
  const test = db.prepare("SELECT * FROM tests WHERE id = ?").get(req.params.id);
  if (!test) return res.status(404).json({ error: "Test not found" });

  const existing = db.prepare(
    "SELECT id FROM test_submissions WHERE test_id = ? AND student_id = ?"
  ).get(req.params.id, req.user.id);
  if (existing) return res.status(409).json({ error: "Already submitted" });

  const { answers, timeTaken } = req.body;
  const questions = db.prepare("SELECT * FROM test_questions WHERE test_id = ?").all(req.params.id);

  let totalPoints = 0;
  let earned = 0;
  for (const q of questions) {
    totalPoints += q.points;
    const submitted = String(answers[q.id] ?? "");
    const correct = String(q.correct_answer);
    if (submitted === correct) earned += q.points;
  }

  const score = totalPoints > 0 ? (earned / totalPoints) * 100 : 0;
  const passed = score >= test.pass_mark ? 1 : 0;

  const subId = `sub-${Date.now()}`;
  db.prepare(`
    INSERT INTO test_submissions (id, test_id, student_id, answers, score, total_points, passed, time_taken)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(subId, req.params.id, req.user.id, JSON.stringify(answers || {}), Math.round(score * 10) / 10, totalPoints, passed, timeTaken || 0);

  // Update test avg_score
  const submissions = db.prepare("SELECT score FROM test_submissions WHERE test_id = ?").all(req.params.id);
  const newAvg = submissions.reduce((a, s) => a + s.score, 0) / submissions.length;
  db.prepare("UPDATE tests SET avg_score = ?, attempted = ? WHERE id = ?").run(Math.round(newAvg * 10) / 10, submissions.length, req.params.id);

  // Update student avg_score in stats
  const studentSubs = db.prepare("SELECT score FROM test_submissions WHERE student_id = ?").all(req.user.id);
  const studentAvg = studentSubs.reduce((a, s) => a + s.score, 0) / studentSubs.length;
  db.prepare("UPDATE student_stats SET avg_score = ? WHERE student_id = ?").run(Math.round(studentAvg * 10) / 10, req.user.id);

  // Log activity
  const today = new Date().toISOString().split("T")[0];
  db.prepare(`
    INSERT INTO student_activity (id, student_id, date, count)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(student_id, date) DO UPDATE SET count = count + 1
  `).run(`act-${Date.now()}`, req.user.id, today);

  res.json({ score: Math.round(score * 10) / 10, totalPoints, earned, passed: !!passed });
});

// GET /api/tests/:id/results (admin)
router.get("/:id/results", authenticate, requireAdmin, (req, res) => {
  const submissions = db.prepare(`
    SELECT ts.*, u.name as student_name, u.email as student_email
    FROM test_submissions ts
    JOIN users u ON u.id = ts.student_id
    WHERE ts.test_id = ?
    ORDER BY ts.submitted_at DESC
  `).all(req.params.id);

  res.json(submissions.map(s => ({
    ...s,
    answers: JSON.parse(s.answers || "{}"),
    passed: !!s.passed,
  })));
});

module.exports = router;
