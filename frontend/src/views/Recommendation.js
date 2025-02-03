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
                }
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, [location.state]);

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

    const addToFavorites = async (place) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                alert('You need to log in to add favorites!');
                return;
            }

            const response = await axios.post(
                'http://127.0.0.1:8000/api/add_favorite/',
                { place },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );
            alert(response.data.message);
        } catch (error) {
            console.error('Error adding to favorites:', error);
            alert('Failed to add to favorites. Please try again.');
        }
    };

    return (
        <div className="recommendation">
            <h1>Recommended Places</h1>
            <div style={{ display: "flex" }}>
                <div style={{ flex: 3 }}>
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
                                        <div>
                                            <h2>{place.place}</h2>
                                            <ul>
                                                {place.keywords.map((keyword, i) => (
                                                    <li key={i}>{keyword}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Tooltip>
                                </Marker>
                            ) : null
                        )}
                    </MapContainer>
                </div>

                <div style={{ flex: 1, padding: "20px", borderLeft: "1px solid #ccc" }}>
                    {selectedPlace ? (
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            {selectedPlace.imageUrl && (
                                <div style={{ marginRight: "20px" }}>
                                    <img
                                        src={selectedPlace.imageUrl}
                                        alt={selectedPlace.name}
                                        style={{ width: '300px', height: 'auto', borderRadius: '8px' }}
                                    />
                                </div>
                            )}
                            <div>
                                <h2>{selectedPlace.name}</h2>
                                <h3>Tags:</h3>
                                <ul>
                                    {selectedPlace.tags.map((tag, index) => (
                                        <li key={index}>{tag}</li>
                                    ))}
                                </ul>
                                <p className="selected-place" dangerouslySetInnerHTML={{ __html: selectedPlace.details }}></p>
                                <button onClick={() => addToFavorites(selectedPlace.name)}>Add to Favorites</button>
                                <button onClick={() => alert('To be implemented')}>See More</button>
                            </div>
                        </div>
                    ) : (
                        <p>Click on a pin to see details about the place.</p>
                    )}
                </div>
            </div>

            <div className="button-group">
                <button type="button1" onClick={() => navigate('/')}>
                    Home
                </button>
            </div>
        </div>
    );
};

export default Recommendation;
