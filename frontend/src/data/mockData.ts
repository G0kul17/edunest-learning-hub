// ─── Types ───────────────────────────────────────────────────────────────────

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  enrolledCourses: string[];
  streak: number;
  longestStreak: number;
  avgScore: number;
  lastActive: string;
  activityData: { date: string; count: number }[];
  courseProgress: Record<string, { completed: number; total: number; score: number }>;
  joinDate: string;
  status: "active" | "inactive" | "at-risk";
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "doc" | "quiz";
  duration: string;
  videoUrl?: string;
  content?: string;
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  lessons: Lesson[];
  lessonCount: number;
  enrolled: number;
  avgCompletion: number;
  instructor: string;
  instructorAvatar: string | null;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string;
  description: string;
  rating: number;
  reviewCount: number;
  duration: string;
  status: "active" | "draft" | "archived";
  tags: string[];
}

export interface TestQuestion {
  id: string;
  text: string;
  type: "mcq" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: number | string;
  points: number;
  hint?: string;
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  type: "daily" | "course-end" | "mock";
  questions: TestQuestion[];
  questionCount: number;
  duration: number;
  date: string;
  avgScore: number;
  attempted: number;
  total: number;
  passMark: number;
  status: "upcoming" | "live" | "completed";
  shuffleQuestions: boolean;
  showResultsImmediately: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  lessonId?: string;
  description: string;
  dueDate: string;
  points: number;
  submissionType: "file" | "text" | "link" | "code";
  status: "pending" | "submitted" | "graded" | "overdue";
  submissions: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  content: string;
  score?: number;
  feedback?: string;
  status: "pending" | "graded" | "revision-requested";
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: number;
  tags: string[];
  solved: boolean;
  attempted: boolean;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  starterCode: Record<string, string>;
  testCases: { input: string; expected: string }[];
}

export interface ForumPost {
  id: string;
  courseId: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  likes: number;
  replies: ForumReply[];
  tags: string[];
  solved: boolean;
}

export interface ForumReply {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: string;
  likes: number;
  isSolution: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  avatar: string | null;
  joinDate: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateActivityData(days: number): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split("T")[0],
      count: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : 0,
    });
  }
  return data;
}

function generateWeeklyData(weeks: number) {
  return Array.from({ length: weeks }, (_, i) => ({
    week: `W${i + 1}`,
    enrollments: Math.floor(Math.random() * 50) + 20,
    completions: Math.floor(Math.random() * 30) + 10,
    scores: Math.floor(Math.random() * 30) + 55,
  }));
}

// ─── Mock Users ──────────────────────────────────────────────────────────────

export const mockAdminUser: UserProfile = {
  id: "admin-1",
  name: "Dr. Priya Sharma",
  email: "admin@edunest.com",
  role: "admin",
  avatar: null,
  joinDate: "2023-01-15",
};

export const mockStudentUser: UserProfile = {
  id: "s1",
  name: "Aryan Mehta",
  email: "aryan@example.com",
  role: "student",
  avatar: null,
  joinDate: "2023-09-01",
};

// ─── Admin Stats ─────────────────────────────────────────────────────────────

export const mockAdminStats = {
  totalStudents: 2847,
  activeStudents: 1923,
  courses: 24,
  avgCompletion: 78.4,
  testsToday: 6,
  assignmentsPending: 43,
  studentGrowth: 12,
  courseGrowth: 3,
  completionGrowth: 5.2,
};

