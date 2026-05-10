import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  writeBatch,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

class ExamService {
  // Create exam (daily mock or past questions)
  async createExam(schoolId, examData) {
    try {
      const examsRef = collection(db, 'exams');
      
      const docRef = await addDoc(examsRef, {
        school_id: schoolId,
        exam_type: examData.exam_type, // 'mock' or 'past_question'
        subject: examData.subject || null,
        is_full_paper: examData.is_full_paper || false, // For past questions
        title: examData.title,
        description: examData.description || '',
        questions: examData.questions || [], // Array of question IDs
        duration_minutes: examData.duration_minutes || 180,
        passing_score: examData.passing_score || 50,
        show_results_immediately: examData.show_results_immediately !== false,
        available_from: examData.available_from || new Date(),
        available_until: examData.available_until || null,
        status: 'active',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to create exam: ${error.message}`);
    }
  }

  // Get active mock exam
  async getActiveMockExam(schoolId) {
    try {
      const q = query(
        collection(db, 'exams'),
        where('school_id', '==', schoolId),
        where('exam_type', '==', 'mock'),
        where('status', '==', 'active')
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get past question exams
  async getPastQuestionExams(schoolId, subject = null) {
    try {
      let q;
      
      if (subject) {
        q = query(
          collection(db, 'exams'),
          where('school_id', '==', schoolId),
          where('exam_type', '==', 'past_question'),
          where('subject', '==', subject),
          where('status', '==', 'active'),
          orderBy('created_at', 'desc')
        );
      } else {
        q = query(
          collection(db, 'exams'),
          where('school_id', '==', schoolId),
          where('exam_type', '==', 'past_question'),
          where('status', '==', 'active'),
          orderBy('created_at', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      const exams = [];
      
      querySnapshot.forEach((doc) => {
        exams.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return exams;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Start exam session
  async startExamSession(userId, examId) {
    try {
      const examDocRef = doc(db, 'exams', examId);
      const examDoc = await getDoc(examDocRef);
      
      if (!examDoc.exists()) {
        throw new Error('Exam not found');
      }

      const exam = examDoc.data();
      
      const sessionsRef = collection(db, 'exam_sessions');
      
      const docRef = await addDoc(sessionsRef, {
        user_id: userId,
        exam_id: examId,
        exam_type: exam.exam_type,
        subject: exam.subject,
        questions: exam.questions,
        duration_minutes: exam.duration_minutes,
        start_time: serverTimestamp(),
        end_time: null,
        answers: {},
        bookmarks: [],
        time_per_question: {},
        score: null,
        percentage: null,
        status: 'in_progress',
        paused_at: null,
        created_at: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Save exam answer
  async saveAnswer(sessionId, questionId, answer) {
    try {
      const sessionRef = doc(db, 'exam_sessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }

      const answers = sessionDoc.data().answers || {};
      answers[questionId] = answer;

      await updateDoc(sessionRef, {
        answers: answers,
      });

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Bookmark question
  async toggleBookmark(sessionId, questionId) {
    try {
      const sessionRef = doc(db, 'exam_sessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      const bookmarks = sessionDoc.data().bookmarks || [];
      const index = bookmarks.indexOf(questionId);
      
      if (index > -1) {
        bookmarks.splice(index, 1);
      } else {
        bookmarks.push(questionId);
      }

      await updateDoc(sessionRef, {
        bookmarks: bookmarks,
      });

      return bookmarks;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Track time per question
  async updateTimePerQuestion(sessionId, questionId, seconds) {
    try {
      const sessionRef = doc(db, 'exam_sessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      const timePerQuestion = sessionDoc.data().time_per_question || {};
      timePerQuestion[questionId] = seconds;

      await updateDoc(sessionRef, {
        time_per_question: timePerQuestion,
      });
    } catch (error) {
      console.error('Error updating time per question:', error);
    }
  }

  // Pause exam
  async pauseExam(sessionId) {
    try {
      await updateDoc(doc(db, 'exam_sessions', sessionId), {
        status: 'paused',
        paused_at: serverTimestamp(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Resume exam
  async resumeExam(sessionId) {
    try {
      await updateDoc(doc(db, 'exam_sessions', sessionId), {
        status: 'in_progress',
        paused_at: null,
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Submit exam and calculate score
  async submitExam(sessionId, questionsData) {
    try {
      const sessionRef = doc(db, 'exam_sessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        throw new Error('Session not found');
      }

      const sessionData = sessionDoc.data();
      const answers = sessionData.answers || {};
      
      let correctCount = 0;
      const detailedResults = [];

      sessionData.questions.forEach((questionId) => {
        const question = questionsData.find(q => q.id === questionId);
        const userAnswer = answers[questionId];
        
        if (question) {
          const isCorrect = userAnswer === question.correct_answer;
          if (isCorrect) correctCount++;

          detailedResults.push({
            question_id: questionId,
            question_text: question.question_text,
            user_answer: userAnswer,
            correct_answer: question.correct_answer,
            is_correct: isCorrect,
            explanation: question.explanation,
            diagram_url: question.diagram_url,
          });
        }
      });

      const percentage = Math.round((correctCount / sessionData.questions.length) * 100);
      const passed = percentage >= 50;

      await updateDoc(sessionRef, {
        end_time: serverTimestamp(),
        score: correctCount,
        total_questions: sessionData.questions.length,
        percentage: percentage,
        passed: passed,
        detailed_results: detailedResults,
        status: 'completed',
      });

      return {
        score: correctCount,
        total: sessionData.questions.length,
        percentage: percentage,
        passed: passed,
        results: detailedResults,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get exam session
  async getExamSession(sessionId) {
    try {
      const docRef = doc(db, 'exam_sessions', sessionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        };
      }
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get user exam sessions
  async getUserExamSessions(userId) {
    try {
      const q = query(
        collection(db, 'exam_sessions'),
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const sessions = [];
      
      querySnapshot.forEach((doc) => {
        sessions.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return sessions;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get exam performance stats
  async getExamPerformanceStats(userId) {
    try {
      const sessions = await this.getUserExamSessions(userId);
      const completedSessions = sessions.filter(s => s.status === 'completed');

      if (completedSessions.length === 0) {
        return {
          total_exams: 0,
          average_score: 0,
          pass_count: 0,
          fail_count: 0,
          average_time_minutes: 0,
        };
      }

      const totalScore = completedSessions.reduce((sum, s) => sum + (s.percentage || 0), 0);
      const passCount = completedSessions.filter(s => s.passed).length;
      const failCount = completedSessions.filter(s => !s.passed).length;

      return {
        total_exams: completedSessions.length,
        average_score: Math.round(totalScore / completedSessions.length),
        pass_count: passCount,
        fail_count: failCount,
        pass_rate: Math.round((passCount / completedSessions.length) * 100),
        sessions: completedSessions,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new ExamService();
