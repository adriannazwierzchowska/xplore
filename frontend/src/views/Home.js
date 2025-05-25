import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaHeart, FaSignOutAlt, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { motion } from "framer-motion";
import { logoutUser } from "../api";
import { useSoundContext } from '../SoundContext';
import "../css/front.css";
import "../css/flight.css";
import "../css/home.css";
import FlightBoard from "./FlightBoard";


const Home = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("authToken") || null);
    const [message, setMessage] = useState("");
    const [isAnimated, setIsAnimated] = useState(false);
    const { isMuted, toggleMute, soundClick } = useSoundContext();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
    }, []);

    const handleLetsGo = () => {
        soundClick();
        setIsAnimated(true);
        navigate(isAuthenticated ? "/month" : "/login");
    };

    const handleLogout = async () => {
        soundClick();
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
        soundClick();
        navigate(isAuthenticated ? "/favorites" : "/login");
    };

    return (
        <div className="home-container">
             <motion.button
                 className={`sound-toggle ${isMuted ? 'muted' : ''}`}
                 onClick={toggleMute}
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.95 }}
             >
                 {isMuted ?
                     <FaVolumeMute size={20} color="#04384B"/> :
                     <FaVolumeUp size={20} color="#04384B"/>
                 }
             </motion.button>
            <form className="home-form">
                {username && (
                    <p className="welcome-text">Hi, <span className="username">{username}</span></p>
                )}
                <h1 className="main-title">
                    Let's{" "}
                    <span className="highlight-blue">
                        <img src={LogoX} alt="X Logo" className="logo-x" />
                        plore
                    </span>
                    !
                </h1>
                <div className="button-group">
                    <button type="button1" onClick={handleLetsGo}>Let's Go!</button>
                    <button type="button2" onClick={handleFavorites}>Favorites</button>
                    {isAuthenticated && <button type="button2" onClick={handleLogout}>Log Out</button>}
                </div>
            </form>

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
            <div className="flight-board-wrapper">
                <FlightBoard />
            </div>
        </div>
    );
};

export default Home;