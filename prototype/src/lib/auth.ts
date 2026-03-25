export type UserRole = "seeker" | "company";

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

const STORAGE_KEY = "futurecareer_user";

const MOCK_USERS: (User & { password: string })[] = [
  {
    email: "test@seeker.com",
    password: "password",
    name: "สมชาย ใจดี",
    role: "seeker",
  },
  {
    email: "test@company.com",
    password: "password",
    name: "Admin TechCorp",
    role: "company",
  },
];

export function login(email: string, password: string): User | null {
  const found = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!found) return null;
  const user: User = { email: found.email, name: found.name, role: found.role };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }
  return user;
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}
