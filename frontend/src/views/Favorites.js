import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useSoundContext } from '../SoundContext';
import { notifyError, notifySuccess, notifyInfo, notifyWarning } from '../utils/toast';
import '../css/recommendation.css';
import '../css/front.css';
import { Plane } from 'lucide-react';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [nearbyPlaces, setNearbyPlaces] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();
    const { soundClick, soundPlaceSelect } = useSoundContext();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    notifyError('You need to log in to view favorites!');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/favorites/', {
                    headers: {
                        Authorization: token,
                    },
                });

                const favoritesWithDetails = await Promise.all(
                    response.data.map(async (favorite) => {
                        const coordsResponse = await axios.get(
                            `http://127.0.0.1:8000/questionnaire/place_coordinates/?place=${encodeURIComponent(favorite.place)}`
                        );

                        const countResponse = await axios.get(
                            `http://127.0.0.1:8000/api/favorite_count/?place=${encodeURIComponent(favorite.place)}`
                        );

                        let keywords = ['favorite'];
                        try {
                            const keywordsResponse = await axios.get(
                                `http://127.0.0.1:8000/questionnaire/keywords?destination=${encodeURIComponent(favorite.place)}`
                            );
                            if (keywordsResponse.data && keywordsResponse.data.keywords) {
                                keywords = keywordsResponse.data.keywords;
                            }
                        } catch (keywordsError) {
                            console.warn(`Failed to fetch keywords for ${favorite.place}:`, keywordsError);
                        }

                        const summary = await fetchCitySummary(favorite.place);
                        return {
                            ...favorite,
                            coordinates: coordsResponse.data.coordinates,
                            favoriteCount: countResponse.data.favorite_count,
                            details: summary.details,
                            imageUrl: summary.imageUrl,
                            keywords: keywords
                        };
                    })
                );

                setFavorites(favoritesWithDetails);
            } catch (error) {
                console.error('Error fetching favorites:', error);
                notifyError('Failed to fetch favorites. Please try again.');
            }
        };
        fetchFavorites();
    }, []);

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
                    imageUrl: null,
                    details: "No specific details available for this location.",
                    keywords: ['favorite']
                };
            }

            const imageUrl = response.data.thumbnail ? response.data.thumbnail.source : null;
            const details = response.data.extract;
            return { details, imageUrl, keywords: ['favorite'] };
        } catch (error) {
            return {
                imageUrl: null,
                details: "No description available for this location.",
                keywords: ['favorite']
            };
        }
    };

    const handleMarkerClick = async (place) => {
        soundPlaceSelect();
        try {
            setSelectedPlace({
                name: place.place,
                tags: place.keywords || [],
                details: place.details || "No description for this city.",
                imageUrl: place.imageUrl,
                favoriteCount: place.favoriteCount || 0,
            });

            fetchPlaceDetails(place);
        } catch (error) {
            console.error('Error handling marker click:', error);
            setSelectedPlace({
                name: place.place,
                tags: ['favorite'],
                details: "No description for this city.",
                imageUrl: null,
                favoriteCount: 0,
            });
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

    const removeFromFavorites = async (placeName) => {
        soundClick();
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                notifyWarning('You need to log in to remove favorites!');
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
            setFavorites(favorites.filter(fav => fav.place !== placeName));
            setSelectedPlace(null);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                notifyWarning('You need to log in again! Your session has expired.');
            } else {
                console.error('Error removing from favorites:', error);
                notifyError('Failed to remove from favorites. Please try again.');
            }
        }
    };

    const handleFlightSearch = (placeName) => {
        navigate('/flights', { state: { place: placeName } });
    };

    const renderNearbyPlaces = () => {
          if (!selectedPlace.nearby || typeof selectedPlace.nearby !== 'object') {
            return (
              <div className="loading-wrapper-small">
                <div className="loading-spinner small"></div>
              </div>
            );
          }
         if (selectedPlace.nearby.error) {
            return <div className="no-results">Error fetching nearby places: {selectedPlace.nearby.error}</div>;
         }
         if (Object.keys(selectedPlace.nearby).length === 0 || !Object.values(selectedPlace.nearby).some(arr => arr.length > 0)) {
             return <div className="no-results">No nearby places found</div>;
         }

        if (selectedCategory) {
            const categoryPlaces = selectedPlace.nearby[selectedCategory] || [];
            return (
                <div className="category-details">
                    <div className="places-list">
                        {categoryPlaces.slice(0,5).map((place, index) => (
                            <div key={index} className="place-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${place.photo || 'placeholder.jpg'})` }}>
                                <div className="place-content">
                                    <div className="place-link" onClick={() => {
                                        soundClick();
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
                            onClick={() => { soundClick(); setSelectedCategory(category); }}
                            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${photoUrl})` }}>
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

    const calculateMapCenter = () => {
        if (favorites.length === 0 || !favorites.some(f => f.coordinates)) {
            return [30.8566, 31.3522];
        }

        const validCoordinates = favorites.filter(f => f.coordinates && f.coordinates.lat && f.coordinates.lng);

        if (validCoordinates.length === 0) {
            return [30.8566, 31.3522];
        }

        const sumLat = validCoordinates.reduce((sum, f) => sum + f.coordinates.lat, 0);
        const sumLng = validCoordinates.reduce((sum, f) => sum + f.coordinates.lng, 0);

        return [sumLat / validCoordinates.length, sumLng / validCoordinates.length];
    };

    return (
        <motion.div
            className="favorites-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <h1>Your favorite places</h1>

            <div className="map-container">
                <MapContainer center={calculateMapCenter()} zoom={3} style={{ height: "500px", width: "100%", maxWidth: "1400px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {favorites.map((favorite, index) =>
                        favorite.coordinates ? (
                            <Marker
                                key={index}
                                position={[favorite.coordinates.lat, favorite.coordinates.lng]}
                                eventHandlers={{
                                    click: () => handleMarkerClick(favorite),
                                }}
                            >
                            <Tooltip>
                                <div className="custom-tooltip">
                                    <h2>{favorite.place} ❤ {favorite.favoriteCount ?? 0}</h2>
                                    <div className="tags-container">
                                        {favorite.keywords && favorite.keywords.map((keyword, i) => (
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
                     <div className="overlay" onClick={() => { soundClick(); setSelectedPlace(null); }} />
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
                                                        fill="#03607E"
                                                        stroke="#03607E"
                                                        strokeWidth="2"
                                                        className="heart-icon filled"
                                                        whileTap={{ scale: 1.7 }}
                                                        animate={{ scale: [1, 1.7, 1] }}
                                                        transition={{ duration: 0.3 }}
                                                        onClick={() => removeFromFavorites(selectedPlace.name)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                    </motion.svg>
                                                    {selectedPlace.favoriteCount ?? 0}
                                                </span>
                                                <motion.div
                                                    className="flight-icon" whileTap={{ scale: 1.3 }} whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.2 }} style={{ cursor: 'pointer' }}
                                                    onClick={() => handleFlightSearch(selectedPlace.name)} title="Search flights"
                                                >
                                                    <Plane size={24} strokeWidth={2} />
                                                </motion.div>
                                            </div>
                                        </h2>

                                        <div className="tags-container">
                                            {(selectedPlace.tags || []).map((tag, index) => (
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
        </motion.div>
    );
};

export default Favorites;