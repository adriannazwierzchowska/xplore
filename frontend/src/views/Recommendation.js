import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../front.css';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

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
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [likes, setLikes] = useState({});

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                if (location.state?.recommendation) {
                    const updatedPlaces = await Promise.all(
                        location.state.recommendation.map(async (place) => {
                            const summary = await fetchCitySummary(place.place);
                            return { ...place, details: summary.details, imageUrl: summary.imageUrl };
                        })
                    );
                    setPlaces(updatedPlaces);

                    fetchLikes(location.state.recommendation.map(p => p.place));
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, [location.state]);

    const fetchLikes = async (placesNames) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/get_likes/', { places: placesNames });
            setLikes(response.data.likes);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    };

    const addLike = async (placeName) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You need to log in to like!');
                return;
            }

            await axios.post(
                'http://127.0.0.1:8000/api/add_like/',
                { place: placeName },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            // Po kliknięciu aktualizuj licznik lajków
            setLikes(prevLikes => ({
                ...prevLikes,
                [placeName]: (prevLikes[placeName] || 0) + 1
            }));
        } catch (error) {
            console.error('Error adding like:', error);
            alert('Failed to add like. Please try again.');
        }
    };

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
                    details: `📌 ${processedCityName} ma wiele znaczeń. <a href="${response.data.content_urls.desktop.page}" target="_blank">Zobacz na Wikipedii</a>`,
                    imageUrl: null
                };
            }

            const imageUrl = response.data.thumbnail ? response.data.thumbnail.source : null;
            const details = response.data.extract || "Brak opisu dla tego miasta.";

            return { details, imageUrl };
        } catch (error) {
            console.error("❌ Błąd podczas pobierania danych z Wikipedii:", error);
            return {
                details: "Brak opisu dla tego miasta.",
                imageUrl: null
            };
        }
    };

    const handleMarkerClick = async (place) => {
        try {
            const summary = await fetchCitySummary(place.place);

            setSelectedPlace({
                name: place.place,
                tags: place.keywords,
                details: summary.details,
                imageUrl: summary.imageUrl
            });
        } catch (error) {
            setSelectedPlace({
                name: place.place,
                tags: place.keywords,
                details: "No description for this city.",
                imageUrl: null
            });
        }
    };

    return (
        <div className="recommendation">
            <h1 className="recommendation-heading">
              You should <span className="turquoise-text">xplore</span> these places
            </h1>

            <div className="map-container">
                <MapContainer center={[30.8566, 31.3522]} zoom={3} style={{ height: "500px", width: "1400px" }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {places.map((place, index) =>
                        place.coordinates ? (
                            <Marker
                                key={index}
                                position={[place.coordinates.lat, place.coordinates.lng]}
                                eventHandlers={{
                                    click: () => handleMarkerClick(place),
                                }}
                            >
                                <Tooltip>
                                    <div className="custom-tooltip">
                                        <h2>{place.place}</h2>

                                        <div className="like-container">
                                            <button
                                                className="like-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addLike(place.place);
                                                }}
                                            >
                                                ❤️
                                            </button>
                                            <span className="like-count">
                                                {likes[place.place] || 0}
                                            </span>
                                        </div>

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
                    <div className="overlay" onClick={() => setSelectedPlace(null)} />
                    <div className="sidebar active">
                        <div className="sidebar-content">
                            {selectedPlace.imageUrl && (
                                <img
                                    src={selectedPlace.imageUrl}
                                    alt={selectedPlace.name}
                                    className="sidebar-image"
                                />
                            )}

                            <div>
                                <h2>{selectedPlace.name}</h2>

                                <div className="like-container">
                                    <button
                                        className="like-button"
                                        onClick={() => addLike(selectedPlace.name)}
                                    >
                                        ❤️
                                    </button>
                                    <span className="like-count">
                                        {likes[selectedPlace.name] || 0}
                                    </span>
                                </div>

                                <div className="tags-container">
                                    {selectedPlace.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>

                                <p
                                    className="selected-place"
                                    dangerouslySetInnerHTML={{ __html: selectedPlace.details }}
                                />

                                <div className="sidebar-buttons">
                                    <button onClick={() => alert('See more to be implemented')}>
                                        See More
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="button-group">
                <button type="button-home" onClick={() => navigate('/')}>
                    Home
                </button>
            </div>
        </div>
    );
};

export default Recommendation;
