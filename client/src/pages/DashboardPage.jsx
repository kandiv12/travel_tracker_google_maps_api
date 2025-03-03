import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GoogleMapComponent from "../components/UI/GoogleMapComponent";

const DashboardPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch workouts
        const workoutRes = await axios.get(
          "http://localhost:5000/api/workouts",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWorkouts(workoutRes.data);
        setCaloriesBurned(
          workoutRes.data.reduce((sum, w) => sum + w.calories_burned, 0)
        );

        // Fetch locations
        const locationRes = await axios.get(
          "http://localhost:5000/api/locations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setLocations(locationRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Display Total Calories Burned */}
      <div className="bg-blue-200 text-blue-900 p-4 rounded-lg text-center mb-6">
        <h2 className="text-2xl font-semibold">
          Total Calories Burned: {caloriesBurned} kcal
        </h2>
      </div>

      {/* Map Component */}
      <h2 className="text-2xl font-semibold mb-4">Workout Locations</h2>
      {locations.length > 0 ? (
        <GoogleMapComponent locations={locations} /> // ✅ Displays Google Maps
      ) : (
        <p className="text-gray-500">No workout locations logged yet.</p>
      )}

      {/* Workout List */}
      <h2 className="text-2xl font-semibold mt-6 mb-4">Your Workouts</h2>
      {workouts.length === 0 ? (
        <p className="text-gray-500">No workouts logged yet.</p>
      ) : (
        <ul className="space-y-4">
          {workouts.map((workout) => (
            <li
              key={workout.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <p>
                <strong>Type:</strong> {workout.workout_type}
              </p>
              <p>
                <strong>Duration:</strong> {workout.duration} min
              </p>
              <p>
                <strong>Calories Burned:</strong> {workout.calories_burned} kcal
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(workout.workout_date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;
