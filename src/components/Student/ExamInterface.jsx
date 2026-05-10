import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import examService from '../../services/examService';
import questionService from '../../services/questionService';
import { FiClock, FiChevronLeft, FiChevronRight, FiBookmark, FiFlag, FiPause, FiCheck } from 'react-icons/fi';

const ExamInterface = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Load session and questions
  useEffect(() => {
    const loadExamData = async () => {
      try {
        const sessionData = await examService.getExamSession(sessionId);
        setSession(sessionData);

        if (sessionData?.questions && sessionData.questions.length > 0) {
          const questionDocs = [];
          for (const qId of sessionData.questions) {
            // Fetch each question document
            // This would require a getQuestionById method
            questionDocs.push(qId);
          }
          // Placeholder - would need to fetch actual question data
          setQuestions([]);
        }

        // Calculate time left
        const startTime = sessionData.start_time?.toDate?.() || new Date(sessionData.start_time);
        const durationMs = sessionData.duration_minutes * 60 * 1000;
        const endTime = new Date(startTime.getTime() + durationMs);
        const now = new Date();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

        setTimeLeft(remaining);
      } catch (error) {
        console.error('Error loading exam:', error);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadExamData();
  }, [sessionId]);

  // Timer
  useEffect(() => {
    if (!session || isPaused || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, isPaused, timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = session?.answers?.[currentQuestion?.id] || '';

  const handleAnswerChange = async (answer) => {
    try {
      await examService.saveAnswer(sessionId, currentQuestion.id, answer);

      // Update local state
      const updatedSession = { ...session };
      updatedSession.answers = { ...session.answers, [currentQuestion.id]: answer };
      setSession(updatedSession);
    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const bookmarks = await examService.toggleBookmark(sessionId, currentQuestion.id);
      const updatedSession = { ...session };
      updatedSession.bookmarks = bookmarks;
      setSession(updatedSession);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handlePause = async () => {
    try {
      if (isPaused) {
        await examService.resumeExam(sessionId);
      } else {
        await examService.pauseExam(sessionId);
      }
      setIsPaused(!isPaused);
    } catch (error) {
      console.error('Error pausing exam:', error);
    }
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const results = await examService.submitExam(sessionId, questions);
      
      // Award XP
      const xpEarned = Math.round((results.percentage / 100) * 50);
      // TODO: Call authService.addXP(user.uid, xpEarned);

      navigate(`/exam-results/${sessionId}`, { state: { results } });
    } catch (error) {
      console.error('Error submitting exam:', error);
      setIsSubmitting(false);
    }
  };

  const isBookmarked = session?.bookmarks?.includes(currentQuestion?.id);
  const isAnswered = session?.answers?.[currentQuestion?.id];
  const answeredCount = Object.keys(session?.answers || {}).length;

  if (loadingQuestions) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-navy">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-navy dark:text-white">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy">
      {/* Header */}
      <div className="bg-white dark:bg-navy-dark border-b border-gray-200 dark:border-navy-light sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-navy dark:text-white">{session?.exam_type === 'mock' ? 'Daily Mock Exam' : 'Past Questions'}</h1>
            <p className="text-sm text-blue-600 dark:text-blue-300">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-2 text-lg font-bold ${timeLeft < 600 ? 'text-red-500' : 'text-blue-600'}`}>
            <FiClock />
            {formatTime(timeLeft || 0)}
          </div>

          {/* Pause Button */}
          <button
            onClick={handlePause}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
          >
            <FiPause className="w-4 h-4" />
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {currentQuestion && (
            <div className="bg-white dark:bg-navy-dark rounded-lg shadow-lg p-8 border border-gray-200 dark:border-navy-light">
              {/* Question */}
              <div className="mb-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-navy dark:text-white mb-4">
                      {currentQuestion.question_text}
                    </h2>

                    {/* Diagram if available */}
                    {currentQuestion.diagram_url && (
                      <img
                        src={currentQuestion.diagram_url}
                        alt="Question diagram"
                        className="max-w-md mb-6 rounded-lg border border-gray-300 dark:border-navy-light"
                      />
                    )}
                  </div>

                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-lg transition ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 dark:bg-navy-light dark:text-blue-300'}`}
                  >
                    <FiBookmark className="w-6 h-6" />
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <label
                      key={key}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        currentAnswer === key
                          ? 'border-accent bg-blue-50 dark:bg-navy-light'
                          : 'border-gray-300 dark:border-navy-light hover:border-accent'
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={key}
                        checked={currentAnswer === key}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="w-5 h-5 accent-accent"
                      />
                      <span className="ml-4 font-semibold text-navy dark:text-white">{key}.</span>
                      <span className="ml-2 text-navy dark:text-white">{value}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-navy-light">
                <button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-navy-light text-navy dark:text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-navy transition"
                >
                  <FiChevronLeft /> Previous
                </button>

                <span className="text-sm font-semibold text-blue-600 dark:text-blue-300">
                  Answered: {answeredCount}/{questions.length}
                </span>

                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Next <FiChevronRight />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck /> Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Question Navigator */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-navy-dark rounded-lg shadow-lg p-6 border border-gray-200 dark:border-navy-light sticky top-24">
            <h3 className="font-bold text-navy dark:text-white mb-4">Questions Overview</h3>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-lg font-semibold transition flex items-center justify-center text-sm ${
                    idx === currentQuestionIndex
                      ? 'bg-accent text-white'
                      : session?.answers?.[q.id]
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-navy dark:bg-navy-light dark:text-blue-300'
                  }`}
                  title={`Question ${idx + 1}${session?.bookmarks?.includes(q.id) ? ' (Bookmarked)' : ''}`}
                >
                  {session?.bookmarks?.includes(q.id) ? '🔖' : idx + 1}
                </button>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-navy-light rounded-lg p-3 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="text-navy dark:text-white">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-navy dark:text-white">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full" />
                <span className="text-navy dark:text-white">Not answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
