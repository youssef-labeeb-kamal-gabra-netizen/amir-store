import crypto from "crypto";
import { readStorageFile, writeStorageFile } from "@/lib/storage";
import {
  CustomerReview,
  ReviewStatus,
  INITIAL_REVIEWS,
} from "@/data/reviews";

export type { ReviewStatus, CustomerReview };
export { INITIAL_REVIEWS };

const STORAGE_FILE = "reviews.json";

export function getReviewsStore(): CustomerReview[] {
  return readStorageFile<CustomerReview[]>(STORAGE_FILE, INITIAL_REVIEWS);
}

export function getApprovedReviews(): CustomerReview[] {
  return getReviewsStore().filter((r) => r.status === "APPROVED");
}

export function addReview(
  data: Omit<CustomerReview, "id" | "date" | "verified" | "status">
): CustomerReview {
  const reviews = getReviewsStore();
  const id = `rev-${crypto.randomUUID()}`;

  // Strict moderation: all new customer submissions default to PENDING & unverified (Phase 4, Item 1)
  const newReview: CustomerReview = {
    id,
    ...data,
    date: "اليوم",
    verified: false,
    status: "PENDING",
  };

  reviews.unshift(newReview);
  writeStorageFile(STORAGE_FILE, reviews);
  return newReview;
}

export function moderateReview(id: string, status: ReviewStatus): CustomerReview | null {
  const reviews = getReviewsStore();
  const rev = reviews.find((r) => r.id === id);
  if (!rev) return null;

  rev.status = status;
  writeStorageFile(STORAGE_FILE, reviews);
  return rev;
}

export function deleteReview(id: string): boolean {
  const reviews = getReviewsStore();
  const idx = reviews.findIndex((r) => r.id === id);
  if (idx === -1) return false;

  reviews.splice(idx, 1);
  writeStorageFile(STORAGE_FILE, reviews);
  return true;
}
