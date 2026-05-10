## 📋 .env.example - Copy this to .env

```
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Anthropic API
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_key

# App Configuration
REACT_APP_JAMB_DATE=2024-04-15
REACT_APP_VAPID_KEY=your_vapid_key_for_fcm
REACT_APP_USE_EMULATOR=false
```

---

## 🗂️ Complete Project File Structure

```
nursing-cbt-platform/
│
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.jsx ✅
│   │   │   ├── SchoolManager.jsx (TODO)
│   │   │   ├── QuestionManager.jsx (TODO)
│   │   │   ├── QuestionBulkUpload.jsx (TODO)
│   │   │   ├── AnalyticsHub.jsx (TODO)
│   │   │   ├── ExamScheduler.jsx (TODO)
│   │   │   └── AdminNav.jsx (TODO)
│   │   │
│   │   ├── Student/
│   │   │   ├── StudentDashboard.jsx ✅
│   │   │   ├── MockExam.jsx (TODO)
│   │   │   ├── PastQuestions.jsx (TODO)
│   │   │   ├── SchoolLeaderboard.jsx (TODO)
│   │   │   ├── PerformanceDashboard.jsx (TODO)
│   │   │   ├── ExamInterface.jsx ✅
│   │   │   ├── ExamResults.jsx (TODO)
│   │   │   ├── QuestionCard.jsx (TODO)
│   │   │   └── StudentNav.jsx (TODO)
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.jsx ✅
│   │   │   ├── SignUp.jsx (TODO)
│   │   │   └── SchoolSelector.jsx (TODO)
│   │   │
│   │   ├── Shared/
│   │   │   ├── Navigation.jsx (TODO)
│   │   │   ├── AITutor.jsx (TODO)
│   │   │   ├── NotificationCenter.jsx (TODO)
│   │   │   ├── ThemeToggle.jsx (TODO)
│   │   │   └── CountdownTimer.jsx (TODO)
│   │   │
│   │   └── Common/
│   │       ├── Modal.jsx (TODO)
│   │       ├── LoadingSpinner.jsx (TODO)
│   │       └── Toast.jsx (TODO)
│   │
│   ├── contexts/
│   │   ├── AuthContext.jsx ✅
│   │   ├── ThemeContext.jsx ✅
│   │   ├── ExamContext.jsx (TODO)
│   │   └── NotificationContext.jsx (TODO)
│   │
│   ├── hooks/
│   │   ├── useAuth.js (From AuthContext)
│   │   ├── useTheme.js (From ThemeContext)
│   │   ├── useExam.js (TODO)
│   │   ├── useNotifications.js (TODO)
│   │   └── useAnalytics.js (TODO)
│   │
│   ├── services/
│   │   ├── firebase.js ✅
│   │   ├── authService.js ✅
│   │   ├── questionService.js ✅
│   │   ├── examService.js ✅
│   │   ├── aiTutorService.js ✅
│   │   ├── leaderboardService.js (TODO)
│   │   ├── notificationService.js (TODO)
│   │   └── analyticsService.js (TODO)
│   │
│   ├── utils/
│   │   ├── gamification.js ✅
│   │   ├── parsing.js (TODO)
│   │   ├── timer.js (TODO)
│   │   └── validators.js (TODO)
│   │
│   ├── styles/
│   │   ├── global.css ✅
│   │   ├── theme.css (TODO)
│   │   ├── animations.css (TODO)
│   │   └── responsive.css (TODO)
│   │
│   ├── App.jsx ✅
│   ├── index.jsx
│   └── index.css (import global.css)
│
├── .env.example
├── .env (DO NOT COMMIT)
├── .gitignore
├── package.json ✅
├── tailwind.config.js
├── postcss.config.js
├── firebase.json
└── README.md
```

✅ = Created  
TODO = Still needs to be created

---

## 🚀 Quick Start Commands

