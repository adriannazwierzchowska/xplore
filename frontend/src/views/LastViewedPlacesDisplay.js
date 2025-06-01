import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaChevronRight } from 'react-icons/fa';
import '../css/home-extended.css';

const getProcessedCityNameForWikipedia = (fullCityName) => {
    if (!fullCityName) return '';
    if (fullCityName.includes(',')) {
        const parts = fullCityName.split(',');
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }
    return fullCityName.trim();
};

const fetchPlaceImageAndDetailsIfNeeded = async (placeFromStorage) => {
    let imageUrl = placeFromStorage.imageUrl;
    let details = placeFromStorage.details;

    if (!imageUrl || !details) {
        const processedName = getProcessedCityNameForWikipedia(placeFromStorage.name);
        if (processedName) {
            try {
                const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(processedName)}`;
                const response = await axios.get(wikiUrl);
                if (response.data.type !== "disambiguation") {
                    imageUrl = imageUrl || (response.data.thumbnail ? response.data.thumbnail.source : '/placeholder-image.jpg');
                    details = details || (response.data.extract || 'No specific details available.');
                } else {
                    imageUrl = imageUrl || '/placeholder-image.jpg';
                    details = details || 'No specific details available.';
                }
            } catch (error) {
                console.warn(`Failed to fetch image/details for ${placeFromStorage.name} from Wikipedia:`, error);
                imageUrl = imageUrl || '/placeholder-image.jpg';
                details = details || 'Failed to load details.';
            }
        } else {
            imageUrl = imageUrl || '/placeholder-image.jpg';
            details = details || 'No specific details available.';
        }
    }

    return { ...placeFromStorage, imageUrl, details };
};

const fetchPlaceKeywordsIfNeeded = async (placeFromStorage) => {
    if (placeFromStorage.keywords && placeFromStorage.keywords.length > 0) {
        return placeFromStorage;
    }
    if (!placeFromStorage.name) return { ...placeFromStorage, keywords: [] };
    try {
        const response = await axios.get(`http://127.0.0.1:8000/questionnaire/keywords?destination=${encodeURIComponent(placeFromStorage.name)}`);
        return { ...placeFromStorage, keywords: (response.data && response.data.keywords) ? response.data.keywords : [] };
    } catch (error) {
        console.warn(`Failed to fetch keywords for ${placeFromStorage.name}:`, error);
        return { ...placeFromStorage, keywords: [] };
    }
};

const fetchCoordinatesIfNeeded = async (placeFromStorage) => {
    if (placeFromStorage.coordinates) {
        return placeFromStorage;
    }
    if (!placeFromStorage.name) return { ...placeFromStorage, coordinates: null };
    try {
        const response = await axios.get(`http://127.0.0.1:8000/questionnaire/place_coordinates/?place=${encodeURIComponent(placeFromStorage.name)}`);
        if (response.data && response.data.coordinates && response.data.coordinates.lat && response.data.coordinates.lng) {
            return { ...placeFromStorage, coordinates: response.data.coordinates };
        }
        return { ...placeFromStorage, coordinates: null };
    } catch (error) {
        console.warn(`Failed to fetch coordinates for ${placeFromStorage.name}:`, error);
        return { ...placeFromStorage, coordinates: null };
    }
};

const fetchFavoriteCountForPlace = async (placeName) => {
    if (!placeName) return 0;
    try {
        const response = await axios.get(`http://127.0.0.1:8000/api/favorite_count/?place=${encodeURIComponent(placeName)}`);
        return response.data.favorite_count || 0;
    } catch (error) {
        console.warn(`Failed to fetch favorite count for ${placeName}:`, error);
        return 0;
    }
};

const PlaceCard = ({ placeData, onPlaceCardClick }) => {
    const { name, imageUrl, favoriteCount, keywords } = placeData;

    return (
        <div
            className="home-community-place-card"
            style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%), url(${imageUrl || '/placeholder-image.jpg'})` }}
            onClick={() => onPlaceCardClick(placeData)}
        >
            <div className="home-community-place-card-top-icons">
                <span className="home-community-place-card-fav-icon"><FaHeart /> {favoriteCount}</span>
                <span className="home-community-place-card-arrow"><FaChevronRight /></span>
            </div>
            <div className="home-community-place-card-bottom-content">
                <h3 className="home-community-place-card-name">{name}</h3>
                <div className="home-community-place-card-tags-container">
                    {(keywords || []).slice(0, 3).map((tag, index) => (
                        <span key={index} className="home-community-place-card-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};


const LastViewedPlacesDisplay = ({ onPlaceCardClick }) => {
    const [lastViewedPlaces, setLastViewedPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadLastViewed = async () => {
            try {
                setLoading(true);
                setError(null);
                const storedPlaces = JSON.parse(localStorage.getItem('lastViewedPlaces')) || [];

                if (storedPlaces.length === 0) {
                    setLastViewedPlaces([]);
                    setLoading(false);
                    return;
                }

                const enrichedPlaces = await Promise.all(
                    storedPlaces.map(async (p_stored) => {
                        let place = { ...p_stored };
                        place = await fetchPlaceImageAndDetailsIfNeeded(place);
                        place = await fetchPlaceKeywordsIfNeeded(place);
                        place = await fetchCoordinatesIfNeeded(place);
                        const favoriteCount = await fetchFavoriteCountForPlace(place.name);
                        return {
                            ...place,
                            favoriteCount: favoriteCount,
                        };
                    })
                );
                setLastViewedPlaces(enrichedPlaces);
            } catch (err) {
                console.error("Error loading last viewed places:", err);
                setError(err.message || "Failed to load last viewed places.");
            } finally {
                setLoading(false);
            }
        };
        loadLastViewed();
    }, []);

    if (loading) return <p className="loading-text">Loading your last viewed places...</p>;
    if (error) return <p className="error-text">Error: {error}</p>;
    if (!lastViewedPlaces.length) return <p className="no-items-text">You haven't viewed any places recently.</p>;

    return (
        <div className="home-community-favorites-section"> {/* Reusing class for layout */}
            <h2 className="home-community-favorites-title">Your last viewed places:</h2>
            <div className="home-community-favorites-list">
                {lastViewedPlaces.map(placeInfo => (
                    <PlaceCard key={placeInfo.name} placeData={placeInfo} onPlaceCardClick={onPlaceCardClick} />
                ))}
            </div>
        </div>
    );
};

export default LastViewedPlacesDisplay;