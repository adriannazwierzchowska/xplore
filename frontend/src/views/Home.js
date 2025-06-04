import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlaneDeparture, FaHeart, FaSignOutAlt, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { motion } from "framer-motion";
import { logoutUser } from "../api";
import { useSoundContext } from '../SoundContext';
import "../css/front.css";
import "../css/flight.css";
import "../css/home.css";
import "../css/home-extended.css";
import FlightBoard from "./FlightBoard";
import CommunityFavoritesDisplay from '../components/CommunityFavoritesDisplay';
import LastViewedPlacesDisplay from '../components/LastViewedPlacesDisplay';
import LastFlightsDisplay from '../components/LastFlightsDisplay';
import PlaceDetailsSidebar from '../components/PlaceDetailsSidebar';
import '../css/recommendation.css';

const Home = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem("authToken") || null);
    const [message, setMessage] = useState("");
    const [isAnimated, setIsAnimated] = useState(false);
    const { isMusicMuted, toggleMusicMute, soundClick } = useSoundContext();
    const [activeTab, setActiveTab] = useState('places');
    const [placeForSidebar, setPlaceForSidebar] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);

        const lastViewed = JSON.parse(localStorage.getItem('lastViewedPlaces')) || [];
        const lastFlights = JSON.parse(localStorage.getItem('lastFlightSearches')) || [];

        if (isAuthenticated) {
            if (lastViewed.length === 0) {
                setActiveTab('community');
            } else {
                setActiveTab('places');
            }
        }

    }, [isAuthenticated]);

    const handleLetsGo = () => {
        soundClick();
        //setIsAnimated(true);
        setTimeout(() => {
            navigate(isAuthenticated ? (localStorage.getItem("lastFormPath") == null ? "/month" : "/continue") : "/login");
        }, 300);
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

    const handleOpenPlaceSidebar = (placeData) => {
        soundClick();
        setPlaceForSidebar(placeData);
    };

    const handleClosePlaceSidebar = () => {
        soundClick();
        setPlaceForSidebar(null);
    };

    return (
        <div className="home-container">
             {/* <motion.button
                 className={`sound-toggle ${isMusicMuted ? 'muted' : ''}`}
                 onClick={() => {
                    soundClick();
                    toggleMusicMute();
                 }}
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.95 }}
             >
                 {isMusicMuted ?
                     <FaVolumeMute size={20} color="#04384B"/> :
                     <FaVolumeUp size={20} color="#04384B"/>
                 }
             </motion.button> */}
            <div className="home-content-wrapper">
                <div className="home-form">
                    {username && (
                        <p className="welcome-text">Hi, <span className="username">{username}</span></p>
                    )}
                    <h1 className="main-title">
                        Let's <span className="highlight-blue">xplore</span>!
                    </h1>
                    <div className="button-group">
                        <button type="button1" onClick={handleLetsGo}>Let's Go!</button>
                        <button type="button2" onClick={handleFavorites}>Favorites</button>
                        {isAuthenticated && <button type="button2" onClick={handleLogout}>Log Out</button>}
                    </div>
                </div>

                {isAuthenticated && (
                    <div className="home-dynamic-section">
                        <div className="home-section-toggle">
                            <button
                                className={`toggle-button ${activeTab === 'places' ? 'active' : ''}`}
                                onClick={() => setActiveTab('places')}
                            >
                                Your last places
                            </button>
                            <button
                                className={`toggle-button ${activeTab === 'flights' ? 'active' : ''}`}
                                onClick={() => setActiveTab('flights')}
                            >
                                Your last flights
                            </button>
                            <button
                                className={`toggle-button ${activeTab === 'community' ? 'active' : ''}`}
                                onClick={() => setActiveTab('community')}
                            >
                                Community favorites
                            </button>
                        </div>
                        <div className="home-dynamic-content-area">
                            {activeTab === 'places' && <LastViewedPlacesDisplay onPlaceCardClick={handleOpenPlaceSidebar} />}
                            {activeTab === 'flights' && <LastFlightsDisplay />}
                            {activeTab === 'community' && <CommunityFavoritesDisplay onPlaceCardClick={handleOpenPlaceSidebar} />}
                        </div>
                    </div>
                )}
            </div>

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
            {!isAuthenticated && (
                <div className="flight-board-wrapper">
                    <FlightBoard />
                </div>
            )}

            {placeForSidebar && (
                <PlaceDetailsSidebar
                    selectedPlaceData={placeForSidebar}
                    onClose={handleClosePlaceSidebar}
                    isAuthenticated={isAuthenticated}
                    username={username}
                />
            )}
        </div>
    );
};

export default Home;