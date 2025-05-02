import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiLifebuoyThin } from "react-icons/pi";
import '../css/front.css';
import axios from 'axios';
import { useSoundContext } from '../SoundContext';
import { notifyError } from '../utils/toast';

const FormAnalise = () => {
    const navigate = useNavigate();
    const { soundClick } = useSoundContext();

    useEffect(() => {
        const analyzeData = async () => {
            const selectedMonths = sessionStorage.getItem('selectedMonths');
            const weather = sessionStorage.getItem('weather');
            const accHotel = sessionStorage.getItem('acc_hotel');
            const accHostel = sessionStorage.getItem('acc_hostel');
            const accGuesthouse = sessionStorage.getItem('acc_guesthouse');
            const accAgrotourism = sessionStorage.getItem('acc_agrotourism');
            const accCamping = sessionStorage.getItem('acc_camping');
            const accAirbnb = sessionStorage.getItem('acc_airbnb');
            const landMountains = sessionStorage.getItem('land_mountains');
            const landSea = sessionStorage.getItem('land_sea');
            const landLake = sessionStorage.getItem('land_lake');
            const landCity = sessionStorage.getItem('land_city');
            const actWater = sessionStorage.getItem('act_water');
            const actSightseeing = sessionStorage.getItem('act_sightseeing');
            const actMuseums = sessionStorage.getItem('act_museums');
            const actNightlife = sessionStorage.getItem('act_nightlife');
            const actBeach = sessionStorage.getItem('act_beach');
            const actNature = sessionStorage.getItem('act_nature');
            const actSports = sessionStorage.getItem('act_sports');
            const cuisine = sessionStorage.getItem('cuisine');

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

            <div className="bottom-button-container">
                <button type="button3" className="back-button-fixed"
                onClick={() => { soundClick(); navigate(-1); }}>
                    <span className="chevron-left"></span> Go Back
                </button>
            </div>
        </div>
    );
};

export default FormAnalise;