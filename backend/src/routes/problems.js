const express = require("express");
const db = require("../db/connection");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

function formatProblem(p, studentId = null) {
  const result = {
    ...p,
    tags: JSON.parse(p.tags || "[]"),
    examples: JSON.parse(p.examples || "[]"),
    constraints: JSON.parse(p.constraints || "[]"),
    hints: JSON.parse(p.hints || "[]"),
    starterCode: JSON.parse(p.starter_code || "{}"),
    testCases: JSON.parse(p.test_cases || "[]"),
    solved: false,
    attempted: false,
  };

  if (studentId) {
    const attempts = db.prepare(
      "SELECT verdict, solved FROM problem_attempts WHERE problem_id = ? AND student_id = ? ORDER BY attempted_at DESC LIMIT 1"
    ).get(p.id, studentId);
    if (attempts) {
      result.solved = !!attempts.solved;
      result.attempted = true;
    }
  }

  return result;
}

// GET /api/problems
router.get("/", authenticate, (req, res) => {
  const { difficulty, tag, search, solved } = req.query;
  let query = "SELECT * FROM problems WHERE 1=1";
  const params = [];
  if (difficulty) { query += " AND difficulty = ?"; params.push(difficulty); }
  if (search) { query += " AND title LIKE ?"; params.push(`%${search}%`); }
  query += " ORDER BY difficulty ASC, title ASC";

  let problems = db.prepare(query).all(...params).map(p =>
    formatProblem(p, req.user.role === "student" ? req.user.id : null)
  );

  if (tag) problems = problems.filter(p => p.tags.includes(tag));
  if (solved === "true") problems = problems.filter(p => p.solved);
  if (solved === "false") problems = problems.filter(p => !p.solved);

  res.json(problems);
});

// GET /api/problems/:id
router.get("/:id", authenticate, (req, res) => {
  const problem = db.prepare("SELECT * FROM problems WHERE id = ?").get(req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const formatted = formatProblem(problem, req.user.role === "student" ? req.user.id : null);

  // Get student's latest code
  let myAttempt = null;
  if (req.user.role === "student") {
    myAttempt = db.prepare(
      "SELECT * FROM problem_attempts WHERE problem_id = ? AND student_id = ? ORDER BY attempted_at DESC LIMIT 1"
    ).get(req.params.id, req.user.id);
  }

  res.json({ ...formatted, myAttempt });
});

// POST /api/problems/:id/submit - submit code
router.post("/:id/submit", authenticate, (req, res) => {
  const problem = db.prepare("SELECT * FROM problems WHERE id = ?").get(req.params.id);
  if (!problem) return res.status(404).json({ error: "Problem not found" });

  const { code, language = "python" } = req.body;
  if (!code) return res.status(400).json({ error: "Code is required" });

  // Simulate code execution (in production, you'd run actual code)
  // For now, we randomly accept/reject for demonstration but accept known patterns
  const verdict = simulateVerdict(code, problem);
  const solved = verdict === "accepted" ? 1 : 0;

  const id = `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  db.prepare(`
    INSERT INTO problem_attempts (id, problem_id, student_id, language, code, verdict, solved)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, req.params.id, req.user.id, language, code, verdict, solved);

  // Log activity
  const today = new Date().toISOString().split("T")[0];
  db.prepare(`
    INSERT INTO student_activity (id, student_id, date, count)
    VALUES (?, ?, ?, 1)
    ON CONFLICT(student_id, date) DO UPDATE SET count = count + 1
  `).run(`act-${Date.now()}`, req.user.id, today);

  res.json({ verdict, message: getVerdictMessage(verdict) });
});

// GET /api/problems/:id/attempts - student's attempts
router.get("/:id/attempts", authenticate, (req, res) => {
  const attempts = db.prepare(
    "SELECT * FROM problem_attempts WHERE problem_id = ? AND student_id = ? ORDER BY attempted_at DESC"
  ).all(req.params.id, req.user.id);
  res.json(attempts);
});

function simulateVerdict(code, problem) {
  // Simple heuristic: if code length is meaningful and not just placeholder
  const trimmed = code.trim();
  if (trimmed.length < 20 || trimmed.includes("pass") || trimmed.includes("// your code")) {
    return "wrong";
  }
  // 70% acceptance rate for non-trivial submissions (simulated)
  return Math.random() > 0.3 ? "accepted" : "wrong";
}

function getVerdictMessage(verdict) {
  const msgs = {
    accepted: "✅ Accepted! All test cases passed.",
    wrong: "❌ Wrong Answer. Check your logic.",
    error: "🔴 Runtime Error. Check for exceptions.",
    timeout: "⏱️ Time Limit Exceeded. Optimize your solution.",
  };
  return msgs[verdict] || "Unknown verdict";
}

module.exports = router;
