import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  writeBatch,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';

class QuestionService {
  // Add single question
  async addQuestion(schoolId, questionData) {
    try {
      const questionsRef = collection(db, 'questions');
      
      const docRef = await addDoc(questionsRef, {
        school_id: schoolId,
        subject: questionData.subject,
        topic: questionData.topic,
        question_text: questionData.question_text,
        options: {
          A: questionData.optionA,
          B: questionData.optionB,
          C: questionData.optionC,
          D: questionData.optionD,
        },
        correct_answer: questionData.correct_answer.toUpperCase(),
        explanation: questionData.explanation,
        diagram_url: questionData.diagram_url || '',
        difficulty: questionData.difficulty || 'medium',
        tags: questionData.tags || [],
        created_at: new Date(),
        updated_at: new Date(),
      });

      return docRef.id;
    } catch (error) {
      throw new Error(`Failed to add question: ${error.message}`);
    }
  }

  // Bulk add questions with parsing
  async bulkAddQuestions(schoolId, questionsData) {
    try {
      const batch = writeBatch(db);
      const questionsRef = collection(db, 'questions');
      const addedIds = [];

      questionsData.forEach((questionData) => {
        const docRef = doc(questionsRef);
        batch.set(docRef, {
          school_id: schoolId,
          subject: questionData.subject || '',
          topic: questionData.topic || '',
          question_text: questionData.question_text,
          options: {
            A: questionData.optionA || questionData.options?.A || '',
            B: questionData.optionB || questionData.options?.B || '',
            C: questionData.optionC || questionData.options?.C || '',
            D: questionData.optionD || questionData.options?.D || '',
          },
          correct_answer: (questionData.correct_answer || questionData.answer || '').toUpperCase(),
          explanation: questionData.explanation || '',
          diagram_url: questionData.diagram_url || '',
          difficulty: questionData.difficulty || 'medium',
          tags: questionData.tags || [],
          created_at: new Date(),
          updated_at: new Date(),
        });
        addedIds.push(docRef.id);
      });

      await batch.commit();
      return addedIds;
    } catch (error) {
      throw new Error(`Failed to bulk add questions: ${error.message}`);
    }
  }

  // Parse CSV or Excel data
  async parseQuestionsFromCSV(csvText) {
    try {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      const questions = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length < 7) continue; // Skip incomplete rows

        const question = {};
        headers.forEach((header, idx) => {
          if (header.includes('question')) question.question_text = values[idx];
          else if (header.includes('subject')) question.subject = values[idx];
          else if (header.includes('topic')) question.topic = values[idx];
          else if (header === 'a' || header.includes('option a')) question.optionA = values[idx];
          else if (header === 'b' || header.includes('option b')) question.optionB = values[idx];
          else if (header === 'c' || header.includes('option c')) question.optionC = values[idx];
          else if (header === 'd' || header.includes('option d')) question.optionD = values[idx];
          else if (header.includes('answer') && !header.includes('explanation')) question.correct_answer = values[idx];
          else if (header.includes('explanation')) question.explanation = values[idx];
          else if (header.includes('difficulty')) question.difficulty = values[idx];
          else if (header.includes('diagram')) question.diagram_url = values[idx];
        });

        if (question.question_text) {
          questions.push(question);
        }
      }

      return questions;
    } catch (error) {
      throw new Error(`Failed to parse CSV: ${error.message}`);
    }
  }

  // Get questions by subject
  async getQuestionsBySubject(schoolId, subject) {
    try {
      const q = query(
        collection(db, 'questions'),
        where('school_id', '==', schoolId),
        where('subject', '==', subject)
      );
      
      const querySnapshot = await getDocs(q);
      const questions = [];
      
      querySnapshot.forEach((doc) => {
        questions.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return questions;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get questions by topic
  async getQuestionsByTopic(schoolId, subject, topic) {
    try {
      const q = query(
        collection(db, 'questions'),
        where('school_id', '==', schoolId),
        where('subject', '==', subject),
        where('topic', '==', topic)
      );
      
      const querySnapshot = await getDocs(q);
      const questions = [];
      
      querySnapshot.forEach((doc) => {
        questions.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return questions;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all questions for school
  async getAllQuestions(schoolId) {
    try {
      const q = query(
        collection(db, 'questions'),
        where('school_id', '==', schoolId),
        orderBy('created_at', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const questions = [];
      
      querySnapshot.forEach((doc) => {
        questions.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return questions;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Update question
  async updateQuestion(questionId, updateData) {
    try {
      const docRef = doc(db, 'questions', questionId);
      await updateDoc(docRef, {
        ...updateData,
        updated_at: new Date(),
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Delete question
  async deleteQuestion(questionId) {
    try {
      await deleteDoc(doc(db, 'questions', questionId));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get question difficulty stats
  async getDifficultyStats(schoolId) {
    try {
      const questions = await this.getAllQuestions(schoolId);
      
      const stats = {
        easy: 0,
        medium: 0,
        hard: 0,
      };

      questions.forEach((q) => {
        const difficulty = q.difficulty || 'medium';
        if (difficulty in stats) {
          stats[difficulty]++;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all subjects
  async getSubjects(schoolId) {
    try {
      const questions = await this.getAllQuestions(schoolId);
      const subjects = new Set();
      
      questions.forEach((q) => {
        if (q.subject) {
          subjects.add(q.subject);
        }
      });

      return Array.from(subjects).sort();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  // Get all topics for subject
  async getTopics(schoolId, subject) {
    try {
      const questions = await this.getQuestionsBySubject(schoolId, subject);
      const topics = new Set();
      
      questions.forEach((q) => {
        if (q.topic) {
          topics.add(q.topic);
        }
      });

      return Array.from(topics).sort();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new QuestionService();
