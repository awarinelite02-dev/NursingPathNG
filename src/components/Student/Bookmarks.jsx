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
  banner:{background:'linear-gradient(135deg,#2e1e3a,#1a1030)',borderRadius:16,padding:'1.2rem',marginBottom:'1.2rem',border:`1px solid ${BORDER}`},
  bannerTitle:{fontSize:'1.4rem',fontWeight:900,color:TEXT,marginBottom:'0.3rem'},
  bannerSub:{fontSize:'0.95rem',color:MUTED,fontWeight:600},
  sectionTitle:{fontSize:'1.1rem',fontWeight:900,color:TEXT,marginBottom:'0.75rem'},
  sessionCard:{backgroundColor:CARD,borderRadius:14,padding:'1.1rem',border:`1px solid ${BORDER}`,marginBottom:'0.75rem',cursor:'pointer'},
  sessionHeader:{display:'flex',alignItems:'center',gap:'0.8rem',marginBottom:'0.5rem'},
  sessionIcon:{width:40,height:40,borderRadius:10,backgroundColor:'#2e1e3a',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0},
  sessionTitle:{fontSize:'1rem',fontWeight:800,color:TEXT},
  sessionMeta:{fontSize:'0.8rem',color:MUTED,fontWeight:600},
  bookmarkCount:{marginLeft:'auto',backgroundColor:'rgba(45,212,191,0.15)',border:`1px solid ${TEAL}`,borderRadius:20,padding:'0.2rem 0.7rem',fontSize:'0.8rem',fontWeight:700,color:TEAL},
  questionCard:{backgroundColor:'#0d1f2d',borderRadius:10,padding:'0.9rem',marginTop:'0.5rem',border:`1px solid ${BORDER}`},
  questionNum:{fontSize:'0.75rem',color:TEAL,fontWeight:700,marginBottom:'0.3rem'},
  questionText:{fontSize:'0.95rem',fontWeight:700,color:TEXT,lineHeight:1.5},
  emptyCard:{backgroundColor:CARD,borderRadius:16,padding:'2.5rem',border:`1px solid ${BORDER}`,textAlign:'center',marginTop:'1rem'},
  emptyIcon:{fontSize:56,marginBottom:'1rem'},
  emptyTitle:{fontSize:'1.3rem',fontWeight:900,color:TEXT,marginBottom:'0.5rem'},
  emptySub:{fontSize:'1rem',color:MUTED,fontWeight:600},
};

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const all = await examService.getUserExamSessions(user.uid);
        // Only sessions that have bookmarks
        const withBookmarks = all.filter(s => s.bookmarks && s.bookmarks.length > 0);
        setSessions(withBookmarks);
      } catch (e) {}
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  const totalBookmarks = sessions.reduce((sum, s) => sum + (s.bookmarks?.length || 0), 0);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => navigate('/dashboard')}>←</button>
        <div style={s.headerTitle}>Bookmarks</div>
      </div>
      <div style={s.body}>
        <div style={s.banner}>
          <div style={s.bannerTitle}>🔖 Saved Questions</div>
          <div style={s.bannerSub}>{totalBookmarks} bookmarked question{totalBookmarks !== 1 ? 's' : ''} across {sessions.length} exam session{sessions.length !== 1 ? 's' : ''}.</div>
        </div>

        {loading ? (
          <div style={{textAlign:'center',padding:'3rem',color:MUTED,fontSize:'1.1rem',fontWeight:700}}>Loading bookmarks...</div>
        ) : sessions.length > 0 ? (
          <>
            <div style={s.sectionTitle}>Bookmarked Sessions</div>
            {sessions.map(session => (
              <div key={session.id} style={s.sessionCard} onClick={() => setExpanded(expanded === session.id ? null : session.id)}>
                <div style={s.sessionHeader}>
                  <div style={s.sessionIcon}>📝</div>
                  <div>
                    <div style={s.sessionTitle}>{session.exam_type === 'mock' ? 'Mock Exam' : 'Past Questions'} Session</div>
                    <div style={s.sessionMeta}>
                      {session.created_at?.toDate?.().toLocaleDateString?.() || 'Recent'} · Score: {session.percentage || 0}%
                    </div>
                  </div>
                  <div style={s.bookmarkCount}>🔖 {session.bookmarks.length}</div>
                </div>
                {expanded === session.id && (
                  <div>
                    {session.detailed_results
                      ?.filter(r => session.bookmarks.includes(r.question_id))
                      .map((r, i) => (
                        <div key={r.question_id} style={s.questionCard}>
                          <div style={s.questionNum}>Question {i + 1} · {r.is_correct ? '✅ Correct' : '❌ Incorrect'}</div>
                          <div style={s.questionText}>{r.question_text}</div>
                          {r.explanation && (
                            <div style={{fontSize:'0.85rem',color:MUTED,marginTop:'0.5rem',fontWeight:600}}>
                              💡 {r.explanation}
                            </div>
                          )}
                        </div>
                      )) || (
                        <div style={{color:MUTED,fontSize:'0.9rem',fontWeight:600,padding:'0.5rem 0'}}>
                          Complete the exam to see bookmarked question details.
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div style={s.emptyCard}>
            <div style={s.emptyIcon}>🔖</div>
            <div style={s.emptyTitle}>No Bookmarks Yet</div>
            <div style={s.emptySub}>When you're taking an exam, tap the bookmark icon on any question to save it here for later review.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
