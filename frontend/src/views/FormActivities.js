import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiLifebuoyThin } from "react-icons/pi";
import { motion } from 'framer-motion'; // Importujemy framer-motion
import '../front.css';

const FormActivities = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const activitiesTag = {
        act_water: 'Water activities',
        act_sightseeing: 'Sightseeing',
        act_museums: 'Visiting museums',
        act_nightlife: 'Nightlife',
        act_beach: 'Relaxing on the beach',
        act_nature: 'Experiencing nature',
        act_sports: 'Extreme sports',
    };

    useEffect(() => {
        const storedTags = Object.keys(activitiesTag).filter(tag => sessionStorage.getItem(tag) === 'true');
        setSelectedTags(storedTags);
    }, []);

    const handleTagClick = (tag) => {
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
                <h1>What activities are you interested in? </h1>

                <motion.div
                    className="filter-tags wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    {Object.keys(activitiesTag).map(tag => (
                        <motion.span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: Object.keys(activitiesTag).indexOf(tag) * 0.1 }}
                        >
                            {activitiesTag[tag]}
                        </motion.span>
                    ))}
                </motion.div>

                <div className="filter-keys"></div>
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
                    className="chevron-left"
                >
                    <span className="chevron-left"></span> Go Back
                </motion.button>
                <div className="right-buttons">
                    <motion.button
                        type="button3"
                        onClick={() => {
                            selectedTags.forEach(tag => sessionStorage.removeItem(tag));
                            setSelectedTags([]);
                            navigate('/cuisine');
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip
                    </motion.button>

                    <motion.button
                        type="button1"
                        onClick={() => {
                            if (selectedTags.length === 0) {
                                alert("Please select at least one activity.");
                            } else {
                                navigate('/cuisine');
                            }
                        }}
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
                <PiLifebuoyThin size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormActivities;
