import React, { useState, useEffect } from 'react';
import { useSoundContext } from '../SoundContext';
import '../css/home-extended.css';

const FlightCard = ({ flightSearchData }) => {
    const { soundClick } = useSoundContext();
    const {
        originAirport,
        destinationAirport,
        flightDetails
    } = flightSearchData;

    if (!flightDetails) return null;

    const { departure_date, return_date, price, booking_link } = flightDetails;

    const handleLetsGoClick = () => {
        soundClick();
        if (booking_link) {
            window.open(booking_link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="home-last-flight-card">
            <div className="home-flight-card-dates">
                <span>{departure_date}</span>
                {return_date && <span>{return_date}</span>}
            </div>
            <div className="home-flight-card-route">
                <span>{originAirport}</span>
                <span className="home-flight-card-line"></span>
                <span>{destinationAirport}</span>
            </div>
            {return_date && (
                <div className="home-flight-card-route">
                    <span>{destinationAirport}</span>
                    <span className="home-flight-card-line"></span>
                    <span>{originAirport}</span>
                </div>
            )}
            <div className="home-flight-card-footer">
                <span className="home-flight-card-price">{price}</span>
                <button className="home-flight-card-button" onClick={handleLetsGoClick}>
                    Let's go!
                </button>
            </div>
        </div>
    );
};

const LastFlightsDisplay = () => {
    const [lastFlights, setLastFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const storedFlights = JSON.parse(localStorage.getItem('lastFlightSearches')) || [];
        setLastFlights(storedFlights);
        setLoading(false);
    }, []);

    if (loading) return <p className="loading-text">Loading your last flights...</p>;
    if (!lastFlights.length) return <p className="no-items-text">You haven't searched for any flights recently.</p>;

    return (
        <div className="home-last-flights-section">
            <h2 className="home-last-flights-title">Your last flights:</h2>
            <div className="home-last-flights-list">
                {lastFlights.map((flightSearch, index) => (
                    <FlightCard key={index} flightSearchData={flightSearch} />
                ))}
            </div>
        </div>
    );
};

export default LastFlightsDisplay;