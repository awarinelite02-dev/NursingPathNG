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
  logo: { display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'1.3rem', fontWeight:900, color:TEAL },
  userBadge: { display:'flex', alignItems:'center', gap:'0.6rem', backgroundColor:CARD2, border:`1px solid ${BORDER}`, borderRadius:30, padding:'0.4rem 0.9rem', cursor:'pointer' },
  userName: { fontSize:'1rem', fontWeight:800, color:TEXT },
  userRole: { fontSize:'0.75rem', color:MUTED, fontWeight:600 },
  body: { padding:'1rem' },
  heroBanner: { background:'linear-gradient(135deg,#1e4d6b 0%,#0d3352 60%,#132233 100%)', borderRadius:16, padding:'1.2rem', marginBottom:'1rem', border:`1px solid ${BORDER}` },
  heroLabel: { fontSize:'0.75rem', fontWeight:800, color:TEAL, letterSpacing:'0.1em', marginBottom:'0.3rem' },
  heroTitle: { fontSize:'1.5rem', fontWeight:900, color:TEXT, marginBottom:'0.4rem' },
  heroPremium: { display:'inline-flex', alignItems:'center', gap:'0.4rem', backgroundColor:'rgba(45,212,191,0.15)', border:`1px solid ${TEAL}`, borderRadius:20, padding:'0.25rem 0.75rem', fontSize:'0.8rem', fontWeight:700, color:TEAL, marginBottom:'1rem' },
  mockCard: { backgroundColor:'rgba(255,255,255,0.07)', borderRadius:12, padding:'0.8rem 1rem', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.8rem', border:`1px solid ${BORDER}` },
  mockIcon: { width:40, height:40, borderRadius:10, backgroundColor:'#1e4d6b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 },
  mockTitle: { fontSize:'0.95rem', fontWeight:800, color:TEXT },
  mockSub: { fontSize:'0.8rem', color:MUTED, fontWeight:600 },
  heroButtons: { display:'flex', gap:'0.75rem' },
  startBtn: { flex:1, padding:'0.9rem', backgroundColor:TEAL, color:'#0d1f2d', border:'none', borderRadius:10, fontSize:'1rem', fontWeight:900, cursor:'pointer' },
  continueBtn: { flex:1, padding:'0.9rem', backgroundColor:'rgba(255,255,255,0.08)', color:TEXT, border:`1px solid ${BORDER}`, borderRadius:10, fontSize:'1rem', fontWeight:800, cursor:'pointer' },
  statsRow: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.75rem', marginBottom:'1rem' },
  statCard: { backgroundColor:CARD, borderRadius:14, padding:'1rem', border:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:'0.8rem' },
  statIcon: { width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 },
  statNum: { fontSize:'1.6rem', fontWeight:900, color:TEXT, lineHeight:1 },
  statLabel: { fontSize:'0.75rem', color:MUTED, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:2 },
  sectionTitle: { fontSize:'1.2rem', fontWeight:900, color:TEXT, marginBottom:'0.75rem', marginTop:'1.2rem' },
  actionsGrid: { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.75rem' },
  actionCard: { backgroundColor:CARD, borderRadius:14, padding:'1.1rem', border:`1px solid ${BORDER}`, cursor:'pointer', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:'0.5rem', transition:'border-color 0.2s' },
  actionIcon: { width:50, height:50, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:'0.2rem' },
  actionTitle: { fontSize:'0.95rem', fontWeight:800, color:TEXT },
  actionSub: { fontSize:'0.75rem', color:MUTED, fontWeight:600 },
  // Modal overlay
  overlay: { position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.7)', display:'flex', alignItems:'flex-end', justifyContent:'center', zIndex:50 },
  modal: { backgroundColor:CARD, borderRadius:'20px 20px 0 0', padding:'1.5rem', width:'100%', maxWidth:480, border:`1px solid ${BORDER}`, borderBottom:'none' },
  modalTitle: { fontSize:'1.3rem', fontWeight:900, color:TEXT, marginBottom:'0.5rem' },
  modalSub: { fontSize:'0.95rem', color:MUTED, fontWeight:600, marginBottom:'1.5rem' },
  modalBtn: { width:'100%', padding:'1rem', backgroundColor:TEAL, color:'#0d1f2d', border:'none', borderRadius:12, fontSize:'1.1rem', fontWeight:900, cursor:'pointer', marginBottom:'0.75rem' },
  modalClose: { width:'100%', padding:'0.9rem', backgroundColor:'transparent', color:MUTED, border:`1px solid ${BORDER}`, borderRadius:12, fontSize:'1rem', fontWeight:700, cursor:'pointer' },
  bottomNav: { position:'fixed', bottom:0, left:0, right:0, backgroundColor:CARD, borderTop:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-around', padding:'0.6rem 0', zIndex:10 },
  navBtn: { display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem', background:'none', border:'none', cursor:'pointer', padding:'0.3rem 0.8rem' },
  navIcon: { fontSize:22 },
  navLabel: { fontSize:'0.65rem', fontWeight:700 },
};

const quickActions = [
  { icon:'⚡', bg:'#1e3a1e', label:'Daily Mock Exam Practice', sub:'Take today\'s daily exam', key:'daily' },
  { icon:'🎯', bg:'#3a1e1e', label:'Subject Drill', sub:'Take exam by subject', key:'subject' },
  { icon:'📚', bg:'#2e1e3a', label:'School Past Questions', sub:'Entrance exam past questions', key:'past' },
  { icon:'🔖', bg:'#3a2e1e', label:'Bookmarks', sub:'Review bookmarked questions', key:'bookmarks' },
];

const navItems = [
  { icon:'🏠', label:'Home', key:'home' },
  { icon:'📝', label:'Mock Exam', key:'mock' },
  { icon:'📊', label:'Performance', key:'performance' },
  { icon:'👥', label:'Leaderboard', key:'leaderboard' },
  { icon:'⚙️', label:'Settings', key:'settings' },
];

const StudentDashboard = () => {
  const { user, userData, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activeNav, setActiveNav] = useState('home');
  const [modal, setModal] = useState(null); // { title, sub, action }

  useEffect(() => {
    const load = async () => {
      try {
        const perf = await examService.getExamPerformanceStats(user.uid);
        setStats(perf);
      } catch (e) {}
    };
    if (user) load();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleAction = (key) => {
    switch (key) {
      case 'daily':
        setModal({ title:'Daily Mock Exam Practice', sub:'Start today\'s timed mock exam. New questions every day to keep your readiness sharp.', action: () => navigate('/exam/daily') });
        break;
      case 'subject':
        setModal({ title:'Subject Drill', sub:'Choose a subject and practice targeted questions to strengthen your weak areas.', action: () => navigate('/exam/subject') });
        break;
      case 'past':
        setModal({ title:'School Past Questions', sub:'Browse and attempt past entrance exam questions from top nursing schools.', action: () => navigate('/exam/past-questions') });
        break;
      case 'bookmarks':
        setModal({ title:'Bookmarks', sub:'Review all your saved/bookmarked questions in one place.', action: () => navigate('/exam/bookmarks') });
        break;
      case 'mock':
        setModal({ title:'Mock Exam', sub:'Simulate a full Post-UTME entrance exam under real timed conditions.', action: () => navigate('/exam/mock') });
        break;
      case 'performance':
        setModal({ title:'My Performance', sub:'View your scores, progress charts, and improvement trends over time.', action: () => {} });
        break;
      case 'leaderboard':
        setModal({ title:'Leaderboard', sub:'See how you rank against other students preparing for nursing school entrance exams.', action: () => {} });
        break;
      case 'settings':
        setModal({ title:'Settings', sub:'Manage your profile, notifications, and account preferences.', action: () => {} });
        break;
      default:
        break;
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={s.page}>
      {/* Top Bar */}
      <div style={s.topBar}>
        <div style={s.logo}>🏫 NursingPath</div>
        <div style={s.userBadge} onClick={() => handleAction('settings')}>
          <div style={{ fontSize:22 }}>👤</div>
          <div>
            <div style={s.userName}>{userData?.name?.split(' ')[0] || 'Student'}</div>
            <div style={s.userRole}>Student</div>
          </div>
        </div>
      </div>

      <div style={{ ...s.body, paddingBottom:'5.5rem' }}>
        {/* Hero Banner */}
        <div style={s.heroBanner}>
          <div style={s.heroLabel}>🏫 NURSING SCHOOLS ENTRANCE EXAM — POST-UTME</div>
          <div style={s.heroTitle}>{greeting}, {userData?.name?.split(' ')[0]}! 👋</div>
          <div style={s.heroPremium}>⭐ Premium subscriber — all content unlocked</div>

          <div style={s.mockCard}>
            <div style={s.mockIcon}>📝</div>
            <div>
              <div style={s.mockTitle}>Mock Exam</div>
              <div style={s.mockSub}>Simulate a real Post-UTME entrance exam under timed conditions. Test your full readiness.</div>
            </div>
          </div>

          <div style={s.heroButtons}>
            <button style={s.startBtn} onClick={() => handleAction('mock')}>▶ Start Exam</button>
            <button style={s.continueBtn} onClick={() => handleAction('daily')}>⚡ Daily Practice</button>
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
            <div
              key={a.key}
              style={s.actionCard}
              onClick={() => handleAction(a.key)}
              onMouseEnter={e => e.currentTarget.style.borderColor = TEAL}
              onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
            >
              <div style={{ ...s.actionIcon, backgroundColor:a.bg }}>{a.icon}</div>
              <div style={s.actionTitle}>{a.label}</div>
              <div style={s.actionSub}>{a.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div style={s.bottomNav}>
        {navItems.map((n) => (
          <button
            key={n.key}
            style={s.navBtn}
            onClick={() => { setActiveNav(n.key); handleAction(n.key); }}
          >
            <div style={s.navIcon}>{n.icon}</div>
            <div style={{ ...s.navLabel, color: activeNav === n.key ? TEAL : MUTED }}>{n.label}</div>
          </button>
        ))}
      </div>

      {/* Action Modal */}
      {modal && (
        <div style={s.overlay} onClick={() => setModal(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>{modal.title}</div>
            <div style={s.modalSub}>{modal.sub}</div>
            <button style={s.modalBtn} onClick={() => { modal.action(); setModal(null); }}>
              Start Now →
            </button>
            <button style={s.modalClose} onClick={() => setModal(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