// ─── Students ────────────────────────────────────────────────────────────────

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Aryan Mehta",
    email: "aryan@example.com",
    avatar: null,
    enrolledCourses: ["c1", "c2", "c3"],
    streak: 12,
    longestStreak: 28,
    avgScore: 84.2,
    lastActive: "2024-03-15",
    activityData: generateActivityData(365),
    courseProgress: {
      c1: { completed: 8, total: 12, score: 87 },
      c2: { completed: 3, total: 10, score: 72 },
      c3: { completed: 5, total: 8, score: 91 },
    },
    joinDate: "2023-09-01",
    status: "active",
  },
  {
    id: "s2",
    name: "Priya Patel",
    email: "priya@example.com",
    avatar: null,
    enrolledCourses: ["c1", "c3"],
    streak: 7,
    longestStreak: 21,
    avgScore: 91.5,
    lastActive: "2024-03-15",
    activityData: generateActivityData(365),
    courseProgress: {
      c1: { completed: 12, total: 12, score: 95 },
      c3: { completed: 6, total: 8, score: 88 },
    },
    joinDate: "2023-08-15",
    status: "active",
  },
  {
    id: "s3",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    avatar: null,
    enrolledCourses: ["c2", "c4"],
    streak: 0,
    longestStreak: 14,
    avgScore: 62.8,
    lastActive: "2024-03-08",
    activityData: generateActivityData(365),
    courseProgress: {
      c2: { completed: 2, total: 10, score: 58 },
      c4: { completed: 1, total: 6, score: 67 },
    },
    joinDate: "2023-10-20",
    status: "at-risk",
  },
  {
    id: "s4",
    name: "Sneha Gupta",
    email: "sneha@example.com",
    avatar: null,
    enrolledCourses: ["c1", "c2", "c4"],
    streak: 23,
    longestStreak: 45,
    avgScore: 88.9,
    lastActive: "2024-03-15",
    activityData: generateActivityData(365),
    courseProgress: {
      c1: { completed: 10, total: 12, score: 92 },
      c2: { completed: 7, total: 10, score: 85 },
      c4: { completed: 4, total: 6, score: 90 },
    },
    joinDate: "2023-07-01",
    status: "active",
  },
  {
    id: "s5",
    name: "Vikram Singh",
    email: "vikram@example.com",
    avatar: null,
    enrolledCourses: ["c3"],
    streak: 3,
    longestStreak: 10,
    avgScore: 71.4,
    lastActive: "2024-03-14",
    activityData: generateActivityData(365),
    courseProgress: {
      c3: { completed: 4, total: 8, score: 71 },
    },
    joinDate: "2024-01-10",
    status: "active",
  },
  {
    id: "s6",
    name: "Ananya Reddy",
    email: "ananya@example.com",
    avatar: null,
    enrolledCourses: ["c1", "c5"],
    streak: 0,
    longestStreak: 5,
    avgScore: 55.3,
    lastActive: "2024-02-28",
    activityData: generateActivityData(365),
    courseProgress: {
      c1: { completed: 3, total: 12, score: 52 },
      c5: { completed: 1, total: 10, score: 58 },
    },
    joinDate: "2024-02-01",
    status: "at-risk",
  },
  {
    id: "s7",
    name: "Karthik Nair",
    email: "karthik@example.com",
    avatar: null,
    enrolledCourses: ["c2", "c3", "c5"],
    streak: 15,
    longestStreak: 30,
    avgScore: 79.6,
    lastActive: "2024-03-15",
    activityData: generateActivityData(365),
    courseProgress: {
      c2: { completed: 8, total: 10, score: 82 },
      c3: { completed: 7, total: 8, score: 78 },
      c5: { completed: 5, total: 10, score: 79 },
    },
    joinDate: "2023-06-15",
    status: "active",
  },
  {
    id: "s8",
    name: "Meera Joshi",
    email: "meera@example.com",
    avatar: null,
    enrolledCourses: ["c1", "c4"],
    streak: 9,
    longestStreak: 18,
    avgScore: 86.1,
    lastActive: "2024-03-15",
    activityData: generateActivityData(365),
    courseProgress: {
      c1: { completed: 11, total: 12, score: 89 },
      c4: { completed: 5, total: 6, score: 83 },
    },
    joinDate: "2023-08-01",
    status: "active",
  },
];

