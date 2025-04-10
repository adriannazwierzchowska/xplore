import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiForkAndKnife } from "react-icons/ci";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../front.css';

const FormCuisine = () => {
    const navigate = useNavigate();
    const [cuisineValue, setCuisineValue] = useState("3");  // Default middle value
    const { soundClick, soundSelect } = useSoundContext();

    // Load saved value on component mount
    useEffect(() => {
        const savedValue = sessionStorage.getItem('cuisine');
        if (savedValue) {
            setCuisineValue(savedValue);
        }
    }, []);

    const handleSliderChange = (e) => {
        soundSelect(); // Add sound for slider movement
        setCuisineValue(e.target.value);
    };

    const handleNext = () => {
        soundClick(); // Add sound effect when clicking next
        sessionStorage.setItem('cuisine', cuisineValue);
        navigate('/analise');
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
                <h1>How important is local cuisine to you?</h1>
                <div className="slidecontainer">
                    <div className="slider-labels">
                        <span style={{ float: 'left', marginBottom: '10px' }}>Not important</span>
                        <span style={{ float: 'right', marginBottom: '10px' }}>Very important</span>
                    </div>
                    <motion.input
                        type="range"
                        min="1"
                        max="5"
                        className="slider"
                        id="cuisineRange"
                        value={cuisineValue}
                        onChange={handleSliderChange}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6 }}
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
                        soundClick(); // Add sound effect for back button
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
                            soundClick(); // Add sound effect for skip button
                            sessionStorage.removeItem('cuisine');
                            navigate('/analise');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip
                    </motion.button>

                    <motion.button
                        type="button1"
                        onClick={handleNext}
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
                transition={{ delay: 0.8, duration: 1 }}
            >
                <CiForkAndKnife size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormCuisine;
