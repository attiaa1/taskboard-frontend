import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
 
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password})
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token)
        navigate('/dashboard', { state: { username: username } })
      }
      console.log('Success:', data)

    } catch (err) {
      console.error('Error:', err)
    }
  };

  return (
    <div className='userCredentials'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className = "userButton" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