// ─── Courses ─────────────────────────────────────────────────────────────────

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Python Fundamentals",
    category: "Programming",
    lessons: [
      { id: "l1", title: "Introduction to Python", type: "video", duration: "15 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", completed: true },
      { id: "l2", title: "Variables & Data Types", type: "video", duration: "22 min", completed: true },
      { id: "l3", title: "Control Flow", type: "video", duration: "18 min", completed: true },
      { id: "l4", title: "Functions", type: "video", duration: "25 min", completed: true },
      { id: "l5", title: "Lists & Tuples", type: "video", duration: "20 min", completed: true },
      { id: "l6", title: "Dictionaries & Sets", type: "video", duration: "18 min", completed: true },
      { id: "l7", title: "String Methods", type: "doc", duration: "12 min", completed: true },
      { id: "l8", title: "File Handling", type: "video", duration: "22 min", completed: true },
      { id: "l9", title: "Error Handling", type: "video", duration: "16 min", completed: false },
      { id: "l10", title: "Modules & Packages", type: "video", duration: "20 min", completed: false },
      { id: "l11", title: "OOP Basics", type: "video", duration: "30 min", completed: false },
      { id: "l12", title: "Final Project", type: "quiz", duration: "45 min", completed: false },
    ],
    lessonCount: 12,
    enrolled: 234,
    avgCompletion: 71,
    instructor: "Prof. Sharma",
    instructorAvatar: null,
    difficulty: "Beginner",
    thumbnail: "python",
    description: "Master Python from scratch — variables, control flow, functions, OOP, and real-world projects.",
    rating: 4.7,
    reviewCount: 182,
    duration: "8 hours",
    status: "active",
    tags: ["Python", "Programming", "Beginner"],
  },
  {
    id: "c2",
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    lessons: [
      { id: "l13", title: "Big-O Notation", type: "video", duration: "20 min", completed: true },
      { id: "l14", title: "Arrays & Strings", type: "video", duration: "25 min", completed: true },
      { id: "l15", title: "Linked Lists", type: "video", duration: "28 min", completed: true },
      { id: "l16", title: "Stacks & Queues", type: "video", duration: "22 min", completed: false },
      { id: "l17", title: "Trees & BST", type: "video", duration: "35 min", completed: false },
      { id: "l18", title: "Graphs", type: "video", duration: "30 min", completed: false },
      { id: "l19", title: "Sorting Algorithms", type: "video", duration: "25 min", completed: false },
      { id: "l20", title: "Searching Algorithms", type: "video", duration: "20 min", completed: false },
      { id: "l21", title: "Dynamic Programming", type: "video", duration: "40 min", completed: false },
      { id: "l22", title: "Practice Problems", type: "quiz", duration: "60 min", completed: false },
    ],
    lessonCount: 10,
    enrolled: 189,
    avgCompletion: 52,
    instructor: "Dr. Anand",
    instructorAvatar: null,
    difficulty: "Intermediate",
    thumbnail: "dsa",
    description: "Deep dive into data structures and algorithms — arrays, trees, graphs, sorting, DP, and competitive coding prep.",
    rating: 4.8,
    reviewCount: 156,
    duration: "12 hours",
    status: "active",
    tags: ["DSA", "Algorithms", "Competitive"],
  },
  {
    id: "c3",
    title: "JavaScript Mastery",
    category: "Programming",
    lessons: [
      { id: "l23", title: "JS Fundamentals", type: "video", duration: "18 min", completed: true },
      { id: "l24", title: "DOM Manipulation", type: "video", duration: "25 min", completed: true },
      { id: "l25", title: "ES6+ Features", type: "video", duration: "22 min", completed: true },
      { id: "l26", title: "Async JavaScript", type: "video", duration: "30 min", completed: true },
      { id: "l27", title: "Closures & Scope", type: "video", duration: "20 min", completed: true },
      { id: "l28", title: "Prototypes & Classes", type: "video", duration: "25 min", completed: false },
      { id: "l29", title: "Error Handling", type: "video", duration: "15 min", completed: false },
      { id: "l30", title: "Mini Project", type: "quiz", duration: "45 min", completed: false },
    ],
    lessonCount: 8,
    enrolled: 312,
    avgCompletion: 65,
    instructor: "Ms. Kavitha",
    instructorAvatar: null,
    difficulty: "Beginner",
    thumbnail: "javascript",
    description: "Complete JavaScript course — from fundamentals to advanced concepts like closures, async, and modern ES6+.",
    rating: 4.6,
    reviewCount: 243,
    duration: "6 hours",
    status: "active",
    tags: ["JavaScript", "Web Dev", "Frontend"],
  },
  {
    id: "c4",
    title: "React & TypeScript",
    category: "Frontend",
    lessons: [
      { id: "l31", title: "React Basics", type: "video", duration: "22 min", completed: true },
      { id: "l32", title: "Components & Props", type: "video", duration: "20 min", completed: true },
      { id: "l33", title: "State & Hooks", type: "video", duration: "28 min", completed: true },
      { id: "l34", title: "TypeScript Intro", type: "video", duration: "25 min", completed: true },
      { id: "l35", title: "Advanced Patterns", type: "video", duration: "35 min", completed: false },
      { id: "l36", title: "Full-Stack Project", type: "quiz", duration: "60 min", completed: false },
    ],
    lessonCount: 6,
    enrolled: 178,
    avgCompletion: 58,
    instructor: "Prof. Sharma",
    instructorAvatar: null,
    difficulty: "Intermediate",
    thumbnail: "react",
    description: "Build production-ready apps with React 18 and TypeScript — hooks, state management, and advanced patterns.",
    rating: 4.9,
    reviewCount: 134,
    duration: "10 hours",
    status: "active",
    tags: ["React", "TypeScript", "Frontend"],
  },
  {
    id: "c5",
    title: "Machine Learning Basics",
    category: "Data Science",
    lessons: [
      { id: "l37", title: "What is ML?", type: "video", duration: "15 min", completed: true },
      { id: "l38", title: "Linear Regression", type: "video", duration: "25 min", completed: false },
      { id: "l39", title: "Classification", type: "video", duration: "22 min", completed: false },
      { id: "l40", title: "Decision Trees", type: "video", duration: "20 min", completed: false },
      { id: "l41", title: "Neural Networks Intro", type: "video", duration: "30 min", completed: false },
      { id: "l42", title: "Clustering", type: "video", duration: "18 min", completed: false },
      { id: "l43", title: "Model Evaluation", type: "video", duration: "22 min", completed: false },
      { id: "l44", title: "Practical Projects", type: "video", duration: "35 min", completed: false },
      { id: "l45", title: "Deep Learning Preview", type: "video", duration: "25 min", completed: false },
      { id: "l46", title: "Capstone", type: "quiz", duration: "45 min", completed: false },
    ],
    lessonCount: 10,
    enrolled: 145,
    avgCompletion: 32,
    instructor: "Dr. Anand",
    instructorAvatar: null,
    difficulty: "Advanced",
    thumbnail: "ml",
    description: "Introduction to machine learning — regression, classification, clustering, neural networks, and hands-on projects.",
    rating: 4.5,
    reviewCount: 98,
    duration: "14 hours",
    status: "active",
    tags: ["ML", "AI", "Data Science"],
  },
  {
    id: "c6",
    title: "Web Design Principles",
    category: "Design",
    lessons: [
      { id: "l47", title: "Design Thinking", type: "video", duration: "18 min", completed: false },
      { id: "l48", title: "Color Theory", type: "video", duration: "15 min", completed: false },
      { id: "l49", title: "Typography", type: "video", duration: "20 min", completed: false },
      { id: "l50", title: "Layout & Grid", type: "video", duration: "22 min", completed: false },
      { id: "l51", title: "Responsive Design", type: "video", duration: "25 min", completed: false },
      { id: "l52", title: "UI/UX Best Practices", type: "video", duration: "20 min", completed: false },
    ],
    lessonCount: 6,
    enrolled: 98,
    avgCompletion: 45,
    instructor: "Ms. Kavitha",
    instructorAvatar: null,
    difficulty: "Beginner",
    thumbnail: "design",
    description: "Learn design fundamentals — color, typography, layout, responsive design, and modern UI/UX practices.",
    rating: 4.4,
    reviewCount: 67,
    duration: "5 hours",
    status: "draft",
    tags: ["Design", "UI/UX", "Web"],
  },
];

