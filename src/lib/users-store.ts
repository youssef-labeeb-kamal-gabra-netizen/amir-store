import { env } from "@/lib/env";
import { readStorageFile, writeStorageFile } from "@/lib/storage";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

const STORAGE_FILE = "users.json";

function getInitialUsers(): AppUser[] {
  const adminEmails =
    env.auth.adminEmails.length > 0
      ? env.auth.adminEmails
      : ["yousseflabeeb256@gmail.com"];

  return adminEmails.map((email, idx) => ({
    id: `admin-${idx + 1}`,
    name: "مدير النظام (م. يوسف لبيب)",
    email: email.trim().toLowerCase(),
    role: "ADMIN" as const,
    createdAt: "2026-01-01T00:00:00Z",
  }));
}

export function getUsersStore(): AppUser[] {
  return readStorageFile<AppUser[]>(STORAGE_FILE, getInitialUsers());
}

export function isImmutableAdmin(email: string): boolean {
  return env.auth.adminEmails.includes(email.trim().toLowerCase());
}

export function upsertUser(data: {
  email: string;
  name?: string;
  role?: "USER" | "ADMIN";
}): AppUser {
  const store = getUsersStore();
  const normalizedEmail = data.email.trim().toLowerCase();
  const existingIndex = store.findIndex((u) => u.email.trim().toLowerCase() === normalizedEmail);

  const isConfiguredAdmin = isImmutableAdmin(normalizedEmail);
  const targetRole: "USER" | "ADMIN" = isConfiguredAdmin ? "ADMIN" : data.role || "USER";

  if (existingIndex !== -1) {
    const existing = store[existingIndex];
    const updated: AppUser = {
      ...existing,
      name: data.name || existing.name,
      role: isConfiguredAdmin ? "ADMIN" : existing.role,
    };
    store[existingIndex] = updated;
    writeStorageFile(STORAGE_FILE, store);
    return updated;
  }

  const newUser: AppUser = {
    id: `usr-${Date.now()}`,
    name: data.name || "مستخدم جديد",
    email: normalizedEmail,
    role: targetRole,
    createdAt: new Date().toISOString(),
  };

  store.push(newUser);
  writeStorageFile(STORAGE_FILE, store);
  return newUser;
}

export function updateUserRole(id: string, role: "USER" | "ADMIN"): AppUser | null {
  const store = getUsersStore();
  const user = store.find((u) => u.id === id);
  if (!user) return null;

  // Protect environment-configured primary administrators from accidental demotion
  if (role !== "ADMIN" && isImmutableAdmin(user.email)) {
    throw new Error("لا يمكن إلغاء صلاحية المدير الرئيسي المحدد في إعدادات الخادم (ADMIN_EMAILS).");
  }

  user.role = role;
  writeStorageFile(STORAGE_FILE, store);
  return user;
}
