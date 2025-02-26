import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiHouseSimple } from "react-icons/pi";
import { motion } from 'framer-motion'; // Importujemy framer-motion
import '../front.css';

const FormStay = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
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
                <h1>What type of accommodation do you prefer? </h1>
                <div className="filter-tags">
                    {Object.keys(destinationKeys).map(tag => (
                        <motion.span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {destinationKeys[tag]}
                        </motion.span>
                    ))}
                    <div className="filter-keys"></div>
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
                        onClick={() => {
                            selectedTags.forEach(tag => sessionStorage.removeItem(tag));
                            setSelectedTags([]);
                            navigate('/landscape');
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
                                alert("Please select at least one type of accommodation.");
                            } else {
                                navigate('/landscape');
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
                <PiHouseSimple size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormStay;