// ─── Tests ───────────────────────────────────────────────────────────────────

export const mockTests: Test[] = [
  {
    id: "t1",
    title: "JavaScript Daily Test #14",
    courseId: "c3",
    courseName: "JavaScript Mastery",
    type: "daily",
    questions: [
      { id: "q1", text: "What does 'typeof null' return in JavaScript?", type: "mcq", options: ["null", "undefined", "object", "boolean"], correctAnswer: 2, points: 5, explanation: "This is a well-known JavaScript quirk. typeof null returns 'object'." },
      { id: "q2", text: "Which method converts a JSON string to a JavaScript object?", type: "mcq", options: ["JSON.parse()", "JSON.stringify()", "JSON.convert()", "JSON.decode()"], correctAnswer: 0, points: 5, explanation: "JSON.parse() parses a JSON string and constructs the JavaScript value." },
      { id: "q3", text: "Arrow functions have their own 'this' binding.", type: "true-false", options: ["True", "False"], correctAnswer: 1, points: 5, explanation: "Arrow functions do NOT have their own 'this'. They inherit 'this' from the enclosing scope." },
      { id: "q4", text: "What is the output of: console.log(1 + '2' + 3)?", type: "mcq", options: ["6", "123", "15", "NaN"], correctAnswer: 1, points: 5, hint: "Think about type coercion" },
      { id: "q5", text: "Which keyword declares a block-scoped variable?", type: "mcq", options: ["var", "let", "function", "global"], correctAnswer: 1, points: 5 },
      { id: "q6", text: "Promise.all() rejects if any promise rejects.", type: "true-false", options: ["True", "False"], correctAnswer: 0, points: 5 },
      { id: "q7", text: "What does the spread operator (...) do?", type: "mcq", options: ["Copies an array", "Expands iterable elements", "Destructures objects", "All of the above"], correctAnswer: 1, points: 5 },
      { id: "q8", text: "Which array method creates a new array with filtered results?", type: "mcq", options: ["map()", "filter()", "reduce()", "forEach()"], correctAnswer: 1, points: 5 },
      { id: "q9", text: "The 'use strict' directive enables strict mode.", type: "true-false", options: ["True", "False"], correctAnswer: 0, points: 5 },
      { id: "q10", text: "What is closure in JavaScript?", type: "mcq", options: ["A function with no return value", "A function with access to its outer scope", "A self-invoking function", "A generator function"], correctAnswer: 1, points: 5, explanation: "A closure is a function that has access to variables in its outer (enclosing) scope." },
      { id: "q11", text: "Which method adds elements to the end of an array?", type: "mcq", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 0, points: 5 },
      { id: "q12", text: "NaN === NaN evaluates to true.", type: "true-false", options: ["True", "False"], correctAnswer: 1, points: 5, explanation: "NaN is not equal to anything, including itself." },
      { id: "q13", text: "What does 'async' keyword do?", type: "mcq", options: ["Makes function synchronous", "Makes function return a Promise", "Pauses execution", "Throws an error"], correctAnswer: 1, points: 5 },
      { id: "q14", text: "Event bubbling propagates from child to parent.", type: "true-false", options: ["True", "False"], correctAnswer: 0, points: 5 },
      { id: "q15", text: "Which is NOT a JavaScript data type?", type: "mcq", options: ["Symbol", "BigInt", "Float", "Undefined"], correctAnswer: 2, points: 5 },
    ],
    questionCount: 15,
    duration: 20,
    date: "2024-03-15",
    avgScore: 76.3,
    attempted: 89,
    total: 120,
    passMark: 60,
    status: "completed",
    shuffleQuestions: true,
    showResultsImmediately: true,
  },
  {
    id: "t2",
    title: "Python Course Final Exam",
    courseId: "c1",
    courseName: "Python Fundamentals",
    type: "course-end",
    questions: [
      { id: "q16", text: "What is the output of print(type([]))?", type: "mcq", options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'set'>"], correctAnswer: 1, points: 10 },
      { id: "q17", text: "Python is dynamically typed.", type: "true-false", options: ["True", "False"], correctAnswer: 0, points: 5 },
      { id: "q18", text: "Which keyword is used for exception handling?", type: "mcq", options: ["catch", "except", "handle", "error"], correctAnswer: 1, points: 10 },
      { id: "q19", text: "What does 'self' refer to in a Python class?", type: "mcq", options: ["The class itself", "The current instance", "The parent class", "A global variable"], correctAnswer: 1, points: 10 },
      { id: "q20", text: "List comprehension is faster than for loops.", type: "true-false", options: ["True", "False"], correctAnswer: 0, points: 5 },
    ],
    questionCount: 5,
    duration: 60,
    date: "2024-03-20",
    avgScore: 0,
    attempted: 0,
    total: 234,
    passMark: 70,
    status: "upcoming",
    shuffleQuestions: false,
    showResultsImmediately: false,
  },
  {
    id: "t3",
    title: "DSA Mock Test — Arrays & Strings",
    courseId: "c2",
    courseName: "Data Structures & Algorithms",
    type: "mock",
    questions: [
      { id: "q21", text: "Time complexity of accessing an array element by index?", type: "mcq", options: ["O(1)", "O(n)", "O(log n)", "O(n²)"], correctAnswer: 0, points: 10 },
      { id: "q22", text: "Which data structure uses LIFO?", type: "mcq", options: ["Queue", "Stack", "Array", "Linked List"], correctAnswer: 1, points: 10 },
      { id: "q23", text: "Binary search requires a sorted array.", type: "true-false", options: ["True", "False"], correctAnswer: 0, points: 5 },
    ],
    questionCount: 3,
    duration: 45,
    date: "2024-03-18",
    avgScore: 82.1,
    attempted: 67,
    total: 189,
    passMark: 65,
    status: "completed",
    shuffleQuestions: true,
    showResultsImmediately: true,
  },
];

// ─── Assignments ─────────────────────────────────────────────────────────────

export const mockAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Build a Calculator in Python",
    courseId: "c1",
    courseName: "Python Fundamentals",
    description: "Create a command-line calculator that supports addition, subtraction, multiplication, and division. Handle division by zero errors gracefully.",
    dueDate: "2024-03-18",
    points: 100,
    submissionType: "code",
    status: "pending",
    submissions: [
      { id: "sub1", studentId: "s1", studentName: "Aryan Mehta", submittedAt: "2024-03-16", content: "def calc(a, op, b):\n  if op == '+': return a+b\n  ...", score: 85, feedback: "Good implementation! Consider adding input validation.", status: "graded" },
      { id: "sub2", studentId: "s2", studentName: "Priya Patel", submittedAt: "2024-03-15", content: "class Calculator:\n  ...", score: 95, feedback: "Excellent OOP approach!", status: "graded" },
    ],
  },
  {
    id: "a2",
    title: "JavaScript DOM Project",
    courseId: "c3",
    courseName: "JavaScript Mastery",
    description: "Build an interactive to-do list application using vanilla JavaScript and DOM manipulation. Must include add, delete, and mark-as-complete functionality.",
    dueDate: "2024-03-20",
    points: 100,
    submissionType: "link",
    status: "pending",
    submissions: [
      { id: "sub3", studentId: "s5", studentName: "Vikram Singh", submittedAt: "2024-03-17", content: "https://github.com/vikram/todo-app", status: "pending" },
    ],
  },
  {
    id: "a3",
    title: "Binary Tree Implementation",
    courseId: "c2",
    courseName: "Data Structures & Algorithms",
    description: "Implement a Binary Search Tree with insert, search, delete, and traversal (inorder, preorder, postorder) operations.",
    dueDate: "2024-03-25",
    points: 100,
    submissionType: "code",
    status: "pending",
    submissions: [],
  },
  {
    id: "a4",
    title: "React Component Library",
    courseId: "c4",
    courseName: "React & TypeScript",
    description: "Create a small component library with at least 5 reusable, typed React components (Button, Input, Card, Modal, Alert).",
    dueDate: "2024-03-12",
    points: 100,
    submissionType: "link",
    status: "overdue",
    submissions: [
      { id: "sub4", studentId: "s4", studentName: "Sneha Gupta", submittedAt: "2024-03-11", content: "https://github.com/sneha/react-components", score: 92, feedback: "Great type safety and reusability!", status: "graded" },
    ],
  },
];

