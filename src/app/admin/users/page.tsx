import React from "react";
import { getUsersStore } from "@/lib/users-store";
import { UsersManager } from "@/components/admin/users-manager";

export default function AdminUsersPage() {
  const users = getUsersStore();
  return <UsersManager initialUsers={users} />;
}
