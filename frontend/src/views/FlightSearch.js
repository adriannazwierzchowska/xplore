import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { notifyError, notifyInfo } from '../utils/toast';
import '../css/flightsearch.css';
import '../css/front.css';
import { Search, ArrowLeftRight } from 'lucide-react';

const MAX_LAST_FLIGHTS = 5;

const addFlightToLastSearched = (flightSearchData) => {
    if (!flightSearchData || !flightSearchData.flightDetails) return;

    let lastFlights = JSON.parse(localStorage.getItem('lastFlightSearches')) || [];
    lastFlights = lastFlights.filter(f =>
        !(f.originAirport === flightSearchData.originAirport &&
          f.destinationAirport === flightSearchData.destinationAirport &&
          f.searchMonth === flightSearchData.searchMonth &&
          f.searchYear === flightSearchData.searchYear)
    );

    lastFlights.unshift(flightSearchData);

    if (lastFlights.length > MAX_LAST_FLIGHTS) {
        lastFlights = lastFlights.slice(0, MAX_LAST_FLIGHTS);
    }
    localStorage.setItem('lastFlightSearches', JSON.stringify(lastFlights));
};

const FlightSearch = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [destinationPlace, setDestinationPlace] = useState('');
    const [destinationAirport, setDestinationAirport] = useState('');
    const [originPlace, setOriginPlace] = useState('Warsaw');
    const [originAirport, setOriginAirport] = useState('WAW');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [originLoading, setOriginLoading] = useState(false);
    const [direction, setDirection] = useState('roundtrip');
    const [showAllFlights, setShowAllFlights] = useState(false);

    const debounceRef = useRef(null);

    useEffect(() => {
        const place = location.state?.place || sessionStorage.getItem('destinationPlace');
        if (place) {
            setDestinationPlace(place);
            sessionStorage.setItem('destinationPlace', place);
            fetchNearestAirport(place, 'destination');
        }
    }, [location.state]);

    const fetchNearestAirport = async (place, type, expectedPlace = null) => {
        if (type === 'origin' && expectedPlace && originPlace !== expectedPlace) {
            return;
        }

        try {
            const response = await axios.get(`http://127.0.0.1:8000/places/nearest-airport/?place=${encodeURIComponent(place)}`);
            const airportCode = response.data.airport_code;

            if (type === 'destination') {
                setDestinationAirport(airportCode);
                sessionStorage.setItem('destinationAirport', airportCode);
            } else if (type === 'origin') {
                if (originPlace === expectedPlace || !expectedPlace) {
                    setOriginAirport(airportCode);
                }
                setOriginLoading(false);
            }
        } catch (error) {
            notifyError(`No airport found near ${place}`);
            if (type === 'destination') {
                setDestinationAirport('');
                sessionStorage.removeItem('destinationAirport');
            } else if (type === 'origin') {
                setOriginAirport('');
                setOriginLoading(false);
            }
        }
    };

    const handleOriginKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            const place = originPlace.trim();

            if (place.length > 2) {
                setOriginLoading(true);
                fetchNearestAirport(place, 'origin', place);
            } else {
                setOriginAirport('');
                setOriginLoading(false);
            }
        }
    };

    const handleOriginPlaceChange = (e) => {
        const place = e.target.value;
        setOriginPlace(place);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (place.trim().length <= 2) {
            setOriginAirport('');
            setOriginLoading(false);
            return;
        }

        setOriginLoading(true);

        debounceRef.current = setTimeout(() => {
            fetchNearestAirport(place, 'origin', place);
        }, 500);
    };

    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const handleSwapDirection = () => {
        const currentOriginPlace = originPlace;
        const currentOriginAirport = originAirport;
        const currentDestinationPlace = destinationPlace;
        const currentDestinationAirport = destinationAirport;

        setOriginPlace(currentDestinationPlace);
        setOriginAirport(currentDestinationAirport);
        setOriginLoading(false);
        setDestinationPlace(currentOriginPlace);
        setDestinationAirport(currentOriginAirport);
    };

    const searchFlights = async () => {
        if (!originAirport || !destinationAirport || !selectedMonth || !selectedYear) {
            if (originLoading) {
                notifyError('Please wait for the origin airport code to load.');
            } else {
                notifyError('Please complete all fields and ensure airport codes are loaded.');
            }
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/places/search-flights/', {
                origin: originAirport,
                destination: destinationAirport,
                month: selectedMonth,
                year: selectedYear,
                direction: direction
            });

            setFlights(response.data.flights);

            if (response.data.flights.length > 0) {
                const firstFlight = response.data.flights[0];
                addFlightToLastSearched({
                    originPlace: originPlace,
                    destinationPlace: destinationPlace,
                    originAirport: originAirport,
                    destinationAirport: destinationAirport,
                    searchMonth: selectedMonth,
                    searchYear: selectedYear,
                    flightDetails: {
                        price: `${firstFlight.price} EUR`,
                        departure_date: firstFlight.departure_date,
                        return_date: firstFlight.return_date,
                        booking_link: firstFlight.booking_link,
                        seller: firstFlight.seller
                    }
                });
            }

            if (response.data.flights.length === 0) {
                notifyInfo('No flights found for the selected criteria');
            }
        } catch (error) {
            notifyError('Error searching for flights. Please try again.');
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBookFlight = (bookingLink) => {
        if (bookingLink) {
            window.open(bookingLink, '_blank');
        } else {
            notifyError('No booking link available');
        }
    };

    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 3 }, (_, i) => currentYear + i);

    return (
        <div className="flight-search">
            <motion.div
                className="flight-search-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="flight-search-title">
                    Let's fly to <span className="turquoise-text">{destinationPlace || '...'}</span>
                </h1>

                <div className="search-form">
                    <div className="search-row search-row-direction">
                        <div className="form-group direction-group">
                            <label className="direction-label">Direction</label>
                            <div className="direction-options">
                                <label className="direction-option">
                                    <input
                                        type="radio"
                                        name="direction"
                                        value="roundtrip"
                                        checked={direction === 'roundtrip'}
                                        onChange={() => setDirection('roundtrip')}
                                    />
                                    Round trip
                                </label>
                                <label className="direction-option">
                                    <input
                                        type="radio"
                                        name="direction"
                                        value="oneway"
                                        checked={direction === 'oneway'}
                                        onChange={() => setDirection('oneway')}
                                    />
                                    One way
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="search-row">
                        <div className="form-group">
                            <label htmlFor="origin">From</label>
                            <div className="input-container">
                                <input
                                    id="origin"
                                    type="text"
                                    value={originPlace}
                                    onChange={handleOriginPlaceChange}
                                    onKeyPress={handleOriginKeyPress}
                                    placeholder="Departure city (e.g. Warsaw, London)"
                                    className="form-input"
                                />
                                <div className="airport-display">
                                    {originLoading ? (
                                        <div className="input-spinner spinner-small" />
                                    ) : originAirport ? (
                                        <>Airport code: <b>{originAirport}</b></>
                                    ) : (
                                        <span className="airport-placeholder">{originPlace && originPlace.trim().length > 2 && !originLoading ? 'Searching...' : ''}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="form-group swap-group">
                            <label style={{ visibility: 'hidden' }}>Change direction</label>
                            <button
                                type="button"
                                className="swap-button"
                                title="Change direction"
                                onClick={handleSwapDirection}
                            >
                                <ArrowLeftRight size={20} />
                            </button>
                        </div>
                        <div className="form-group">
                            <label htmlFor="destination">To</label>
                            <div className="input-container">
                                <input
                                    id="destination"
                                    type="text"
                                    value={destinationPlace}
                                    readOnly
                                    className="form-input"
                                    placeholder="Select destination on map"
                                />
                                <div className="airport-display">
                                    {destinationAirport ? (
                                        <>Airport code: <b>{destinationAirport}</b></>
                                    ) : (
                                        <span className="airport-placeholder">{destinationPlace ? 'Searching...' : ''}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="search-row">
                        <div className="form-group">
                            <label htmlFor="month">Month</label>
                            <div className="input-container">
                                <select
                                    id="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Select month</option>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="year">Year</label>
                            <div className="input-container">
                                <select
                                    id="year"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="form-input"
                                >
                                    <option value="">Select year</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ visibility: 'hidden' }}>Search</label>
                            <button
                                onClick={searchFlights}
                                disabled={loading || originLoading || !destinationPlace || !originPlace}
                                className="icon-button"
                                title="Search flights"
                            >
                                {(loading || originLoading) ? <div className="spinner-icon" /> : <Search size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="results-area-container">
                    {loading && (
                        <div className="loading-wrapper">
                            <div className="loading-spinner"></div>
                            <p>Searching for best flights...</p>
                        </div>
                    )}

                    {searched && !loading && flights.length > 0 && (
                        <motion.div
                            className="flights-results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2>Available flights</h2>
                            <div className="flights-list">
                                {(!showAllFlights ? flights.slice(0, 3) : flights).map((flight, index) => (
                                    <motion.div
                                        key={index}
                                        className="flight-card-search"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="flight-info">
                                            <div className="flight-route">
                                                <span className="airport-code">{flight.origin}</span>
                                                <span className="arrow">?</span>
                                                <span className="airport-code">{flight.destination}</span>
                                            </div>
                                            <div className="flight-dates">
                                                <div className="date-info">
                                                    <span className="date-label">Departure</span>
                                                    <span className="date-value">{flight.departure_date}</span>
                                                </div>
                                                {flight.return_date && (
                                                    <div className="date-info">
                                                        <span className="date-label">Return</span>
                                                        <span className="date-value">{flight.return_date}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flight-price">
                                                <span className="price">{flight.price} EUR</span>
                                                <span className="seller">via {flight.seller}</span>
                                            </div>
                                        </div>
                                        <motion.button
                                            onClick={() => handleBookFlight(flight.booking_link)}
                                            className="book-button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Book now
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </div>
                            {!showAllFlights && flights.length > 3 && (
                                <div style={{ textAlign: 'center', marginTop: '18px' }}>
                                    <button
                                        className="icon-button"
                                        onClick={() => setShowAllFlights(true)}
                                    >
                                        Show {flights.length - 3} more results
                                    </button>
                                </div>
                            )}
                            {showAllFlights && (
                                <div style={{ textAlign: 'center', marginTop: '18px' }}>
                                    <button
                                        className="icon-button"
                                        onClick={() => setShowAllFlights(false)}
                                    >
                                        Show less
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {searched && !loading && flights.length === 0 && (
                        <div className="no-flights">
                            <p>No flights found for the selected criteria. Try different dates or airports.</p>
                        </div>
                    )}
                </div>

                <motion.button
                    type="button1"
                    onClick={() => { navigate('/'); }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="chevron-left"></span> Back to Home
                </motion.button>
            </motion.div>
        </div>
    );
};

export default FlightSearch;