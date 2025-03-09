import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import L from "leaflet";

// Fix default icon issue in Leaflet
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const icon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMap = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        fetchLocationDetails(lat, lon);
      },
      (err) => {
        setError(err.message);
      }
    );
  }, []);

  const fetchLocationDetails = async (lat: number, lon: number) => {
    try {
      const API_KEY = "pk.f048e46c65c8255a6e9cbb50bb30d3a8"; // Your LocationIQ API Key
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();

      if (data.address) {
        const { road, city, state, country } = data.address;
        setAddress(`${road || "Unnamed Road"}, ${city || state}, ${country}`);
      } else {
        setError("No location found");
      }
    } catch (error) {
      setError("Failed to fetch location details");
    }
  };

  return (
    <div className="p-4">
      {error && <p className="text-red-500">{error}</p>}

      {location && (
        <div>
          <p>
            Latitude: {location.lat}, Longitude: {location.lon}
          </p>
          <p>Address: {address || "Fetching address..."}</p>

          {/* Leaflet Map */}
          <MapContainer
            center={[location.lat, location.lon]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            {/* LocationIQ Tile Layer */}
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Marker at User Location */}
            <Marker position={[location.lat, location.lon]} icon={icon}>
              <Popup>{address || "You are here!"}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
