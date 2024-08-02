import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle registration logic here
    if (password === confirmPassword) {
      try{
        const response = await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password})
        });
        const data = await response.json();
        console.log('Success:', data)
        navigate('/login');

      } catch (err) {
        console.error('Error:', err)
      }
      
    } else {
      console.log('Passwords do not match');
    }
  };

  return (
    <div className='userCredentials'>
      <h2>Register</h2>
      <h3>If you already have an <br></br> account, please <Link to='/login'>login</Link>.</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label className='userLabel'>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className='userLabel'>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className='userLabel'>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className = "userButton" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

