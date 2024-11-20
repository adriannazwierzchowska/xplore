import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiLifebuoyThin } from "react-icons/pi";
import '../front.css';

const FormActivities = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const activitiesTag = {
        act_water: 'Water activities',
        act_sightseeing: 'Sightseeing',
        act_museums: 'Visiting museums',
        act_nightlife: 'Nightlife',
        act_beach: 'Relaxing on the beach',
        act_nature: 'Experiencing nature',
        act_sports: 'Extreme sports',
    };

    useEffect(() => {
        const storedTags = Object.keys(activitiesTag).filter(tag => sessionStorage.getItem(tag) === 'true');
        setSelectedTags(storedTags);
    }, []);

    const handleTagClick = (tag) => {
        const updatedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(updatedTags);

        if (updatedTags.includes(tag)) {
            sessionStorage.setItem(tag, true);
        } else {
            sessionStorage.removeItem(tag);
        }
    };


    return (
        <div className="form">
            <form>
                <h1>What activities are you interested in? </h1>
                <div className="filter-tags wrap">
                    {Object.keys(activitiesTag).map(tag => (
                        <span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {activitiesTag[tag]}
                        </span>
                    ))}
                <div className="filter-keys"></div>
                </div>
            </form>
            <div className="bottom-button-group">
                <button type="button3" onClick={() => navigate(-1)}>
                    <span className="chevron-left"></span> Go Back
                </button>
                <div className="right-buttons">
                    <button type="button3" onClick={() => {
                        selectedTags.forEach(tag => sessionStorage.removeItem(tag));
                        setSelectedTags([]);
                        navigate('/questionnaire_6');
                    }}>
                        Skip
                    </button>
                    <button type="button1" onClick={() => navigate('/questionnaire_6')}>
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>
            <div className="page-icon">
                <PiLifebuoyThin size={200} />
            </div>
        </div>
    );
};

export default FormActivities;
