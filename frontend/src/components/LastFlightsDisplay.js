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

    return (
        <motion.div
            className="flight-card-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            style={{ flexGrow: 0 }}
        >
            <div className="flight-info">
                <div className="flight-route">
                    <span className="airport-code">{originAirport}</span>
                    <span className="arrow">?</span>
                    <span className="airport-code">{destinationAirport}</span>
                </div>
                <div className="flight-dates">
                    <div className="date-info">
                        <span className="date-label">Departure</span>
                        <span className="date-value">{departure_date}</span>
                    </div>
                    {return_date && (
                        <div className="date-info">
                            <span className="date-label">Return</span>
                            <span className="date-value">{return_date}</span>
                        </div>
                    )}
                </div>
                <div className="flight-price">
                    <span className="price">{price}</span>
                    {seller && <span className="seller">via {seller}</span>}
                </div>
            </div>
            <motion.button
                onClick={handleBookFlight}
                className="book-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Book now
            </motion.button>
        </motion.div>
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