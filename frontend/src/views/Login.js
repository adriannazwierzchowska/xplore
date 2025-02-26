import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Importujemy framer-motion
import '../front.css';
import { loginUser } from "../api";

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
        <motion.div
            className="login-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.form
                onSubmit={handleLogin}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Log in</h1>
                <label htmlFor="login">Login</label>
                <motion.input
                    type="text"
                    id="login"
                    name="login"
                    placeholder="Enter your login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    whileFocus={{ scale: 1.05 }} // Zmiana rozmiaru po kliknięciu w input
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
                    whileFocus={{ scale: 1.05 }} // Zmiana rozmiaru po kliknięciu w input
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
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Login
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={() => navigate('/register')}
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
        </motion.div>
    );
};

export default Login;
