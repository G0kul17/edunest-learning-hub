const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/connection");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// PUT /api/users/me — update own profile (name, email, avatar, password)
router.put("/me", authenticate, (req, res) => {
  const { name, email, avatar, currentPassword, newPassword } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  // If changing password, verify current password first
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required to set a new password" });
    }
    const valid = bcrypt.compareSync(currentPassword, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be at least 6 characters" });
    }
  }

  // Check if new email is already taken by another user
  if (email && email.toLowerCase() !== user.email) {
    const existing = db.prepare("SELECT id FROM users WHERE email = ? AND id != ?").get(email.toLowerCase(), req.user.id);
    if (existing) return res.status(409).json({ error: "Email already in use by another account" });
  }

  const updatedName = name?.trim() || user.name;
  const updatedEmail = email?.toLowerCase().trim() || user.email;
  const updatedAvatar = avatar !== undefined ? avatar : user.avatar;
  const updatedPassword = newPassword ? bcrypt.hashSync(newPassword, 10) : user.password;

  db.prepare(`
    UPDATE users SET name = ?, email = ?, avatar = ?, password = ? WHERE id = ?
  `).run(updatedName, updatedEmail, updatedAvatar, updatedPassword, req.user.id);

  const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);

  res.json({
    id: updated.id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    avatar: updated.avatar,
    joinDate: updated.join_date,
  });
});

module.exports = router;
