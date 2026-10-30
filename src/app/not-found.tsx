import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center text-white space-y-6">
      <div className="flex justify-center">
        <div className="rounded-3xl bg-amber-400/10 border border-amber-400/30 p-7 text-amber-400 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          <Compass className="h-16 w-16 animate-pulse" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-arabic">
          الصفحة غير موجودة (404)
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
          يبدو أنك سلكت مساراً غير صحيح، أو أن العطر أو الصفحة قد نُقلت إلى تشكيلة أخرى.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <Link href="/">
          <Button variant="primary" size="md" className="gap-2 font-black">
            <Home className="h-4 w-4" />
            العودة للرئيسية
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="md" className="gap-2 font-bold">
            مجموعة العطور الملكية
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
