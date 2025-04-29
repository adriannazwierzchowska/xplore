import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { registerUser } from "../api";
import { useNavigate } from 'react-router-dom';
import { useSoundContext } from '../SoundContext';
import '../front.css';

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
            className="register-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
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

                <motion.input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05, borderColor: "#6200ea" }}
                    transition={{ duration: 0.2 }}
                />
                <motion.input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05, borderColor: "#6200ea" }}
                    transition={{ duration: 0.2 }}
                />
                <motion.input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    whileFocus={{ scale: 1.05, borderColor: "#6200ea" }}
                    transition={{ duration: 0.2 }}
                />

                <motion.div className="button-group">
                     <motion.button
                         type="button"
                         onClick={() => { soundClick(); navigate('/login'); }}
                         whileHover={{ scale: 1.1, backgroundColor: "#3700b3" }}
                         whileTap={{ scale: 0.95 }}
                         transition={{ duration: 0.2 }}
                     >
                         Back to Login
                     </motion.button>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.1, backgroundColor: "#3700b3" }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        Register
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
                     <span className="chevron-left"></span> Go Back
                 </motion.button>
             </motion.div>
        </motion.div>
    );
};

export default Register;