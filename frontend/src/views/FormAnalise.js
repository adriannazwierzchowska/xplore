import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiLifebuoyThin } from "react-icons/pi";
import '../css/front.css';
import axios from 'axios';
import { useSoundContext } from '../SoundContext';
import { notifyError } from '../utils/toast';
import { motion } from 'framer-motion';

const FormAnalise = () => {
    const navigate = useNavigate();
    const { soundClick } = useSoundContext();

    useEffect(() => {
        const analyzeData = async () => {
            const selectedMonths = localStorage.getItem('selectedMonths');
            const weather = localStorage.getItem('weather');
            const accHotel = localStorage.getItem('acc_hotel');
            const accHostel = localStorage.getItem('acc_hostel');
            const accGuesthouse = localStorage.getItem('acc_guesthouse');
            const accAgrotourism = localStorage.getItem('acc_agrotourism');
            const accCamping = localStorage.getItem('acc_camping');
            const accAirbnb = localStorage.getItem('acc_airbnb');
            const landMountains = localStorage.getItem('land_mountains');
            const landSea = localStorage.getItem('land_sea');
            const landLake = localStorage.getItem('land_lake');
            const landCity = localStorage.getItem('land_city');
            const actWater = localStorage.getItem('act_water');
            const actSightseeing = localStorage.getItem('act_sightseeing');
            const actMuseums = localStorage.getItem('act_museums');
            const actNightlife = localStorage.getItem('act_nightlife');
            const actBeach = localStorage.getItem('act_beach');
            const actNature = localStorage.getItem('act_nature');
            const actSports = localStorage.getItem('act_sports');
            const cuisine = localStorage.getItem('cuisine');

            const data = {
                months: selectedMonths ? JSON.parse(selectedMonths) : [],
                weather: weather || 'default-weather',
                acc_hotel: accHotel === 'true' ? 1 : 0,
                acc_hostel: accHostel === 'true' ? 1 : 0,
                acc_guesthouse: accGuesthouse === 'true' ? 1 : 0,
                acc_agrotourism: accAgrotourism === 'true' ? 1 : 0,
                acc_camping: accCamping === 'true' ? 1 : 0,
                acc_airbnb: accAirbnb === 'true' ? 1 : 0,
                land_mountains: landMountains === 'true' ? 1 : 0,
                land_sea: landSea === 'true' ? 1 : 0,
                land_lake: landLake === 'true' ? 1 : 0,
                land_city: landCity === 'true' ? 1 : 0,
                act_water: actWater === 'true' ? 1 : 0,
                act_sightseeing: actSightseeing === 'true' ? 1 : 0,
                act_museums: actMuseums === 'true' ? 1 : 0,
                act_nightlife: actNightlife === 'true' ? 1 : 0,
                act_beach: actBeach === 'true' ? 1 : 0,
                act_nature: actNature === 'true' ? 1 : 0,
                act_sports: actSports === 'true' ? 1 : 0,
                cuisine: cuisine || 'default-cuisine',
            };

            try {
                const response = await axios.post('http://127.0.0.1:8000/questionnaire/classify/', data);
                localStorage.setItem('lastFormPath', '/cuisine');
                navigate('/recommendation', { state: { recommendation: response.data.predictions } });
            } catch (error) {
                console.error('Error analyzing data:', error);
                notifyError('Failed to analyze data. Please try again.');
            }
        };

        analyzeData();
    }, [navigate]);

    return (
        <div className="analyzing-wrapper">
            <div className="analyzing-content">
                <h1 className="analyzing-text">Analyzing...</h1>
                <div className="loading-spinner"></div>
            </div>
        </div>
    
    );
};

export default FormAnalise;