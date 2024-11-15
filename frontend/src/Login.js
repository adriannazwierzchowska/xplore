import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './front.css';
import { loginUser } from "./api";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(username, password);
            localStorage.setItem('authToken', response.data.username);
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Login failed');
        }
    };
      

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h1>Log in</h1>
                <label htmlFor="login">Login</label>
                <input type="text" id="login" name="login" placeholder="Enter your login" value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Enter your password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="button-group">
                    <button type="button1">Login</button>
                    <button type="button2" onClick={() => navigate('/register')}>Sign Up</button>
                </div>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Login;