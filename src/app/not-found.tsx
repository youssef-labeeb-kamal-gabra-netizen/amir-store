import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="mb-6 flex justify-center">
        <div className="rounded-2xl bg-brand-green-50 p-6 text-brand-green-700">
          <FileQuestion className="h-16 w-16" />
        </div>
      </div>
      <h1 className="text-3xl font-extrabold text-brand-neutral-900 mb-2">
        الصفحة غير موجودة (404)
      </h1>
      <p className="text-base text-brand-neutral-600 mb-8 max-w-md mx-auto">
        الصفحة التي تحاول الوصول إليها قد تكون نُقلت أو حُذفت، أو أن الرابط غير صحيح.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/">
          <Button variant="primary" size="md" className="gap-2">
            <Home className="h-4 w-4" />
            الصفحة الرئيسية
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="md" className="gap-2">
            كتالوج المنتجات
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
