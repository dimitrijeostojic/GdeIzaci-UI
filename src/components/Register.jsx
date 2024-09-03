import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('RegularUser');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Koristi useNavigate za preusmeravanje

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedRoles = [role];
    try {
      const response = await axios.post('https://localhost:5000/api/Auth/Register', {
        username,
        email,
        password,
        roles: selectedRoles
      });
      setError('');
      navigate('/home'); // Preusmeri na stranicu dobrodošlice
      localStorage.setItem('token', response.data.jwtToken);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.roles[0]);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors;
        console.error('Validation errors:', errors);

        // Na primer, možeš proći kroz greške i prikazati ih
        for (const [field, messages] of Object.entries(errors)) {
            console.error(`${field}: ${messages.join(', ')}`);
        }
        alert('Error: ' + Object.values(errors).flat().join('\n'));
        setError('Registration failed. Please try again.');
    } else {
        console.error('Error register:', error);
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" className="register-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="email" placeholder="Email" className="register-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="register-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="register-button">Register</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="login-redirect">
          <p>Already have an account?  <Link to="/login" className="login-link">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
