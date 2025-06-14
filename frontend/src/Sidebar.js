import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaHome, FaHeart, FaCompass, FaUserCircle, FaTimes, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './css/sidebar.css';
import { useSoundContext } from './SoundContext';
import LogoX from "./static/logo512.png";

const Sidebar = ({ username }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { isMusicMuted, toggleMusicMute, soundClick } = useSoundContext();
    const isAuthenticated = !!localStorage.getItem("authToken");

    const toggleSidebar = () => {
        soundClick();
        setIsExpanded(!isExpanded);
    };

    const handleNavigate = (path) => {
        soundClick();
        if (path === '/favorites' && !isAuthenticated) {
            navigate('/login');
        } else if (path === '/xplore') {
            if (!isAuthenticated) {
                navigate('/login');
            } else {
                const lastFormPath = localStorage.getItem('lastFormPath');
                navigate(lastFormPath || '/month');
            }
        } else {
            navigate(path);
        }
        if (window.innerWidth < 768) {
            setIsExpanded(false);
        }
    };

    const navItems = [
        { icon: <FaHome />, text: 'Home', path: '/' },
        { icon: <FaHeart />, text: 'Favorites', path: '/favorites' },
        { icon: <FaCompass />, text: 'xplore', path: '/xplore' },
    ];

    return (
        <>
            <motion.button
                className="sidebar-toggle-button"
                onClick={toggleSidebar}
                animate={{ opacity: 1 }}
                style={{ pointerEvents: 'auto' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isExpanded ? (
                    <img src={LogoX} alt="Close menu" className="sidebar-logo" />
                ) : (
                    <img src={LogoX} alt="Open menu" className="sidebar-logo" />
                )}
            </motion.button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="sidebar expanded"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <nav>
                            <ul>
                                {navItems.map((item) => (
                                    <li key={item.text} onClick={() => handleNavigate(item.path)} className={location.pathname === item.path ? 'active' : ''}>
                                        {item.icon}
                                        <span>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="sidebar-bottom-section">
                            <div className="sidebar-mute-button" onClick={toggleMusicMute} title={isMusicMuted ? "Unmute" : "Mute"}>
                                {isMusicMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                <span>{isMusicMuted ? 'Unmute' : 'Mute'}</span>
                            </div>
                            {username && isAuthenticated && (
                                <div className="sidebar-user">
                                    <FaUserCircle />
                                    <span>{username}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isExpanded && (
                <motion.div
                    className="sidebar collapsed"
                    animate={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <nav>
                        <ul>
                            {navItems.map((item) => (
                                <li key={item.text} onClick={() => handleNavigate(item.path)} title={item.text} className={location.pathname === item.path ? 'active' : ''}>
                                    {item.icon}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="sidebar-bottom-section-collapsed"> 
                    <div className="sidebar-mute-button-collapsed" onClick={toggleMusicMute} title={isMusicMuted ? "Unmute" : "Mute"}>
                        {isMusicMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </div>
                    {username && isAuthenticated && (
                        <div className="sidebar-user" title={username}>
                            <FaUserCircle />
                        </div>
                    )}
                </div>
                </motion.div>
            )}
        </>
    );
};

export default Sidebar;