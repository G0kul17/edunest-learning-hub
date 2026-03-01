# EduNest Learning Hub 🎓

A full-stack learning management platform built with **React + TypeScript** (frontend) and **Node.js + Express + SQLite** (backend).

## 📁 Project Structure

```
edunest-learning-hub/
├── frontend/          # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages (student & admin)
│   │   ├── context/      # Auth context
│   │   ├── data/         # Mock data
│   │   └── lib/          # API service layer
│   └── ...
└── backend/           # Node.js + Express + SQLite
    ├── src/
    │   ├── routes/       # API route handlers
    │   ├── db/           # Database schema, connection, seed
    │   └── index.js      # Express server entry
    └── ...
```

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
npm run seed   # Seed the database with mock data
npm run dev    # Start server on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev    # Start app on http://localhost:8080
```

## 🔑 Demo Credentials

| Role    | Email                  | Password      |
|---------|------------------------|---------------|
| Student | aryan@example.com      | password123   |
| Admin   | admin@edunest.com      | admin123      |

## ⚙️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS, Shadcn|
| Backend   | Node.js, Express, SQLite (better-sqlite3)       |
| Auth      | JWT (jsonwebtoken) + bcryptjs                   |
| Animation | Framer Motion                                   |
