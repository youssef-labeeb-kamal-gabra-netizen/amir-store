import React from "react";
import { getOrders } from "@/lib/orders-store";
import { OrdersManager } from "@/components/admin/orders-manager";

export const metadata = {
  title: "إدارة طلبات العطور | لوحة الإدارة - أمير ستور",
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <OrdersManager initialOrders={orders} />;
}