// ─── Coding Problems ─────────────────────────────────────────────────────────

export const mockProblems: Problem[] = [
  {
    id: "p1",
    title: "Two Sum",
    difficulty: "Easy",
    acceptance: 68.2,
    tags: ["Arrays", "HashMap"],
    solved: true,
    attempted: true,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "Only one valid answer exists."],
    hints: ["Try using a hash map to store values you've seen."],
    starterCode: {
      python: "class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass",
      javascript: "function twoSum(nums, target) {\n    // your code here\n}",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // your code here\n    }\n}",
    },
    testCases: [
      { input: "[2,7,11,15]\n9", expected: "[0,1]" },
      { input: "[3,2,4]\n6", expected: "[1,2]" },
      { input: "[3,3]\n6", expected: "[0,1]" },
    ],
  },
  {
    id: "p2",
    title: "Reverse Linked List",
    difficulty: "Easy",
    acceptance: 72.5,
    tags: ["Linked List", "Recursion"],
    solved: true,
    attempted: true,
    description: "Given the `head` of a singly linked list, reverse the list, and return the reversed list.",
    examples: [
      { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
      { input: "head = [1,2]", output: "[2,1]" },
    ],
    constraints: ["The number of nodes in the list is [0, 5000]", "-5000 <= Node.val <= 5000"],
    hints: ["Try iterating through the list and reversing pointers."],
    starterCode: {
      python: "class Solution:\n    def reverseList(self, head):\n        pass",
      javascript: "function reverseList(head) {\n    // your code here\n}",
    },
    testCases: [
      { input: "[1,2,3,4,5]", expected: "[5,4,3,2,1]" },
      { input: "[1,2]", expected: "[2,1]" },
    ],
  },
  {
    id: "p3",
    title: "Valid Parentheses",
    difficulty: "Easy",
    acceptance: 65.8,
    tags: ["Stack", "String"],
    solved: false,
    attempted: true,
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'"],
    hints: ["Use a stack. Push opening brackets, pop on closing."],
    starterCode: {
      python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
      javascript: "function isValid(s) {\n    // your code here\n}",
    },
    testCases: [
      { input: "()", expected: "true" },
      { input: "()[]{}", expected: "true" },
      { input: "(]", expected: "false" },
    ],
  },
  {
    id: "p4",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    acceptance: 42.3,
    tags: ["String", "Sliding Window", "HashMap"],
    solved: false,
    attempted: false,
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1" },
    ],
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"],
    hints: ["Use a sliding window with a set to track characters."],
    starterCode: {
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
      javascript: "function lengthOfLongestSubstring(s) {\n    // your code here\n}",
    },
    testCases: [
      { input: "abcabcbb", expected: "3" },
      { input: "bbbbb", expected: "1" },
      { input: "pwwkew", expected: "3" },
    ],
  },
  {
    id: "p5",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    acceptance: 71.1,
    tags: ["Linked List", "Recursion"],
    solved: true,
    attempted: true,
    description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
    ],
    constraints: ["The number of nodes in both lists is [0, 50]", "-100 <= Node.val <= 100"],
    hints: ["Compare the heads and recursively merge."],
    starterCode: {
      python: "class Solution:\n    def mergeTwoLists(self, list1, list2):\n        pass",
      javascript: "function mergeTwoLists(list1, list2) {\n    // your code here\n}",
    },
    testCases: [
      { input: "[1,2,4]\n[1,3,4]", expected: "[1,1,2,3,4,4]" },
    ],
  },
  {
    id: "p6",
    title: "Maximum Subarray",
    difficulty: "Medium",
    acceptance: 51.7,
    tags: ["Arrays", "Dynamic Programming", "Divide and Conquer"],
    solved: false,
    attempted: false,
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    hints: ["Try Kadane's algorithm."],
    starterCode: {
      python: "class Solution:\n    def maxSubArray(self, nums: list[int]) -> int:\n        pass",
      javascript: "function maxSubArray(nums) {\n    // your code here\n}",
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", expected: "6" },
      { input: "[1]", expected: "1" },
      { input: "[5,4,-1,7,8]", expected: "23" },
    ],
  },
  {
    id: "p7",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    acceptance: 47.8,
    tags: ["Trees", "BFS", "Queue"],
    solved: false,
    attempted: false,
    description: "Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" },
    ],
    constraints: ["The number of nodes in the tree is [0, 2000]"],
    hints: ["Use BFS with a queue."],
    starterCode: {
      python: "class Solution:\n    def levelOrder(self, root):\n        pass",
      javascript: "function levelOrder(root) {\n    // your code here\n}",
    },
    testCases: [
      { input: "[3,9,20,null,null,15,7]", expected: "[[3],[9,20],[15,7]]" },
    ],
  },
  {
    id: "p8",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    acceptance: 31.2,
    tags: ["Arrays", "Two Pointers", "Stack", "Dynamic Programming"],
    solved: false,
    attempted: false,
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
    ],
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    hints: ["Try two-pointer approach from both ends.", "Or use a stack to track boundaries."],
    starterCode: {
      python: "class Solution:\n    def trap(self, height: list[int]) -> int:\n        pass",
      javascript: "function trap(height) {\n    // your code here\n}",
    },
    testCases: [
      { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expected: "6" },
      { input: "[4,2,0,3,2,5]", expected: "9" },
    ],
  },
];

