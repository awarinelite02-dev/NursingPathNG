import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import examService from '../../services/examService';

const BG='#0d1f2d',CARD='#132233',BORDER='#1e3a50',TEAL='#2dd4bf',TEXT='#f0f9ff',MUTED='#94a3b8';

const s = {
  page:{minHeight:'100vh',backgroundColor:BG,fontFamily:"'Poppins',sans-serif",color:TEXT},
  header:{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.2rem',backgroundColor:CARD,borderBottom:`1px solid ${BORDER}`,position:'sticky',top:0,zIndex:10},
  backBtn:{background:'none',border:'none',color:TEAL,fontSize:'1.5rem',cursor:'pointer',padding:0},
  headerTitle:{fontSize:'1.2rem',fontWeight:900,color:TEXT},
  body:{padding:'1rem'},
  banner:{background:'linear-gradient(135deg,#1e4d6b,#0d3352)',borderRadius:16,padding:'1.2rem',marginBottom:'1.2rem',border:`1px solid ${BORDER}`},
  bannerTitle:{fontSize:'1.4rem',fontWeight:900,color:TEXT,marginBottom:'0.3rem'},
  bannerSub:{fontSize:'0.95rem',color:MUTED,fontWeight:600},
  sectionTitle:{fontSize:'1.1rem',fontWeight:900,color:TEXT,marginBottom:'0.75rem'},
  examCard:{backgroundColor:CARD,borderRadius:14,padding:'1.1rem',border:`1px solid ${BORDER}`,cursor:'pointer',display:'flex',alignItems:'center',gap:'1rem',marginBottom:'0.75rem'},
  examIcon:{width:48,height:48,borderRadius:12,backgroundColor:'#1e3a50',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,flexShrink:0},
  examTitle:{fontSize:'1rem',fontWeight:800,color:TEXT},
  examMeta:{fontSize:'0.8rem',color:MUTED,fontWeight:600,marginTop:2},
  examArrow:{marginLeft:'auto',color:MUTED,fontSize:20},
  emptyCard:{backgroundColor:CARD,borderRadius:16,padding:'2rem',border:`1px solid ${BORDER}`,textAlign:'center',marginTop:'1rem'},
  emptyIcon:{fontSize:56,marginBottom:'1rem'},
  emptyTitle:{fontSize:'1.3rem',fontWeight:900,color:TEXT,marginBottom:'0.5rem'},
  emptySub:{fontSize:'1rem',color:MUTED,fontWeight:600},
  overlay:{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:50},
  modal:{backgroundColor:CARD,borderRadius:'20px 20px 0 0',padding:'1.5rem',width:'100%',maxWidth:480,border:`1px solid ${BORDER}`,borderBottom:'none'},
  modalTitle:{fontSize:'1.3rem',fontWeight:900,color:TEXT,marginBottom:'0.3rem'},
  modalSub:{fontSize:'0.95rem',color:MUTED,fontWeight:600,marginBottom:'1.5rem'},
  startBtn:{width:'100%',padding:'1rem',backgroundColor:TEAL,color:'#0d1f2d',border:'none',borderRadius:12,fontSize:'1.1rem',fontWeight:900,cursor:'pointer',marginBottom:'0.75rem'},
  closeBtn:{width:'100%',padding:'0.9rem',backgroundColor:'transparent',color:MUTED,border:`1px solid ${BORDER}`,borderRadius:12,fontSize:'1rem',fontWeight:700,cursor:'pointer'},
};

const SchoolPastQuestions = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (userData?.school_id) {
          const list = await examService.getPastQuestionExams(userData.school_id);
          setExams(list);
        }
      } catch (e) {}
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user, userData]);

  const handleStart = async () => {
    if (!selected) return;
    setStarting(true);
    try {
      const sessionId = await examService.startExamSession(user.uid, selected.id);
      navigate(`/exam/${sessionId}`);
    } catch (e) {
      alert('Failed to start exam. Please try again.');
    } finally { setStarting(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>←</button>
        <div style={s.headerTitle}>School Past Questions</div>
      </div>
      <div style={s.body}>
        <div style={s.banner}>
          <div style={s.bannerTitle}>📚 Past Questions</div>
          <div style={s.bannerSub}>Practise with real past entrance exam questions from top nursing schools across Nigeria.</div>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'3rem',color:MUTED,fontSize:'1.1rem',fontWeight:700}}>Loading past questions...</div>
        ) : exams.length > 0 ? (
          <>
            <div style={s.sectionTitle}>Available Exams ({exams.length})</div>
            {exams.map(exam => (
              <div key={exam.id} style={s.examCard} onClick={() => setSelected(exam)}
                onMouseEnter={e => e.currentTarget.style.borderColor=TEAL}
                onMouseLeave={e => e.currentTarget.style.borderColor=BORDER}>
                <div style={s.examIcon}>📝</div>
                <div>
                  <div style={s.examTitle}>{exam.title}</div>
                  <div style={s.examMeta}>
                    {exam.questions?.length || 0} questions · {exam.duration_minutes} mins · Pass: {exam.passing_score || 50}%
                  </div>
                </div>
                <div style={s.examArrow}>›</div>
              </div>
            ))}
          </>
        ) : (
          <div style={s.emptyCard}>
            <div style={s.emptyIcon}>📭</div>
            <div style={s.emptyTitle}>No Past Questions Yet</div>
            <div style={s.emptySub}>Your admin hasn't uploaded past questions yet. Check back soon!</div>
          </div>
        )}
      </div>

      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalTitle}>{selected.title}</div>
            <div style={s.modalSub}>
              {selected.questions?.length || 0} questions · {selected.duration_minutes} minutes · Pass mark: {selected.passing_score || 50}%
            </div>
            <button style={s.startBtn} onClick={handleStart} disabled={starting}>
              {starting ? 'Starting...' : 'Start Exam →'}
            </button>
            <button style={s.closeBtn} onClick={() => setSelected(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolPastQuestions;
