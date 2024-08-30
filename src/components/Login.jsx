import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://localhost:5000/api/Auth/Login', {
        username,
        password
      });
      // Sačuvaj token u localStorage
      localStorage.setItem('token', response.data.jwtToken);
      localStorage.setItem('username', response.data.username);
      setError('');
      navigate('/home');

    } catch (error) {
      setError('Login failed. Please try again.');
      console.log(error.response.data);
    }
  };



  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form">
          <input type="username" placeholder="Username" className="login-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" onClick={handleSubmit} className="login-button">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className='registration-redirect'>
          <p>You don't have an account? <Link to="/register" className="register-link">Registration</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