// ─── Forum Posts ──────────────────────────────────────────────────────────────

export const mockForumPosts: ForumPost[] = [
  {
    id: "fp1",
    courseId: "c1",
    title: "How does list comprehension work?",
    body: "I'm confused about the syntax of list comprehension in Python. Can someone explain with examples?",
    authorId: "s1",
    authorName: "Aryan Mehta",
    authorAvatar: null,
    createdAt: "2024-03-14T10:30:00Z",
    likes: 12,
    tags: ["python", "beginner"],
    solved: true,
    replies: [
      {
        id: "fr1",
        body: "List comprehension is a concise way to create lists. Syntax: `[expression for item in iterable if condition]`\n\nExample:\n```python\nsquares = [x**2 for x in range(10)]\neven_squares = [x**2 for x in range(10) if x % 2 == 0]\n```",
        authorId: "s2",
        authorName: "Priya Patel",
        authorAvatar: null,
        createdAt: "2024-03-14T11:00:00Z",
        likes: 8,
        isSolution: true,
      },
      {
        id: "fr2",
        body: "Great explanation Priya! I'd add that you can also use nested comprehensions for 2D lists.",
        authorId: "s4",
        authorName: "Sneha Gupta",
        authorAvatar: null,
        createdAt: "2024-03-14T11:30:00Z",
        likes: 3,
        isSolution: false,
      },
    ],
  },
  {
    id: "fp2",
    courseId: "c2",
    title: "Time Complexity of Merge Sort vs Quick Sort?",
    body: "Can someone compare the time complexities of merge sort and quick sort in different cases?",
    authorId: "s7",
    authorName: "Karthik Nair",
    authorAvatar: null,
    createdAt: "2024-03-13T14:00:00Z",
    likes: 18,
    tags: ["algorithms", "sorting"],
    solved: false,
    replies: [
      {
        id: "fr3",
        body: "Merge Sort: O(n log n) in all cases.\nQuick Sort: O(n log n) average, O(n²) worst case.\nMerge sort uses extra space O(n), quick sort is in-place.",
        authorId: "s3",
        authorName: "Rahul Kumar",
        authorAvatar: null,
        createdAt: "2024-03-13T15:00:00Z",
        likes: 15,
        isSolution: false,
      },
    ],
  },
  {
    id: "fp3",
    courseId: "c3",
    title: "async/await vs .then() — which is better?",
    body: "When should I use async/await vs promise chaining with .then()? Are there performance differences?",
    authorId: "s5",
    authorName: "Vikram Singh",
    authorAvatar: null,
    createdAt: "2024-03-12T09:00:00Z",
    likes: 24,
    tags: ["javascript", "async"],
    solved: true,
    replies: [
      {
        id: "fr4",
        body: "async/await is syntactic sugar over promises — no performance difference. Use async/await for readability, especially with multiple sequential async operations. Use .then() for simple one-off operations.",
        authorId: "s4",
        authorName: "Sneha Gupta",
        authorAvatar: null,
        createdAt: "2024-03-12T09:30:00Z",
        likes: 20,
        isSolution: true,
      },
    ],
  },
];

