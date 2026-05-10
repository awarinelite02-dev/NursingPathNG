@echo off
REM 🚀 GitHub Upload Script for Windows - Nursing CBT Platform

echo ==========================================
echo 🚀 Nursing CBT Platform - GitHub Setup
echo ==========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Get user input
echo 📝 Please provide the following information:
echo.

set /p GITHUB_USERNAME=Enter your GitHub username: 
set /p REPO_NAME="Enter repository name (default: nursing-cbt-platform): "
if "%REPO_NAME%"=="" set REPO_NAME=nursing-cbt-platform

set /p VISIBILITY="Enter visibility (public/private, default: public): "
if "%VISIBILITY%"=="" set VISIBILITY=public

set /p GITHUB_TOKEN=Enter your GitHub personal access token: 

echo.
echo ⚠️  About to push to:
echo https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.

set /p CONFIRM="Is this correct? (yes/no): "
if not "%CONFIRM%"=="yes" (
    echo Cancelled.
    pause
    exit /b 1
)

echo.
echo 🔧 Setting up Git repository...
echo.

REM Check if git is already initialized
if not exist ".git" (
    echo Initializing Git...
    call git init
    echo ✅ Git initialized
) else (
    echo ⚠️  Git already initialized
)

echo.
echo Adding all files...
call git add .
echo ✅ Files added

echo.
echo Creating initial commit...
call git commit -m "🚀 Initial commit: Complete nursing CBT platform - Production Ready"
if errorlevel 1 (
    echo Commit already exists or no changes to commit
)
echo ✅ Commit created

echo.
echo Setting up remote repository...

REM Check if remote exists and remove it
for /f %%i in ('git remote get-url origin 2^>nul') do (
    echo Removing existing remote...
    call git remote remove origin
)

set GITHUB_URL=https://%GITHUB_TOKEN%@github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
call git remote add origin %GITHUB_URL%
echo ✅ Remote added

echo.
echo Setting main branch...
call git branch -M main
echo ✅ Main branch set

echo.
echo 📤 Pushing to GitHub...
echo This may take a moment...
echo.

call git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ Push failed!
    echo.
    echo Possible issues:
    echo 1. Invalid GitHub token
    echo 2. Repository already exists
    echo 3. Network connection problem
    echo.
    echo To create a new repository, visit:
    echo https://github.com/new
    pause
    exit /b 1
)

echo.
echo ==========================================
echo ✅ SUCCESS! Your code is now on GitHub!
echo ==========================================
echo.

echo 📍 Repository URL:
echo https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.

echo 📝 Next steps:
echo 1. Visit your repository on GitHub
echo 2. Add a description and topics
echo 3. Enable Issues for bug tracking
echo 4. Share the repository link with team members
echo.

echo 🔄 To update in the future, use:
echo    git add .
echo    git commit -m "Your message"
echo    git push
echo.

echo 📚 Documentation files on your repo:
echo    - README.md - Start here
echo    - IMPLEMENTATION_GUIDE.md - Setup instructions
echo    - PROJECT_SETUP.md - Architecture overview
echo    - DELIVERY_SUMMARY.md - Executive summary
echo.

echo Done! 🎉
pause
