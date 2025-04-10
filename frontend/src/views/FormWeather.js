import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCloud } from "react-icons/ci";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../front.css';

const FormWeather = () => {
    const navigate = useNavigate();
    const [weather, setWeatherRange] = useState("3");  // Default middle value
    const { soundClick, soundSelect } = useSoundContext();

    // Load saved value if it exists
    useEffect(() => {
        const savedWeather = sessionStorage.getItem('weather');
        if (savedWeather) {
            setWeatherRange(savedWeather);
        }
    }, []);

    const addWeather = async (e) => {
        e.preventDefault();
        soundClick(); // Add sound when clicking next
        sessionStorage.setItem('weather', weather);
        navigate('/stay');
    };

    return (
        <motion.div
            className="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>What kind of weather do you prefer?</h1>
                <div className="slidecontainer">
                    <div className="slider-labels">
                        <span style={{ float: 'left', marginBottom: '10px' }}>Very cold</span>
                        <span style={{ float: 'right', marginBottom: '10px' }}>Very hot</span>
                    </div>
                    <motion.input
                        type="range"
                        min="1"
                        max="5"
                        value={weather}
                        className="slider"
                        id="weatherRange"
                        onChange={(e) => {
                            soundSelect(); // Add sound when selecting range
                            setWeatherRange(e.target.value);
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    />
                </div>
            </motion.form>

            <motion.div
                className="bottom-button-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                <motion.button
                    type="button3"
                    onClick={() => {
                        soundClick(); // Add sound when going back
                        navigate(-1);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="chevron-left"></span> Go Back
                </motion.button>
                <div className="right-buttons">
                    <motion.button
                        type="button3"
                        onClick={() => {
                            soundClick(); // Add sound when skipping
                            navigate('/stay');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip
                    </motion.button>

                    <motion.button
                        type="button1"
                        onClick={addWeather}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Next <span className="chevron-right"></span>
                    </motion.button>
                </div>
            </motion.div>

            <motion.div
                className="page-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <CiCloud size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormWeather;
