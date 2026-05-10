// Gamification utilities

export const XP_REWARDS = {
  CORRECT_ANSWER: 10,
  EXAM_COMPLETION: 50,
  DAILY_STREAK: 25,
  PERFECT_SCORE: 100,
  FIRST_ATTEMPT_PASS: 75,
};

export const BADGES = {
  FIRST_EXAM: {
    id: 'first_exam',
    name: 'First Step',
    description: 'Completed your first exam',
    icon: '🎯',
  },
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Flawless',
    description: 'Scored 100% on an exam',
    icon: '⭐',
  },
  SEVEN_DAY_STREAK: {
    id: 'seven_day_streak',
    name: 'On Fire 🔥',
    description: '7 day study streak',
    icon: '🔥',
  },
  THIRTY_DAY_STREAK: {
    id: 'thirty_day_streak',
    name: 'Legend',
    description: '30 day study streak',
    icon: '👑',
  },
  EXAM_CHAMPION: {
    id: 'exam_champion',
    name: 'Champion',
    description: 'Ranked #1 in school leaderboard',
    icon: '🏆',
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Completed exam in under 30 mins',
    icon: '⚡',
  },
};

export const TIERS = {
  bronze: { name: 'Bronze', xpRange: [0, 500], color: '#CD7F32' },
  silver: { name: 'Silver', xpRange: [500, 1500], color: '#C0C0C0' },
  gold: { name: 'Gold', xpRange: [1500, 3500], color: '#FFD700' },
  diamond: { name: 'Diamond', xpRange: [3500, Infinity], color: '#B9F3FC' },
};

/**
 * Calculate XP for exam performance
 */
export const calculateExamXP = (totalQuestions, correctAnswers, timeSpentSeconds) => {
  const correctPercentage = (correctAnswers / totalQuestions) * 100;
  
  // Base XP for answering correctly
  let xp = correctAnswers * XP_REWARDS.CORRECT_ANSWER;
  
  // Bonus for completing exam
  xp += XP_REWARDS.EXAM_COMPLETION;
  
  // Bonus for perfect score
  if (correctPercentage === 100) {
    xp += XP_REWARDS.PERFECT_SCORE;
  }
  
  // Bonus for passing on first attempt
  if (correctPercentage >= 50) {
    xp += XP_REWARDS.FIRST_ATTEMPT_PASS;
  }
  
  // Speed bonus (less time = more bonus, cap at 30 mins)
  const speedBonusMinutes = Math.max(0, 30 - Math.floor(timeSpentSeconds / 60));
  xp += speedBonusMinutes * 2;
  
  return Math.round(xp);
};

/**
 * Check if user qualifies for badges
 */
export const checkBadgeQualification = (userData, examData) => {
  const newBadges = [];
  
  // First exam
  if (!userData.badges?.includes('first_exam')) {
    newBadges.push(BADGES.FIRST_EXAM);
  }
  
  // Perfect score
  if (examData.percentage === 100 && !userData.badges?.includes('perfect_score')) {
    newBadges.push(BADGES.PERFECT_SCORE);
  }
  
  // Streak badges
  if (userData.daily_streak === 7 && !userData.badges?.includes('seven_day_streak')) {
    newBadges.push(BADGES.SEVEN_DAY_STREAK);
  }
  
  if (userData.daily_streak === 30 && !userData.badges?.includes('thirty_day_streak')) {
    newBadges.push(BADGES.THIRTY_DAY_STREAK);
  }
  
  return newBadges;
};

/**
 * Get tier based on XP
 */
export const getTierByXP = (xp) => {
  if (xp >= 3500) return 'diamond';
  if (xp >= 1500) return 'gold';
  if (xp >= 500) return 'silver';
  return 'bronze';
};

/**
 * Parse CSV text to questions array
 */
export const parseCSVToQuestions = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const questions = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    if (values.length < 7) continue;

    const question = {};
    
    headers.forEach((header, idx) => {
      if (header.includes('question')) question.question_text = values[idx];
      else if (header.includes('subject')) question.subject = values[idx];
      else if (header.includes('topic')) question.topic = values[idx];
      else if (header === 'a') question.optionA = values[idx];
      else if (header === 'b') question.optionB = values[idx];
      else if (header === 'c') question.optionC = values[idx];
      else if (header === 'd') question.optionD = values[idx];
      else if (header.includes('answer')) question.correct_answer = values[idx];
      else if (header.includes('explanation')) question.explanation = values[idx];
      else if (header.includes('difficulty')) question.difficulty = values[idx];
      else if (header.includes('diagram')) question.diagram_url = values[idx];
    });

    if (question.question_text) {
      questions.push(question);
    }
  }

  return questions;
};

/**
 * Validate question object
 */
export const validateQuestion = (question) => {
  const errors = [];

  if (!question.question_text) errors.push('Question text is required');
  if (!question.optionA) errors.push('Option A is required');
  if (!question.optionB) errors.push('Option B is required');
  if (!question.optionC) errors.push('Option C is required');
  if (!question.optionD) errors.push('Option D is required');
  if (!question.correct_answer) errors.push('Correct answer is required');
  if (!['A', 'B', 'C', 'D'].includes(question.correct_answer?.toUpperCase())) {
    errors.push('Correct answer must be A, B, C, or D');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

/**
 * Format time for display
 */
export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
};

/**
 * Calculate time remaining until deadline
 */
export const getTimeRemaining = (deadline) => {
  const now = new Date();
  const end = new Date(deadline);
  const remaining = Math.max(0, Math.floor((end - now) / 1000));

  return {
    total: remaining,
    hours: Math.floor(remaining / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
    formatted: formatTime(remaining),
    isExpired: remaining === 0,
  };
};

/**
 * Get performance color
 */
export const getPerformanceColor = (percentage) => {
  if (percentage >= 80) return 'green'; // Excellent
  if (percentage >= 60) return 'blue'; // Good
  if (percentage >= 40) return 'yellow'; // Fair
  return 'red'; // Poor
};

/**
 * Get performance text
 */
export const getPerformanceText = (percentage) => {
  if (percentage >= 80) return 'Excellent! 🎉';
  if (percentage >= 60) return 'Good job! 👍';
  if (percentage >= 40) return 'Keep trying! 💪';
  return 'Need more practice 📚';
};

/**
 * Generate study recommendation
 */
export const getStudyRecommendation = (weakAreas) => {
  if (!weakAreas || weakAreas.length === 0) {
    return 'You\'re doing great! Keep up the good work! 🌟';
  }

  const topWeak = weakAreas[0];
  return `Focus on improving ${topWeak.topic} in ${topWeak.subject}. You can do it! 💪`;
};
