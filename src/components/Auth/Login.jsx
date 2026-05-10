import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../services/firebase';

const BG = '#0d1f2d';
const CARD = '#132233';
const TEAL = '#2dd4bf';
const INPUT_BG = '#1a2e40';
const BORDER = '#1e3a50';
const TEXT = '#f0f9ff';
const MUTED = '#94a3b8';

const styles = {
  page: { minHeight:'100vh', backgroundColor:BG, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', fontFamily:"'Poppins', sans-serif" },
  card: { width:'100%', maxWidth:'440px', backgroundColor:CARD, borderRadius:'20px', padding:'2.2rem', border:`1px solid ${BORDER}`, boxShadow:'0 25px 60px rgba(0,0,0,0.5)' },
  logoRow: { display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' },
  logoBox: { width:58, height:58, borderRadius:14, background:'linear-gradient(135deg,#1e4d6b,#0d3352)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0, border:`1px solid ${BORDER}` },
  appName: { fontSize:'1.6rem', fontWeight:900, color:TEXT, letterSpacing:'0.03em' },
  appSub: { fontSize:'0.9rem', color:MUTED, fontWeight:600, marginTop:2 },
  welcomeText: { fontSize:'2.2rem', fontWeight:900, color:TEXT, marginBottom:'0.5rem' },
  subText: { fontSize:'1.1rem', color:MUTED, fontWeight:600, marginBottom:'1.8rem', lineHeight:1.5 },
  errorBox: { backgroundColor:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.4)', borderRadius:10, padding:'0.9rem 1rem', color:'#fca5a5', fontSize:'1rem', fontWeight:700, marginBottom:'1.2rem' },
  form: { display:'flex', flexDirection:'column', gap:'1.2rem' },
  fieldGroup: { display:'flex', flexDirection:'column', gap:'0.5rem' },
  label: { fontSize:'1.1rem', fontWeight:800, color:TEXT },
  input: { width:'100%', padding:'1rem 1.1rem', backgroundColor:INPUT_BG, border:`1.5px solid ${BORDER}`, borderRadius:12, color:TEXT, fontSize:'1.1rem', fontWeight:600, outline:'none', boxSizing:'border-box' },
  passwordWrapper: { position:'relative' },
  eyeBtn: { position:'absolute', right:'1rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:MUTED, cursor:'pointer', display:'flex', alignItems:'center', padding:0 },
  forgotRow: { textAlign:'right', marginTop:'-0.4rem' },
  forgotLink: { color:TEAL, fontSize:'1rem', fontWeight:700, textDecoration:'underline', textUnderlineOffset:3 },
  signInBtn: { width:'100%', padding:'1.1rem', backgroundColor:TEAL, color:'#0d1f2d', border:'none', borderRadius:12, fontSize:'1.2rem', fontWeight:900, cursor:'pointer', letterSpacing:'0.02em' },
  divider: { display:'flex', alignItems:'center', gap:'0.75rem', margin:'1.5rem 0' },
  dividerLine: { flex:1, height:1, backgroundColor:BORDER },
  dividerText: { color:MUTED, fontSize:'0.9rem', fontWeight:800, letterSpacing:'0.1em' },
  googleBtn: { width:'100%', padding:'1rem', backgroundColor:INPUT_BG, color:TEXT, border:`1.5px solid ${BORDER}`, borderRadius:12, fontSize:'1.1rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' },
  signupRow: { textAlign:'center', marginTop:'1.4rem', fontSize:'1.05rem', fontWeight:700, color:MUTED },
  signupLink: { color:TEAL, fontWeight:900, textDecoration:'underline', textUnderlineOffset:3 },
  footerNote: { textAlign:'center', marginTop:'1.2rem', padding:'0.8rem', backgroundColor:'rgba(255,255,255,0.04)', borderRadius:10, border:`1px solid ${BORDER}`, color:MUTED, fontSize:'0.95rem', fontWeight:700 },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>📚</div>
          <div>
            <div style={styles.appName}>NMCN CBT</div>
            <div style={styles.appSub}>Nursing Exam Prep Platform</div>
          </div>
        </div>

        <div style={styles.welcomeText}>Welcome Back</div>
        <div style={styles.subText}>Sign in to continue your exam preparation</div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={styles.input} />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required style={{ ...styles.input, paddingRight:'3.2rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
              </button>
            </div>
          </div>

          <div style={styles.forgotRow}>
            <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} style={styles.signInBtn}>
            {loading ? 'Signing in...' : '🔒 Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine} />
        </div>

        <button onClick={handleGoogleSignIn} disabled={googleLoading} style={styles.googleBtn}>
          <svg width="22" height="22" viewBox="0 0 48 48" style={{ marginRight:10, flexShrink:0 }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? 'Connecting...' : 'Continue with Google'}
        </button>

        <div style={styles.signupRow}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.signupLink}>Create one free</Link>
        </div>

        <div style={styles.footerNote}>
          🏥 Exclusively for NMCN-registered nursing students
        </div>
      </div>
    </div>
  );
};

export default Login;
