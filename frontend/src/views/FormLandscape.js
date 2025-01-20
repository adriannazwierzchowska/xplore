import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiMountainsLight } from "react-icons/pi";
import '../front.css';

const FormLandscape = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const landscapeKeys = {
        land_mountains: 'Mountains',
        land_sea: 'Sea',
        land_lake: 'Lake',
        land_city: 'City',
    };

    useEffect(() => {
        const storedTags = Object.keys(landscapeKeys).filter(tag => sessionStorage.getItem(tag) === 'true');
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
                <h1>What landscape interests you? </h1>
                <div className="filter-tags">
                    {Object.keys(landscapeKeys).map(tag => (
                        <span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {landscapeKeys[tag]}
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
                        navigate('/activities');
                    }}>
                        Skip
                    </button>
                    <button type="button1" onClick={() => {
                            if (selectedTags.length === 0) {
                                alert("Please select at least one type of landscape.");
                            } else {
                                navigate('/activities');
                            }
                        }}
                    >
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>
            <div className="page-icon">
                <PiMountainsLight size={200} />
            </div>
        </div>
    );
};

export default FormLandscape;
