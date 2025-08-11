import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Login.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await AuthService.signup(username, email, password);
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{background: 'linear-gradient(120deg,#e0e7ff 0%,#f5f7fa 100%)'}}>
      <div className="login-card">
        <div className="login-header">
          <h1>Sign Up</h1>
          <p>Create your account to access the dashboard</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a username" disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" disabled={loading} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" disabled={loading} />
          </div>
          <button type="submit" className="login-button" disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        </form>
        <div className="login-footer">
          <span>Already have an account?</span>
          <button type="button" style={{marginLeft:8,padding:'6px 16px',background:'linear-gradient(90deg,#6366f1,#f472b6)',color:'#fff',border:'none',borderRadius:4,fontWeight:600,cursor:'pointer',boxShadow:'0 2px 8px #6366f122'}} onClick={()=>navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
