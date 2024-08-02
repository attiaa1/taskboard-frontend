import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Forbidden from './components/Forbidden';
import './App.css';

function App() {
  return (
    <div className='appWrapper'>
      <h1>Adam's Taskboard Website</h1>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forbidden" element={<Forbidden />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;