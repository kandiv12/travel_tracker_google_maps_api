import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

// Default to a known location (e.g., New York) if no locations exist
const defaultCenter = { lat: 40.7128, lng: -74.006 };

const GoogleMapComponent = ({ locations }) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          locations.length > 0
            ? { lat: locations[0].latitude, lng: locations[0].longitude }
            : defaultCenter
        }
        zoom={locations.length > 0 ? 10 : 5} // Zoom out if no locations
      >
        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={{ lat: loc.latitude, lng: loc.longitude }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
