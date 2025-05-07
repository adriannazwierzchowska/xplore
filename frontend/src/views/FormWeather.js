import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CiCloud } from "react-icons/ci";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';
import FormDots from './FormDots';


const FormWeather = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [weather, setWeatherRange] = useState(0);
    const { soundClick, soundSelect } = useSoundContext();

    useEffect(() => {
        const savedWeather = sessionStorage.getItem('weather');
        if (savedWeather !== null) {
            setWeatherRange(savedWeather);
        }
        sessionStorage.setItem('lastFormPath', location.pathname);
    }, [location.pathname]);

    const handleSliderChange = (e) => {
        soundSelect();
        setWeatherRange(e.target.value);
    };

    const addWeather = async (e) => {
        e.preventDefault();
        soundClick();
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
                        onChange={handleSliderChange}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        whileHover={{ scale: 1.1 }}
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
                    type="button"
                    onClick={() => { soundClick(); navigate(-1); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="chevron-left"></span> Go Back
                </motion.button>
                <FormDots />
                <div className="right-buttons">
                    <motion.button
                        type="button"
                        onClick={() => { soundClick(); navigate('/stay'); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip
                    </motion.button>

                    <motion.button
                        type="button"
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