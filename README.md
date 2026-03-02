# EduNest Learning Hub 🎓

> A full-stack Learning Management System (LMS) built with **React + TypeScript** (frontend) and **Node.js + Express + SQLite** (backend), featuring role-based dashboards for students and administrators.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Demo Credentials](#-demo-credentials)
- [API Endpoints](#-api-endpoints)
- [Pages & Routes](#-pages--routes)
- [Git Workflow](#-git-workflow)
- [Database](#-database)

---

## ✨ Features

### 👨‍🎓 Student
- 📊 Personal dashboard with streak calendar, course progress & stats
- 📚 Browse and enroll in courses; watch video lessons
- 📝 Take live tests and quizzes with instant results
- 📋 Submit assignments (code, file, link, text)
- 💻 Code Arena — solve coding problems with a built-in editor
- 💬 Community forum — create posts, reply, like, mark solutions
- 👤 Profile page with activity heatmap
- ⚙️ Settings modal — update name, email, and password

### 🛠️ Admin
- 📈 Dashboard with engagement charts, leaderboard & score distribution
- 🏫 Course Manager — create and manage courses & lessons
- 👥 Student Tracker — view all students, activity, and progress
- 📝 Test Manager — create and publish tests/quizzes
- 📋 Assignment Manager — create assignments and grade submissions
- 📊 Analytics — platform-wide charts and metrics

### 🔐 Auth
- JWT-based authentication with role support (`student` / `admin`)
- Secure password hashing with bcryptjs
- Token stored in `localStorage`, injected into all API requests
- Profile update with current-password verification

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Shadcn/UI |
| Routing | React Router v6 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Code Editor | Monaco Editor |
| Backend | Node.js, Express.js |
| Database | SQLite via `better-sqlite3` |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Dev | Nodemon, Vite HMR |

---

## 📁 Project Structure

```
edunest-learning-hub/
│
├── 📁 frontend/                    # React + Vite app
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.tsx  # Sidebar + TopBar wrapper
│   │   │   │   ├── Sidebar.tsx          # Collapsible nav sidebar
│   │   │   │   ├── TopBar.tsx           # Header with avatar dropdown
│   │   │   │   ├── AIChatBot.tsx        # Floating AI assistant
│   │   │   │   └── SettingsModal.tsx    # Profile/password settings
│   │   │   ├── shared/
│   │   │   │   ├── StreakCalendar.tsx   # GitHub-style activity calendar
│   │   │   │   └── Leaderboard.tsx
│   │   │   └── ui/                     # Shadcn base components
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # login, logout, updateUser
│   │   ├── data/
│   │   │   └── mockData.ts              # Typed mock data & generators
│   │   ├── lib/
│   │   │   └── api.ts                   # Axios API service layer
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Register.tsx
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.tsx
│   │   │   │   ├── CourseCatalog.tsx
│   │   │   │   ├── LessonViewer.tsx
│   │   │   │   ├── TestPage.tsx
│   │   │   │   ├── AssignmentsPage.tsx
│   │   │   │   ├── CodingArena.tsx
│   │   │   │   ├── Forums.tsx
│   │   │   │   └── Profile.tsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── CourseManager.tsx
│   │   │       ├── StudentTracker.tsx
│   │   │       ├── TestManager.tsx
│   │   │       ├── AssignmentManager.tsx
│   │   │       └── Analytics.tsx
│   │   └── App.tsx                      # Routes + AuthProvider
│   ├── .env                             # VITE_API_URL
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
└── 📁 backend/                     # Node.js + Express API
    ├── src/
    │   ├── db/
    │   │   ├── connection.js        # SQLite connection (WAL mode)
    │   │   ├── schema.js            # CREATE TABLE statements
    │   │   └── seed.js              # Seed mock data
    │   ├── routes/
    │   │   ├── auth.js              # /api/auth/login, register, me
    │   │   ├── users.js             # /api/users/me (PUT — profile update)
    │   │   ├── courses.js           # /api/courses/* + lessons + enrollment
    │   │   ├── students.js          # /api/students/* + admin stats
    │   │   ├── tests.js             # /api/tests/* + submissions
    │   │   ├── assignments.js       # /api/assignments/* + grading
    │   │   ├── problems.js          # /api/problems/* + code submissions
    │   │   └── forum.js             # /api/forum/* + replies + likes
    │   └── index.js                 # Express server entry point
    ├── .env                         # PORT, JWT_SECRET, FRONTEND_URL
    ├── edunest.db                   # SQLite database file (git-ignored)
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **npm** v9+

---

### 1. Clone the repository

```bash
git clone https://github.com/G0kul17/edunest-learning-hub.git
cd edunest-learning-hub
```

---

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
PORT=5000
JWT_SECRET=edunest_super_secret_key_2024_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
```

Seed the database with mock data:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
# Server running at http://localhost:5000
# Health check: http://localhost:5000/api/health
```

---

### 3. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend dev server:

```bash
npm run dev
# App running at http://localhost:8080
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port for Express server | `5000` |
| `JWT_SECRET` | Secret key for signing JWTs | *(required)* |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:8080` |

### Frontend (`frontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL for backend API | `http://localhost:5000/api` |

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👨‍🎓 Student | `aryan@example.com` | `password123` |
| 🛠️ Admin | `admin@edunest.com` | `password123` |

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/login` | Login and receive JWT | ❌ |
| POST | `/register` | Register new user | ❌ |
| GET | `/me` | Get current user profile | ✅ |

### Users — `/api/users`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| PUT | `/me` | Update name, email, avatar, password | ✅ |

### Courses — `/api/courses`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all courses | ✅ |
| GET | `/:id` | Course detail with lessons | ✅ |
| POST | `/` | Create course (admin) | ✅ Admin |
| PUT | `/:id` | Update course (admin) | ✅ Admin |
| POST | `/:id/enroll` | Enroll in a course | ✅ |
| POST | `/:id/lessons/:lid/complete` | Mark lesson complete | ✅ |

### Students — `/api/students`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all students (admin) | ✅ Admin |
| GET | `/stats` | Admin dashboard stats | ✅ Admin |
| GET | `/me` | My progress & enrolled courses | ✅ |

### Tests — `/api/tests`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all tests | ✅ |
| GET | `/:id` | Test detail with questions | ✅ |
| POST | `/` | Create test (admin) | ✅ Admin |
| POST | `/:id/submit` | Submit test answers | ✅ |

### Assignments — `/api/assignments`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all assignments | ✅ |
| POST | `/` | Create assignment (admin) | ✅ Admin |
| POST | `/:id/submit` | Submit assignment | ✅ |
| PUT | `/:id/submissions/:sid/grade` | Grade submission (admin) | ✅ Admin |

### Problems — `/api/problems`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List coding problems | ✅ |
| GET | `/:id` | Problem detail | ✅ |
| POST | `/:id/submit` | Submit code (simulated verdict) | ✅ |

### Forum — `/api/forum`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | List all posts | ✅ |
| POST | `/` | Create post | ✅ |
| POST | `/:id/replies` | Add reply | ✅ |
| POST | `/:id/like` | Like/unlike post | ✅ |
| PUT | `/:id/replies/:rid/solution` | Mark as solution | ✅ |

---

## 🗺️ Pages & Routes

### Public
| Route | Page |
|---|---|
| `/login` | Login page |
| `/register` | Registration page |

### Student (requires auth, role: student)
| Route | Page |
|---|---|
| `/student/dashboard` | Home dashboard |
| `/student/courses` | Course catalog |
| `/student/courses/:id/lessons/:lid` | Lesson viewer |
| `/student/tests/:id` | Test / quiz page |
| `/student/assignments` | My assignments |
| `/student/coding-arena` | Code editor & problems |
| `/student/forum` | Community forum |
| `/student/profile` | Profile & activity |

### Admin (requires auth, role: admin)
| Route | Page |
|---|---|
| `/admin/dashboard` | Admin home |
| `/admin/courses` | Course manager |
| `/admin/students` | Student tracker |
| `/admin/tests` | Test manager |
| `/admin/assignments` | Assignment manager |
| `/admin/analytics` | Analytics |

---

## 🗄️ Database

SQLite database (`backend/edunest.db`) with the following tables:

```
users              — id, name, email, password_hash, role, avatar, join_date
courses            — id, title, category, difficulty, instructor, ...
lessons            — id, course_id, title, type, duration, video_url, content
enrollments        — user_id, course_id, enrolled_at
lesson_completions — user_id, lesson_id, completed_at
tests              — id, title, course_id, type, duration, pass_mark, ...
test_questions     — id, test_id, text, type, options, correct_answer, points
test_submissions   — id, test_id, user_id, answers, score, submitted_at
assignments        — id, title, course_id, description, due_date, points, ...
assignment_submissions — id, assignment_id, user_id, content, score, feedback, ...
problems           — id, title, difficulty, description, examples, constraints, ...
problem_submissions — id, problem_id, user_id, code, language, verdict, ...
forum_posts        — id, course_id, title, body, author_id, likes, solved
forum_replies      — id, post_id, body, author_id, likes, is_solution
```

> **Note:** `edunest.db` is in `.gitignore`. Run `npm run seed` to recreate it.

---

## 🌿 Git Workflow

```
main         ← stable production branch
  └── gokul  ← active development branch (your working branch)
```

### Daily workflow

```bash
# Make sure you're on the gokul branch
git checkout gokul

# Pull latest from main (keep in sync)
git merge main

# Work on your changes...

# Commit and push
git add -A
git commit -m "feat: describe your change"
git push origin gokul
```

### Merge to main (via Pull Request)
1. Push your changes to `gokul`
2. Go to GitHub → **Pull Requests** → **New Pull Request**
3. Set `base: main` ← `compare: gokul`
4. Review and **Merge**

---

## 📜 Scripts Reference

### Backend
```bash
npm run dev    # Start with nodemon (auto-restart)
npm run start  # Start without nodemon
npm run seed   # Seed the database
```

### Frontend
```bash
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

---

> Built with ❤️ by Gokul · EduNest Learning Hub
