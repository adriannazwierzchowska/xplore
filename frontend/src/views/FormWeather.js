import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCloud } from "react-icons/ci";
import { motion } from 'framer-motion'; // Importujemy framer-motion
import '../front.css';

const FormWeather = () => {
    const navigate = useNavigate();
    const [weather, setWeatherRange] = useState(0);

    const addWeather = async (e) => {
        e.preventDefault();
        sessionStorage.setItem('weather', weather);
        navigate('/stay');
    };

    return (
        <motion.div
            className="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.form
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
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
                        onChange={(e) => setWeatherRange(e.target.value)}
                        whileHover={{ scale: 1.1 }} // Efekt powiększenia przy najechaniu
                        transition={{ duration: 0.2 }}
                    />
                </div>
            </motion.form>

            <motion.div
                className="bottom-button-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
            >
                <motion.button
                    type="button3"
                    onClick={() => navigate(-1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="chevron-left"></span> Go Back
                </motion.button>
                <div className="right-buttons">
                    <motion.button
                        type="button3"
                        onClick={() => navigate('/stay')}
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
                transition={{ delay: 0.6, duration: 1 }}
            >
                <CiCloud size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormWeather;
