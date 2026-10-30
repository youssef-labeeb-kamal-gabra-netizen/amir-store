@echo off
chcp 65001 > nul
echo ========================================================
echo   شركة لبيب كمال لبيب - رفع المشروع على GitHub
echo ========================================================
echo.

set PATH=%PATH%;%LOCALAPPDATA%\MinGit\cmd

echo يرجى لصق رابط مستودع GitHub الخاص بك (Repository URL):
echo مثال: https://github.com/YourUsername/lkl-website.git
set /p REPO_URL="رابط المستودع: "

if "%REPO_URL%"=="" (
    echo [خطأ] لم تقم بإدخال الرابط!
    pause
    exit /b
)

echo.
echo جاري ربط المستودع ورفع الملفات...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ========================================================
echo تم رفع الكود إلى GitHub بنجاح!
echo ========================================================
pause