// ─── Chart Data ──────────────────────────────────────────────────────────────

export const mockEngagementData = generateWeeklyData(12);

export const mockScoreDistribution = [
  { grade: "A (90-100)", count: 342, color: "hsl(var(--success))" },
  { grade: "B (80-89)", count: 518, color: "hsl(var(--primary))" },
  { grade: "C (70-79)", count: 421, color: "hsl(var(--accent))" },
  { grade: "D (60-69)", count: 287, color: "hsl(var(--warning))" },
  { grade: "F (<60)", count: 156, color: "hsl(var(--destructive))" },
];

export const mockHourlyActivity = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day,
    hour,
    value: Math.random() > 0.3 ? Math.floor(Math.random() * 100) : 0,
  }))
).flat();

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const mockLeaderboard = mockStudents
  .map((s) => ({
    id: s.id,
    name: s.name,
    avatar: s.avatar,
    score: s.avgScore,
    streak: s.streak,
    completionPct: Object.values(s.courseProgress).reduce((sum, cp) => sum + (cp.completed / cp.total) * 100, 0) / Object.keys(s.courseProgress).length,
    courseName: mockCourses.find((c) => c.id === s.enrolledCourses[0])?.title || "",
  }))
  .sort((a, b) => b.score - a.score);

// ─── Notifications ───────────────────────────────────────────────────────────

