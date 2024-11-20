import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCalendarDate } from "react-icons/ci";
import '../front.css';

const FormMonth = () => {
    const navigate = useNavigate();

    const addMonth = async (e) => {
        e.preventDefault();
        const selectedMonth = document.getElementById('month').value;
        sessionStorage.setItem('selectedMonth', selectedMonth);
        navigate('/questionnaire_2');
    };

    return (
        <div className="form-month-container">
            <form>
            <h1>Which month would you like to travel in?</h1>
            <select name="month" id="month">
            <option value="0">January</option>
            <option value="1">February</option>
            <option value="2">March</option>
            <option value="3">April</option>
            <option value="4">May</option>
            <option value="5">June</option>
            <option value="6">July</option>
            <option value="7">August</option>
            <option value="8">September</option>
            <option value="9">October</option>
            <option value="10">November</option>
            <option value="11">December</option>
            </select>
            </form>
            <div className="bottom-button-group">
                <button type="button3" onClick={() => navigate(-1)}>
                    <span className="chevron-left"></span> Go Back
                </button>
                <div className="right-buttons">
                    <button type="button3" onClick={() => navigate('/questionnaire_2')}>
                        Skip
                    </button>
                    <button type="button1" onClick={addMonth}>
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>
            <div className="page-icon">
                <CiCalendarDate size={200} />
            </div>
        </div>
    );
};

export default FormMonth;
