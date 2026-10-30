import React from "react";
import { getReviewsStore } from "@/lib/reviews-store";
import { ReviewsManager } from "@/components/admin/reviews-manager";

export default function AdminReviewsPage() {
  const reviews = getReviewsStore();
  return <ReviewsManager initialReviews={reviews} />;
}
