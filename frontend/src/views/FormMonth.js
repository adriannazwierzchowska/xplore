import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendarDate } from "react-icons/ci";
import '../front.css';
import { motion } from 'framer-motion'; // Import framer-motion


const FormMonth = () => {
    const navigate = useNavigate();
    const [selectedMonths, setSelectedMonths] = useState([]);
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


    const handleMonthClick = (monthValue) => {
        if (selectedMonths.includes(monthValue)) {
            setSelectedMonths(selectedMonths.filter(m => m !== monthValue));
        } else if (selectedMonths.length < 2) {
            setSelectedMonths([...selectedMonths, monthValue]);
        }
    };

    const handleNext = () => {
        if (selectedMonths.length === 0) {
            alert("Please select at least one month.");
            return;
        }

        sessionStorage.setItem('selectedMonths', JSON.stringify(selectedMonths));
        navigate('/weather');
    };

    return (
        <div className="form-month-container">
            <form>
                <h1>Which months would you like to travel in?</h1>
                <div className="filter-tags wrap">
                    {Object.entries(months).map(([value, name]) => (
                        <span
                            key={value}
                            className={`filter-tag ${selectedMonths.includes(value) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleMonthClick(value)}
                        >
                            {name}
                        </span>
                    ))}
                </div>
            </form>

            <div className="bottom-button-group">
                <button type="button3" onClick={() => navigate(-1)}>
                    <span className="chevron-left"></span> Go Back
                </button>
                <div className="right-buttons">
                    <button type="button3" onClick={() => navigate('/weather')}>
                        Skip
                    </button>
                    <button type="button1" onClick={handleNext}>
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>
            <div className="page-icon">
                <CiCalendarDate size={200} />
            </div>
            <motion.div
                className="page-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <CiCalendarDate size={200} />
            </motion.div>
        </div>
    );
};

export default FormMonth;
