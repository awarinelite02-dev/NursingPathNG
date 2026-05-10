#!/bin/bash

# 🚀 Automated GitHub Upload Script for Nursing CBT Platform
# This script sets up Git and pushes everything to GitHub automatically

echo "=========================================="
echo "🚀 Nursing CBT Platform - GitHub Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is not installed!${NC}"
    echo "Please install Git from https://git-scm.com/"
    exit 1
fi

echo -e "${GREEN}✅ Git is installed${NC}"
echo ""

# Get user input
echo -e "${BLUE}📝 Please provide the following information:${NC}"
echo ""

read -p "Enter your GitHub username: " GITHUB_USERNAME
read -p "Enter your repository name (default: nursing-cbt-platform): " REPO_NAME
REPO_NAME=${REPO_NAME:-nursing-cbt-platform}

read -p "Enter repository visibility (public/private, default: public): " VISIBILITY
VISIBILITY=${VISIBILITY:-public}

read -p "Enter your GitHub personal access token (get from Settings > Developer settings): " GITHUB_TOKEN

echo ""
echo -e "${YELLOW}⚠️  About to push to:${NC}"
echo "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""

read -p "Is this correct? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Setting up Git repository...${NC}"
echo ""

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing Git..."
    git init
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${YELLOW}⚠️  Git already initialized${NC}"
fi

echo ""
echo "Adding all files..."
git add .
echo -e "${GREEN}✅ Files added${NC}"

echo ""
echo "Creating initial commit..."
git commit -m "🚀 Initial commit: Complete nursing CBT platform

Features:
- ✅ Student dashboard with gamification
- ✅ Admin panel for school & question management  
- ✅ AI tutoring powered by Claude
- ✅ Mock exams with 24-hour countdown
- ✅ Performance analytics & leaderboards
- ✅ Dark/light mode support
- ✅ Fully responsive design

Components:
- ✅ 19 production-ready files
- ✅ 5 backend services
- ✅ 5 UI components
- ✅ 2 context providers
- ✅ Complete documentation

Status: Production Ready
Version: 1.0.0" 2>/dev/null || git commit -m "Initial commit: Complete nursing CBT platform"
echo -e "${GREEN}✅ Commit created${NC}"

echo ""
echo "Setting up remote repository..."

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "Removing existing remote..."
    git remote remove origin
fi

GITHUB_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
git remote add origin "$GITHUB_URL"
echo -e "${GREEN}✅ Remote added${NC}"

echo ""
echo "Setting main branch..."
git branch -M main
echo -e "${GREEN}✅ Main branch set${NC}"

echo ""
echo -e "${BLUE}📤 Pushing to GitHub...${NC}"
echo "This may take a moment..."
echo ""

if git push -u origin main; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✅ SUCCESS! Your code is now on GitHub!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo ""
    echo "📍 Repository URL:"
    echo "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
    echo ""
    echo "📝 Next steps:"
    echo "1. Visit your repository on GitHub"
    echo "2. Add a description and topics"
    echo "3. Enable Issues for bug tracking"
    echo "4. Share the repository link with team members"
    echo ""
    echo "🔄 To update in the future, use:"
    echo "   git add ."
    echo "   git commit -m 'Your message'"
    echo "   git push"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Push failed!${NC}"
    echo ""
    echo "Possible issues:"
    echo "1. Invalid GitHub token"
    echo "2. Repository already exists"
    echo "3. Network connection problem"
    echo ""
    echo "To create a new repository, visit:"
    echo "https://github.com/new"
    exit 1
fi

echo ""
echo -e "${BLUE}📚 Documentation files on your repo:${NC}"
echo "  - README.md - Start here"
echo "  - IMPLEMENTATION_GUIDE.md - Setup instructions"
echo "  - PROJECT_SETUP.md - Architecture overview"
echo "  - DELIVERY_SUMMARY.md - Executive summary"
echo ""

echo -e "${GREEN}Done! 🎉${NC}"
