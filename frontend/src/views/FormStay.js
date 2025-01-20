import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiHouseSimple } from "react-icons/pi";
import '../front.css';

const FormStay = () => {
    const navigate = useNavigate();
    const [selectedTags, setSelectedTags] = useState([]);
    const destinationKeys = {
        acc_hotel: 'Hotel',
        acc_hostel: 'Hostel',
        acc_guesthouse: 'Guesthouse',
        acc_agrotourism: 'Agritourism',
        acc_camping: 'Camping',
        acc_airbnb: 'Airbnb'
    };

    useEffect(() => {
        const storedTags = Object.keys(destinationKeys).filter(tag => sessionStorage.getItem(tag) === 'true');
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
                <h1>What type of accommodation do you prefer? </h1>
                <div className="filter-tags">
                    {Object.keys(destinationKeys).map(tag => (
                        <span
                            key={tag}
                            className={`filter-tag ${selectedTags.includes(tag) ? 'clicked' : 'unclicked'}`}
                            onClick={() => handleTagClick(tag)}
                        >
                            {destinationKeys[tag]}
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
                        navigate('/landscape');
                    }}>
                        Skip
                    </button>
                    <button type="button1" onClick={() => {
                            if (selectedTags.length === 0) {
                                alert("Please select at least one type of accommodation.");
                            } else {
                                navigate('/landscape');
                            }
                        }}
                    >
                        Next <span className="chevron-right"></span>
                    </button>
                </div>
            </div>
            <div className="page-icon">
                <PiHouseSimple size={200} />
            </div>
        </div>
    );
};

export default FormStay;
