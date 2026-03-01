
# EduNest — Full Implementation Plan

## Phase 1: Foundation
- Set up the design system in `index.css`: dark navy theme, CSS variables, Google Fonts (Sora, Plus Jakarta Sans, JetBrains Mono), glassmorphism utilities, glow effects
- Create `src/data/mockData.ts` with comprehensive mock data (students, courses, tests, assignments, coding problems, activity data, leaderboard)
- Create `src/context/AuthContext.tsx` with role-based auth (admin/student), login/logout, mock user profiles
- Set up `App.tsx` with React Router, role-based route guards, and Framer Motion page transitions (AnimatePresence)

## Phase 2: Shared Components
- **Layout:** `Sidebar.tsx` (collapsible 72px/240px, role-based nav, glow hover effects, active state), `TopBar.tsx` (greeting, search spotlight CMD+K, notifications, avatar dropdown)
- **UI Components:** `GlowCard.tsx` (glassmorphism card with hover lift + glow), `AnimatedCounter.tsx` (count-up animation with Intersection Observer), `ScrollReveal.tsx` (scroll-triggered animations using Intersection Observer), `ProgressRing.tsx` (SVG circular progress), `Badge.tsx` (colored status badges)
- **Shared Components:** `StreakCalendar.tsx` (GitHub-style 52-week heatmap grid with tooltips), `Leaderboard.tsx` (podium + ranked list), `CourseCard.tsx` (thumbnail, stats, progress bar, hover tilt effect)
- **Charts:** `EngagementChart.tsx`, `CompletionChart.tsx`, `ScoreDistribution.tsx` using Recharts with glassmorphism tooltips
- **AIChatBot.tsx:** Floating bottom-right chat panel with quick prompts, simulated AI responses, slide-up animation

## Phase 3: Auth Pages
- **Login page** (`/login`): Split layout — animated left panel with logo, tagline, testimonial cards, animated stats; right panel with glass form card, Student/Admin toggle, email+password fields, shimmer button
- **Register page** (`/register`): Same aesthetic, enrollment code field, role selector

## Phase 4: Admin Pages
- **Admin Dashboard** (`/admin/dashboard`): Hero stat cards (4 animated counters with sparklines), 90-day activity heatmap, dual chart row (engagement area chart + score donut), top students leaderboard table, recent assignments/tests panel, floating quick-action FAB
- **Course Manager** (`/admin/courses`): Filterable course grid, create/edit course right drawer with rich text, lesson drag-reorder, publish toggle
- **Student Tracker** (`/admin/students`): Searchable/filterable student table with expandable rows showing per-course breakdown, student detail modal with streak calendar and activity timeline, export CSV
- **Test Manager** (`/admin/tests`): Tabbed test list (daily/course-end/mock), step-by-step test creation wizard (details → questions with MCQ builder → settings → preview), test results view with score distribution and per-question analysis
- **Assignment Manager** (`/admin/assignments`): Create assignments with file upload, submission review with grading and feedback, bulk grade
- **Analytics** (`/admin/analytics`): KPI cards, engagement deep dive chart, course performance table, at-risk students AI insight cards, activity heatmap by hour/day

## Phase 5: Student Pages
- **Student Dashboard** (`/student/dashboard`): Personalized greeting with streak flame, quick stats, streak calendar, continue learning carousel, AI recommendations, upcoming schedule
- **Course Catalog** (`/student/courses`): Searchable/filterable course grid with 3D tilt hover, course detail page with curriculum accordion, enroll flow
- **Lesson Viewer** (`/student/courses/:id/lesson/:lessonId`): Left lesson nav sidebar, video player with mark-as-complete, notes section, navigation between lessons
- **Test Page** (`/student/tests/:testId`): Pre-test instructions screen, test-taking UI with countdown timer, question grid navigator, flag questions, auto-submit, results page with score ring animation and confetti
- **Assignments Page** (`/student/assignments`): Pending/submitted/graded tabs, submission modal with file upload and text/code editors, graded feedback view
- **Coding Arena** (`/student/coding-arena`): LeetCode-style problem list with difficulty filters and tags, problem page with split view (description + Monaco code editor), test cases panel, run/submit with verdict animations
- **Profile** (`/student/profile`): Student info, stats, streak calendar, certificates

## Phase 6: Discussion Forums & Certificates
- **Forums** (`/student/forum`): Course-based forum list, post list with filters, create post with rich text and code blocks, threaded replies, like and mark-as-solution
- **Certificate generation**: Completion modal with confetti, certificate preview with branding, download as PDF

## Phase 7: Polish
- Skeleton loading states for all data sections
- Empty states with friendly illustrations
- Mobile responsive: bottom nav bar for mobile, stacked layouts, touch-friendly targets
- Accessibility: aria-labels, focus states, keyboard navigation
- Micro-interactions: button ripples, hover scales, transition effects throughout
