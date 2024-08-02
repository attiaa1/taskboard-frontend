import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import Forbidden from "./Forbidden";

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || 'Guest';
    
    useEffect(() => {
        
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debugging

        if(token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            navigate('/login');
        }
        
        // does not allow unauthorized user to access /dashboards without logging in first
        console.log('isAuthenticated:', isAuthenticated); // Debugging line
        if (isAuthenticated === false) {
            navigate('/forbidden');
        }


    },[isAuthenticated, navigate]);


    return (
        <>
        <h2> Welcome, {username}! </h2>
        <h3> Here's your dashboard:</h3>
        </>
    );
}

export default Dashboard;