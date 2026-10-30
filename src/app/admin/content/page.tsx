import React from "react";
import { getContentStore } from "@/lib/content-store";
import { ContentManager } from "@/components/admin/content-manager";

export default function AdminContentPage() {
  const content = getContentStore();
  return <ContentManager initialContent={content} />;
}
