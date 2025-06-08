import React, { useState, useEffect } from 'react';
import { useSoundContext } from '../SoundContext';
import { motion } from 'framer-motion';
import '../css/home-extended.css';
import '../css/flightsearch.css';

const FlightCard = ({ flightSearchData, index }) => {
    const { soundClick } = useSoundContext();
    const {
        originAirport,
        destinationAirport,
        flightDetails
    } = flightSearchData;

    if (!flightDetails) return null;

    const { departure_date, return_date, price, booking_link, seller } = flightDetails;

    const handleBookFlight = () => {
        soundClick();
        if (booking_link) {
            window.open(booking_link, '_blank', 'noopener,noreferrer');
        }
    };

    const isRoundTrip = return_date && return_date !== departure_date;

    return (
        <motion.div
            className="flight-card-redesigned"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <div className="flight-leg">
                <span className="leg-date">{departure_date}</span>
                <span className="leg-airport">{originAirport}</span>
                <div className="leg-line-container">
                    <div className="leg-line"></div>
                </div>
                <span className="leg-airport">{destinationAirport}</span>
            </div>

            {isRoundTrip && (
                <div className="flight-leg">
                    <span className="leg-date">{return_date}</span>
                    <span className="leg-airport">{destinationAirport}</span>
                    <div className="leg-line-container">
                        <div className="leg-line"></div>
                    </div>
                    <span className="leg-airport">{originAirport}</span>
                </div>
            )}

            <div className="flight-footer">
                <div className="flight-price-info">
                    <span className="price">{price}</span>
                    <span className="seller">via {seller}</span>
                </div>
                <motion.button
                    onClick={handleBookFlight}
                    className="book-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Let's go
                </motion.button>
            </div>
        </motion.div>
    );
};


const LastFlightsDisplay = () => {
    const [lastFlights, setLastFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const storedFlights = JSON.parse(localStorage.getItem('lastFlightSearches')) || [];
        setLastFlights(storedFlights.slice(0, 4));
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <div className="loading-spinner"></div>
        );
    }
    if (!lastFlights.length) return <p className="no-items-text">You haven't searched for any flights recently.</p>;

    return (
        <div className="home-last-flights-section">
            <div className="home-last-flights-list">
                {lastFlights.map((flightSearch, index) => (
                    <FlightCard key={index} flightSearchData={flightSearch} index={index} />
                ))}
            </div>
        </div>
    );
};

export default LastFlightsDisplay;