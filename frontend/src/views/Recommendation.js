import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSoundContext } from '../SoundContext';
import '../css/front.css';
import '../css/recommendation.css';
import '../css/flightsearch.css';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import { motion } from "framer-motion";
import { notifyError, notifyInfo } from '../utils/toast';
import { Plane } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Recommendation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { soundClick, soundPlaceSelect } = useSoundContext();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                if (location.state?.recommendation) {
                    const updatedPlaces = await Promise.all(
                        location.state.recommendation.map(async (place) => {
                            const summary = await fetchCitySummary(place.place);
                            const count = await fetchFavoriteCount(place.place)
                            return { ...place, details: summary.details, imageUrl: summary.imageUrl, favoriteCount: count };
                        })
                    );
                    setPlaces(updatedPlaces);
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, [location.state]);

    useEffect(() => {
        if (selectedPlace) {
            document.body.classList.add('place-sidebar-active');
        } else {
            document.body.classList.remove('place-sidebar-active');
        }

        return () => {
            document.body.classList.remove('place-sidebar-active');
        };
    }, [selectedPlace]);

    const getCityNameForWikipedia = (fullCityName) => {
        if (fullCityName.includes(',')) {
            const parts = fullCityName.split(',');
            return parts[1].trim();
        }
        return fullCityName.trim();
    };

    const fetchCitySummary = async (cityName) => {
        try {
            const processedCityName = getCityNameForWikipedia(cityName);
            const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(processedCityName)}`;
            const response = await axios.get(wikiUrl);

            if (response.data.type === "disambiguation") {
                return {
                    imageUrl: null
                };
            }

            const imageUrl = response.data.thumbnail ? response.data.thumbnail.source : null;
            const details = response.data.extract;
            return { details, imageUrl };
        } catch (error) {
            return {
                imageUrl: null
            };
        }
    };

    const handleMarkerClick = async (place) => {
        soundPlaceSelect();
        try {
            const summary = await fetchCitySummary(place.place);
            const favoriteCount = await fetchFavoriteCount(place.place);
            const isFavorite = await checkIfFavorite(place.place);

            setSelectedPlace({
                name: place.place,
                tags: place.keywords || [],
                details: summary.details,
                imageUrl: summary.imageUrl,
                favoriteCount: favoriteCount,
            });

           setIsFavorite(isFavorite);
           fetchPlaceDetails(place);
        } catch (error) {
            setSelectedPlace({
                name: place.place,
                tags: place.keywords || [],
                details: "No description for this city.",
                imageUrl: null,
                favoriteCount: 0,
            });

            setIsFavorite(false);
        }
    };


    const addToFavorites = async (placeName) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                notifyInfo('You need to log in to add favorites!');
                return;
            }

            const response = await axios.post(
                'http://127.0.0.1:8000/api/add_favorite/',
                { place: placeName },
                { headers: { Authorization: `${token}` } }
            );

            const updatedFavoriteCount = await fetchFavoriteCount(placeName);

            setSelectedPlace(prevState => ({
                ...prevState,
                favoriteCount: updatedFavoriteCount
            }));

            setPlaces(prevPlaces =>
                prevPlaces.map(place =>
                    place.place === placeName ? { ...place, favoriteCount: updatedFavoriteCount } : place
                )
            );

            setIsFavorite(true);
            notifyInfo(response.data.message);
        } catch (error) {
            console.error('Error adding to favorites:', error);
            notifyError('Failed to add to favorites. Please try again.');
        }
    };

    const removeFromFavorites = async (placeName) => {
        try {
            const token = localStorage.getItem('authToken');
            console.log('Token:', token);
            if (!token) {
                notifyInfo ('You need to log in to add favorites!');
                return;
            }
            const response = await axios.post(
                'http://127.0.0.1:8000/api/remove_favorite/',
                { place: placeName },
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );

            const updatedFavoriteCount = await fetchFavoriteCount(placeName)
            const isFavorite = await checkIfFavorite(placeName)
            setSelectedPlace(prevState => ({
                ...prevState,
                favoriteCount: updatedFavoriteCount
            }));
            setPlaces(prevPlaces =>
                prevPlaces.map(place =>
                    place.place === placeName ? { ...place, favoriteCount: updatedFavoriteCount } : place
                )
            );
            setIsFavorite(false)
            notifyInfo(response.data.message);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notifyError('You need to log in again! Your session has expired.');
            } else {
                console.error('Error removing from favorites:', error);
                notifyError('Failed to remove from favorites. Please try again.');
            }
        }
    };

    const checkIfFavorite = async (placeName) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                notifyInfo('You need to log in to add favorites!');
                return;
            }
            const response = await axios.get(
                `http://127.0.0.1:8000/api/is_favorite/?place=${encodeURIComponent(placeName)}`,
                {
                    headers: { Authorization: `${token}` },
                }
            );
            console.log(response)

            return response.data.is_favorite;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            return false;
        }
    };

    const fetchFavoriteCount = async (placeName) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/favorite_count/?place=${encodeURIComponent(placeName)}`);
            return response.data.favorite_count;
        } catch (error) {
            console.error('Error fetching favorite count:', error);
            return 0;
        }
    };

    const fetchPlaceDetails = async (place) => {
      try {
        const nearbyRes = await axios.post('http://127.0.0.1:8000/places/nearby-places/', {
          lat: place.coordinates.lat,
          lng: place.coordinates.lng
        });
        if (nearbyRes.data && typeof nearbyRes.data === 'object') {
          setSelectedPlace(prev => ({
            ...prev,
            nearby: nearbyRes.data || {}
          }));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching details:', error);
        setSelectedPlace(prev => ({
          ...prev,
          nearby: { error: error.message }
        }));
      }
    };

    const renderNearbyPlaces = () => {
      if (!selectedPlace.nearby || typeof selectedPlace.nearby !== 'object') {
        return (
          <div className="loading-wrapper-small">
            <div className="loading-spinner small"></div>
          </div>
        );
      }


      if (Object.keys(selectedPlace.nearby).length === 0) {
        return <div className="no-results">No nearby places found</div>;
      }

      if (selectedCategory) {
        const categoryPlaces = selectedPlace.nearby[selectedCategory] || [];
        return (
            <div className="category-details">
                <div className="places-list">
                    {categoryPlaces.slice(0,5).map((place, index) => (
                        <div key={index} className="place-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${place.photo || 'placeholder.jpg'})`}}>
                            <div className="place-content">
                                <div className="place-link" onClick={() => {
                                    if (place.website) {
                                        window.open(place.website, '_blank');
                                    } else {
                                        notifyInfo('No website available for this place');
                                    }
                                }} />

                                <div className="place-header">
                                    {place.rating && renderStarRating(place.rating)}
                                </div>
                                <h4>{place.name}</h4>
                                <div className="place-footer">
                                    {place.reviews?.[0]?.text && (
                                        <p className="place-description">
                                            "{place.reviews[0].text}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
      }

      const categories = ['Accommodation', 'Food', 'Entertainment', 'Sightseeing'];

      return (
            <div className="category-grid">
                {categories.map((category) => {
                    const places = selectedPlace.nearby?.[category] || [];
                    const firstPlace = places[0];
                    const photoUrl = firstPlace?.photo || 'placeholder.jpg';

                    return (
                        <div
                            key={category}
                            className="category-card"
                            onClick={() => setSelectedCategory(category)}
                            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${photoUrl})`, }} >
                            <h3 className="category-title">{category}</h3>
                            {firstPlace?.name && (
                                <p className="place-name">{firstPlace.name}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderStarRating = (rating) => {
        const parsedRating = typeof rating === 'string' ? parseFloat(rating) : rating;
        const roundedRating = Math.round(parsedRating);

        return (
            <div className="rating-container">
                <div className="star-rating">
                    {[...Array(5)].map((_, index) => (
                        index < roundedRating ? (
                            <span key={index} className="star">★</span>
                        ) : (
                            <span key={index} className="star empty-star">★</span>
                        )
                    ))}
                </div>
                <span className="rating-number">{parsedRating.toFixed(1)}</span>
            </div>
        );
    };

    const handleFlightSearch = (placeName) => {
        navigate('/flights', { state: { place: placeName } });
    };

    return (
        <div className="recommendation">
            <h1 className="recommendation-heading">
              You should <span className="turquoise-text">xplore</span> these places
            </h1>
            <div className="map-container">
                <MapContainer center={[30.8566, 31.3522]} zoom={3} style={{ height: "500px", width: "100%", maxWidth: "1400px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {places?.map((place, index) =>
                        place.coordinates ? (
                            <Marker key={index} position={[place.coordinates.lat, place.coordinates.lng]}
                                eventHandlers={{
                                    click: () => handleMarkerClick(place),
                                }} >
                                <Tooltip>
                                    <div className="custom-tooltip">
                                        <h2>{place.place} ❤ {place.favoriteCount ?? 0}</h2>
                                        <div className="tags-container">
                                          {place.keywords.map((keyword, i) => (
                                            <span key={i} className="tag">{keyword}</span>
                                          ))}
                                        </div>
                                    </div>
                                </Tooltip>
                            </Marker>
                        ) : null
                    )}
                </MapContainer>
            </div>

            {selectedPlace && (
                <>
                    <div className="overlay" onClick={() => { soundClick(); setSelectedPlace(null);}} />
                    <div className={`place-details-sidebar ${selectedCategory ? 'expanded' : ''} ${selectedPlace ? 'active' : ''}`}>
                        <div className="place-details-sidebar-content">
                            {!selectedCategory ? (
                            <>
                                {selectedPlace.imageUrl && (
                                    <img src={selectedPlace.imageUrl} alt={selectedPlace.name} className="sidebar-image" />
                                )}
                                <div>
                                    <h2 className="s-place-name">
                                        {selectedPlace.name}
                                        <div className="place-actions">
                                            <span className="favorite-count">
                                                <motion.svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill={isFavorite ? '#03607E' : 'none'}
                                                    stroke="#03607E"
                                                    strokeWidth="2"
                                                    className={`heart-icon ${isFavorite ? 'filled' : ''}`}
                                                    whileTap={{ scale: 1.7 }}
                                                    animate={{ scale: isFavorite ? [1, 1.7, 1] : 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() =>
                                                        isFavorite ? removeFromFavorites(selectedPlace.name) : addToFavorites(selectedPlace.name)
                                                    }
                                                >
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                </motion.svg>
                                                {selectedPlace.favoriteCount ?? 0}
                                            </span>

                                            <motion.div
                                                className="flight-icon"
                                                whileTap={{ scale: 1.3 }}
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.2 }}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleFlightSearch(selectedPlace.name)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#03607E"
                                                    strokeWidth="2"
                                                    className="plane-icon"
                                                >
                                                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4s-2 1-3.5 2.5L11 10l-8.2-1.8c-.5-.1-.9.1-1.1.5-.2.4-.1.9.2 1.2L7 15l-1.8 8.2c-.1.5.1.9.5 1.1.4.2.9.1 1.2-.2L12 19l5.1 5.1c.3.3.8.4 1.2.2.4-.2.6-.6.5-1.1z"/>
                                                </svg>
                                            </motion.div>
                                        </div>
                                    </h2>

                                    <div className="sidebar-buttons">
                                        <span
                                            className={`favorite-count ${isFavorite ? 'filled' : ''}`}
                                            onClick={() =>
                                                isFavorite ? removeFromFavorites(selectedPlace.name) : addToFavorites(selectedPlace.name)
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                        </span>
                                    </div>


                                    <div className="tags-container">
                                        {selectedPlace.tags.map((tag, index) => (
                                            <span key={index} className="tag">{tag}</span>
                                        ))}
                                    </div>

                                    <div className="nearby-section">
                                        {renderNearbyPlaces()}
                                    </div>

                                    <p
                                        className="selected-place"
                                        dangerouslySetInnerHTML={{ __html: selectedPlace.details }}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="category-details">
                                <button
                                    className="button3"
                                    onClick={() => { soundClick(); setSelectedCategory(null); }}
                                >
                                    &lt; Go back to {selectedPlace.name}
                                </button>
                                {renderNearbyPlaces()}
                            </div>
                        )}

                    </div>
                    </div>
                </>
            )}

            <motion.div
                className="bottom-button-group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                    <motion.button
                        type="button"
                        onClick={() => { soundClick(); navigate('/month'); }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Edit preferences
                    </motion.button>
            </motion.div>
        </div>
    );
};

export default Recommendation;