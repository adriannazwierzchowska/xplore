import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CiForkAndKnife } from "react-icons/ci";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';
import FormDots from './FormDots';

const FormCuisine = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cuisine, setCuisineRange] = useState("3");
    const { soundClick, soundSelect } = useSoundContext();

    useEffect(() => {
        const savedValue = localStorage.getItem('cuisine');
        if (savedValue) {
            setCuisineRange(savedValue);
        }
        localStorage.setItem('lastFormPath', location.pathname);
    }, [location.pathname]);

    const handleSliderChange = (e) => {
        soundSelect();
        setCuisineRange(e.target.value);
    };


    const addCuisine = async (e) => {
        e.preventDefault();
        soundClick();
        localStorage.setItem('cuisine', cuisine);
        navigate('/analise');
    };

     const handleSkip = () => {
         soundClick();
         localStorage.removeItem('cuisine');
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
                        value={cuisine}
                        className="slider"
                        id="weatherRange"
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
                        onClick={addCuisine}
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