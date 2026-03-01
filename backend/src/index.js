require("dotenv").config();
const express = require("express");
const cors = require("cors");
const initializeDatabase = require("./db/schema");

// Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const studentRoutes = require("./routes/students");
const testRoutes = require("./routes/tests");
const assignmentRoutes = require("./routes/assignments");
const problemRoutes = require("./routes/problems");
const forumRoutes = require("./routes/forum");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl/Postman), or any localhost origin
    if (!origin || /^http:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    // Also allow the configured FRONTEND_URL
    if (origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev only)
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ── Initialize DB ─────────────────────────────────────────────────────────────
initializeDatabase();

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), version: "1.0.0" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 EduNest API running at http://localhost:${PORT}`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/health`);
  console.log(`🌱 To seed the database: npm run seed\n`);
});

module.exports = app;
