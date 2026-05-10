import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FiLogOut, FiMoon, FiSun, FiPlus, FiUpload, FiBarChart3, FiCalendar } from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, userData, signOut, isAdmin } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalQuestions: 0,
    totalStudents: 0,
    totalExams: 0,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
  }, [isAdmin, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'schools', label: 'Schools', icon: FiPlus },
    { id: 'questions', label: 'Questions', icon: FiUpload },
    { id: 'exams', label: 'Exams', icon: FiCalendar },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart3 },
  ];

  return (
    <div className="flex h-screen bg-white dark:bg-navy text-navy dark:text-white">
      {/* Sidebar */}
      <div className="w-64 bg-navy dark:bg-navy-dark border-r border-blue-200 dark:border-navy-light p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg" />
            Admin Panel
          </h1>
        </div>

        {/* Admin Info */}
        <div className="bg-navy-light rounded-lg p-4 mb-8">
          <p className="font-semibold text-white text-sm">{userData?.name}</p>
          <p className="text-blue-300 text-xs">Administrator</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-accent text-white'
                    : 'hover:bg-navy-light text-blue-100 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
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
      <div className="flex-1 overflow-auto bg-gray-50 dark:bg-navy-dark">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">Admin Dashboard</h2>
            <p className="text-blue-600 dark:text-blue-300">Manage schools, questions, and exams</p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-navy-light rounded-lg p-6 border border-gray-200 dark:border-navy-light shadow-sm">
                  <div className="text-3xl font-bold text-navy dark:text-accent mb-2">{stats.totalSchools}</div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Schools</p>
                </div>
                <div className="bg-white dark:bg-navy-light rounded-lg p-6 border border-gray-200 dark:border-navy-light shadow-sm">
                  <div className="text-3xl font-bold text-navy dark:text-accent mb-2">{stats.totalQuestions}</div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Questions</p>
                </div>
                <div className="bg-white dark:bg-navy-light rounded-lg p-6 border border-gray-200 dark:border-navy-light shadow-sm">
                  <div className="text-3xl font-bold text-navy dark:text-accent mb-2">{stats.totalStudents}</div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Students</p>
                </div>
                <div className="bg-white dark:bg-navy-light rounded-lg p-6 border border-gray-200 dark:border-navy-light shadow-sm">
                  <div className="text-3xl font-bold text-navy dark:text-accent mb-2">{stats.totalExams}</div>
                  <p className="text-sm text-blue-600 dark:text-blue-300">Active Exams</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-navy-light rounded-lg p-8 border border-gray-200 dark:border-navy-light shadow-sm mb-8">
                <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab('schools')}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent to-blue-600 hover:from-blue-600 hover:to-accent text-white rounded-lg font-semibold transition"
                  >
                    <FiPlus className="w-5 h-5" />
                    Add School
                  </button>
                  <button
                    onClick={() => setActiveTab('questions')}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white rounded-lg font-semibold transition"
                  >
                    <FiUpload className="w-5 h-5" />
                    Upload Questions
                  </button>
                  <button
                    onClick={() => setActiveTab('exams')}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white rounded-lg font-semibold transition"
                  >
                    <FiCalendar className="w-5 h-5" />
                    Create Exam
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-500 text-white rounded-lg font-semibold transition"
                  >
                    <FiBarChart3 className="w-5 h-5" />
                    View Analytics
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-navy-light rounded-lg p-8 border border-gray-200 dark:border-navy-light shadow-sm">
                <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: 'New student registered', school: 'LUTH', time: '2 hours ago' },
                    { action: 'Questions uploaded', school: 'LASUTH', time: '5 hours ago' },
                    { action: 'Mock exam completed', school: 'UNILOH', time: '1 day ago' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-navy rounded-lg">
                      <div>
                        <p className="font-semibold">{activity.action}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-300">{activity.school}</p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-blue-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Other Tabs - Placeholder */}
          {activeTab !== 'overview' && (
            <div className="bg-white dark:bg-navy-light rounded-lg p-8 border border-gray-200 dark:border-navy-light shadow-sm text-center">
              <p className="text-xl font-semibold text-blue-600 dark:text-blue-300">
                {tabs.find((t) => t.id === activeTab)?.label} Management
              </p>
              <p className="text-gray-600 dark:text-blue-400 mt-2">
                Component for {activeTab} management coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
