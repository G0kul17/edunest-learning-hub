require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("crypto");
const db = require("./connection");
const initializeDatabase = require("./schema");

// Simple UUID generator
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateActivityData(studentId, days) {
  const today = new Date();
  const insertActivity = db.prepare(`
    INSERT OR IGNORE INTO student_activity (id, student_id, date, count)
    VALUES (?, ?, ?, ?)
  `);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : 0;
    if (count > 0) {
      insertActivity.run(uuid(), studentId, dateStr, count);
    }
  }
}

async function seed() {
  // Initialize schema
  initializeDatabase();

  // Check if already seeded
  const existingAdmin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
  if (existingAdmin) {
    console.log("✅ Database already seeded. Skipping.");
    return;
  }

  console.log("🌱 Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // ── Users ────────────────────────────────────────────────────────────────
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password, role, avatar, join_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertUser.run("admin-1", "Dr. Priya Sharma", "admin@edunest.com", passwordHash, "admin", null, "2023-01-15");
  insertUser.run("s1", "Aryan Mehta", "aryan@example.com", passwordHash, "student", null, "2023-09-01");
  insertUser.run("s2", "Priya Patel", "priya@example.com", passwordHash, "student", null, "2023-08-15");
  insertUser.run("s3", "Rahul Kumar", "rahul@example.com", passwordHash, "student", null, "2023-10-20");
  insertUser.run("s4", "Sneha Gupta", "sneha@example.com", passwordHash, "student", null, "2023-07-01");
  insertUser.run("s5", "Vikram Singh", "vikram@example.com", passwordHash, "student", null, "2024-01-10");
  insertUser.run("s6", "Ananya Reddy", "ananya@example.com", passwordHash, "student", null, "2024-02-01");
  insertUser.run("s7", "Karthik Nair", "karthik@example.com", passwordHash, "student", null, "2023-06-15");
  insertUser.run("s8", "Meera Joshi", "meera@example.com", passwordHash, "student", null, "2023-08-01");

  console.log("✅ Users seeded");

  // ── Student Stats ─────────────────────────────────────────────────────────
  const insertStats = db.prepare(`
    INSERT INTO student_stats (student_id, streak, longest_streak, avg_score, last_active)
    VALUES (?, ?, ?, ?, ?)
  `);

  const studentStats = [
    ["s1", 12, 28, 84.2, "2024-03-15"],
    ["s2", 7, 21, 91.5, "2024-03-15"],
    ["s3", 0, 14, 62.8, "2024-03-08"],
    ["s4", 23, 45, 88.9, "2024-03-15"],
    ["s5", 3, 10, 71.4, "2024-03-14"],
    ["s6", 0, 5, 55.3, "2024-02-28"],
    ["s7", 15, 30, 79.6, "2024-03-15"],
    ["s8", 9, 18, 86.1, "2024-03-15"],
  ];
  for (const s of studentStats) insertStats.run(...s);

  // Activity data
  const studentIds = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
  for (const sid of studentIds) generateActivityData(sid, 365);
  console.log("✅ Student stats & activity seeded");

  // ── Courses ────────────────────────────────────────────────────────────────
  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, category, description, difficulty, instructor, instructor_avatar,
      thumbnail, duration, rating, review_count, lesson_count, enrolled, avg_completion, status, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const courses = [
    ["c1", "Python Fundamentals", "Programming", "Master Python from scratch — variables, control flow, functions, OOP, and real-world projects.", "Beginner", "Prof. Sharma", null, "python", "8 hours", 4.7, 182, 12, 234, 71, "active", JSON.stringify(["Python", "Programming", "Beginner"])],
    ["c2", "Data Structures & Algorithms", "Computer Science", "Deep dive into data structures and algorithms — arrays, trees, graphs, sorting, DP, and competitive coding prep.", "Intermediate", "Dr. Anand", null, "dsa", "12 hours", 4.8, 156, 10, 189, 52, "active", JSON.stringify(["DSA", "Algorithms", "Competitive"])],
    ["c3", "JavaScript Mastery", "Programming", "Complete JavaScript course — from fundamentals to advanced concepts like closures, async, and modern ES6+.", "Beginner", "Ms. Kavitha", null, "javascript", "6 hours", 4.6, 243, 8, 312, 65, "active", JSON.stringify(["JavaScript", "Web Dev", "Frontend"])],
    ["c4", "React & TypeScript", "Frontend", "Build production-ready apps with React 18 and TypeScript — hooks, state management, and advanced patterns.", "Intermediate", "Prof. Sharma", null, "react", "10 hours", 4.9, 134, 6, 178, 58, "active", JSON.stringify(["React", "TypeScript", "Frontend"])],
    ["c5", "Machine Learning Basics", "Data Science", "Introduction to machine learning — regression, classification, clustering, neural networks, and hands-on projects.", "Advanced", "Dr. Anand", null, "ml", "14 hours", 4.5, 98, 10, 145, 32, "active", JSON.stringify(["ML", "AI", "Data Science"])],
    ["c6", "Web Design Principles", "Design", "Learn design fundamentals — color, typography, layout, responsive design, and modern UI/UX practices.", "Beginner", "Ms. Kavitha", null, "design", "5 hours", 4.4, 67, 6, 98, 45, "draft", JSON.stringify(["Design", "UI/UX", "Web"])],
  ];
  for (const c of courses) insertCourse.run(...c);

  // ── Lessons ────────────────────────────────────────────────────────────────
  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, course_id, title, type, duration, video_url, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const lessons = [
    // c1 - Python
    ["l1", "c1", "Introduction to Python", "video", "15 min", "https://www.youtube.com/embed/dQw4w9WgXcQ", 1],
    ["l2", "c1", "Variables & Data Types", "video", "22 min", null, 2],
    ["l3", "c1", "Control Flow", "video", "18 min", null, 3],
    ["l4", "c1", "Functions", "video", "25 min", null, 4],
    ["l5", "c1", "Lists & Tuples", "video", "20 min", null, 5],
    ["l6", "c1", "Dictionaries & Sets", "video", "18 min", null, 6],
    ["l7", "c1", "String Methods", "doc", "12 min", null, 7],
    ["l8", "c1", "File Handling", "video", "22 min", null, 8],
    ["l9", "c1", "Error Handling", "video", "16 min", null, 9],
    ["l10", "c1", "Modules & Packages", "video", "20 min", null, 10],
    ["l11", "c1", "OOP Basics", "video", "30 min", null, 11],
    ["l12", "c1", "Final Project", "quiz", "45 min", null, 12],
    // c2 - DSA
    ["l13", "c2", "Big-O Notation", "video", "20 min", null, 1],
    ["l14", "c2", "Arrays & Strings", "video", "25 min", null, 2],
    ["l15", "c2", "Linked Lists", "video", "28 min", null, 3],
    ["l16", "c2", "Stacks & Queues", "video", "22 min", null, 4],
    ["l17", "c2", "Trees & BST", "video", "35 min", null, 5],
    ["l18", "c2", "Graphs", "video", "30 min", null, 6],
    ["l19", "c2", "Sorting Algorithms", "video", "25 min", null, 7],
    ["l20", "c2", "Searching Algorithms", "video", "20 min", null, 8],
    ["l21", "c2", "Dynamic Programming", "video", "40 min", null, 9],
    ["l22", "c2", "Practice Problems", "quiz", "60 min", null, 10],
    // c3 - JS
    ["l23", "c3", "JS Fundamentals", "video", "18 min", null, 1],
    ["l24", "c3", "DOM Manipulation", "video", "25 min", null, 2],
    ["l25", "c3", "ES6+ Features", "video", "22 min", null, 3],
    ["l26", "c3", "Async JavaScript", "video", "30 min", null, 4],
    ["l27", "c3", "Closures & Scope", "video", "20 min", null, 5],
    ["l28", "c3", "Prototypes & Classes", "video", "25 min", null, 6],
    ["l29", "c3", "Error Handling", "video", "15 min", null, 7],
    ["l30", "c3", "Mini Project", "quiz", "45 min", null, 8],
    // c4 - React
    ["l31", "c4", "React Basics", "video", "22 min", null, 1],
    ["l32", "c4", "Components & Props", "video", "20 min", null, 2],
    ["l33", "c4", "State & Hooks", "video", "28 min", null, 3],
    ["l34", "c4", "TypeScript Intro", "video", "25 min", null, 4],
    ["l35", "c4", "Advanced Patterns", "video", "35 min", null, 5],
    ["l36", "c4", "Full-Stack Project", "quiz", "60 min", null, 6],
    // c5 - ML
    ["l37", "c5", "What is ML?", "video", "15 min", null, 1],
    ["l38", "c5", "Linear Regression", "video", "25 min", null, 2],
    ["l39", "c5", "Classification", "video", "22 min", null, 3],
    ["l40", "c5", "Decision Trees", "video", "20 min", null, 4],
    ["l41", "c5", "Neural Networks Intro", "video", "30 min", null, 5],
    ["l42", "c5", "Clustering", "video", "18 min", null, 6],
    ["l43", "c5", "Model Evaluation", "video", "22 min", null, 7],
    ["l44", "c5", "Practical Projects", "video", "35 min", null, 8],
    ["l45", "c5", "Deep Learning Preview", "video", "25 min", null, 9],
    ["l46", "c5", "Capstone", "quiz", "45 min", null, 10],
    // c6 - Design
    ["l47", "c6", "Design Thinking", "video", "18 min", null, 1],
    ["l48", "c6", "Color Theory", "video", "15 min", null, 2],
    ["l49", "c6", "Typography", "video", "20 min", null, 3],
    ["l50", "c6", "Layout & Grid", "video", "22 min", null, 4],
    ["l51", "c6", "Responsive Design", "video", "25 min", null, 5],
    ["l52", "c6", "UI/UX Best Practices", "video", "20 min", null, 6],
  ];
  for (const l of lessons) insertLesson.run(...l);
  console.log("✅ Courses & lessons seeded");

  // ── Enrollments ────────────────────────────────────────────────────────────
  const insertEnrollment = db.prepare(`
    INSERT OR IGNORE INTO enrollments (id, student_id, course_id, completed_lessons, total_lessons, score)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const enrollments = [
    ["s1", "c1", 8, 12, 87], ["s1", "c2", 3, 10, 72], ["s1", "c3", 5, 8, 91],
    ["s2", "c1", 12, 12, 95], ["s2", "c3", 6, 8, 88],
    ["s3", "c2", 2, 10, 58], ["s3", "c4", 1, 6, 67],
    ["s4", "c1", 10, 12, 92], ["s4", "c2", 7, 10, 85], ["s4", "c4", 4, 6, 90],
    ["s5", "c3", 4, 8, 71],
    ["s6", "c1", 3, 12, 52], ["s6", "c5", 1, 10, 58],
    ["s7", "c2", 8, 10, 82], ["s7", "c3", 7, 8, 78], ["s7", "c5", 5, 10, 79],
    ["s8", "c1", 11, 12, 89], ["s8", "c4", 5, 6, 83],
  ];
  for (const [sid, cid, comp, tot, score] of enrollments) {
    insertEnrollment.run(uuid(), sid, cid, comp, tot, score);
  }
  console.log("✅ Enrollments seeded");

  // ── Tests ─────────────────────────────────────────────────────────────────
  const insertTest = db.prepare(`
    INSERT INTO tests (id, title, course_id, course_name, type, duration, date, avg_score,
      attempted, total, pass_mark, status, shuffle_questions, show_results_immediately)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertTest.run("t1", "JavaScript Daily Test #14", "c3", "JavaScript Mastery", "daily", 20, "2024-03-15", 76.3, 89, 120, 60, "completed", 1, 1);
  insertTest.run("t2", "Python Course Final Exam", "c1", "Python Fundamentals", "course-end", 60, "2024-03-20", 0, 0, 234, 70, "upcoming", 0, 0);
  insertTest.run("t3", "DSA Mock Test — Arrays & Strings", "c2", "Data Structures & Algorithms", "mock", 45, "2024-03-18", 82.1, 67, 189, 65, "completed", 1, 1);

  // ── Test Questions ─────────────────────────────────────────────────────────
  const insertQ = db.prepare(`
    INSERT INTO test_questions (id, test_id, text, type, options, correct_answer, points, hint, explanation, order_index)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const t1Questions = [
    ["q1", "t1", "What does 'typeof null' return in JavaScript?", "mcq", JSON.stringify(["null", "undefined", "object", "boolean"]), "2", 5, null, "This is a well-known JavaScript quirk. typeof null returns 'object'.", 1],
    ["q2", "t1", "Which method converts a JSON string to a JavaScript object?", "mcq", JSON.stringify(["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.decode()"]), "0", 5, null, "JSON.parse() parses a JSON string and constructs the JavaScript value.", 2],
    ["q3", "t1", "Arrow functions have their own 'this' binding.", "true-false", JSON.stringify(["True", "False"]), "1", 5, null, "Arrow functions do NOT have their own 'this'. They inherit 'this' from the enclosing scope.", 3],
    ["q4", "t1", "What is the output of: console.log(1 + '2' + 3)?", "mcq", JSON.stringify(["6", "123", "15", "NaN"]), "1", 5, "Think about type coercion", null, 4],
    ["q5", "t1", "Which keyword declares a block-scoped variable?", "mcq", JSON.stringify(["var", "let", "function", "global"]), "1", 5, null, null, 5],
    ["q6", "t1", "Promise.all() rejects if any promise rejects.", "true-false", JSON.stringify(["True", "False"]), "0", 5, null, null, 6],
    ["q7", "t1", "What does the spread operator (...) do?", "mcq", JSON.stringify(["Copies an array", "Expands iterable elements", "Destructures objects", "All of the above"]), "1", 5, null, null, 7],
    ["q8", "t1", "Which array method creates a new array with filtered results?", "mcq", JSON.stringify(["map()", "filter()", "reduce()", "forEach()"]), "1", 5, null, null, 8],
    ["q9", "t1", "The 'use strict' directive enables strict mode.", "true-false", JSON.stringify(["True", "False"]), "0", 5, null, null, 9],
    ["q10", "t1", "What is closure in JavaScript?", "mcq", JSON.stringify(["A function with no return value", "A function with access to its outer scope", "A self-invoking function", "A generator function"]), "1", 5, null, "A closure is a function that has access to variables in its outer (enclosing) scope.", 10],
  ];
  for (const q of t1Questions) insertQ.run(...q);

  const t2Questions = [
    ["q16", "t2", "What is the output of print(type([]))?", "mcq", JSON.stringify(["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'set'>"]), "1", 10, null, null, 1],
    ["q17", "t2", "Python is dynamically typed.", "true-false", JSON.stringify(["True", "False"]), "0", 5, null, null, 2],
    ["q18", "t2", "Which keyword is used for exception handling?", "mcq", JSON.stringify(["catch", "except", "handle", "error"]), "1", 10, null, null, 3],
    ["q19", "t2", "What does 'self' refer to in a Python class?", "mcq", JSON.stringify(["The class itself", "The current instance", "The parent class", "A global variable"]), "1", 10, null, null, 4],
    ["q20", "t2", "List comprehension is faster than for loops.", "true-false", JSON.stringify(["True", "False"]), "0", 5, null, null, 5],
  ];
  for (const q of t2Questions) insertQ.run(...q);

  const t3Questions = [
    ["q21", "t3", "Time complexity of accessing an array element by index?", "mcq", JSON.stringify(["O(1)", "O(n)", "O(log n)", "O(n²)"]), "0", 10, null, null, 1],
    ["q22", "t3", "Which data structure uses LIFO?", "mcq", JSON.stringify(["Queue", "Stack", "Array", "Linked List"]), "1", 10, null, null, 2],
    ["q23", "t3", "Binary search requires a sorted array.", "true-false", JSON.stringify(["True", "False"]), "0", 5, null, null, 3],
  ];
  for (const q of t3Questions) insertQ.run(...q);
  console.log("✅ Tests & questions seeded");

  // ── Assignments ────────────────────────────────────────────────────────────
  const insertAssignment = db.prepare(`
    INSERT INTO assignments (id, title, course_id, course_name, description, due_date, points, submission_type, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAssignment.run("a1", "Build a Calculator in Python", "c1", "Python Fundamentals", "Create a command-line calculator that supports addition, subtraction, multiplication, and division. Handle division by zero errors gracefully.", "2024-03-18", 100, "code", "pending");
  insertAssignment.run("a2", "JavaScript DOM Project", "c3", "JavaScript Mastery", "Build an interactive to-do list application using vanilla JavaScript and DOM manipulation. Must include add, delete, and mark-as-complete functionality.", "2024-03-20", 100, "link", "pending");
  insertAssignment.run("a3", "Binary Tree Implementation", "c2", "Data Structures & Algorithms", "Implement a Binary Search Tree with insert, search, delete, and traversal (inorder, preorder, postorder) operations.", "2024-03-25", 100, "code", "pending");
  insertAssignment.run("a4", "React Component Library", "c4", "React & TypeScript", "Create a small component library with at least 5 reusable, typed React components (Button, Input, Card, Modal, Alert).", "2024-03-12", 100, "link", "overdue");

  const insertSub = db.prepare(`
    INSERT INTO assignment_submissions (id, assignment_id, student_id, student_name, content, score, feedback, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertSub.run("sub1", "a1", "s1", "Aryan Mehta", "def calc(a, op, b):\n  if op == '+': return a+b\n  ...", 85, "Good implementation! Consider adding input validation.", "graded");
  insertSub.run("sub2", "a1", "s2", "Priya Patel", "class Calculator:\n  ...", 95, "Excellent OOP approach!", "graded");
  insertSub.run("sub3", "a2", "s5", "Vikram Singh", "https://github.com/vikram/todo-app", null, null, "pending");
  insertSub.run("sub4", "a4", "s4", "Sneha Gupta", "https://github.com/sneha/react-components", 92, "Great type safety and reusability!", "graded");
  console.log("✅ Assignments & submissions seeded");

  // ── Coding Problems ────────────────────────────────────────────────────────
  const insertProblem = db.prepare(`
    INSERT INTO problems (id, title, difficulty, acceptance, tags, description, examples, constraints, hints, starter_code, test_cases)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const problems = [
    [
      "p1", "Two Sum", "Easy", 68.2,
      JSON.stringify(["Arrays", "HashMap"]),
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
      JSON.stringify([{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }, { input: "nums = [3,2,4], target = 6", output: "[1,2]" }]),
      JSON.stringify(["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."]),
      JSON.stringify(["Try using a hash map to store values you've seen."]),
      JSON.stringify({ python: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass", javascript: "function twoSum(nums, target) {\n    // your code here\n}", java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n    }\n}" }),
      JSON.stringify([{ input: "[2,7,11,15]\n9", expected: "[0,1]" }, { input: "[3,2,4]\n6", expected: "[1,2]" }, { input: "[3,3]\n6", expected: "[0,1]" }])
    ],
    [
      "p2", "Reverse Linked List", "Easy", 72.5,
      JSON.stringify(["Linked List", "Recursion"]),
      "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
      JSON.stringify([{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" }, { input: "head = [1,2]", output: "[2,1]" }]),
      JSON.stringify(["The number of nodes in the list is [0, 5000]", "-5000 <= Node.val <= 5000"]),
      JSON.stringify(["Try iterating through the list and reversing pointers."]),
      JSON.stringify({ python: "class Solution:\n    def reverseList(self, head):\n        pass", javascript: "function reverseList(head) {\n    // your code here\n}" }),
      JSON.stringify([{ input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" }, { input: "[1,2]", expected: "[2,1]" }])
    ],
    [
      "p3", "Valid Parentheses", "Easy", 65.8,
      JSON.stringify(["Stack", "String"]),
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      JSON.stringify([{ input: 's = "()"', output: "true" }, { input: 's = "()[]{}"', output: "true" }, { input: 's = "(]"', output: "false" }]),
      JSON.stringify(["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"] ),
      JSON.stringify(["Use a stack. Push opening brackets, pop on closing."]),
      JSON.stringify({ python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass", javascript: "function isValid(s) {\n    // your code here\n}" }),
      JSON.stringify([{ input: "()", expected: "true" }, { input: "()[]{}", expected: "true" }, { input: "(]", expected: "false" }])
    ],
    [
      "p4", "Longest Substring Without Repeating Characters", "Medium", 42.3,
      JSON.stringify(["String", "Sliding Window", "HashMap"]),
      'Given a string `s`, find the length of the longest substring without repeating characters.',
      JSON.stringify([{ input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' }, { input: 's = "bbbbb"', output: "1" }]),
      JSON.stringify(["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"]),
      JSON.stringify(["Use a sliding window with a set to track characters."]),
      JSON.stringify({ python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass", javascript: "function lengthOfLongestSubstring(s) {\n    // your code here\n}" }),
      JSON.stringify([{ input: "abcabcbb", expected: "3" }, { input: "bbbbb", expected: "1" }, { input: "pwwkew", expected: "3" }])
    ],
    [
      "p5", "Merge Two Sorted Lists", "Easy", 71.1,
      JSON.stringify(["Linked List", "Recursion"]),
      "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list.",
      JSON.stringify([{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }, { input: "list1 = [], list2 = []", output: "[]" }]),
      JSON.stringify(["The number of nodes in both lists is in the range [0, 50]", "-100 <= Node.val <= 100"]),
      JSON.stringify(["Think about what the base cases are."]),
      JSON.stringify({ python: "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        pass", javascript: "function mergeTwoLists(list1, list2) {\n    // your code here\n}" }),
      JSON.stringify([{ input: "[1,2,4]\n[1,3,4]", expected: "[1,1,2,3,4,4]" }])
    ],
    [
      "p6", "Maximum Subarray", "Medium", 50.3,
      JSON.stringify(["Array", "Dynamic Programming", "Divide and Conquer"]),
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
      JSON.stringify([{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }]),
      JSON.stringify(["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"]),
      JSON.stringify(["Try Kadane's algorithm."]),
      JSON.stringify({ python: "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass", javascript: "function maxSubArray(nums) {\n    // your code here\n}" }),
      JSON.stringify([{ input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" }, { input: "[1]", expected: "1" }])
    ],
    [
      "p7", "Binary Search", "Easy", 58.7,
      JSON.stringify(["Array", "Binary Search"]),
      "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`.",
      JSON.stringify([{ input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" }, { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" }]),
      JSON.stringify(["1 <= nums.length <= 10^4", "All integers in nums are unique."]),
      JSON.stringify(["Maintain left and right pointers and narrow down the search each step."]),
      JSON.stringify({ python: "class Solution:\n    def search(self, nums: list[int], target: int) -> int:\n        pass", javascript: "function search(nums, target) {\n    // your code here\n}" }),
      JSON.stringify([{ input: "[-1,0,3,5,9,12]\n9", expected: "4" }, { input: "[-1,0,3,5,9,12]\n2", expected: "-1" }])
    ],
    [
      "p8", "Climbing Stairs", "Easy", 52.1,
      JSON.stringify(["Dynamic Programming", "Math"]),
      "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      JSON.stringify([{ input: "n = 2", output: "2", explanation: "1+1 or 2." }, { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." }]),
      JSON.stringify(["1 <= n <= 45"]),
      JSON.stringify(["This problem resembles the Fibonacci sequence."]),
      JSON.stringify({ python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass", javascript: "function climbStairs(n) {\n    // your code here\n}" }),
      JSON.stringify([{ input: "2", expected: "2" }, { input: "3", expected: "3" }, { input: "5", expected: "8" }])
    ],
  ];
  for (const p of problems) insertProblem.run(...p);
  console.log("✅ Coding problems seeded");

  // ── Problem Attempts ───────────────────────────────────────────────────────
  const insertAttempt = db.prepare(`
    INSERT INTO problem_attempts (id, problem_id, student_id, language, code, verdict, solved)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertAttempt.run(uuid(), "p1", "s1", "python", "class Solution:\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, n in enumerate(nums):\n            if target - n in seen:\n                return [seen[target-n], i]\n            seen[n] = i", "accepted", 1);
  insertAttempt.run(uuid(), "p2", "s1", "python", "class Solution:\n    def reverseList(self, head):\n        prev = None\n        curr = head\n        while curr:\n            next_node = curr.next\n            curr.next = prev\n            prev = curr\n            curr = next_node\n        return prev", "accepted", 1);
  insertAttempt.run(uuid(), "p1", "s2", "javascript", "function twoSum(nums, target) {\n    const map = {};\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (comp in map) return [map[comp], i];\n        map[nums[i]] = i;\n    }\n}", "accepted", 1);
  insertAttempt.run(uuid(), "p5", "s7", "python", "class Solution:\n    def mergeTwoLists(self, l1, l2):\n        pass", "accepted", 1);
  insertAttempt.run(uuid(), "p3", "s1", "python", "class Solution:\n    def isValid(self, s):\n        stack = []\n        for c in s:\n            if c in '([{': stack.append(c)\n        return len(stack) == 0", "wrong", 0);
  console.log("✅ Problem attempts seeded");

  // ── Forum Posts ────────────────────────────────────────────────────────────
  const insertPost = db.prepare(`
    INSERT INTO forum_posts (id, course_id, title, body, author_id, author_name, tags, likes, solved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertPost.run("fp1", "c1", "How does list comprehension work in Python?", "I understand basic for loops, but I'm confused about list comprehension syntax. Can someone explain with examples?", "s1", "Aryan Mehta", JSON.stringify(["Python", "List Comprehension"]), 12, 1);
  insertPost.run("fp2", "c3", "Difference between == and === in JavaScript?", "When should I use === instead of ==? I keep getting confused about when type coercion happens.", "s5", "Vikram Singh", JSON.stringify(["JavaScript", "Operators"]), 8, 1);
  insertPost.run("fp3", "c2", "Time complexity of HashMap operations?", "Is HashMap lookup always O(1)? What happens with hash collisions?", "s7", "Karthik Nair", JSON.stringify(["DSA", "HashMap", "Complexity"]), 15, 0);
  insertPost.run("fp4", "c4", "Best way to manage state in React?", "I'm working on a larger React app and useState is getting complicated. Should I use useReducer or Context API?", "s4", "Sneha Gupta", JSON.stringify(["React", "State Management"]), 20, 1);

  const insertReply = db.prepare(`
    INSERT INTO forum_replies (id, post_id, body, author_id, author_name, likes, is_solution)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertReply.run("fr1", "fp1", "List comprehension is basically a compact way to create lists! `[expression for item in iterable if condition]`. For example: `squares = [x**2 for x in range(10)]` creates a list of squares from 0-9.", "admin-1", "Dr. Priya Sharma", 5, 1);
  insertReply.run("fr2", "fp2", "`==` does type coercion (1 == '1' is true), while `===` checks both value AND type (1 === '1' is false). Always use `===` to avoid bugs!", "admin-1", "Dr. Priya Sharma", 10, 1);
  insertReply.run("fr3", "fp3", "HashMap average case is O(1) for lookups, inserts, and deletes. In the worst case with many collisions, it degrades to O(n), but a good hash function makes this very rare.", "s4", "Sneha Gupta", 6, 0);
  insertReply.run("fr4", "fp4", "For local component state, useState is fine. For shared/global state between many components, use Context API + useReducer. For very complex apps, consider Zustand or Redux Toolkit.", "admin-1", "Dr. Priya Sharma", 14, 1);
  console.log("✅ Forum posts & replies seeded");

  console.log("\n🎉 Database seeding complete!");
  console.log("─────────────────────────────────────────");
  console.log("Admin login:   admin@edunest.com / password123");
  console.log("Student login: aryan@example.com / password123");
  console.log("─────────────────────────────────────────");
}

seed().catch(console.error);
