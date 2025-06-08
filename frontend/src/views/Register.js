import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from "../api";
import { useNavigate } from 'react-router-dom';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';
import FlightBoard from './FlightBoard';
import '../css/flight.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { soundClick } = useSoundContext();

    const handleRegister = async (e) => {
        e.preventDefault();
        soundClick();

        try {
            const response = await registerUser(username, password, email);
            setMessage(response.data.message);
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <motion.div
            className="home-container register-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
        <div className="home-form">
            <motion.form
                onSubmit={handleRegister}
                className="register-form"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Register
                </motion.h1>
                <label htmlFor="username">Username</label>
                <motion.input
                    type="text"
                    placeholder="Choose your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05, borderColor: "#6200ea" }}
                    transition={{ duration: 0.2 }}
                />
                <label htmlFor="password">Password</label>
                <motion.input
                    type="password"
                    placeholder="Choose your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05, borderColor: "#6200ea" }}
                    transition={{ duration: 0.2 }}
                />
                <label htmlFor="email">Email</label>
                <motion.input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05, borderColor: "#6200ea" }}
                    transition={{ duration: 0.2 }}
                />

                <motion.div className="button-group">
                    <motion.button
                        type="submit"
                        className="login-btn"
                        whileHover={{ scale: 1.1}}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Register
                    </motion.button>
                    <motion.button
                         type="button"
                         className="back-to-login-btn"
                         onClick={() => { soundClick(); navigate('/login'); }}
                         whileHover={{ scale: 1.1}}
                         whileTap={{ scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                     >
                         Back to Login
                     </motion.button>
                </motion.div>

                {message && <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    {message}
                </motion.p>}
            </motion.form>
            </div>
            <div className="flight-board-wrapper">
                <FlightBoard />
            </div>
             <motion.div
                 className="bottom-button-group"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.6, duration: 0.8 }}
             >
                 <motion.button
                     type="button"
                     onClick={() => { soundClick(); navigate('/login'); }}
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                 >
                     <span className="chevron-left"></span> Go back
                 </motion.button>
             </motion.div>
        </motion.div>
    );
};

export default Register;