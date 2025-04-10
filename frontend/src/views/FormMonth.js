import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendarDate } from "react-icons/ci";
import { motion } from 'framer-motion';
import { useSoundContext } from '../SoundContext';
import '../front.css';

const FormMonth = () => {
    const navigate = useNavigate();
    const [selectedMonths, setSelectedMonths] = useState([]);
    const { soundClick, soundSelect } = useSoundContext();
    const months = {
        '1': 'January',
        '2': 'February',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    };

    // Load saved values on component mount
    useEffect(() => {
        const savedMonths = sessionStorage.getItem('selectedMonths');
        if (savedMonths) {
            try {
                const parsedMonths = JSON.parse(savedMonths);
                setSelectedMonths(parsedMonths);
            } catch (e) {
                console.error('Error parsing saved months:', e);
                sessionStorage.removeItem('selectedMonths');
            }
        }
    }, []);

    const handleMonthClick = (monthValue) => {
        soundSelect(); // Add sound when selecting a month
        
        if (selectedMonths.includes(monthValue)) {
            const updated = selectedMonths.filter(m => m !== monthValue);
            setSelectedMonths(updated);
            sessionStorage.setItem('selectedMonths', JSON.stringify(updated));
        } else if (selectedMonths.length < 2) {
            const updated = [...selectedMonths, monthValue];
            setSelectedMonths(updated);
            sessionStorage.setItem('selectedMonths', JSON.stringify(updated));
        }
    };

    const handleNext = () => {
        soundClick(); // Add sound when clicking next button
        if (selectedMonths.length === 0) {
            alert("Please select at least one month.");
            return;
        }
        navigate('/weather');
    };

    return (
        <motion.div
            className="form-month-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1>Which months would you like to travel in?</h1>
                <motion.div
                    className="filter-tags wrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {Object.entries(months).map(([value, name]) => (
                        <motion.span
                            key={value}
                            className={`filter-tag ${selectedMonths.includes(value) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleMonthClick(value)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            {name}
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
                    onClick={() => {
                        soundClick(); // Add sound when clicking back button
                        navigate('/');
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
                            soundClick(); // Add sound when clicking skip button
                            sessionStorage.removeItem('selectedMonths');
                            navigate('/weather');
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
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <CiCalendarDate size={200} />
            </motion.div>
        </motion.div>
    );
};

export default FormMonth;
