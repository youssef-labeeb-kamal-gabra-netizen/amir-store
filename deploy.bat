@echo off
chcp 65001 > nul
echo ===================================================================
echo   أمير ستور (Amir Store) - الفحص والرفع المباشر إلى منصة Vercel
echo ===================================================================
echo.
echo [1/4] جاري تشغيل الفحص البرمجي للأنواع (TypeScript Typecheck)...
call npm.cmd run typecheck
if %errorlevel% neq 0 (
    echo.
    echo [خطأ فادح] فشل فحص الأنواع (Typecheck Failed)! يرجى إصلاح أخطاء TypeScript قبل الرفع.
    pause
    exit /b %errorlevel%
)
echo [نجح] فحص الأنواع منضبط بنسبة 100%%.

echo.
echo [2/4] جاري التحقق من جودة الكود ومعايير الأمان (ESLint)...
call npm.cmd run lint
if %errorlevel% neq 0 (
    echo.
    echo [خطأ فادح] فشل تدقيق الكود (Lint Failed)! يرجى مراجعة المعايير.
    pause
    exit /b %errorlevel%
)
echo [نجح] معايير الأمان وجودة الشيفرة معتمدة 100%%.

echo.
echo [3/4] جاري تشغيل حزم الاختبارات الآلية الشاملة والتحدي التنافسي (104 اختباراً)...
node scripts/run-tests.js
if %errorlevel% neq 0 (
    echo.
    echo [خطأ فادح] فشلت بعض الاختبارات الآلية! لن يتم رفع الموقع لحماية بيئة الإنتاج.
    pause
    exit /b %errorlevel%
)
node scripts/adversarial-challenge-2.js
if %errorlevel% neq 0 (
    echo.
    echo [خطأ فادح] فشلت اختبارات المنطق التجاري والتحدي التنافسي!
    pause
    exit /b %errorlevel%
)
echo [نجح] جميع الاختبارات الـ 104 اجتازت بنجاح تام.

echo.
echo [4/4] جاري التحقق من بناء النسخة الإنتاجية (Production Build)...
call npm.cmd run build
if %errorlevel% neq 0 (
    echo.
    echo [خطأ فادح] فشل بناء المشروع الإنتاجي!
    pause
    exit /b %errorlevel%
)
echo [نجح] تم بناء النسخة الإنتاجية بنجاح واكتمال 41 مساراً.

echo.
echo ===================================================================
echo   جميع الفحوصات الأمنية والوظيفية اجتازت بنسبة 100%%!
echo   جاري الآن تشغيل أمر النشر المباشر على Vercel الإنتاجي...
echo ===================================================================
echo.

set PATH=%PATH%;%LOCALAPPDATA%\MinGit\cmd

call npx.cmd vercel --prod
if %errorlevel% neq 0 (
    call npx vercel --prod
)

echo.
echo ===================================================================
echo تم الانتهاء! إذا تم النشر لأول مرة، يرجى ربط قاعدة بيانات
echo Vercel Postgres من تبويب Storage في لوحة تحكم Vercel.
echo ===================================================================
pause