export const mockNotifications = [
  { id: "n1", title: "New test scheduled", message: "Python Final Exam — March 20", time: "2 hours ago", read: false, type: "test" as const },
  { id: "n2", title: "Assignment graded", message: "Calculator project scored 85/100", time: "5 hours ago", read: false, type: "assignment" as const },
  { id: "n3", title: "New course available", message: "Machine Learning Basics is now live", time: "1 day ago", read: true, type: "course" as const },
  { id: "n4", title: "Streak milestone!", message: "You've maintained a 10-day streak! 🔥", time: "2 days ago", read: true, type: "streak" as const },
  { id: "n5", title: "Forum reply", message: "Priya Patel replied to your question", time: "3 days ago", read: true, type: "forum" as const },
];

// ─── Testimonials (Login page) ───────────────────────────────────────────────

export const mockTestimonials = [
  { id: 1, name: "Sneha Gupta", role: "Full Stack Developer", quote: "EduNest helped me land my dream job at a top tech company. The coding arena was invaluable!" },
  { id: 2, name: "Karthik Nair", role: "Data Scientist", quote: "The structured courses and daily tests kept me accountable. Best learning platform I've used." },
  { id: 3, name: "Priya Patel", role: "Software Engineer", quote: "From zero to hero in 6 months. The AI chatbot answered all my doubts instantly." },
];
