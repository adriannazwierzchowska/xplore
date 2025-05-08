import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaHome, FaHeart, FaCompass, FaUserCircle, FaTimes } from 'react-icons/fa';
import './css/sidebar.css';
import { useSoundContext } from './SoundContext';

const Sidebar = ({ username, isHome }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { soundClick } = useSoundContext();
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
                const lastFormPath = sessionStorage.getItem('lastFormPath');
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
        { icon: <FaHome />, text: 'home', path: '/' },
        { icon: <FaHeart />, text: 'favourites', path: '/favorites' },
        { icon: <FaCompass />, text: 'xplore', path: '/xplore' },
    ];

    return (
        <>
            <motion.button
                className="sidebar-toggle-button"
                onClick={toggleSidebar}
                animate={{ opacity: isHome ? 0 : 1 }}
                style={{ pointerEvents: isHome ? 'none' : 'auto' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isExpanded ? <FaTimes /> : <FaBars />}
            </motion.button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="sidebar expanded"
                        initial={{ x: '-100%' }}
                        animate={{ x: isHome ? '-100%' : 0 }}
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
                        {username && isAuthenticated && (
                            <div className="sidebar-user">
                                <FaUserCircle />
                                <span>{username}</span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            {!isExpanded && (
                <motion.div 
                    className="sidebar collapsed"
                    animate={{ x: isHome ? -70 : 0 }}
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
                    {username && isAuthenticated && (
                        <div className="sidebar-user" title={username}>
                            <FaUserCircle />
                        </div>
                    )}
                </motion.div>
            )}
        </>
    );
};

export default Sidebar;