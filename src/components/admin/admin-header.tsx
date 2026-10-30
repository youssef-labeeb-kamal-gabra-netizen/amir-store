import React from "react";
import { SessionUser } from "@/lib/auth";
import { ShieldCheck, Menu } from "lucide-react";

interface AdminHeaderProps {
  user: SessionUser;
  onToggleSidebar?: () => void;
}

export function AdminHeader({ user, onToggleSidebar }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-brand-neutral-200 bg-white px-4 sm:px-6 flex items-center justify-between text-start shrink-0">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-brand-neutral-600 hover:text-brand-neutral-900 hover:bg-brand-neutral-100 transition-colors shrink-0 cursor-pointer"
            aria-label="فتح قائمة الإدارة الجانبية"
            title="القائمة"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-100 text-purple-800 px-2.5 py-1 text-xs font-bold border border-purple-200 shrink-0">
          <ShieldCheck className="h-3.5 w-3.5 text-purple-700" />
          <span className="hidden xs:inline">جلسة مشرفة ومؤمنة</span>
          <span className="xs:hidden">مشرف</span>
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-brand-green-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="hidden sm:block text-start">
            <span className="text-xs font-bold text-brand-neutral-900 block leading-none">
              {user.name}
            </span>
            <span className="text-[10px] text-brand-neutral-500">{user.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
