import crypto from "crypto";
import { readStorageFile, writeStorageFile } from "@/lib/storage";

export type ContactRequestStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "RESOLVED" | "ARCHIVED";

export interface ContactRequest {
  id: string;
  userId?: string;
  userEmail?: string;
  name: string;
  phone: string;
  email?: string;
  product?: string;
  message: string;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

const STORAGE_FILE = "inquiries.json";

// In adherence with Constitution Rule 1 (Zero Fabrication), initial inquiries start empty
const initialRequests: ContactRequest[] = [];

/**
 * Returns all inquiries (Administrator scope)
 */
export function getContactRequests(): ContactRequest[] {
  return readStorageFile<ContactRequest[]>(STORAGE_FILE, initialRequests);
}

/**
 * Returns inquiries strictly isolated for a single customer (Customer private scope)
 * Enforces zero cross-customer data leakage.
 */
export function getUserContactRequests(userEmail: string, userId?: string): ContactRequest[] {
  if (!userEmail && !userId) return [];
  const normalizedEmail = (userEmail || "").trim().toLowerCase();
  const all = getContactRequests();
  return all.filter((r) => {
    if (userId && r.userId && r.userId === userId) return true;
    if (r.userEmail && r.userEmail.trim().toLowerCase() === normalizedEmail) return true;
    if (r.email && r.email.trim().toLowerCase() === normalizedEmail) return true;
    return false;
  });
}

/**
 * Retrieves a single customer inquiry with strict ownership verification
 */
export function getUserContactRequestById(id: string, userEmail: string, userId?: string): ContactRequest | null {
  const userRequests = getUserContactRequests(userEmail, userId);
  return userRequests.find((r) => r.id === id) || null;
}

/**
 * Adds an inquiry, binding it securely to customer identity if authenticated
 */
export function addContactRequest(data: Omit<ContactRequest, "id" | "status" | "createdAt">): ContactRequest {
  const requests = getContactRequests();
  const id = `req-${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const newReq: ContactRequest = {
    id,
    ...data,
    status: "NEW",
    createdAt: now,
    updatedAt: now,
  };

  requests.unshift(newReq);
  writeStorageFile(STORAGE_FILE, requests);
  return newReq;
}

/**
 * Updates inquiry status and notes (Administrator scope)
 */
export function updateContactRequestStatus(
  id: string,
  status: ContactRequestStatus,
  notes?: string
): ContactRequest | null {
  const requests = getContactRequests();
  const req = requests.find((r) => r.id === id);
  if (!req) return null;

  req.status = status;
  req.updatedAt = new Date().toISOString();
  if (notes !== undefined) {
    req.notes = notes;
  }

  writeStorageFile(STORAGE_FILE, requests);
  return req;
}

/**
 * Deletes an inquiry (Administrator scope)
 */
export function deleteContactRequest(id: string): boolean {
  const requests = getContactRequests();
  const filtered = requests.filter((r) => r.id !== id);
  if (filtered.length === requests.length) return false;

  writeStorageFile(STORAGE_FILE, filtered);
  return true;
}

/**
 * Customer self-service deletion of their own inquiry (Customer scope)
 */
export function deleteUserContactRequest(id: string, userEmail: string, userId?: string): boolean {
  const req = getUserContactRequestById(id, userEmail, userId);
  if (!req) return false;
  return deleteContactRequest(id);
}
