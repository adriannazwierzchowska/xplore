import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaChevronRight } from 'react-icons/fa';
import '../css/home-extended.css';

const checkIfFavorite = async (placeName, isAuthenticated) => {
    if (!isAuthenticated || !placeName) return false;
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return false;

        const response = await axios.get(
            `http://127.0.0.1:8000/api/is_favorite/?place=${encodeURIComponent(placeName)}`,
            { headers: { Authorization: `${token}` } }
        );
        return response.data.is_favorite;
    } catch (error) {
        console.warn(`Error checking favorite status for ${placeName}:`, error);
        return false;
    }
};

const getProcessedCityNameForWikipedia = (fullCityName) => {
    if (!fullCityName) return '';
    if (fullCityName.includes(',')) {
        const parts = fullCityName.split(',');
        return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    }
    return fullCityName.trim();
};

const fetchPlaceImageAndDetails = async (cityName) => {
    if (!cityName) return { imageUrl: null, details: null };
    const processedName = getProcessedCityNameForWikipedia(cityName);
    if (!processedName) return { imageUrl: null, details: null };

    try {
        const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(processedName)}`;
        const response = await axios.get(wikiUrl);
        if (response.data.type === "disambiguation" || (!response.data.thumbnail && !response.data.extract)) {
            return { imageUrl: '/placeholder-image.jpg', details: 'No specific details available.' };
        }
        return {
            imageUrl: response.data.thumbnail ? response.data.thumbnail.source : '/placeholder-image.jpg',
            details: response.data.extract || 'No specific details available.'
        };
    } catch (error) {
        console.warn(`Failed to fetch image/details for ${cityName} from Wikipedia:`, error);
        return { imageUrl: '/placeholder-image.jpg', details: 'Failed to load details.' };
    }
};

const fetchPlaceKeywords = async (cityName) => {
    if (!cityName) return [];
    try {
        const response = await axios.get(`http://127.0.0.1:8000/questionnaire/keywords?destination=${encodeURIComponent(cityName)}`);
        if (response.data && response.data.keywords) {
            return response.data.keywords;
        }
        return [];
    } catch (error) {
        console.warn(`Failed to fetch keywords for ${cityName}:`, error);
        return [];
    }
};

const fetchCoordinates = async (placeName) => {
    if (!placeName) return null;
    try {
        const response = await axios.get(`http://127.0.0.1:8000/questionnaire/place_coordinates/?place=${encodeURIComponent(placeName)}`);
        if (response.data && response.data.coordinates && response.data.coordinates.lat && response.data.coordinates.lng) {
            return response.data.coordinates;
        }
        return null;
    } catch (error) {
        console.warn(`Failed to fetch coordinates for ${placeName}:`, error);
        return null;
    }
};

const PlaceCard = ({ placeData, onPlaceCardClick }) => {
    const { name, imageUrl, favoriteCount, keywords, isFavoritedByUser } = placeData;

    return (
        <div
            className="home-community-place-card"
            style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 100%), url(${imageUrl || '/placeholder-image.jpg'})` }}
            onClick={() => onPlaceCardClick(placeData)}
        >
            <div className="home-community-place-card-top-icons">
                <span className="home-community-place-card-fav-icon">
                    <FaHeart className={isFavoritedByUser ? 'filled' : ''} /> {favoriteCount}
                </span>
                <span className="home-community-place-card-arrow"><FaChevronRight /></span>
            </div>
            <div className="home-community-place-card-bottom-content">
                <h3 className="home-community-place-card-name">{name}</h3> {}
                <div className="home-community-place-card-tags-container">
                    {(keywords || []).slice(0, 3).map((tag, index) => (
                        <span key={index} className="home-community-place-card-tag">{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CommunityFavoritesDisplay = ({ onPlaceCardClick, isAuthenticated }) => {
    const [topPlaces, setTopPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopFavorites = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('http://127.0.0.1:8000/api/community_top_favorites/');
                const placesData = response.data;

                if (!Array.isArray(placesData)) {
                    throw new Error("Invalid data format from API");
                }

                const enrichedPlaces = await Promise.all(
                    placesData.map(async (p) => {
                        const imageAndDetails = await fetchPlaceImageAndDetails(p.place);
                        const keywords = await fetchPlaceKeywords(p.place);
                        const coordinates = await fetchCoordinates(p.place);
                        const isFavorited = await checkIfFavorite(p.place, isAuthenticated);
                        return {
                            name: p.place,
                            favoriteCount: p.favorite_count,
                            imageUrl: imageAndDetails.imageUrl,
                            details: imageAndDetails.details,
                            keywords: keywords,
                            coordinates: coordinates,
                            isFavoritedByUser: isFavorited,
                        };
                    })
                );
                setTopPlaces(enrichedPlaces.slice(0, 4));
            } catch (err) {
                console.error("Error fetching community favorites:", err);
                setError(err.message || "Failed to load community favorites.");
            } finally {
                setLoading(false);
            }
        };
        fetchTopFavorites();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="loading-spinner"></div>
        );
    }
    if (error) return <p className="error-text">Error: {error}</p>;
    if (!topPlaces.length) return <p className="no-items-text">No community favorites to display yet.</p>;

    return (
        <div className="home-community-favorites-section">
            <div className="home-community-favorites-list">
                {topPlaces.map(placeInfo => (
                    <PlaceCard key={placeInfo.name} placeData={placeInfo} onPlaceCardClick={onPlaceCardClick} />
                ))}
            </div>
        </div>
    );
};

export default CommunityFavoritesDisplay;