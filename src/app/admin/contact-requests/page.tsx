import React from "react";
import { getContactRequests } from "@/lib/contact-requests";
import { ContactRequestsManager } from "@/components/admin/contact-requests-manager";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "إدارة طلبات واستفسارات الزبائن | شركة لبيب كمال",
  noIndex: true,
});

export default function AdminContactRequestsPage() {
  const requests = getContactRequests();

  return (
    <div className="space-y-6 text-start">
      <div className="border-b border-brand-neutral-200 pb-5">
        <span className="text-xs font-bold text-brand-green-700 tracking-wider uppercase">
          خدمة العملاء ومتابعة المبيعات
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-neutral-900 tracking-tight mt-0.5">
          إدارة طلبات واستفسارات الزبائن
        </h1>
        <p className="text-sm text-brand-neutral-500 mt-1">
          متابعة استفسارات الزبائن الواردة، تحديث حالتها، والتواصل المباشر مع أصحابها هاتفياً أو عبر واتساب.
        </p>
      </div>

      <ContactRequestsManager initialRequests={requests} />
    </div>
  );
}
