import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiHouseSimple } from "react-icons/pi";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';
import { notifyInfo } from '../utils/toast';
import FormDots from './FormDots';

const FormStay = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const { soundClick, soundSelect } = useSoundContext();
    const destinationKeys = {
        acc_hotel: 'Hotel',
        acc_hostel: 'Hostel',
        acc_guesthouse: 'Guesthouse',
        acc_agrotourism: 'Agritourism',
        acc_camping: 'Camping',
        acc_airbnb: 'Airbnb'
    };

    useEffect(() => {
        const storedTags = Object.keys(destinationKeys).filter(tag => sessionStorage.getItem(tag) === 'true');
        setSelectedTags(storedTags);
    }, []);

    const handleTagClick = (tag) => {
        soundSelect();
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(updatedTags);

        if (updatedTags.includes(tag)) {
            sessionStorage.setItem(tag, 'true');
        } else {
            sessionStorage.removeItem(tag);
        }
    };

    const handleNext = () => {
        soundClick();
        if (selectedTags.length === 0) {
            notifyInfo("Please select at least one type of accommodation.");
        } else {
            navigate('/landscape');
        }
    };

     const handleSkip = () => {
         soundClick();
         selectedTags.forEach(tag => sessionStorage.removeItem(tag));
         setSelectedTags([]);
         navigate('/landscape');
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
                <h1>What type of accommodation do you prefer?</h1>
                <div className="filter-tags">
                    {Object.keys(destinationKeys).map(tag => (
                        <motion.span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {destinationKeys[tag]}
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
                        onClick={handleSkip}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Skip
                    </motion.button>

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
                <PiHouseSimple size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormStay;