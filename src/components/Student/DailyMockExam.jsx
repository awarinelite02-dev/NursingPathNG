import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import examService from '../../services/examService';

const BG='#0d1f2d',CARD='#132233',CARD2='#1a2e40',BORDER='#1e3a50',TEAL='#2dd4bf',TEXT='#f0f9ff',MUTED='#94a3b8';

const s = {
  page:{minHeight:'100vh',backgroundColor:BG,fontFamily:"'Poppins',sans-serif",color:TEXT},
  header:{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.2rem',backgroundColor:CARD,borderBottom:`1px solid ${BORDER}`,position:'sticky',top:0,zIndex:10},
  backBtn:{background:'none',border:'none',color:TEAL,fontSize:'1.5rem',cursor:'pointer',padding:0},
  headerTitle:{fontSize:'1.2rem',fontWeight:900,color:TEXT},
  body:{padding:'1rem'},
  banner:{background:'linear-gradient(135deg,#1e4d6b,#0d3352)',borderRadius:16,padding:'1.5rem',marginBottom:'1.2rem',border:`1px solid ${BORDER}`},
  bannerIcon:{fontSize:48,marginBottom:'0.5rem'},
  bannerTitle:{fontSize:'1.6rem',fontWeight:900,color:TEXT,marginBottom:'0.3rem'},
  bannerSub:{fontSize:'1rem',color:MUTED,fontWeight:600,marginBottom:'1.2rem'},
  pill:{display:'inline-flex',alignItems:'center',gap:'0.4rem',backgroundColor:'rgba(45,212,191,0.15)',border:`1px solid ${TEAL}`,borderRadius:20,padding:'0.3rem 0.9rem',fontSize:'0.85rem',fontWeight:700,color:TEAL,marginRight:'0.5rem',marginBottom:'0.5rem'},
  infoRow:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.75rem',marginBottom:'1.2rem'},
  infoCard:{backgroundColor:CARD,borderRadius:12,padding:'0.9rem',border:`1px solid ${BORDER}`,textAlign:'center'},
  infoNum:{fontSize:'1.4rem',fontWeight:900,color:TEAL},
  infoLabel:{fontSize:'0.75rem',color:MUTED,fontWeight:700,marginTop:2},
  startBtn:{width:'100%',padding:'1.1rem',backgroundColor:TEAL,color:'#0d1f2d',border:'none',borderRadius:12,fontSize:'1.2rem',fontWeight:900,cursor:'pointer',marginBottom:'0.75rem'},
  emptyCard:{backgroundColor:CARD,borderRadius:16,padding:'2rem',border:`1px solid ${BORDER}`,textAlign:'center',marginTop:'1rem'},
  emptyIcon:{fontSize:56,marginBottom:'1rem'},
  emptyTitle:{fontSize:'1.3rem',fontWeight:900,color:TEXT,marginBottom:'0.5rem'},
  emptySub:{fontSize:'1rem',color:MUTED,fontWeight:600},
};

const DailyMockExam = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (userData?.school_id) {
          const e = await examService.getActiveMockExam(userData.school_id);
          setExam(e);
        }
      } catch (e) {}
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user, userData]);

  const handleStart = async () => {
    if (!exam) return;
    setStarting(true);
    try {
      const sessionId = await examService.startExamSession(user.uid, exam.id);
      navigate(`/exam/${sessionId}`);
    } catch (e) {
      alert('Failed to start exam. Please try again.');
    } finally { setStarting(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>←</button>
        <div style={s.headerTitle}>Daily Mock Exam Practice</div>
      </div>
      <div style={s.body}>
        {loading ? (
          <div style={{textAlign:'center',padding:'3rem',color:MUTED,fontSize:'1.1rem',fontWeight:700}}>Loading today's exam...</div>
        ) : exam ? (
          <>
            <div style={s.banner}>
              <div style={s.bannerIcon}>⚡</div>
              <div style={s.bannerTitle}>{exam.title}</div>
              <div style={s.bannerSub}>{exam.description || 'Simulate a real Post-UTME entrance exam under timed conditions.'}</div>
              <div>
                <span style={s.pill}>📅 Daily Exam</span>
                <span style={s.pill}>⏱ {exam.duration_minutes} mins</span>
              </div>
            </div>
            <div style={s.infoRow}>
              <div style={s.infoCard}><div style={s.infoNum}>{exam.questions?.length || 0}</div><div style={s.infoLabel}>Questions</div></div>
              <div style={s.infoCard}><div style={s.infoNum}>{exam.duration_minutes}</div><div style={s.infoLabel}>Minutes</div></div>
              <div style={s.infoCard}><div style={s.infoNum}>{exam.passing_score || 50}%</div><div style={s.infoLabel}>Pass Mark</div></div>
            </div>
            <button style={s.startBtn} onClick={handleStart} disabled={starting}>
              {starting ? 'Starting...' : '▶ Start Today\'s Exam'}
            </button>
          </>
        ) : (
          <div style={s.emptyCard}>
            <div style={s.emptyIcon}>📭</div>
            <div style={s.emptyTitle}>No Active Exam Today</div>
            <div style={s.emptySub}>Your admin hasn't published today's mock exam yet. Check back soon!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyMockExam;
