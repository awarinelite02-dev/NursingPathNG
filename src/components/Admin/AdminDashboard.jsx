import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import questionService from '../../services/questionService';
import examService from '../../services/examService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

const BG='#0d1f2d',CARD='#132233',CARD2='#1a2e40',BORDER='#1e3a50',TEAL='#2dd4bf',TEXT='#f0f9ff',MUTED='#94a3b8',RED='#ef4444',GREEN='#22c55e';

const s = {
  page:{minHeight:'100vh',backgroundColor:BG,fontFamily:"'Poppins',sans-serif",color:TEXT},
  topBar:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 1.2rem',backgroundColor:CARD,borderBottom:`1px solid ${BORDER}`,position:'sticky',top:0,zIndex:10},
  logo:{fontSize:'1.3rem',fontWeight:900,color:TEAL},
  adminBadge:{display:'flex',alignItems:'center',gap:'0.5rem',backgroundColor:CARD2,border:`1px solid ${BORDER}`,borderRadius:30,padding:'0.4rem 0.9rem'},
  adminName:{fontSize:'0.95rem',fontWeight:800,color:TEXT},
  adminRole:{fontSize:'0.7rem',color:TEAL,fontWeight:700},
  tabBar:{display:'flex',overflowX:'auto',backgroundColor:CARD,borderBottom:`1px solid ${BORDER}`,padding:'0 0.5rem',gap:'0.2rem'},
  tab:{padding:'0.9rem 1rem',background:'none',border:'none',fontSize:'0.9rem',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',borderBottom:'3px solid transparent',display:'flex',alignItems:'center',gap:'0.4rem'},
  body:{padding:'1rem'},
  // Stats
  statsGrid:{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.75rem',marginBottom:'1.2rem'},
  statCard:{backgroundColor:CARD,borderRadius:14,padding:'1rem',border:`1px solid ${BORDER}`},
  statIcon:{fontSize:28,marginBottom:'0.3rem'},
  statNum:{fontSize:'1.8rem',fontWeight:900,color:TEAL,lineHeight:1},
  statLabel:{fontSize:'0.75rem',color:MUTED,fontWeight:700,textTransform:'uppercase',marginTop:2},
  // Section
  sectionTitle:{fontSize:'1.1rem',fontWeight:900,color:TEXT,marginBottom:'0.75rem',marginTop:'1rem'},
  // Cards
  actionCard:{backgroundColor:CARD,borderRadius:14,padding:'1.1rem',border:`1px solid ${BORDER}`,cursor:'pointer',display:'flex',alignItems:'center',gap:'1rem',marginBottom:'0.75rem'},
  actionIcon:{width:46,height:46,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0},
  actionTitle:{fontSize:'1rem',fontWeight:800,color:TEXT},
  actionSub:{fontSize:'0.8rem',color:MUTED,fontWeight:600},
  actionArrow:{marginLeft:'auto',color:TEAL,fontSize:20,fontWeight:900},
  // Form
  formCard:{backgroundColor:CARD,borderRadius:16,padding:'1.2rem',border:`1px solid ${BORDER}`,marginBottom:'1rem'},
  formTitle:{fontSize:'1.1rem',fontWeight:900,color:TEXT,marginBottom:'1rem'},
  label:{fontSize:'0.95rem',fontWeight:800,color:TEXT,marginBottom:'0.4rem',display:'block'},
  input:{width:'100%',padding:'0.9rem 1rem',backgroundColor:CARD2,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT,fontSize:'1rem',fontWeight:600,outline:'none',boxSizing:'border-box',marginBottom:'0.9rem'},
  select:{width:'100%',padding:'0.9rem 1rem',backgroundColor:CARD2,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT,fontSize:'1rem',fontWeight:600,outline:'none',boxSizing:'border-box',marginBottom:'0.9rem'},
  textarea:{width:'100%',padding:'0.9rem 1rem',backgroundColor:CARD2,border:`1.5px solid ${BORDER}`,borderRadius:10,color:TEXT,fontSize:'1rem',fontWeight:600,outline:'none',boxSizing:'border-box',marginBottom:'0.9rem',minHeight:90,resize:'vertical'},
  submitBtn:{width:'100%',padding:'1rem',backgroundColor:TEAL,color:'#0d1f2d',border:'none',borderRadius:12,fontSize:'1.1rem',fontWeight:900,cursor:'pointer'},
  dangerBtn:{width:'100%',padding:'0.9rem',backgroundColor:'rgba(239,68,68,0.15)',color:RED,border:`1px solid ${RED}`,borderRadius:12,fontSize:'1rem',fontWeight:700,cursor:'pointer',marginTop:'0.75rem'},
  // Question list
  qCard:{backgroundColor:CARD,borderRadius:12,padding:'1rem',border:`1px solid ${BORDER}`,marginBottom:'0.75rem'},
  qText:{fontSize:'0.95rem',fontWeight:700,color:TEXT,marginBottom:'0.4rem'},
  qMeta:{display:'flex',gap:'0.5rem',flexWrap:'wrap'},
  qPill:{backgroundColor:CARD2,border:`1px solid ${BORDER}`,borderRadius:20,padding:'0.2rem 0.6rem',fontSize:'0.75rem',fontWeight:700,color:MUTED},
  qAnswer:{color:GREEN,fontWeight:800},
  // Success/error
  successBox:{backgroundColor:'rgba(34,197,94,0.15)',border:`1px solid ${GREEN}`,borderRadius:10,padding:'0.9rem',color:GREEN,fontSize:'1rem',fontWeight:700,marginBottom:'1rem'},
  errorBox:{backgroundColor:'rgba(239,68,68,0.15)',border:`1px solid ${RED}`,borderRadius:10,padding:'0.9rem',color:'#fca5a5',fontSize:'1rem',fontWeight:700,marginBottom:'1rem'},
  logoutBtn:{background:'none',border:`1px solid ${RED}`,borderRadius:20,padding:'0.4rem 0.9rem',color:RED,fontSize:'0.85rem',fontWeight:700,cursor:'pointer'},
};

const SCHOOL_ID = 'global'; // Default school ID

const subjects = ['Biology','Chemistry','Mathematics','Physics','English Language','Health Science','Anatomy & Physiology','Pharmacology'];

const AdminDashboard = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState({ questions:0, exams:0, students:0 });
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'success'|'error', text}

  // Add Question form
  const [qForm, setQForm] = useState({ subject:'Biology', topic:'', question_text:'', optionA:'', optionB:'', optionC:'', optionD:'', correct_answer:'A', explanation:'', difficulty:'medium' });

  // Add Exam form
  const [eForm, setEForm] = useState({ title:'', description:'', exam_type:'past_question', subject:'Biology', duration_minutes:60, passing_score:50 });

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const qs = await questionService.getAllQuestions(SCHOOL_ID);
      const es = await examService.getPastQuestionExams(SCHOOL_ID);
      const usersSnap = await getDocs(query(collection(db,'users'), where('role','==','student')));
      setStats({ questions: qs.length, exams: es.length, students: usersSnap.size });
    } catch(e) {}
  };

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const qs = await questionService.getAllQuestions(SCHOOL_ID);
      setQuestions(qs);
    } catch(e) { showMsg('error','Failed to load questions.'); }
    finally { setLoading(false); }
  };

  const loadExams = async () => {
    setLoading(true);
    try {
      const es = await examService.getPastQuestionExams(SCHOOL_ID);
      const mock = await examService.getActiveMockExam(SCHOOL_ID);
      setExams(mock ? [mock, ...es] : es);
    } catch(e) { showMsg('error','Failed to load exams.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (tab === 'questions') loadQuestions();
    if (tab === 'exams') loadExams();
  }, [tab]);

  const showMsg = (type, text) => {
    setMsg({type, text});
    setTimeout(() => setMsg(null), 4000);
  };

  const handleAddQuestion = async () => {
    if (!qForm.question_text || !qForm.optionA || !qForm.optionB || !qForm.optionC || !qForm.optionD) {
      showMsg('error', 'Please fill in the question and all 4 options.');
      return;
    }
    setLoading(true);
    try {
      await questionService.addQuestion(SCHOOL_ID, qForm);
      showMsg('success', '✅ Question added successfully!');
      setQForm({ subject:'Biology', topic:'', question_text:'', optionA:'', optionB:'', optionC:'', optionD:'', correct_answer:'A', explanation:'', difficulty:'medium' });
      loadStats();
    } catch(e) { showMsg('error', 'Failed to add question. Try again.'); }
    finally { setLoading(false); }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await questionService.deleteQuestion(id);
      showMsg('success', 'Question deleted.');
      loadQuestions();
      loadStats();
    } catch(e) { showMsg('error', 'Failed to delete question.'); }
  };

  const handleCreateExam = async () => {
    if (!eForm.title) { showMsg('error','Please enter an exam title.'); return; }
    setLoading(true);
    try {
      // Get questions for this subject
      const qs = eForm.exam_type === 'mock'
        ? await questionService.getAllQuestions(SCHOOL_ID)
        : await questionService.getQuestionsBySubject(SCHOOL_ID, eForm.subject);
      if (qs.length === 0) { showMsg('error','No questions found for this subject. Add questions first.'); setLoading(false); return; }
      const qIds = qs.map(q => q.id);
      await examService.createExam(SCHOOL_ID, { ...eForm, questions: qIds });
      showMsg('success','✅ Exam created successfully!');
      setEForm({ title:'', description:'', exam_type:'past_question', subject:'Biology', duration_minutes:60, passing_score:50 });
      loadStats();
      loadExams();
    } catch(e) { showMsg('error','Failed to create exam. Try again.'); }
    finally { setLoading(false); }
  };

  const tabs = [
    { key:'overview', icon:'📊', label:'Overview' },
    { key:'questions', icon:'📝', label:'Questions' },
    { key:'exams', icon:'🏥', label:'Exams' },
    { key:'students', icon:'👥', label:'Students' },
  ];

  return (
    <div style={s.page}>
      {/* Top Bar */}
      <div style={s.topBar}>
        <div style={s.logo}>🏫 Admin Panel</div>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={s.adminBadge}>
            <div style={{fontSize:20}}>👤</div>
            <div>
              <div style={s.adminName}>{userData?.name?.split(' ')[0]}</div>
              <div style={s.adminRole}>Administrator</div>
            </div>
          </div>
          <button style={s.logoutBtn} onClick={async()=>{ await signOut(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={s.tabBar}>
        {tabs.map(t => (
          <button key={t.key} style={{...s.tab, color: tab===t.key ? TEAL : MUTED, borderBottomColor: tab===t.key ? TEAL : 'transparent'}}
            onClick={() => setTab(t.key)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={s.body}>
        {msg && <div style={msg.type==='success' ? s.successBox : s.errorBox}>{msg.text}</div>}

        {/* OVERVIEW */}
        {tab==='overview' && (
          <>
            <div style={s.sectionTitle}>📊 Platform Stats</div>
            <div style={s.statsGrid}>
              <div style={s.statCard}><div style={s.statIcon}>📝</div><div style={s.statNum}>{stats.questions}</div><div style={s.statLabel}>Questions</div></div>
              <div style={s.statCard}><div style={s.statIcon}>🏥</div><div style={s.statNum}>{stats.exams}</div><div style={s.statLabel}>Exams</div></div>
              <div style={s.statCard}><div style={s.statIcon}>👥</div><div style={s.statNum}>{stats.students}</div><div style={s.statLabel}>Students</div></div>
              <div style={s.statCard}><div style={s.statIcon}>🏫</div><div style={s.statNum}>1</div><div style={s.statLabel}>School</div></div>
            </div>

            <div style={s.sectionTitle}>⚡ Quick Actions</div>
            {[
              { icon:'📝', bg:'#1e3a1e', title:'Add Question', sub:'Add a new exam question', action:()=>setTab('questions') },
              { icon:'🏥', bg:'#1e1e3a', title:'Create Exam', sub:'Create a new exam for students', action:()=>setTab('exams') },
              { icon:'👥', bg:'#2e1e3a', title:'View Students', sub:'See all registered students', action:()=>setTab('students') },
            ].map(a => (
              <div key={a.title} style={s.actionCard} onClick={a.action}
                onMouseEnter={e=>e.currentTarget.style.borderColor=TEAL}
                onMouseLeave={e=>e.currentTarget.style.borderColor=BORDER}>
                <div style={{...s.actionIcon,backgroundColor:a.bg}}>{a.icon}</div>
                <div><div style={s.actionTitle}>{a.title}</div><div style={s.actionSub}>{a.sub}</div></div>
                <div style={s.actionArrow}>›</div>
              </div>
            ))}
          </>
        )}

        {/* QUESTIONS */}
        {tab==='questions' && (
          <>
            <div style={s.formCard}>
              <div style={s.formTitle}>➕ Add New Question</div>
              <label style={s.label}>Subject</label>
              <select style={s.select} value={qForm.subject} onChange={e=>setQForm({...qForm,subject:e.target.value})}>
                {subjects.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <label style={s.label}>Topic (optional)</label>
              <input style={s.input} placeholder="e.g. Cell Biology" value={qForm.topic} onChange={e=>setQForm({...qForm,topic:e.target.value})} />
              <label style={s.label}>Question</label>
              <textarea style={s.textarea} placeholder="Type the question here..." value={qForm.question_text} onChange={e=>setQForm({...qForm,question_text:e.target.value})} />
              <label style={s.label}>Option A</label>
              <input style={s.input} placeholder="Option A" value={qForm.optionA} onChange={e=>setQForm({...qForm,optionA:e.target.value})} />
              <label style={s.label}>Option B</label>
              <input style={s.input} placeholder="Option B" value={qForm.optionB} onChange={e=>setQForm({...qForm,optionB:e.target.value})} />
              <label style={s.label}>Option C</label>
              <input style={s.input} placeholder="Option C" value={qForm.optionC} onChange={e=>setQForm({...qForm,optionC:e.target.value})} />
              <label style={s.label}>Option D</label>
              <input style={s.input} placeholder="Option D" value={qForm.optionD} onChange={e=>setQForm({...qForm,optionD:e.target.value})} />
              <label style={s.label}>Correct Answer</label>
              <select style={s.select} value={qForm.correct_answer} onChange={e=>setQForm({...qForm,correct_answer:e.target.value})}>
                {['A','B','C','D'].map(o=><option key={o} value={o}>Option {o}</option>)}
              </select>
              <label style={s.label}>Explanation (optional)</label>
              <textarea style={s.textarea} placeholder="Explain why this is the correct answer..." value={qForm.explanation} onChange={e=>setQForm({...qForm,explanation:e.target.value})} />
              <label style={s.label}>Difficulty</label>
              <select style={s.select} value={qForm.difficulty} onChange={e=>setQForm({...qForm,difficulty:e.target.value})}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button style={s.submitBtn} onClick={handleAddQuestion} disabled={loading}>
                {loading ? 'Adding...' : '➕ Add Question'}
              </button>
            </div>

            <div style={s.sectionTitle}>📚 All Questions ({questions.length})</div>
            {loading ? <div style={{color:MUTED,fontWeight:700,textAlign:'center',padding:'2rem'}}>Loading...</div>
              : questions.length === 0 ? <div style={{color:MUTED,fontWeight:700,textAlign:'center',padding:'2rem'}}>No questions yet. Add your first question above.</div>
              : questions.map(q => (
                <div key={q.id} style={s.qCard}>
                  <div style={s.qText}>{q.question_text}</div>
                  <div style={s.qMeta}>
                    <span style={s.qPill}>{q.subject}</span>
                    {q.topic && <span style={s.qPill}>{q.topic}</span>}
                    <span style={s.qPill}>{q.difficulty}</span>
                    <span style={{...s.qPill,...{color:GREEN}}}>✓ {q.correct_answer}</span>
                  </div>
                  <button style={{...s.dangerBtn,marginTop:'0.6rem',padding:'0.5rem',fontSize:'0.85rem'}} onClick={()=>handleDeleteQuestion(q.id)}>🗑 Delete</button>
                </div>
              ))
            }
          </>
        )}

        {/* EXAMS */}
        {tab==='exams' && (
          <>
            <div style={s.formCard}>
              <div style={s.formTitle}>🏥 Create New Exam</div>
              <label style={s.label}>Exam Title</label>
              <input style={s.input} placeholder="e.g. LUTH 2024 Past Questions" value={eForm.title} onChange={e=>setEForm({...eForm,title:e.target.value})} />
              <label style={s.label}>Description (optional)</label>
              <textarea style={s.textarea} placeholder="Brief description of this exam..." value={eForm.description} onChange={e=>setEForm({...eForm,description:e.target.value})} />
              <label style={s.label}>Exam Type</label>
              <select style={s.select} value={eForm.exam_type} onChange={e=>setEForm({...eForm,exam_type:e.target.value})}>
                <option value="past_question">Past Questions</option>
                <option value="mock">Mock Exam (all subjects)</option>
              </select>
              {eForm.exam_type === 'past_question' && (
                <>
                  <label style={s.label}>Subject</label>
                  <select style={s.select} value={eForm.subject} onChange={e=>setEForm({...eForm,subject:e.target.value})}>
                    {subjects.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </>
              )}
              <label style={s.label}>Duration (minutes)</label>
              <input style={s.input} type="number" value={eForm.duration_minutes} onChange={e=>setEForm({...eForm,duration_minutes:parseInt(e.target.value)})} />
              <label style={s.label}>Pass Mark (%)</label>
              <input style={s.input} type="number" value={eForm.passing_score} onChange={e=>setEForm({...eForm,passing_score:parseInt(e.target.value)})} />
              <button style={s.submitBtn} onClick={handleCreateExam} disabled={loading}>
                {loading ? 'Creating...' : '🏥 Create Exam'}
              </button>
            </div>

            <div style={s.sectionTitle}>📋 All Exams ({exams.length})</div>
            {loading ? <div style={{color:MUTED,fontWeight:700,textAlign:'center',padding:'2rem'}}>Loading...</div>
              : exams.length === 0 ? <div style={{color:MUTED,fontWeight:700,textAlign:'center',padding:'2rem'}}>No exams yet. Create your first exam above.</div>
              : exams.map(exam => (
                <div key={exam.id} style={s.qCard}>
                  <div style={s.qText}>{exam.title}</div>
                  <div style={s.qMeta}>
                    <span style={s.qPill}>{exam.exam_type}</span>
                    <span style={s.qPill}>{exam.questions?.length || 0} questions</span>
                    <span style={s.qPill}>{exam.duration_minutes} mins</span>
                    <span style={{...s.qPill,...{color:GREEN}}}>{exam.status}</span>
                  </div>
                </div>
              ))
            }
          </>
        )}

        {/* STUDENTS */}
        {tab==='students' && (
          <>
            <div style={s.formCard}>
              <div style={s.formTitle}>👥 Registered Students</div>
              <div style={{color:MUTED,fontWeight:600,fontSize:'0.95rem'}}>
                Total registered students: <span style={{color:TEAL,fontWeight:900}}>{stats.students}</span>
              </div>
            </div>
            <div style={{...s.formCard,textAlign:'center',padding:'2rem'}}>
              <div style={{fontSize:48,marginBottom:'0.5rem'}}>🚧</div>
              <div style={{fontSize:'1.1rem',fontWeight:900,color:TEXT,marginBottom:'0.3rem'}}>Student Management</div>
              <div style={{fontSize:'0.95rem',color:MUTED,fontWeight:600}}>Full student management with search, filter, and performance view coming soon.</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
