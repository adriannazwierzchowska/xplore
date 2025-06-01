import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { notifyError, notifyInfo } from '../utils/toast';
import '../css/flightsearch.css';
import '../css/front.css';
import { Search } from 'lucide-react';

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
    const [debounceTimeout, setDebounceTimeout] = useState(null);


    useEffect(() => {
        if (location.state?.place) {
            setDestinationPlace(location.state.place);
            fetchNearestAirport(location.state.place, 'destination');
        }
    }, [location.state]);

    const fetchNearestAirport = async (place, type, expectedPlace = null) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/places/nearest-airport/?place=${encodeURIComponent(place)}`);

            if (type === 'origin' && expectedPlace && originPlace !== expectedPlace) {
                console.log(`Ignoring outdated response for "${place}", current place is "${originPlace}"`);
                return;
            }

            if (type === 'destination') {
                setDestinationAirport(response.data.airport_code);
            } else if (type === 'origin') {
                setOriginAirport(response.data.airport_code);
                setOriginLoading(false);
            }
        } catch (error) {
            console.error('Error fetching nearest airport:', error);
            notifyError(`Could not find nearest airport for ${place}`);
            if (type === 'origin') {
                setOriginLoading(false);
            }
        }
    };

    const handleOriginKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();

            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
                setDebounceTimeout(null);
            }

            const place = originPlace.trim();

            if (place.length > 2) {
                setOriginLoading(true);
                setOriginAirport('');
                fetchNearestAirport(place, 'origin', place);
            }
        }
    };

    const handleOriginPlaceChange = (e) => {
        const place = e.target.value;
        setOriginPlace(place);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        if (place.trim().length <= 2) {
            setOriginAirport('');
            setOriginLoading(false);
            setDebounceTimeout(null);
            return;
        }

        setOriginLoading(true);

        const newTimeoutId = setTimeout(() => {
            fetchNearestAirport(place, 'origin', place);
        }, 1000);

        setDebounceTimeout(newTimeoutId);
    };

    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    const searchFlights = async () => {
        if (!originAirport || !destinationAirport || !selectedMonth || !selectedYear) {
            notifyError('Please fill in all fields and wait for airport codes to load');
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            const response = await axios.post('http://127.0.0.1:8000/places/search-flights/', {
                origin: originAirport,
                destination: destinationAirport,
                month: selectedMonth,
                year: selectedYear
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
            } else {
                notifyInfo('No flights found for the selected criteria');
            }
        } catch (error) {
            console.error('Error searching flights:', error);
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
            notifyError('Booking link not available');
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
                    Let's fly to <span className="turquoise-text">{destinationPlace}</span>
                </h1>

                <div className="search-form">
                    <div className="form-group">
                        <label htmlFor="origin">From</label>
                        <div className="origin-input-container">
                            <input
                                id="origin"
                                type="text"
                                value={originPlace}
                                onChange={handleOriginPlaceChange}
                                onKeyPress={handleOriginKeyPress}
                                placeholder="Enter city name (e.g., Warsaw, London)"
                                className="form-input"
                            />
                            {originLoading && <div className="input-spinner"></div>}
                            {/*
                            {originAirport && !originLoading && (
                                <div className="airport-display">
                                    Airport: {originAirport}
                                </div>
                            )}*/}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="month">Month</label>
                        <select
                            id="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="form-select-month"
                        >
                            <option value="">Select month</option>
                            {months.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="year">Year</label>
                        <select
                            id="year"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="form-select form-select-year"
                        >
                            <option value="">Select year</option>
                            {years.map(year => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <button
                            onClick={searchFlights}
                            disabled={loading}
                            className="icon-button"
                            title="Search flights"
                        >
                            {loading ? (
                                <div className="spinner-icon"></div>
                            ) : (
                                <Search size={24} />
                            )}
                        </button>
                    </div>
                </div>

                {loading && (
                    <div className="loading-wrapper">
                        <div className="loading-spinner"></div>
                        <p>Searching for the best flights...</p>
                    </div>
                )}

                {searched && !loading && flights.length > 0 && (
                    <motion.div
                        className="flights-results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2>Available Flights</h2>
                        {flights.slice(0, 1).map((flight, index) => (
                            <motion.div
                                key={index}
                                className="flight-card-search"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flight-info">
                                    <div className="flight-route">
                                        <span className="airport-code">{flight.origin}</span>
                                        <span className="arrow">-></span>
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
                                    Book Flight
                                </motion.button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {searched && !loading && flights.length === 0 && (
                    <div className="no-flights">
                        <p>No flights found for your search criteria. Try different dates or airports.</p>
                    </div>
                )}

                <motion.button
                    onClick={() => navigate(-1)}
                    className="back-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Back to recommendations
                </motion.button>
            </motion.div>
        </div>
    );
};

export default FlightSearch;