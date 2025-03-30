import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { logoutUser } from "../api";
import "../front.css";

const Home = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("authToken") || null);
    const [message, setMessage] = useState("");
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
    }, []);

    const handleLetsGo = () => {
        setIsAnimated(true);
        setTimeout(() => {
            navigate(isAuthenticated ? "/month" : "/login");
        }, 2000);
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("authToken");
            setUsername(null);
            navigate("/login");
        } catch (error) {
            setMessage(error.response?.data?.error || "Logout error");
        }
    };

    const handleFavorites = () => {
        navigate(isAuthenticated ? "/favorites" : "/login");
    };

    return (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white min-h-screen flex flex-col items-center justify-center relative">
            <motion.h1
                className="text-5xl font-bold mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                Let's xplore
            </motion.h1>

            <motion.div
                className="button-group flex gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
            >
                <motion.button
                    className="px-8 py-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105"
                    onClick={handleLetsGo}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaPlaneDeparture /> Let's Go!
                </motion.button>

                <motion.button
                    className="px-8 py-4 flex items-center gap-2 bg-pink-500 hover:bg-pink-600 transition-all duration-300 text-white text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105"
                    onClick={handleFavorites}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaHeart /> Favorites
                </motion.button>

                {isAuthenticated && (
                    <motion.button
                        className="px-8 py-4 flex items-center gap-2 bg-red-500 hover:bg-red-600 transition-all duration-300 text-white text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105"
                        onClick={handleLogout}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaSignOutAlt /> Log Out
                    </motion.button>
                )}
            </motion.div>

            {username && <p className="mt-4 text-lg">Hi, {username}!</p>}

            {isAnimated && (
                <motion.div
                    className="absolute"
                    initial={{ x: 0, y: 0, scale: 1, opacity: 0.8 }}
                    animate={{
                        x: window.innerWidth * 2,
                        y: 0,
                        scale: 10,
                        opacity: 0,
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeOut"
                    }}
                >
                    <FaPlaneDeparture className="text-4xl text-yellow-500" />
                </motion.div>
            )}
        </div>
    );
};

export default Home;
