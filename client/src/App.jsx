import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const API_URL = "http://localhost:5000/api";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const tokenKey = "authToken";

function App() {
  const [user, setUser] = useState(null);
  const [locations, setLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [isRegistering, setIsRegistering] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (token) {
      axios
        .get(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem(tokenKey));
    }
  }, []);

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_URL}/locations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
        })
        .then((res) => {
          setLocations(res.data);
          if (res.data.length > 0)
            setMapCenter({
              lat: res.data[0].latitude,
              lng: res.data[0].longitude,
            });
        })
        .catch((error) => console.error("Error fetching locations:", error));
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem(tokenKey, res.data.token);
      setUser({ username: res.data.username });
    } catch (err) {
      alert("Invalid login credentials");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/register`, { username, email, password });
      alert("Registration successful! You can now log in.");
      setIsRegistering(false);
    } catch (err) {
      alert("Error registering user. Username or email may already exist.");
    }
  };

  const addLocation = async () => {
    const name = document.getElementById("name").value;
    const latitude = parseFloat(document.getElementById("lat").value);
    const longitude = parseFloat(document.getElementById("lng").value);

    if (!name || isNaN(latitude) || isNaN(longitude)) {
      alert("Please enter valid location details.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/locations`,
        { name, latitude, longitude },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
        }
      );
      setLocations([res.data, ...locations]);
      setMapCenter({ lat: res.data.latitude, lng: res.data.longitude });
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    setUser(null);
    setLocations([]);
  };

  return (
    <div>
      <h1>🗺 Travel Tracker</h1>

      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={handleLogout}>Logout</button>

          <h2>Add New Location</h2>
          <input type="text" placeholder="Name" id="name" />
          <input type="number" placeholder="Latitude" id="lat" />
          <input type="number" placeholder="Longitude" id="lng" />
          <button onClick={addLocation}>Add Location</button>

          <h2>Your Locations</h2>
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={mapCenter}
              zoom={5}
            >
              {locations.map((loc) => (
                <Marker
                  key={loc.id}
                  position={{ lat: loc.latitude, lng: loc.longitude }}
                />
              ))}
            </GoogleMap>
          </LoadScript>

          <ul>
            {locations.map((loc) => (
              <li key={loc.id}>
                {loc.name} - ({loc.latitude}, {loc.longitude})
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div>
          {isRegistering ? (
            <form onSubmit={handleRegister}>
              <h2>Register</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Register</button>
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setIsRegistering(false)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Login here
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <h2>Login</h2>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
              <p>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsRegistering(true)}
                  style={{ cursor: "pointer", color: "blue" }}
                >
                  Register here
                </span>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
