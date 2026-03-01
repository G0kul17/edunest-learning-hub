const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/connection");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = signToken(user);
  const { password: _, ...userWithoutPassword } = user;

  // Update last_active for students
  if (user.role === "student") {
    const today = new Date().toISOString().split("T")[0];
    db.prepare(`
      UPDATE student_stats SET last_active = ? WHERE student_id = ?
    `).run(today, user.id);
  }

  res.json({
    token,
    user: {
      id: userWithoutPassword.id,
      name: userWithoutPassword.name,
      email: userWithoutPassword.email,
      role: userWithoutPassword.role,
      avatar: userWithoutPassword.avatar,
      joinDate: userWithoutPassword.join_date,
    },
  });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password, role = "student" } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }
  if (!["admin", "student"].includes(role)) {
    return res.status(400).json({ error: "Role must be admin or student" });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const id = `u-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const joinDate = new Date().toISOString().split("T")[0];

  db.prepare(`
    INSERT INTO users (id, name, email, password, role, join_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, name, email.toLowerCase().trim(), hashedPassword, role, joinDate);

  if (role === "student") {
    db.prepare(`
      INSERT INTO student_stats (student_id, streak, longest_streak, avg_score, last_active)
      VALUES (?, 0, 0, 0, ?)
    `).run(id, joinDate);
  }

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  const token = signToken(user);

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      joinDate: user.join_date,
    },
  });
});

// GET /api/auth/me
router.get("/me", authenticate, (req, res) => {
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: _, ...rest } = user;
  res.json({
    id: rest.id,
    name: rest.name,
    email: rest.email,
    role: rest.role,
    avatar: rest.avatar,
    joinDate: rest.join_date,
  });
});

module.exports = router;
