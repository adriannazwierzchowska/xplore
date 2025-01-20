import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiForkAndKnife } from "react-icons/ci";
import '../front.css';

const FormCuisine = () => {
    const navigate = useNavigate();
    const [cuisine, setCuisineRange] = useState(0);

    const addCuisine = async (e) => {
        e.preventDefault();
        sessionStorage.setItem('cuisine', cuisine);
        navigate('/analise');
    };

    return (
        <div className="form">
            <form>
            <h1>How important is local cuisine to you?</h1>
            <div className="slidecontainer">
                <div className="slider-labels">
                    <span style={{ float: 'left', marginBottom: '10px' }}>Not important</span>
                    <span style={{ float: 'right', marginBottom: '10px' }}>Very important</span>
                </div>
                <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={cuisine} 
                    className="slider" 
                    id="weatherRange" 
                    onChange={(e) => setCuisineRange(e.target.value)} 
                />
            </div>
            </form>
            <div className="bottom-button-group">
                <button type="button3" onClick={() => navigate(-1)}>
                    <span className="chevron-left"></span> Go Back
                </button>
                <div className="right-buttons">
                    <button type="button3" onClick={() => navigate('/analise')}>
                        Skip
                    </button>
                    <button type="button1" onClick={addCuisine}>
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>
            <div className="page-icon">
                <CiForkAndKnife size={200} />
            </div>
        </div>
    );
};

export default FormCuisine;
