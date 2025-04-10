import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { loginUser } from '../api';
import { useSoundContext } from '../SoundContext';
import '../front.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { soundClick } = useSoundContext();

    const handleLogin = async (e) => {
        e.preventDefault();
        soundClick(); // Add sound when logging in

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
            className="login-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.form 
                onSubmit={handleLogin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                <h1>Login</h1>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {message && <p className="message">{message}</p>}
                <motion.div
                    className="button-group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <motion.button 
                        type="button" 
                        onClick={() => {
                            soundClick(); // Add sound when going back
                            navigate('/');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="chevron-left"></span> Go Back
                    </motion.button>
                    <motion.button 
                        type="button" 
                        onClick={() => {
                            soundClick(); // Add sound when going to register
                            navigate('/register');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Register
                    </motion.button>
                    <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Login <span className="chevron-right"></span>
                    </motion.button>
                </motion.div>
            </motion.form>
        </motion.div>
    );
};

export default Login;
