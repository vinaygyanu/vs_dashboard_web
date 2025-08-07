import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const success = await AuthService.login(username, password);
      
      if (success) {
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Dashboard Login</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>
        
        {/* Signup link */}
        <div style={{textAlign:'center',marginBottom:16}}>
          <span style={{color:'#6366f1'}}>Don't have an account?</span>
          <button
            type="button"
            style={{marginLeft:8,padding:'6px 16px',background:'linear-gradient(90deg,#6366f1,#f472b6)',color:'#fff',border:'none',borderRadius:4,fontWeight:600,cursor:'pointer',boxShadow:'0 2px 8px #6366f122'}}
            onClick={()=>navigate('/signup')}
          >Sign Up</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p>Username: admin | Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
