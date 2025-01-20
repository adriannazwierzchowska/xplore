import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiLifebuoyThin } from "react-icons/pi";
import '../front.css';
import axios from 'axios';

const FormActivities = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const analyzeData = async () => {
            const data = {
                month: sessionStorage.getItem('selectedMonth'),
                weather: sessionStorage.getItem('weather'),
                acc_hotel: sessionStorage.getItem('acc_hotel') === 'true' ? 1 : 0,
                acc_hostel: sessionStorage.getItem('acc_hostel') === 'true' ? 1 : 0,
                acc_guesthouse: sessionStorage.getItem('acc_guesthouse') === 'true' ? 1 : 0,
                acc_agrotourism: sessionStorage.getItem('acc_agrotourism') === 'true' ? 1 : 0,
                acc_camping: sessionStorage.getItem('acc_camping') === 'true' ? 1 : 0,
                acc_airbnb: sessionStorage.getItem('acc_airbnb') === 'true' ? 1 : 0,
                land_mountains: sessionStorage.getItem('land_mountains') === 'true' ? 1 : 0,
                land_sea: sessionStorage.getItem('land_sea') === 'true' ? 1 : 0,
                land_lake: sessionStorage.getItem('land_lake') === 'true' ? 1 : 0,
                land_city: sessionStorage.getItem('land_city') === 'true' ? 1 : 0,
                act_water: sessionStorage.getItem('act_water') === 'true' ? 1 : 0,
                act_sightseeing: sessionStorage.getItem('act_sightseeing') === 'true' ? 1 : 0,
                act_museums: sessionStorage.getItem('act_museums') === 'true' ? 1 : 0,
                act_nightlife: sessionStorage.getItem('act_nightlife') === 'true' ? 1 : 0,
                act_beach: sessionStorage.getItem('act_beach') === 'true' ? 1 : 0,
                act_nature: sessionStorage.getItem('act_nature') === 'true' ? 1 : 0,
                act_sports: sessionStorage.getItem('act_sports') === 'true' ? 1 : 0,
                cuisine: sessionStorage.getItem('cuisine'),
            };

            try {
                const response = await axios.post('http://127.0.0.1:8000/questionnaire/classify/', data);
                navigate('/recommendation', { state: { recommendation: response.data.predictions } });
            } catch (error) {
                console.error('Error analyzing data:', error);
                alert('Failed to analyze data. Please try again.');
            }
        };

        analyzeData();
    }, [navigate]);

    return (
        <div>
            <div>
                <h1>Analyzing... </h1>
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
