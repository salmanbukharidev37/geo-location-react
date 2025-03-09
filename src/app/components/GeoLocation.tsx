import { useState } from "react";

const GeolocationComponent = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon });

        // Fetch address from LocationIQ
        fetchLocationDetails(lat, lon);
      },
      (err) => {
        setError(err.message);
      }
    );
  };

  const fetchLocationDetails = async (lat: number, lon: number) => {
    try {
      const API_KEY = "pk.f048e46c65c8255a6e9cbb50bb30d3a8"; // Your LocationIQ API Key
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`
      );

      const data = await response.json();

      if (data.address) {
        // const { residential, city, state, country } = data.display_name;
        setAddress(`${data.display_name}`);
      } else {
        setError("No location found");
      }
    } catch (error) {
      setError("Failed to fetch location details");
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={getLocation}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Location
      </button>

      {location && (
        <p className="mt-2">
          Latitude: {location.lat}, Longitude: {location.lon}
        </p>
      )}

      {address && <p className="mt-2">Address: {address}</p>}

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default GeolocationComponent;
