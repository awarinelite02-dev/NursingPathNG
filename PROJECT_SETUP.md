# 🏥 Nursing Schools Entrance Post-UTME CBT Platform

## Project Overview
A comprehensive exam preparation platform for Nigerian nursing school entrance exams (Post-UTME) with AI-powered features, gamification, analytics, and school-based leaderboards.

---

## 📋 Project Structure

```
nursing-cbt-platform/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── SchoolManager.jsx
│   │   │   ├── QuestionManager.jsx
│   │   │   ├── QuestionBulkUpload.jsx
│   │   │   ├── AnalyticsHub.jsx
│   │   │   ├── ExamScheduler.jsx
│   │   │   └── AdminNav.jsx
│   │   ├── Student/
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── MockExam.jsx
│   │   │   ├── PastQuestions.jsx
│   │   │   ├── SchoolLeaderboard.jsx
│   │   │   ├── PerformanceDashboard.jsx
│   │   │   ├── ExamInterface.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   └── StudentNav.jsx
│   │   ├── Shared/
│   │   │   ├── Navigation.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── SignUp.jsx
│   │   │   │   └── SchoolSelector.jsx
│   │   │   ├── AITutor.jsx
│   │   │   ├── NotificationCenter.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── CountdownTimer.jsx
│   │   └── Common/
│   │       ├── Modal.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── Toast.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   ├── ExamContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useExam.js
│   │   ├── useNotifications.js
│   │   └── useAnalytics.js
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.js
│   │   ├── questionService.js
│   │   ├── examService.js
│   │   ├── leaderboardService.js
│   │   ├── notificationService.js
│   │   ├── aiTutorService.js
│   │   └── analyticsService.js
│   ├── utils/
│   │   ├── parsing.js
│   │   ├── timer.js
│   │   ├── gamification.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── global.css
│   │   ├── theme.css
│   │   ├── animations.css
│   │   └── responsive.css
│   ├── App.jsx
│   └── index.jsx
├── .env.example
├── package.json
├── firebase.json
└── README.md
```

---

## 🚀 Setup Instructions

