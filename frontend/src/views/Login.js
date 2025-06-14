import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../css/front.css';
import { loginUser } from "../api";
import { useSoundContext } from '../SoundContext';
import FlightBoard from './FlightBoard';
import '../css/flight.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { soundClick } = useSoundContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        soundClick();

        try {
            const response = await loginUser(username, password);
            localStorage.setItem('authToken', response.data.username);
            navigate('/');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <motion.div
            className="home-container login-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
        <div className="home-form">
            <motion.form
                onSubmit={handleLogin}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Log In</h1>
                <label htmlFor="username">Username</label>
                <motion.input
                    type="text"
                    id="login"
                    name="login"
                    placeholder="Enter your login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    whileFocus={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                />
                <label htmlFor="password">Password</label>
                <motion.input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    whileFocus={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                />
                <motion.div
                    className="button-group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                >
                    <motion.button
                        type="submit"
                        className="login-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Log In
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={() => { soundClick(); navigate('/register'); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Sign Up
                    </motion.button>
                </motion.div>
                {message &&
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="error-message"
                    >
                        {message}
                    </motion.p>
                }
            </motion.form>
            </div>
             <motion.div
                 className="bottom-button-group"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.6, duration: 0.8 }}
             >
                 <motion.button
                     type="button"
                     onClick={() => { soundClick(); navigate('/'); }}
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                 >
                     <span className="chevron-left"></span> Go back
                 </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default Login;