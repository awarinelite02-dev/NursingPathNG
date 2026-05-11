import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import examService from '../../services/examService';

const BG='#0d1f2d',CARD='#132233',BORDER='#1e3a50',TEAL='#2dd4bf',TEXT='#f0f9ff',MUTED='#94a3b8';

const subjects = [
  { icon:'🧬', label:'Biology', key:'biology', bg:'#1e3a1e' },
  { icon:'⚗️', label:'Chemistry', key:'chemistry', bg:'#1e1e3a' },
  { icon:'🔢', label:'Mathematics', key:'mathematics', bg:'#3a1e1e' },
  { icon:'🔬', label:'Physics', key:'physics', bg:'#1e3a2e' },
  { icon:'📖', label:'English Language', key:'english', bg:'#2e1e3a' },
  { icon:'🏥', label:'Health Science', key:'health_science', bg:'#3a2e1e' },
  { icon:'🧠', label:'Anatomy & Physiology', key:'anatomy', bg:'#1e2e3a' },
  { icon:'💊', label:'Pharmacology', key:'pharmacology', bg:'#2e3a1e' },
];

const s = {
  page:{minHeight:'100vh',backgroundColor:BG,fontFamily:"'Poppins',sans-serif",color:TEXT},
  header:{display:'flex',alignItems:'center',gap:'1rem',padding:'1rem 1.2rem',backgroundColor:CARD,borderBottom:`1px solid ${BORDER}`,position:'sticky',top:0,zIndex:10},
  backBtn:{background:'none',border:'none',color:TEAL,fontSize:'1.5rem',cursor:'pointer',padding:0},
  headerTitle:{fontSize:'1.2rem',fontWeight:900,color:TEXT},
  body:{padding:'1rem'},
  intro:{backgroundColor:CARD,borderRadius:14,padding:'1.2rem',border:`1px solid ${BORDER}`,marginBottom:'1.2rem'},
  introTitle:{fontSize:'1.3rem',fontWeight:900,color:TEXT,marginBottom:'0.3rem'},
  introSub:{fontSize:'0.95rem',color:MUTED,fontWeight:600},
  sectionTitle:{fontSize:'1.1rem',fontWeight:900,color:TEXT,marginBottom:'0.75rem'},
  grid:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.75rem'},
  subjectCard:{backgroundColor:CARD,borderRadius:14,padding:'1.2rem',border:`1px solid ${BORDER}`,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:'0.5rem',textAlign:'center'},
  subjectIcon:{width:52,height:52,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26},
  subjectLabel:{fontSize:'0.95rem',fontWeight:800,color:TEXT},
  // modal
  overlay:{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.7)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:50},
  modal:{backgroundColor:CARD,borderRadius:'20px 20px 0 0',padding:'1.5rem',width:'100%',maxWidth:480,border:`1px solid ${BORDER}`,borderBottom:'none'},
  modalIcon:{fontSize:44,textAlign:'center',marginBottom:'0.5rem'},
  modalTitle:{fontSize:'1.3rem',fontWeight:900,color:TEXT,marginBottom:'0.3rem'},
  modalSub:{fontSize:'0.95rem',color:MUTED,fontWeight:600,marginBottom:'1.5rem'},
  startBtn:{width:'100%',padding:'1rem',backgroundColor:TEAL,color:'#0d1f2d',border:'none',borderRadius:12,fontSize:'1.1rem',fontWeight:900,cursor:'pointer',marginBottom:'0.75rem'},
  closeBtn:{width:'100%',padding:'0.9rem',backgroundColor:'transparent',color:MUTED,border:`1px solid ${BORDER}`,borderRadius:12,fontSize:'1rem',fontWeight:700,cursor:'pointer'},
};

const SubjectDrill = () => {
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!selected || !userData?.school_id) return;
    setLoading(true);
    try {
      const exams = await examService.getPastQuestionExams(userData.school_id, selected.key);
      if (!exams || exams.length === 0) {
        alert(`No ${selected.label} exam available yet. Check back soon!`);
        setSelected(null);
        return;
      }
      const sessionId = await examService.startExamSession(user.uid, exams[0].id);
      navigate(`/exam/${sessionId}`);
    } catch (e) {
      alert('Failed to start exam. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>←</button>
        <div style={s.headerTitle}>Subject Drill</div>
      </div>
      <div style={s.body}>
        <div style={s.intro}>
          <div style={s.introTitle}>🎯 Pick a Subject</div>
          <div style={s.introSub}>Choose a subject to practice targeted questions and strengthen your weak areas.</div>
        </div>
        <div style={s.sectionTitle}>Select Subject</div>
        <div style={s.grid}>
          {subjects.map(sub => (
            <div key={sub.key} style={s.subjectCard} onClick={() => setSelected(sub)}
              onMouseEnter={e => e.currentTarget.style.borderColor=TEAL}
              onMouseLeave={e => e.currentTarget.style.borderColor=BORDER}>
              <div style={{...s.subjectIcon, backgroundColor:sub.bg}}>{sub.icon}</div>
              <div style={s.subjectLabel}>{sub.label}</div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={s.overlay} onClick={() => setSelected(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalIcon}>{selected.icon}</div>
            <div style={s.modalTitle}>{selected.label}</div>
            <div style={s.modalSub}>Start a timed drill with questions focused on {selected.label}. Build speed and accuracy in this subject.</div>
            <button style={s.startBtn} onClick={handleStart} disabled={loading}>
              {loading ? 'Starting...' : `Start ${selected.label} Drill →`}
            </button>
            <button style={s.closeBtn} onClick={() => setSelected(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectDrill;
