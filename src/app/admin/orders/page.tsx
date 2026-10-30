import React from "react";
import { getOrders } from "@/lib/orders-store";
import { OrdersManager } from "@/components/admin/orders-manager";

export const metadata = {
  title: "إدارة طلبات العطور | لوحة الإدارة - أمير ستور",
};

export default function AdminOrdersPage() {
  const orders = getOrders();
  return <OrdersManager initialOrders={orders} />;
}
