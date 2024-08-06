import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import TaskModal from "./TaskModal";
import '@fortawesome/fontawesome-free/css/all.min.css';

const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [tasks, setTasks] = useState({
        'To Do': [],
        'In Progress': [],
        'Done': []
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentColumn, setCurrentColumn] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const { username } = location.state || 'Guest';
    const token = localStorage.getItem('token');

    // checks to see if user is logged in before allowing to see /dashboard
    useEffect(() => {
        console.log('Token:', token); // Debugging

        if(token && username) {
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

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch('http://localhost:5000/tasks', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
                    }
                });
                const data = await response.json();
                console.log('Fetched tasks:', data);

                // Populate the tasks state
                const tasksByColumn = {
                    'To Do': [],
                    'In Progress': [],
                    'Done': []
                };

                data.forEach(task => {
                    tasksByColumn[task.column].push(task);
                });

                setTasks(tasksByColumn);
            } catch (error) {
                console.error('Error fetching tasks:', error);
                setIsAuthenticated(false);
                navigate('/login');
            }
        };

        fetchTasks();
    }, []);

    const addTask = (task) => {
        // Ensure currentColumn is defined
        if (!currentColumn) {
            console.error('Error: currentColumn is not defined');
            return;
        }
    
        // Ensure task object contains all required fields
        if (!task || !task.name) {
            console.error('Error: task object is missing required fields');
            return;
        }
    
        const taskWithColumn = { ...task, column: currentColumn };
        console.log('Adding task:', taskWithColumn);
    
        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
            },
            body: JSON.stringify(taskWithColumn), // Ensure column is included
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Ensure the task object is correctly structured
            if (data && data.name) {
                setTasks(prevTasks => ({
                    ...prevTasks,
                    [currentColumn]: [...prevTasks[currentColumn], data]
                }));
            } else {
                console.error('Invalid task data:', data);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const deleteTask = (column, taskId) => {
        fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Deleted:', data);
            setTasks(prevTasks => ({
                ...prevTasks,
                [column]: prevTasks[column].filter(task => task._id !== taskId)
            }));
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    const updateTask = (taskId, updates) => {
        fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add the Bearer token to the headers
            },
            body: JSON.stringify(updates)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Updated:', data);
            setTasks(prevTasks => {
                const updatedTasks = { ...prevTasks };
                Object.keys(updatedTasks).forEach(column => {
                    updatedTasks[column] = updatedTasks[column].filter(task => task._id !== taskId);
                });
                updatedTasks[data.column].push(data);
                return updatedTasks;
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
    


    const openModal = (column) => {
        setCurrentColumn(column);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
        <h2> Welcome, {username}! </h2>
        <div className="dashboard">
            <div className="dashboardColumn">
                <h1>To Do</h1>
                <button onClick={() => openModal('To Do')}>Add Task</button>
                <div className="taskList">
                    {tasks['To Do'].map((task, index) => (
                        <div key={index} className="task">
                            <button className="deleteButton" onClick={() => deleteTask('To Do', task._id)}>X</button>
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Due Date: {formatDate(task.dueDate)}</p>
                            <p>Completed: {task.completed ? <i className="fas fa-check-circle"></i> : <i className="fas fa-times-circle"></i>} 
                                <button onClick={() => updateTask(task._id, { completed: !task.completed })}>
                                    <i className="fas fa-sync-alt"></i>
                                </button>
                            </p> 
                            <p>Priority: {task.priority}</p>
                            <button onClick={() => updateTask(task._id, { column: 'In Progress' })}>
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dashboardColumn">
                <h1>In Progress</h1>
                <button onClick={() => openModal('In Progress')}>Add Task</button>
                <div className="taskList">
                    {tasks['In Progress'].map((task, index) => (
                        <div key={index} className="task">
                            <button className="deleteButton" onClick={() => deleteTask('In Progress', task._id)}>X</button>
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Due Date: {formatDate(task.dueDate)}</p>
                            <p>Completed: {task.completed ? <i className="fas fa-check-circle"></i> : <i className="fas fa-times-circle"></i>} 
                                <button onClick={() => updateTask(task._id, { completed: !task.completed })}>
                                    <i className="fas fa-sync-alt"></i>
                                </button>
                            </p>
                            <p>Priority: {task.priority}</p>
                            <button onClick={() => updateTask(task._id, { column: 'To Do' })}>
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <button onClick={() => updateTask(task._id, { column: 'Done' })}>
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="dashboardColumn">
                <h1>Done</h1>
                <button onClick={() => openModal('Done')}>Add Task</button>
                <div className="taskList">
                    {tasks['Done'].map((task, index) => (
                        <div key={index} className="task">
                            <button className="deleteButton" onClick={() => deleteTask('Done', task._id)}>X</button>
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Due Date: {formatDate(task.dueDate)}</p>
                            <p>Completed: {task.completed ? <i className="fas fa-check-circle"></i> : <i className="fas fa-times-circle"></i>} 
                                <button onClick={() => updateTask(task._id, { completed: !task.completed })}>
                                    <i className="fas fa-sync-alt"></i>
                                </button>
                            </p>
                            <p>Priority: {task.priority}</p>
                            <button onClick={() => updateTask(task._id, { column: 'In Progress' })}>
                                <i className="fas fa-arrow-left"></i>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={addTask}
        />
    </>
    

    );
    
}

export default Dashboard;
