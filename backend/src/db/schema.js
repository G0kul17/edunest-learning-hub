const db = require("./connection");

function initializeDatabase() {
  db.exec(`
    -- Users table (both admins and students)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'student')),
      avatar TEXT,
      join_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Courses table
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
      instructor TEXT NOT NULL,
      instructor_avatar TEXT,
      thumbnail TEXT,
      duration TEXT,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      lesson_count INTEGER DEFAULT 0,
      enrolled INTEGER DEFAULT 0,
      avg_completion REAL DEFAULT 0,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'draft', 'archived')),
      tags TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Lessons table
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('video', 'doc', 'quiz')),
      duration TEXT,
      video_url TEXT,
      content TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Student course enrollments
    CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      enrolled_at TEXT DEFAULT (datetime('now')),
      completed_lessons INTEGER DEFAULT 0,
      total_lessons INTEGER DEFAULT 0,
      score REAL DEFAULT 0,
      UNIQUE(student_id, course_id),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Lesson completion tracking
    CREATE TABLE IF NOT EXISTS lesson_completions (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      completed_at TEXT DEFAULT (datetime('now')),
      UNIQUE(student_id, lesson_id),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    -- Student activity (for heatmap/streak)
    CREATE TABLE IF NOT EXISTS student_activity (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      date TEXT NOT NULL,
      count INTEGER DEFAULT 1,
      UNIQUE(student_id, date),
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Student streak data
    CREATE TABLE IF NOT EXISTS student_stats (
      student_id TEXT PRIMARY KEY,
      streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      avg_score REAL DEFAULT 0,
      last_active TEXT,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Tests table
    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      course_id TEXT NOT NULL,
      course_name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('daily', 'course-end', 'mock')),
      duration INTEGER NOT NULL DEFAULT 30,
      date TEXT NOT NULL,
      avg_score REAL DEFAULT 0,
      attempted INTEGER DEFAULT 0,
      total INTEGER DEFAULT 0,
      pass_mark INTEGER DEFAULT 60,
      status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'live', 'completed')),
      shuffle_questions INTEGER DEFAULT 0,
      show_results_immediately INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Test questions
    CREATE TABLE IF NOT EXISTS test_questions (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL,
      text TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('mcq', 'true-false', 'short-answer')),
      options TEXT DEFAULT '[]',
      correct_answer TEXT NOT NULL,
      points INTEGER DEFAULT 5,
      hint TEXT,
      explanation TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
    );

    -- Test submissions (student results)
    CREATE TABLE IF NOT EXISTS test_submissions (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      answers TEXT NOT NULL DEFAULT '{}',
      score REAL DEFAULT 0,
      total_points INTEGER DEFAULT 0,
      passed INTEGER DEFAULT 0,
      submitted_at TEXT DEFAULT (datetime('now')),
      time_taken INTEGER DEFAULT 0,
      UNIQUE(test_id, student_id),
      FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Assignments table
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      course_id TEXT NOT NULL,
      course_name TEXT NOT NULL,
      lesson_id TEXT,
      description TEXT,
      due_date TEXT NOT NULL,
      points INTEGER DEFAULT 100,
      submission_type TEXT DEFAULT 'text' CHECK(submission_type IN ('file', 'text', 'link', 'code')),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'submitted', 'graded', 'overdue')),
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Assignment submissions
    CREATE TABLE IF NOT EXISTS assignment_submissions (
      id TEXT PRIMARY KEY,
      assignment_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      student_name TEXT NOT NULL,
      content TEXT NOT NULL,
      score REAL,
      feedback TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'graded', 'revision-requested')),
      submitted_at TEXT DEFAULT (datetime('now')),
      UNIQUE(assignment_id, student_id),
      FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Coding problems
    CREATE TABLE IF NOT EXISTS problems (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy', 'Medium', 'Hard')),
      acceptance REAL DEFAULT 0,
      tags TEXT DEFAULT '[]',
      description TEXT,
      examples TEXT DEFAULT '[]',
      constraints TEXT DEFAULT '[]',
      hints TEXT DEFAULT '[]',
      starter_code TEXT DEFAULT '{}',
      test_cases TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Student problem attempts
    CREATE TABLE IF NOT EXISTS problem_attempts (
      id TEXT PRIMARY KEY,
      problem_id TEXT NOT NULL,
      student_id TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'python',
      code TEXT NOT NULL,
      verdict TEXT DEFAULT 'pending' CHECK(verdict IN ('pending', 'accepted', 'wrong', 'error', 'timeout')),
      attempted_at TEXT DEFAULT (datetime('now')),
      solved INTEGER DEFAULT 0,
      FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Forum posts
    CREATE TABLE IF NOT EXISTS forum_posts (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_avatar TEXT,
      tags TEXT DEFAULT '[]',
      likes INTEGER DEFAULT 0,
      solved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Forum replies
    CREATE TABLE IF NOT EXISTS forum_replies (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL,
      body TEXT NOT NULL,
      author_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_avatar TEXT,
      likes INTEGER DEFAULT 0,
      is_solution INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (post_id) REFERENCES forum_posts(id) ON DELETE CASCADE,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  console.log("✅ Database schema initialized");
}

module.exports = initializeDatabase;
