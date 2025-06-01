import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";
import { FaHeart } from 'react-icons/fa';
import { Plane } from 'lucide-react';
import { useSoundContext } from '../SoundContext';
import { notifyError, notifyInfo, notifySuccess, notifyWarning } from '../utils/toast';
import '../css/recommendation.css';

const PlaceDetailsSidebar = ({ selectedPlaceData, onClose, isAuthenticated, username }) => {
    const navigate = useNavigate();
    const { soundClick, soundPlaceSelect } = useSoundContext();

    const [isFavorite, setIsFavorite] = useState(false);
    const [currentFavoriteCount, setCurrentFavoriteCount] = useState(selectedPlaceData?.favoriteCount || 0);
    const [nearbyPlacesDetails, setNearbyPlacesDetails] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLoadingNearby, setIsLoadingNearby] = useState(false);

    const checkIfFavorite = useCallback(async (placeName) => {
        if (!isAuthenticated || !placeName) return false;
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `http://127.0.0.1:8000/api/is_favorite/?place=${encodeURIComponent(placeName)}`,
                { headers: { Authorization: `${token}` } }
            );
            return response.data.is_favorite;
        } catch (error) {
            console.error('Error checking favorite status:', error);
            return false;
        }
    }, [isAuthenticated]);

    const fetchFavoriteStats = useCallback(async (placeName) => {
        if (!placeName) return;
        const favStatus = await checkIfFavorite(placeName);
        setIsFavorite(favStatus);
        setCurrentFavoriteCount(selectedPlaceData?.favoriteCount || 0);
    }, [checkIfFavorite, selectedPlaceData?.favoriteCount]);


    useEffect(() => {
        if (selectedPlaceData) {
            document.body.classList.add('place-sidebar-active');
            fetchFavoriteStats(selectedPlaceData.name);
            if (selectedPlaceData.coordinates) {
                fetchNearbyDetails(selectedPlaceData.coordinates);
            } else {
                setNearbyPlacesDetails({});
            }
            setSelectedCategory(null);
        } else {
            document.body.classList.remove('place-sidebar-active');
        }
        return () => {
            document.body.classList.remove('place-sidebar-active');
        };
    }, [selectedPlaceData, fetchFavoriteStats]);


    const fetchNearbyDetails = async (coordinates) => {
        if (!coordinates || !coordinates.lat || !coordinates.lng) {
            setNearbyPlacesDetails({ error: "Coordinates not available." });
            return;
        }
        setIsLoadingNearby(true);
        try {
            const response = await axios.post('http://127.0.0.1:8000/places/nearby-places/', {
                lat: coordinates.lat,
                lng: coordinates.lng
            });
            setNearbyPlacesDetails(response.data || {});
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            setNearbyPlacesDetails({ error: error.message || "Failed to load nearby places." });
        } finally {
            setIsLoadingNearby(false);
        }
    };

    const handleAddToFavorites = async (placeName) => {
        if (!isAuthenticated) {
            notifyInfo('You need to log in to add favorites!');
            navigate('/login');
            return;
        }
        soundClick();
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('http://127.0.0.1:8000/api/add_favorite/', { place: placeName }, { headers: { Authorization: `${token}` } });
            setIsFavorite(true);
            setCurrentFavoriteCount(prev => prev + 1);
            notifySuccess(`${placeName} added to favorites!`);
        } catch (error) {
            console.error('Error adding to favorites:', error);
            notifyError('Failed to add to favorites.');
        }
    };

    const handleRemoveFromFavorites = async (placeName) => {
        if (!isAuthenticated) return;
        soundClick();
        try {
            const token = localStorage.getItem('authToken');
            await axios.post('http://127.0.0.1:8000/api/remove_favorite/', { place: placeName }, { headers: { Authorization: `${token}` } });
            setIsFavorite(false);
            setCurrentFavoriteCount(prev => Math.max(0, prev - 1));
            notifySuccess(`${placeName} removed from favorites.`);
        } catch (error) {
            console.error('Error removing from favorites:', error);
            notifyError('Failed to remove from favorites.');
        }
    };

    const handleFlightSearch = (placeName) => {
        soundClick();
        navigate('/flights', { state: { place: placeName } });
    };

    const renderStarRating = (rating) => {
        const parsedRating = typeof rating === 'string' ? parseFloat(rating) : rating;
        if (isNaN(parsedRating) || parsedRating === 0) return null;
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

    const renderNearbyPlacesContent = () => {
        if (isLoadingNearby) return <div className="loading-message">Loading nearby places...</div>;
        if (nearbyPlacesDetails.error) return <div className="no-results">Error: {nearbyPlacesDetails.error}</div>;
        if (Object.keys(nearbyPlacesDetails).length === 0) return <div className="no-results">No nearby places data.</div>;

        if (selectedCategory) {
            const categoryPlaces = nearbyPlacesDetails[selectedCategory] || [];
            if (categoryPlaces.length === 0) return <div className="no-results">No places found for {selectedCategory}.</div>;
            return (
                <div className="places-list">
                    {categoryPlaces.slice(0, 5).map((place, index) => (
                        <div key={index} className="place-card" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${place.photo || '/placeholder-image.jpg'})` }}>
                            <div className="place-content">
                                <div className="place-link" onClick={() => {
                                    soundClick();
                                    if (place.website) window.open(place.website, '_blank');
                                    else notifyInfo('No website available.');
                                }} />
                                {place.rating && renderStarRating(place.rating)}
                                <h4>{place.name}</h4>
                                {place.reviews?.[0]?.text && <p className="place-description">"{place.reviews[0].text}"</p>}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        const categories = ['Accommodation', 'Food', 'Entertainment', 'Sightseeing'].filter(cat => nearbyPlacesDetails[cat] && nearbyPlacesDetails[cat].length > 0);
        if (categories.length === 0) return <div className="no-results">No nearby categories with places found.</div>;

        return (
            <div className="category-grid">
                {categories.map((category) => {
                    const firstPlace = nearbyPlacesDetails[category][0];
                    const photoUrl = firstPlace?.photo || '/placeholder-image.jpg';
                    return (
                        <div
                            key={category}
                            className="category-card"
                            onClick={() => { soundClick(); setSelectedCategory(category); }}
                            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${photoUrl})` }}
                        >
                            <h3 className="category-title">{category}</h3>
                            {firstPlace?.name && <p className="place-name">{firstPlace.name}</p>}
                        </div>
                    );
                })}
            </div>
        );
    };


    if (!selectedPlaceData) return null;

    return (
        <>
            <div className="overlay" onClick={() => { soundClick(); onClose(); }} />
            <motion.div
                className={`place-details-sidebar ${selectedCategory ? 'expanded' : ''} active`}
            >
                <div className="place-details-sidebar-content">
                    {!selectedCategory ? (
                        <>
                            {selectedPlaceData.imageUrl && (
                                <img src={selectedPlaceData.imageUrl} alt={selectedPlaceData.name} className="sidebar-image" />
                            )}
                            <div>
                                <h2 className="s-place-name">
                                    {selectedPlaceData.name}
                                    <div className="place-actions">
                                        <span className={`favorite-count ${isFavorite ? 'filled' : ''}`}>
                                            <motion.svg
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill={isFavorite ? '#03607E' : 'none'} stroke="#03607E" strokeWidth="2"
                                                className={`heart-icon ${isFavorite ? 'filled' : ''}`}
                                                whileTap={{ scale: 1.7 }}
                                                animate={{ scale: isFavorite ? [1, 1.7, 1] : 1 }}
                                                transition={{ duration: 0.3 }}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => isFavorite ? handleRemoveFromFavorites(selectedPlaceData.name) : handleAddToFavorites(selectedPlaceData.name)}
                                            >
                                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                            </motion.svg>
                                            {currentFavoriteCount}
                                        </span>
                                        {selectedPlaceData.coordinates && (
                                            <motion.div
                                                className="flight-icon" whileTap={{ scale: 1.3 }} whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.2 }} style={{ cursor: 'pointer' }}
                                                onClick={() => handleFlightSearch(selectedPlaceData.name)} title="Search flights"
                                            >
                                                <Plane size={24} strokeWidth={2} />
                                            </motion.div>
                                        )}
                                    </div>
                                </h2>
                                <div className="tags-container">
                                    {(selectedPlaceData.keywords || []).map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>
                                <div className="nearby-section">
                                    {renderNearbyPlacesContent()}
                                </div>
                                <p className="selected-place" dangerouslySetInnerHTML={{ __html: selectedPlaceData.details }} />
                            </div>
                        </>
                    ) : (
                        <div className="category-details">
                            <button className="button3" onClick={() => { soundClick(); setSelectedCategory(null); }}>
                                &lt; Go back to {selectedPlaceData.name}
                            </button>
                            {renderNearbyPlacesContent()}
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default PlaceDetailsSidebar;