### 1. **Create Firebase Project**
- Go to [Firebase Console](https://console.firebase.google.com)
- Create a new project: "Nursing-CBT-Platform"
- Enable these services:
  - Authentication (Email/Password, Google Sign-In)
  - Firestore Database (Production mode)
  - Cloud Storage
  - Cloud Messaging
  - Cloud Functions (for notifications)

### 2. **Install Dependencies**

```bash
npx create-react-app nursing-cbt-platform
cd nursing-cbt-platform

npm install firebase
npm install react-router-dom
npm install tailwindcss
npm install zustand (for state management alternative to Context)
npm install react-icons
npm install axios
npm install date-fns
npm install react-hot-toast
npm install framer-motion
npm install @anthropic-ai/sdk
npm install react-quill (for rich text editing)
npm install papaparse (for CSV parsing)
```

### 3. **Setup Tailwind CSS**

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy': '#1a365d',
        'navy-dark': '#0f1f3c',
        'navy-light': '#2c5282',
        'accent': '#3182ce',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
```

### 4. **Environment Variables**

Create `.env`:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_key
REACT_APP_JAMB_DATE=2024-04-15
```

### 5. **Deploy**

```bash
# Firebase Hosting
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy

# Or Vercel
vercel
```

---

## 📊 Database Schema (Firestore)

### Collections

**users/**
- uid (doc ID)
- email, name, phone
- role: "student" | "admin"
- school_id
- target_school
- created_at
- xp, badges, tier

**schools/**
- school_id (doc ID)
- name, address, code
- created_at

**questions/**
- question_id (doc ID)
- school_id
- subject
- topic
- question_text
- options: [A, B, C, D]
- correct_answer
- explanation
- diagram_url
- difficulty: "easy" | "medium" | "hard"
- created_at

**exams/**
- exam_id (doc ID)
- exam_type: "mock" | "past_question"
- school_id
- subject
- questions: [question_ids]
- duration_minutes
- created_at
- status: "active" | "archived"

**exam_sessions/**
- session_id (doc ID)
- user_id
- exam_id
- start_time
- end_time
- answers: {question_id: answer, ...}
- score
- time_per_question: {question_id: seconds, ...}
- status: "in_progress" | "completed" | "paused"

**leaderboards/**
- leaderboard_id (doc ID)
- school_id
- period: "weekly" | "monthly" | "all_time"
- rankings: [{user_id, score, position, xp}, ...]
- updated_at

**notifications/**
- notification_id (doc ID)
- user_id
- type: "study_reminder" | "exam_available" | "achievement" | "performance"
- title, message
- read
- created_at

---

## 🎨 Design System

**Colors:**
- Primary: Navy Blue (#1a365d)
- Secondary: Light Blue (#3182ce)
- Success: Green (#48bb78)
- Warning: Orange (#ed8936)
- Error: Red (#f56565)
- Background: White / Dark Navy
- Text: Charcoal / White

**Typography:**
- Display: Poppins Bold 32px
- Heading: Poppins Semi-Bold 24px
- Body: Inter Regular 16px
- Caption: Inter Light 12px

---

## ✨ Key Features Implementation Guide

| Feature | Component | Service | Database |
|---------|-----------|---------|----------|
| Admin Panel | AdminDashboard.jsx | authService | users, schools |
| Add Questions | QuestionManager.jsx | questionService | questions |
| Bulk Upload | QuestionBulkUpload.jsx | parsing.js | questions |
| Mock Exam | MockExam.jsx | examService | exams, exam_sessions |
| Past Questions | PastQuestions.jsx | questionService | questions, exams |
| Leaderboard | SchoolLeaderboard.jsx | leaderboardService | leaderboards |
| Performance | PerformanceDashboard.jsx | analyticsService | exam_sessions |
| AI Tutor | AITutor.jsx | aiTutorService | — |
| Notifications | NotificationCenter.jsx | notificationService | notifications |
| Gamification | (integrated) | gamification.js | users |

---

## 🔐 Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }

    // Admins can manage schools & questions
    match /schools/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }

    match /questions/{document=**} {
      allow read: if true;
      allow write: if request.auth.token.role == 'admin';
    }

    // Students can read exams for their school
    match /exams/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.role == 'admin';
    }

    // Exam sessions
    match /exam_sessions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.user_id;
      allow create: if request.auth != null;
    }

    // Leaderboards
    match /leaderboards/{document=**} {
      allow read: if true;
    }

    // Notifications
    match /notifications/{document=**} {
      allow read, write: if request.auth.uid == resource.data.user_id;
    }
  }
}
```

---

## 🧪 Testing Checklist

- [ ] User registration (student + admin)
- [ ] School selection on signup
- [ ] Admin can add schools
- [ ] Admin can add single question
- [ ] Admin can bulk upload questions (CSV)
- [ ] Questions parse correctly with answers & explanations
- [ ] Student can see daily mock exam with 24hr countdown
- [ ] Mock exam timer works correctly
- [ ] Student can bookmark questions
- [ ] Exam auto-saves to Firestore
- [ ] Student can pause & resume exam
- [ ] Results show correct/incorrect with explanations
- [ ] Leaderboard updates in real-time
- [ ] Performance dashboard shows trends
- [ ] Notifications send to students
- [ ] AI Tutor responds to questions
- [ ] Dark/Light mode works
- [ ] Mobile responsive
- [ ] XP & badges award correctly

---

## 📱 Next Steps

1. Generate all component files from the code dumps below
2. Set up Firebase project
3. Configure environment variables
4. Test authentication flow
5. Populate initial schools & questions
6. Deploy to Firebase Hosting
7. Enable Cloud Messaging for notifications
8. Set up Cloud Functions for scheduled notifications

---

**Built with ❤️ for nursing education excellence**
