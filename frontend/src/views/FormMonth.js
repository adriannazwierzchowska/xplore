import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendarDate } from "react-icons/ci";
import { motion } from 'framer-motion'; // Import framer-motion
import '../front.css';

const FormMonth = () => {
    const navigate = useNavigate();

    const addMonth = async (e) => {
        e.preventDefault();
        const selectedMonth = document.getElementById('month').value;
        sessionStorage.setItem('selectedMonth', selectedMonth);
        navigate('/weather');
    };

    return (
        <div className="form-month-container">
            <form>
                <h1>Which month would you like to travel in?</h1>
                <select name="month" id="month" defaultValue="1">
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
            </form>
            <div className="bottom-button-group">
                <button type="button3" onClick={() => navigate(-1)}>
                    <span className="chevron-left"></span> Go Back
                </button>
                <div className="right-buttons">
                    <button type="button3" onClick={() => navigate('/weather')}>
                        Skip
                    </button>
                    <button type="button1" onClick={addMonth}>
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>

            {/* Dodanie animacji do ikony */}
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
