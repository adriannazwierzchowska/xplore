import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PiLifebuoyThin } from "react-icons/pi";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';
import { notifyInfo } from '../utils/toast';
import FormDots from './FormDots';

const FormActivities = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedTags, setSelectedTags] = useState([]);
    const { soundClick, soundSelect } = useSoundContext();
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
        const storedTags = Object.keys(activitiesTag).filter(tag => localStorage.getItem(tag) === 'true');
        setSelectedTags(storedTags);
        localStorage.setItem('lastFormPath', location.pathname);
    }, [location.pathname]);

    const handleTagClick = (tag) => {
        soundSelect();
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(updatedTags);

        if (updatedTags.includes(tag)) {
            localStorage.setItem(tag, 'true');
        } else {
            localStorage.removeItem(tag);
        }
    };

     const handleNext = () => {
         soundClick();
         if (selectedTags.length === 0) {
             notifyInfo("Please select at least one activity.");
         } else {
             navigate('/cuisine');
         }
     };

      const handleSkip = () => {
          soundClick();
          selectedTags.forEach(tag => localStorage.removeItem(tag));
          setSelectedTags([]);
          navigate('/cuisine');
      }

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
                <h1>What activities are you interested in?</h1>
                <div className="filter-tags">
                    {Object.keys(activitiesTag).map(tag => (
                        <motion.span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {activitiesTag[tag]}
                        </motion.span>
                    ))}
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
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                <PiLifebuoyThin size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormActivities;