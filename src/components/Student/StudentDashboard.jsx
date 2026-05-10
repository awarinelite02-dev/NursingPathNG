import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import examService from '../../services/examService';
import { FiLogOut, FiMoon, FiSun, FiClock, FiBook, FiTrendingUp, FiUsers, FiMessageSquare, FiBell } from 'react-icons/fi';

const StudentDashboard = () => {
  const { user, userData, signOut, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeMockExam, setActiveMockExam] = useState(null);
  const [stats, setStats] = useState(null);
  const [timeUntilMock, setTimeUntilMock] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, userData]);

  const fetchDashboardData = async () => {
    try {
      if (userData?.school_id) {
        const mockExam = await examService.getActiveMockExam(userData.school_id);
        setActiveMockExam(mockExam);
      }

      const performance = await examService.getExamPerformanceStats(user.uid);
      setStats(performance);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-navy">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white dark:bg-navy text-navy dark:text-white">
      {/* Sidebar */}
      <div className="w-64 bg-navy dark:bg-navy-dark border-r border-blue-200 dark:border-navy-light p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg" />
            Nursing CBT
          </h1>
        </div>

        {/* User Card */}
        <div className="bg-navy-light rounded-lg p-4 mb-8">
          <div className="w-12 h-12 bg-accent rounded-full mb-3" />
          <p className="font-semibold text-white text-sm">{userData.name}</p>
          <p className="text-blue-300 text-xs">Student • Tier: {userData.tier}</p>
          <p className="text-yellow-300 text-xs mt-1">⭐ {userData.xp} XP</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {[
            { icon: FiClock, label: 'Mock Exam', path: '/mock' },
            { icon: FiBook, label: 'Past Questions', path: '/past-questions' },
            { icon: FiTrendingUp, label: 'Performance', path: '/performance' },
            { icon: FiUsers, label: 'Leaderboard', path: '/leaderboard' },
            { icon: FiMessageSquare, label: 'AI Tutor', path: '/ai-tutor' },
            { icon: FiBell, label: 'Notifications', path: '/notifications' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-navy-light transition text-blue-100 hover:text-white"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-navy-light pt-4">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-navy-light transition text-blue-100"
          >
            {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            <span className="text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-600/20 transition text-red-300"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">Welcome back, {userData.name}! 👋</h2>
            <p className="text-blue-600 dark:text-blue-300">You're on a {userData.daily_streak} day study streak 🔥</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-navy-light dark:to-navy rounded-lg p-6 border border-blue-200 dark:border-navy-light">
              <div className="text-3xl font-bold text-navy dark:text-accent mb-2">{stats?.total_exams || 0}</div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Exams Completed</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-navy-light dark:to-navy rounded-lg p-6 border border-green-200 dark:border-navy-light">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{stats?.average_score || 0}%</div>
              <p className="text-sm text-green-700 dark:text-green-300">Average Score</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-navy-light dark:to-navy rounded-lg p-6 border border-purple-200 dark:border-navy-light">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stats?.pass_rate || 0}%</div>
              <p className="text-sm text-purple-700 dark:text-purple-300">Pass Rate</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-navy-light dark:to-navy rounded-lg p-6 border border-yellow-200 dark:border-navy-light">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{userData.xp}</div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Total XP Points</p>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Mock Exam */}
            <div className="bg-gradient-to-br from-accent/10 to-blue-100/50 dark:from-navy-light dark:to-navy rounded-2xl p-8 border border-accent/30 dark:border-navy-light">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Daily Mock Exam</h3>
              </div>
              {activeMockExam ? (
                <>
                  <p className="text-blue-600 dark:text-blue-300 mb-4">{activeMockExam.title}</p>
                  <div className="text-sm text-blue-500 dark:text-blue-400 mb-4">⏱️ 24 hours countdown active</div>
                  <button
                    onClick={() => navigate('/mock')}
                    className="w-full bg-accent hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Start Exam
                  </button>
                </>
              ) : (
                <p className="text-blue-600 dark:text-blue-300">No active mock exam at the moment. Check back soon!</p>
              )}
            </div>

            {/* Study Plan */}
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-navy-light dark:to-navy rounded-2xl p-8 border border-green-300/50 dark:border-navy-light">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <FiBook className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Study Resources</h3>
              </div>
              <p className="text-green-700 dark:text-green-300 mb-4">Access past questions and AI tutoring</p>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/past-questions')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Past Questions
                </button>
                <button
                  onClick={() => navigate('/ai-tutor')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
                >
                  Ask AI Tutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
