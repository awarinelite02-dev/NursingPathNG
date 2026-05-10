import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import examService from '../../services/examService';

const BG = '#0d1f2d';
const CARD = '#132233';
const CARD2 = '#1a2e40';
const BORDER = '#1e3a50';
const TEAL = '#2dd4bf';
const TEXT = '#f0f9ff';
const MUTED = '#94a3b8';

const s = {
  page: { minHeight:'100vh', backgroundColor:BG, fontFamily:"'Poppins',sans-serif", color:TEXT },
  topBar: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.2rem', backgroundColor:CARD, borderBottom:`1px solid ${BORDER}`, position:'sticky', top:0, zIndex:10 },
  logo: { display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'1.4rem', fontWeight:900, color:TEAL },
  userBadge: { display:'flex', alignItems:'center', gap:'0.6rem', backgroundColor:CARD2, border:`1px solid ${BORDER}`, borderRadius:30, padding:'0.4rem 0.9rem' },
  userName: { fontSize:'1rem', fontWeight:800, color:TEXT },
  userRole: { fontSize:'0.75rem', color:MUTED, fontWeight:600 },
  body: { padding:'1rem' },
  // Hero banner
  heroBanner: { background:'linear-gradient(135deg,#1e4d6b 0%,#0d3352 60%,#132233 100%)', borderRadius:16, padding:'1.2rem', marginBottom:'1rem', border:`1px solid ${BORDER}`, position:'relative', overflow:'hidden' },
  heroLabel: { fontSize:'0.75rem', fontWeight:800, color:TEAL, letterSpacing:'0.1em', marginBottom:'0.3rem' },
  heroTitle: { fontSize:'1.5rem', fontWeight:900, color:TEXT, marginBottom:'0.2rem' },
  heroSub: { fontSize:'0.9rem', color:MUTED, fontWeight:600, marginBottom:'1rem' },
  heroPremium: { display:'inline-flex', alignItems:'center', gap:'0.4rem', backgroundColor:'rgba(45,212,191,0.15)', border:`1px solid ${TEAL}`, borderRadius:20, padding:'0.25rem 0.75rem', fontSize:'0.8rem', fontWeight:700, color:TEAL, marginBottom:'1rem' },
  mockCard: { backgroundColor:'rgba(255,255,255,0.07)', borderRadius:12, padding:'0.8rem 1rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.8rem', border:`1px solid ${BORDER}` },
  mockIcon: { width:40, height:40, borderRadius:10, backgroundColor:'#1e4d6b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 },
  mockTitle: { fontSize:'0.95rem', fontWeight:800, color:TEXT },
  mockSub: { fontSize:'0.8rem', color:MUTED, fontWeight:600 },
  heroButtons: { display:'flex', gap:'0.75rem' },
  startBtn: { flex:1, padding:'0.8rem', backgroundColor:TEAL, color:'#0d1f2d', border:'none', borderRadius:10, fontSize:'1rem', fontWeight:900, cursor:'pointer' },
  continueBtn: { flex:1, padding:'0.8rem', backgroundColor:'rgba(255,255,255,0.08)', color:TEXT, border:`1px solid ${BORDER}`, borderRadius:10, fontSize:'1rem', fontWeight:800, cursor:'pointer' },
  // Stats row
  statsRow: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.75rem', marginBottom:'1rem' },
  statCard: { backgroundColor:CARD, borderRadius:14, padding:'1rem', border:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:'0.8rem' },
  statIcon: { width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 },
  statNum: { fontSize:'1.6rem', fontWeight:900, color:TEXT, lineHeight:1 },
  statLabel: { fontSize:'0.75rem', color:MUTED, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 },
  // Section
  sectionTitle: { fontSize:'1.2rem', fontWeight:900, color:TEXT, marginBottom:'0.75rem', marginTop:'1.2rem' },
  // Quick actions grid
  actionsGrid: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.75rem', marginBottom:'1rem' },
  actionCard: { backgroundColor:CARD, borderRadius:14, padding:'1rem', border:`1px solid ${BORDER}`, cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem' },
  actionIcon: { width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:'0.2rem' },
  actionTitle: { fontSize:'0.95rem', fontWeight:800, color:TEXT },
  actionSub: { fontSize:'0.75rem', color:MUTED, fontWeight:600 },
  // Category cards
  catCard: { backgroundColor:CARD, borderRadius:14, padding:'1rem', border:`1px solid ${BORDER}`, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.9rem', marginBottom:'0.75rem' },
  catIcon: { width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 },
  catTitle: { fontSize:'1rem', fontWeight:800, color:TEXT },
  catSub: { fontSize:'0.8rem', color:MUTED, fontWeight:600 },
  // Bottom nav
  bottomNav: { position:'fixed', bottom:0, left:0, right:0, backgroundColor:CARD, borderTop:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-around', padding:'0.6rem 0', zIndex:10 },
  navBtn: { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem', background:'none', border:'none', cursor:'pointer', padding:'0.3rem 0.8rem' },
  navIcon: { fontSize:22 },
  navLabel: { fontSize:'0.65rem', fontWeight:700, color:MUTED },
};

const quickActions = [
  { icon:'⚡', bg:'#1e3a1e', label:'Daily Practice', sub:'Take daily exam', path:'/daily' },
  { icon:'📖', bg:'#1e1e3a', label:'Course Drill', sub:'Exam by courses', path:'/courses' },
  { icon:'🎯', bg:'#3a1e1e', label:'Topic Drill', sub:'Exam by topics', path:'/topics' },
  { icon:'🏥', bg:'#1e3a2e', label:'Mock Exams', sub:'Hospital Final exam', path:'/mock' },
  { icon:'📚', bg:'#2e1e3a', label:'Past Questions', sub:'NMCN past questions', path:'/past-questions' },
  { icon:'🔖', bg:'#3a2e1e', label:'Bookmarks', sub:'Review bookmarked', path:'/bookmarks' },
];

const categories = [
  { icon:'🏥', bg:'#1e3a50', label:'General Nursing', sub:'Basic RN' },
  { icon:'👶', bg:'#2e1e3a', label:'Midwifery', sub:'Post Basic' },
  { icon:'🧠', bg:'#1e3a2e', label:'Psychiatric Nursing', sub:'Mental Health' },
  { icon:'🩺', bg:'#3a1e1e', label:'Community Health', sub:'Public Health' },
  { icon:'💊', bg:'#3a2e1e', label:'Pharmacology', sub:'Drug & Dosage' },
];

const StudentDashboard = () => {
  const { user, userData, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeMockExam, setActiveMockExam] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const perf = await examService.getExamPerformanceStats(user.uid);
        setStats(perf);
        if (userData?.school_id) {
          const mock = await examService.getActiveMockExam(userData.school_id);
          setActiveMockExam(mock);
        }
      } catch (e) {}
    };
    if (user) load();
  }, [user, userData]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={s.page}>
      {/* Top Bar */}
      <div style={s.topBar}>
        <div style={s.logo}>📚 NMCNCBT</div>
        <div style={s.userBadge}>
          <div style={{ fontSize:22 }}>👤</div>
          <div>
            <div style={s.userName}>{userData?.name?.split(' ')[0] || 'Student'}</div>
            <div style={s.userRole}>⭐ Admin</div>
          </div>
        </div>
      </div>

      <div style={{ ...s.body, paddingBottom:'5rem' }}>
        {/* Hero Banner */}
        <div style={s.heroBanner}>
          <div style={s.heroLabel}>🏥 NMCN CBT PLATFORM</div>
          <div style={s.heroTitle}>{greeting}, {userData?.name?.split(' ')[0]}! 👋</div>
          <div style={s.heroPremium}>⭐ Premium subscriber — all content unlocked</div>

          <div style={s.mockCard}>
            <div style={s.mockIcon}>🏥</div>
            <div>
              <div style={s.mockTitle}>Mock Exams</div>
              <div style={s.mockSub}>Simulate a real hospital final exam under timed conditions. Tests your full readiness.</div>
            </div>
          </div>

          <div style={s.heroButtons}>
            <button style={s.startBtn} onClick={() => navigate('/mock')}>▶ Start Exam</button>
            <button style={s.continueBtn} onClick={() => navigate('/mock')}>⏸ Continue 4</button>
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <div style={{ ...s.statIcon, backgroundColor:'#1e3a50' }}>📝</div>
            <div>
              <div style={s.statNum}>{stats?.total_exams || 0}</div>
              <div style={s.statLabel}>Exams Taken</div>
            </div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statIcon, backgroundColor:'#1e3a1e' }}>📊</div>
            <div>
              <div style={{ ...s.statNum, color:'#34d399' }}>{stats?.average_score || 0}%</div>
              <div style={s.statLabel}>Avg. Score</div>
            </div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statIcon, backgroundColor:'#3a1e1e' }}>🔥</div>
            <div>
              <div style={{ ...s.statNum, color:'#fb923c' }}>{userData?.daily_streak || 0}</div>
              <div style={s.statLabel}>Day Streak</div>
            </div>
          </div>
          <div style={s.statCard}>
            <div style={{ ...s.statIcon, backgroundColor:'#2e1e3a' }}>⭐</div>
            <div>
              <div style={{ ...s.statNum, color:'#facc15' }}>{userData?.xp || 0}</div>
              <div style={s.statLabel}>Total XP</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={s.sectionTitle}>⚡ Quick Actions</div>
        <div style={s.actionsGrid}>
          {quickActions.map((a) => (
            <div key={a.label} style={s.actionCard} onClick={() => navigate(a.path)}>
              <div style={{ ...s.actionIcon, backgroundColor:a.bg }}>{a.icon}</div>
              <div style={s.actionTitle}>{a.label}</div>
              <div style={s.actionSub}>{a.sub}</div>
            </div>
          ))}
        </div>

        {/* Exam Categories */}
        <div style={s.sectionTitle}>🎓 Exam Categories</div>
        {categories.map((c) => (
          <div key={c.label} style={s.catCard}>
            <div style={{ ...s.catIcon, backgroundColor:c.bg }}>{c.icon}</div>
            <div>
              <div style={s.catTitle}>{c.label}</div>
              <div style={s.catSub}>{c.sub}</div>
            </div>
            <div style={{ marginLeft:'auto', color:MUTED, fontSize:20 }}>›</div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div style={s.bottomNav}>
        {[
          { icon:'🏠', label:'Home', path:'/dashboard' },
          { icon:'📝', label:'Mock Exam', path:'/mock' },
          { icon:'📊', label:'Performance', path:'/performance' },
          { icon:'👥', label:'Leaderboard', path:'/leaderboard' },
          { icon:'⚙️', label:'Settings', path:'/settings' },
        ].map((n) => (
          <button key={n.label} style={s.navBtn} onClick={() => navigate(n.path)}>
            <div style={s.navIcon}>{n.icon}</div>
            <div style={s.navLabel}>{n.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
