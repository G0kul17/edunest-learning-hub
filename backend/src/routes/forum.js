const express = require("express");
const db = require("../db/connection");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

function formatPost(post, withReplies = false) {
  const result = {
    ...post,
    courseId: post.course_id,
    authorId: post.author_id,
    authorName: post.author_name,
    authorAvatar: post.author_avatar,
    createdAt: post.created_at,
    tags: JSON.parse(post.tags || "[]"),
    solved: !!post.solved,
    replies: [],
  };

  if (withReplies) {
    const replies = db.prepare(
      "SELECT * FROM forum_replies WHERE post_id = ? ORDER BY created_at ASC"
    ).all(post.id);
    result.replies = replies.map(r => ({
      id: r.id,
      body: r.body,
      authorId: r.author_id,
      authorName: r.author_name,
      authorAvatar: r.author_avatar,
      createdAt: r.created_at,
      likes: r.likes,
      isSolution: !!r.is_solution,
    }));
  }

  return result;
}

// GET /api/forum/posts
router.get("/posts", authenticate, (req, res) => {
  const { courseId, solved, search } = req.query;
  let query = "SELECT * FROM forum_posts WHERE 1=1";
  const params = [];
  if (courseId) { query += " AND course_id = ?"; params.push(courseId); }
  if (solved !== undefined) { query += " AND solved = ?"; params.push(solved === "true" ? 1 : 0); }
  if (search) { query += " AND (title LIKE ? OR body LIKE ?)"; params.push(`%${search}%`, `%${search}%`); }
  query += " ORDER BY created_at DESC";

  const posts = db.prepare(query).all(...params).map(p => {
    const replyCount = db.prepare("SELECT COUNT(*) as c FROM forum_replies WHERE post_id = ?").get(p.id).c;
    return { ...formatPost(p), replyCount };
  });

  res.json(posts);
});

// GET /api/forum/posts/:id - get single post with replies
router.get("/posts/:id", authenticate, (req, res) => {
  const post = db.prepare("SELECT * FROM forum_posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(formatPost(post, true));
});

// POST /api/forum/posts - create post
router.post("/posts", authenticate, (req, res) => {
  const { courseId, title, body, tags } = req.body;
  if (!courseId || !title || !body) {
    return res.status(400).json({ error: "courseId, title, body are required" });
  }

  const user = db.prepare("SELECT name, avatar FROM users WHERE id = ?").get(req.user.id);
  const id = `fp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  db.prepare(`
    INSERT INTO forum_posts (id, course_id, title, body, author_id, author_name, author_avatar, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, courseId, title, body, req.user.id, user.name, user.avatar, JSON.stringify(tags || []));

  const post = db.prepare("SELECT * FROM forum_posts WHERE id = ?").get(id);
  res.status(201).json(formatPost(post, true));
});

// POST /api/forum/posts/:id/replies - add reply
router.post("/posts/:id/replies", authenticate, (req, res) => {
  const post = db.prepare("SELECT id FROM forum_posts WHERE id = ?").get(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  const { body } = req.body;
  if (!body) return res.status(400).json({ error: "Body is required" });

  const user = db.prepare("SELECT name, avatar FROM users WHERE id = ?").get(req.user.id);
  const id = `fr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  db.prepare(`
    INSERT INTO forum_replies (id, post_id, body, author_id, author_name, author_avatar)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, req.params.id, body, req.user.id, user.name, user.avatar);

  const reply = db.prepare("SELECT * FROM forum_replies WHERE id = ?").get(id);
  res.status(201).json({
    id: reply.id,
    body: reply.body,
    authorId: reply.author_id,
    authorName: reply.author_name,
    authorAvatar: reply.author_avatar,
    createdAt: reply.created_at,
    likes: reply.likes,
    isSolution: false,
  });
});

// POST /api/forum/posts/:id/like - like a post
router.post("/posts/:id/like", authenticate, (req, res) => {
  db.prepare("UPDATE forum_posts SET likes = likes + 1 WHERE id = ?").run(req.params.id);
  const post = db.prepare("SELECT likes FROM forum_posts WHERE id = ?").get(req.params.id);
  res.json({ likes: post.likes });
});

// POST /api/forum/replies/:id/like - like a reply
router.post("/replies/:id/like", authenticate, (req, res) => {
  db.prepare("UPDATE forum_replies SET likes = likes + 1 WHERE id = ?").run(req.params.id);
  const reply = db.prepare("SELECT likes FROM forum_replies WHERE id = ?").get(req.params.id);
  res.json({ likes: reply.likes });
});

// POST /api/forum/replies/:id/solution - mark reply as solution (post author or admin)
router.post("/replies/:id/solution", authenticate, (req, res) => {
  const reply = db.prepare("SELECT * FROM forum_replies WHERE id = ?").get(req.params.id);
  if (!reply) return res.status(404).json({ error: "Reply not found" });

  const post = db.prepare("SELECT * FROM forum_posts WHERE id = ?").get(reply.post_id);
  if (req.user.id !== post.author_id && req.user.role !== "admin") {
    return res.status(403).json({ error: "Only the post author or admin can mark a solution" });
  }

  db.prepare("UPDATE forum_replies SET is_solution = 1 WHERE id = ?").run(req.params.id);
  db.prepare("UPDATE forum_posts SET solved = 1 WHERE id = ?").run(reply.post_id);
  res.json({ message: "Marked as solution" });
});

module.exports = router;
