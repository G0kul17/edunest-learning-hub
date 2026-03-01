// ─── Base API Client ──────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("edunest-token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "student";
  avatar: string | null;
  joinDate: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),

  register: (name: string, email: string, password: string, role: "admin" | "student" = "student") =>
    api.post<AuthResponse>("/auth/register", { name, email, password, role }),

  me: () => api.get<UserProfile>("/auth/me"),
};

// ─── User Profile ─────────────────────────────────────────────────────────────

export const userApi = {
  updateProfile: (data: {
    name?: string;
    email?: string;
    avatar?: string | null;
    currentPassword?: string;
    newPassword?: string;
  }) => api.put<UserProfile>("/users/me", data),
};

// ─── Courses ──────────────────────────────────────────────────────────────────

export const coursesApi = {
  list: (params?: { status?: string; category?: string; difficulty?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<any[]>(`/courses${q ? `?${q}` : ""}`);
  },
  get: (id: string) => api.get<any>(`/courses/${id}`),
  create: (data: any) => api.post<any>("/courses", data),
  update: (id: string, data: any) => api.put<any>(`/courses/${id}`, data),
  delete: (id: string) => api.delete<any>(`/courses/${id}`),
  enroll: (id: string) => api.post<any>(`/courses/${id}/enroll`),
  completeLesson: (courseId: string, lessonId: string) =>
    api.post<any>(`/courses/${courseId}/lessons/${lessonId}/complete`),
};

// ─── Students ─────────────────────────────────────────────────────────────────

export const studentsApi = {
  list: (params?: { search?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<any[]>(`/students${q ? `?${q}` : ""}`);
  },
  me: () => api.get<any>("/students/me"),
  get: (id: string) => api.get<any>(`/students/${id}`),
  adminStats: () => api.get<any>("/students/admin/stats"),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

export const testsApi = {
  list: (params?: { type?: string; status?: string; courseId?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<any[]>(`/tests${q ? `?${q}` : ""}`);
  },
  get: (id: string) => api.get<any>(`/tests/${id}`),
  create: (data: any) => api.post<any>("/tests", data),
  update: (id: string, data: any) => api.put<any>(`/tests/${id}`, data),
  submit: (id: string, answers: Record<string, any>, timeTaken: number) =>
    api.post<any>(`/tests/${id}/submit`, { answers, timeTaken }),
  results: (id: string) => api.get<any[]>(`/tests/${id}/results`),
};

// ─── Assignments ──────────────────────────────────────────────────────────────

export const assignmentsApi = {
  list: (params?: { courseId?: string; status?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<any[]>(`/assignments${q ? `?${q}` : ""}`);
  },
  get: (id: string) => api.get<any>(`/assignments/${id}`),
  create: (data: any) => api.post<any>("/assignments", data),
  update: (id: string, data: any) => api.put<any>(`/assignments/${id}`, data),
  submit: (id: string, content: string) =>
    api.post<any>(`/assignments/${id}/submit`, { content }),
  grade: (id: string, subId: string, score: number, feedback: string) =>
    api.post<any>(`/assignments/${id}/submissions/${subId}/grade`, { score, feedback }),
};

// ─── Problems ─────────────────────────────────────────────────────────────────

export const problemsApi = {
  list: (params?: { difficulty?: string; tag?: string; search?: string; solved?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<any[]>(`/problems${q ? `?${q}` : ""}`);
  },
  get: (id: string) => api.get<any>(`/problems/${id}`),
  submit: (id: string, code: string, language: string) =>
    api.post<any>(`/problems/${id}/submit`, { code, language }),
  attempts: (id: string) => api.get<any[]>(`/problems/${id}/attempts`),
};

// ─── Forum ────────────────────────────────────────────────────────────────────

export const forumApi = {
  posts: (params?: { courseId?: string; solved?: string; search?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return api.get<any[]>(`/forum/posts${q ? `?${q}` : ""}`);
  },
  post: (id: string) => api.get<any>(`/forum/posts/${id}`),
  createPost: (data: { courseId: string; title: string; body: string; tags?: string[] }) =>
    api.post<any>("/forum/posts", data),
  addReply: (postId: string, body: string) =>
    api.post<any>(`/forum/posts/${postId}/replies`, { body }),
  likePost: (id: string) => api.post<any>(`/forum/posts/${id}/like`),
  likeReply: (id: string) => api.post<any>(`/forum/replies/${id}/like`),
  markSolution: (replyId: string) => api.post<any>(`/forum/replies/${replyId}/solution`),
};

export default api;