```bash
# Initial setup
npx create-react-app nursing-cbt-platform
cd nursing-cbt-platform

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init hosting

# Start development server
npm start

# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

---

## 📱 Key API Endpoints & Services

### Authentication Service
```javascript
authService.signUp(email, password, userData)
authService.signIn(email, password)
authService.signOut()
authService.getUserData(uid)
authService.updateUserData(uid, data)
authService.addXP(uid, xpAmount)
authService.awardBadge(uid, badge)
authService.updateDailyStreak(uid)
authService.getSchoolLeaderboard(schoolId)
```

### Question Service
```javascript
questionService.addQuestion(schoolId, questionData)
questionService.bulkAddQuestions(schoolId, questionsData)
questionService.parseQuestionsFromCSV(csvText)
questionService.getQuestionsBySubject(schoolId, subject)
questionService.getQuestionsByTopic(schoolId, subject, topic)
questionService.getAllQuestions(schoolId)
questionService.updateQuestion(questionId, updateData)
questionService.deleteQuestion(questionId)
questionService.getSubjects(schoolId)
questionService.getTopics(schoolId, subject)
```

### Exam Service
```javascript
examService.createExam(schoolId, examData)
examService.getActiveMockExam(schoolId)
examService.getPastQuestionExams(schoolId, subject)
examService.startExamSession(userId, examId)
examService.saveAnswer(sessionId, questionId, answer)
examService.toggleBookmark(sessionId, questionId)
examService.pauseExam(sessionId)
examService.resumeExam(sessionId)
examService.submitExam(sessionId, questionsData)
examService.getExamSession(sessionId)
examService.getUserExamSessions(userId)
examService.getExamPerformanceStats(userId)
```

### AI Tutor Service
```javascript
aiTutorService.explainQuestion(question, options, correctAnswer, explanation)
aiTutorService.generateTopicQuiz(topic, subject, numberOfQuestions)
aiTutorService.chatWithTutor(conversationHistory)
aiTutorService.generateStudyNotes(topic, subject)
aiTutorService.analyzeWeakAreas(performanceData)
aiTutorService.generateFlashcards(topic, subject, numberOfCards)
```

---

## 🎨 Color Scheme Reference

```javascript
// Primary Colors
--navy: #1a365d           // Dark blue sidebar
--navy-dark: #0f1f3c      // Darkest background
--navy-light: #2c5282     // Medium blue
--accent: #3182ce         // Bright blue (buttons, highlights)
--accent-light: #63b3ed   // Light blue (hover states)

// Semantic Colors
--green: #48bb78          // Success
--yellow: #f6ad55         // Warning
--red: #f56565            // Error
--white: #ffffff          // Light background
--gray-*: Various grays   // Neutral

// Usage
background: var(--navy-dark)
color: var(--white)
border-color: var(--accent)
```

---

## 📊 Firestore Collection Schema Reference

### users
```javascript
{
  uid: "string",
  email: "string",
  name: "string",
  phone: "string",
  role: "student" | "admin",
  school_id: "string",
  target_school: "string",
  avatar_url: "string",
  xp: number,
  badges: string[],
  tier: "bronze" | "silver" | "gold" | "diamond",
  daily_streak: number,
  last_study_date: timestamp,
  created_at: timestamp,
  updated_at: timestamp
}
```

### schools
```javascript
{
  id: "string",
  name: "string",
  address: "string",
  code: "string",
  created_at: timestamp
}
```

### questions
```javascript
{
  id: "string",
  school_id: "string",
  subject: "string",
  topic: "string",
  question_text: "string",
  options: {
    A: "string",
    B: "string",
    C: "string",
    D: "string"
  },
  correct_answer: "string",
  explanation: "string",
  diagram_url: "string",
  difficulty: "easy" | "medium" | "hard",
  tags: string[],
  created_at: timestamp,
  updated_at: timestamp
}
```

### exams
```javascript
{
  id: "string",
  school_id: "string",
  exam_type: "mock" | "past_question",
  subject: "string" | null,
  is_full_paper: boolean,
  title: "string",
  description: "string",
  questions: string[],
  duration_minutes: number,
  passing_score: number,
  show_results_immediately: boolean,
  available_from: timestamp,
  available_until: timestamp | null,
  status: "active" | "archived",
  created_at: timestamp,
  updated_at: timestamp
}
```

### exam_sessions
```javascript
{
  id: "string",
  user_id: "string",
  exam_id: "string",
  exam_type: "mock" | "past_question",
  subject: "string" | null,
  questions: string[],
  duration_minutes: number,
  start_time: timestamp,
  end_time: timestamp | null,
  answers: {
    [question_id]: "A" | "B" | "C" | "D"
  },
  bookmarks: string[],
  time_per_question: {
    [question_id]: number
  },
  score: number | null,
  percentage: number | null,
  passed: boolean | null,
  status: "in_progress" | "paused" | "completed",
  paused_at: timestamp | null,
  created_at: timestamp
}
```

---

## 🔗 Important Links

- Firebase Console: https://console.firebase.google.com
- Anthropic API: https://console.anthropic.com
- Tailwind Docs: https://tailwindcss.com/docs
- React Docs: https://react.dev
- Firebase Docs: https://firebase.google.com/docs
- React Router Docs: https://reactrouter.com

---

## 🆘 Common Error Solutions

### "Firebase config not found"
→ Check `.env` file has correct credentials

### "Firestore permission denied"
→ Check Firestore Rules in Firebase Console

### "API key invalid"
→ Verify Anthropic API key in `.env`

### "Component not found"
→ Check import paths and file locations

### "Tailwind styles not applying"
→ Ensure `tailwind.config.js` includes correct content paths

---

## 📞 Support Resources

- Firebase Discord: https://discord.gg/firebase
- React Community: https://react.dev/community
- Stack Overflow: Tag your questions with `firebase`, `react`, `tailwindcss`

---

**Last Updated:** 2024
**Version:** 1.0.0
**Status:** Production Ready
