import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function App() {
  const mapRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState("Chicago"); // Default city
  const [locations, setLocations] = useState({});

  // Dummy data for locations
  const cityLocations = {
    "New York": [
      {
        name: "Central Park",
        latitude: 40.7829,
        longitude: -73.9654,
        description: "Iconic urban park.",
        imageUrl: "https://placehold.co/200x150/EEE/31343C?text=Central+Park",
      },
      {
        name: "Empire State Building",
        latitude: 40.7484,
        longitude: -73.9857,
        description: "Famous skyscraper.",
        imageUrl: "https://placehold.co/200x150/EEE/31343C?text=Empire+State",
      },
    ],
    Chicago: [
      {
        name: "Millennium Park",
        latitude: 41.8827,
        longitude: -87.6233,
        description: "Home to Cloud Gate.",
        imageUrl:
          "https://placehold.co/200x150/EEE/31343C?text=Millennium+Park",
      },
      {
        name: "Navy Pier",
        latitude: 41.8917,
        longitude: -87.6006,
        description: "Amusement park on a pier.",
        imageUrl: "https://placehold.co/200x150/EEE/31343C?text=Navy+Pier",
      },
    ],
    "Los Angeles": [
      {
        name: "Griffith Observatory",
        latitude: 34.1186,
        longitude: -118.3004,
        description: "Offers views of the city.",
        imageUrl: "https://placehold.co/200x150/EEE/31343C?text=Griffith",
      },
      {
        name: "Santa Monica Pier",
        latitude: 34.0097,
        longitude: -118.4975,
        description: "Famous pier with an amusement park.",
        imageUrl: "https://placehold.co/200x150/EEE/31343C?text=Santa+Monica",
      },
    ],
  };

  useEffect(() => {
    setLocations(cityLocations);
  }, []);

  useEffect(() => {
    if (mapRef.current && locations[selectedCity]) {
      // Clear the previous map if it exists
      if (mapRef.current.leafletElement) {
        mapRef.current.leafletElement.remove();
      }

      // Initialize the map
      const map = L.map(mapRef.current).setView(
        getCityCoordinates(selectedCity),
        11
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add markers for the selected city
      locations[selectedCity].forEach((location) => {
        const marker = L.marker([location.latitude, location.longitude]).addTo(
          map
        );
        marker.bindPopup(`
                    <h3>${location.name}</h3>
                    <p>${location.description}</p>
                    <img src="${location.imageUrl}" alt="${location.name}" width="200" />
                `);
      });

      // Store the map instance in the ref
      mapRef.current.leafletElement = map;
    }
  }, [selectedCity, locations]);

  // Helper function to get city coordinates
  const getCityCoordinates = (city) => {
    switch (city) {
      case "New York":
        return [40.7128, -74.006];
      case "Chicago":
        return [41.8781, -87.6298];
      case "Los Angeles":
        return [34.0522, -118.2437];
      default:
        return [0, 0];
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Explore Cities</h1>
        <p>Select a city to view its landmarks:</p>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="New York">New York</option>
          <option value="Chicago">Chicago</option>
          <option value="Los Angeles">Los Angeles</option>
        </select>
      </header>
      <div id="map" ref={mapRef} style={{ height: "500px" }} />
    </div>
  );
}

export default App;
