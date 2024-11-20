import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiLifebuoyThin } from "react-icons/pi";
import '../front.css';

const FormActivities = () => {
    const navigate = useNavigate();
    useEffect(() => {
        alert("Analising...");
    }, []);





    return (
        <div>
            <div>
                <h1>Analising... </h1>
            </div>

            <div className="bottom-button-group">
                <button type="button3" onClick={() => navigate(-1)}>
                    <span className="chevron-left"></span> Go Back
                </button>

            </div>
        </div>
    );
};

export default FormActivities;
