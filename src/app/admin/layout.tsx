import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "لوحة تحكم الإدارة | شركة لبيب كمال",
  noIndex: true,
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Strict Server-Side Authentication Guard (Task 108)
  if (!session) {
    redirect("/login");
  }

  // Strict Server-Side Authorization Guard (Task 109)
  if (session.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return <AdminShell user={session}>{children}</AdminShell>;
}
