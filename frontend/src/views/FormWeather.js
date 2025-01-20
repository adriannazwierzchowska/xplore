import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiCloud } from "react-icons/ci";
import '../front.css';

const FormWeather = () => {
    const navigate = useNavigate();
    const [weather, setWeatherRange] = useState(0);

    const addWeather = async (e) => {
        e.preventDefault();
        sessionStorage.setItem('weather', weather);
        navigate('/stay');
    };

    return (
        <div className="form">
            <form>
            <h1>What kind of weather do you prefer?</h1>
            <div className="slidecontainer">
                <div className="slider-labels">
                    <span style={{ float: 'left', marginBottom: '10px' }}>Very cold</span>
                    <span style={{ float: 'right', marginBottom: '10px' }}>Very hot</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={weather} 
                    className="slider" 
                    id="weatherRange" 
                    onChange={(e) => setWeatherRange(e.target.value)} 
                />
            </div>
            </form>
            <div className="bottom-button-group">
                <button type="button3" onClick={() => navigate(-1)}>
                    <span className="chevron-left"></span> Go Back
                </button>
                <div className="right-buttons">
                    <button type="button3" onClick={() => navigate('/stay')}>
                        Skip
                    </button>
                    <button type="button1" onClick={addWeather}>
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>
            <div className="page-icon">
                <CiCloud size={200} />
            </div>
        </div>
    );
};

export default FormWeather;
