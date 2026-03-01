import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CourseManager from "./pages/admin/CourseManager";
import StudentTracker from "./pages/admin/StudentTracker";
import TestManager from "./pages/admin/TestManager";
import AssignmentManager from "./pages/admin/AssignmentManager";
import Analytics from "./pages/admin/Analytics";
import StudentDashboard from "./pages/student/StudentDashboard";
import CourseCatalog from "./pages/student/CourseCatalog";
import LessonViewer from "./pages/student/LessonViewer";
import TestPage from "./pages/student/TestPage";
import AssignmentsPage from "./pages/student/AssignmentsPage";
import CodingArena from "./pages/student/CodingArena";
import Profile from "./pages/student/Profile";
import Forums from "./pages/student/Forums";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: "admin" | "student" }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to={role === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={role === "admin" ? "/admin/dashboard" : "/student/dashboard"} replace /> : <Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute allowedRole="admin"><CourseManager /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute allowedRole="admin"><StudentTracker /></ProtectedRoute>} />
        <Route path="/admin/tests" element={<ProtectedRoute allowedRole="admin"><TestManager /></ProtectedRoute>} />
        <Route path="/admin/assignments" element={<ProtectedRoute allowedRole="admin"><AssignmentManager /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute allowedRole="admin"><Analytics /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/courses" element={<ProtectedRoute allowedRole="student"><CourseCatalog /></ProtectedRoute>} />
        <Route path="/student/courses/:id/lesson/:lessonId" element={<ProtectedRoute allowedRole="student"><LessonViewer /></ProtectedRoute>} />
        <Route path="/student/tests/:testId" element={<ProtectedRoute allowedRole="student"><TestPage /></ProtectedRoute>} />
        <Route path="/student/assignments" element={<ProtectedRoute allowedRole="student"><AssignmentsPage /></ProtectedRoute>} />
        <Route path="/student/coding-arena" element={<ProtectedRoute allowedRole="student"><CodingArena /></ProtectedRoute>} />
        <Route path="/student/coding-arena/:problemId" element={<ProtectedRoute allowedRole="student"><CodingArena /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRole="student"><Profile /></ProtectedRoute>} />
        <Route path="/student/forum" element={<ProtectedRoute allowedRole="student"><Forums /></ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
