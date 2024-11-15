import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser, logoutUser } from "./api";
import './front.css';

const Home = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('authToken') || null);
    const [message, setMessage] = useState('');

    // useEffect(() => {
    //     try {
    //         const response = currentUser();
    //         setUsername(response.data.username);
    //         setIsAuthenticated(true);
    //     } catch (error) {
    //         setMessage(error.response?.data?.error || '"Error fetching user info"');
    //     }
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    const handleLetsGo = () => {
        if (isAuthenticated) {
            navigate('/questionnaire');
        } else {
            navigate('/login');
        }
    };

    const handleLogout = async () => {
        try {
            const response = await logoutUser();
            localStorage.removeItem('authToken');
            setUsername(null);
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data?.error || '"Logout error"');
        }
    };

    return (
        <div>
            <h1>Let's xplore</h1>
            <button type="button1" onClick={handleLetsGo}>Let's Go!</button>
            <button type="button2">Favorites</button>
            {isAuthenticated && <button type="button2" onClick={handleLogout}>Log Out</button>}
            {username ? <p>Hi, {username}</p> : null}
        </div>
    );
};

export default Home;
