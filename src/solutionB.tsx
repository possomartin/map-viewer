import React, { useState, useEffect, useRef } from "react";

// City center coordinates and initial zoom levels
const CITY_CONFIGS = {
  "New York": { center: [40.7128, -74.006], zoom: 12 },
  Chicago: { center: [41.8781, -87.6298], zoom: 12 },
  "Los Angeles": { center: [34.0522, -118.2437], zoom: 12 },
};

// Dummy location data for each city
const CITY_LOCATIONS = {
  "New York": [
    {
      name: "Central Park",
      latitude: 40.7829,
      longitude: -73.9654,
      description:
        "An iconic 843-acre urban park featuring lakes, walking paths, and the Central Park Zoo.",
      imageUrl: "/api/placeholder/300/200",
    },
    {
      name: "Empire State Building",
      latitude: 40.7484,
      longitude: -73.9857,
      description:
        "102-story Art Deco skyscraper with observation decks offering panoramic city views.",
      imageUrl: "/api/placeholder/300/200",
    },
    {
      name: "Times Square",
      latitude: 40.758,
      longitude: -73.9855,
      description:
        "Bustling tourist hub known for bright lights, Broadway theaters, and street performances.",
      imageUrl: "/api/placeholder/300/200",
    },
  ],
  Chicago: [
    {
      name: "Millennium Park",
      latitude: 41.8827,
      longitude: -87.6233,
      description:
        "Home to the famous Cloud Gate sculpture (The Bean) and Crown Fountain.",
      imageUrl: "/api/placeholder/300/200",
    },
    {
      name: "Navy Pier",
      latitude: 41.8917,
      longitude: -87.6074,
      description:
        "Historic pier featuring rides, restaurants, and boat tours of Lake Michigan.",
      imageUrl: "/api/placeholder/300/200",
    },
    {
      name: "Art Institute of Chicago",
      latitude: 41.8796,
      longitude: -87.6237,
      description:
        "World-renowned art museum housing famous works like American Gothic.",
      imageUrl: "/api/placeholder/300/200",
    },
  ],
  "Los Angeles": [
    {
      name: "Griffith Observatory",
      latitude: 34.1184,
      longitude: -118.3004,
      description:
        "Iconic observatory offering city views, planetarium shows, and astronomical exhibits.",
      imageUrl: "/api/placeholder/300/200",
    },
    {
      name: "Santa Monica Pier",
      latitude: 34.0089,
      longitude: -118.4973,
      description:
        "Historic pier featuring an amusement park, restaurants, and beautiful ocean views.",
      imageUrl: "/api/placeholder/300/200",
    },
    {
      name: "Hollywood Walk of Fame",
      latitude: 34.1016,
      longitude: -118.3267,
      description:
        "Famous sidewalk featuring stars honoring achievements in entertainment.",
      imageUrl: "/api/placeholder/300/200",
    },
  ],
};

export default function SolutionB() {
  const [selectedCity, setSelectedCity] = useState("New York");
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // Load the Leaflet library and styles dynamically
    const loadLeaflet = async () => {
      const L = await import("leaflet");
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(css);

      // Initialize map if it doesn't exist
      if (!map) {
        const newMap = L.map(mapRef.current).setView(
          CITY_CONFIGS[selectedCity].center,
          CITY_CONFIGS[selectedCity].zoom
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(newMap);

        setMap(newMap);
      }
    };

    loadLeaflet();

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => marker.remove());
    setMarkers([]);

    // Update map view for selected city
    map.setView(
      CITY_CONFIGS[selectedCity].center,
      CITY_CONFIGS[selectedCity].zoom
    );

    // Add new markers
    const newMarkers = CITY_LOCATIONS[selectedCity].map((location) => {
      const marker = L.marker([location.latitude, location.longitude]).addTo(
        map
      );

      marker.bindPopup(`
        <div class="p-4">
          <h3 class="text-lg font-bold mb-2">${location.name}</h3>
          <img src="${location.imageUrl}" alt="${location.name}" class="w-full mb-2 rounded"/>
          <p>${location.description}</p>
        </div>
      `);

      return marker;
    });

    setMarkers(newMarkers);
  }, [selectedCity, map]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            City Explorer
          </h1>
          <p className="text-gray-600 mb-6">
            Discover fascinating locations in major US cities
          </p>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-64 p-2 border rounded shadow-sm mb-4"
          >
            {Object.keys(CITY_CONFIGS).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </header>

        <div ref={mapRef} className="w-full h-96 rounded-lg shadow-lg mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CITY_LOCATIONS[selectedCity].map((location) => (
            <div
              key={location.name}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={location.imageUrl}
                alt={location.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
                <p className="text-gray-600">{location.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
