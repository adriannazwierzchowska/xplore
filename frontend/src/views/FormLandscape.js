import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PiMountainsLight } from "react-icons/pi";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';
import FormDots from './FormDots';

import { notifyInfo } from '../utils/toast';

const FormLandscape = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedTags, setSelectedTags] = useState([]);
    const { soundClick, soundSelect } = useSoundContext();
    const landscapeKeys = {
        land_mountains: 'Mountains',
        land_sea: 'Sea',
        land_lake: 'Lake',
        land_city: 'City',
    };

    useEffect(() => {
        const storedTags = Object.keys(landscapeKeys).filter(tag => sessionStorage.getItem(tag) === 'true');
        setSelectedTags(storedTags);
        sessionStorage.setItem('lastFormPath', location.pathname);
    }, [location.pathname]);

    const handleTagClick = (tag) => {
        soundSelect();
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(updatedTags);

        if (updatedTags.includes(tag)) {
            sessionStorage.setItem(tag, true);
        } else {
            sessionStorage.removeItem(tag);
        }
    };

    const handleNext = () => {
        soundClick();
        if (selectedTags.length === 0) {
            notifyInfo("Please select at least one type of landscape.");
            return;
        }

        navigate('/activities');
    };

    const handleSkip = () => {
        soundClick();
        selectedTags.forEach(tag => sessionStorage.removeItem(tag));
        setSelectedTags([]);
        navigate('/activities');
    }


    return (
        <motion.div
            className="form-landscape-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1>What landscape interests you?</h1>
                <motion.div
                    className="filter-tags"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {Object.keys(landscapeKeys).map(tag => (
                        <motion.span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {landscapeKeys[tag]}
                        </motion.span>
                    ))}
                </motion.div>
            </motion.form>

            <motion.div
                className="bottom-button-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <motion.button
                    type="button3"
                    onClick={() => { soundClick(); navigate(-1); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="chevron-left"></span> Go Back
                </motion.button>
                <FormDots />
                <div className="right-buttons">
                    <motion.button
                        type="button3"
                        onClick={handleSkip}
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
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <PiMountainsLight size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormLandscape;