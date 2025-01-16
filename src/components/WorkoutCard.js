import React, { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import dayjs from "dayjs";
import Spinner from "./Spinner";

const WorkoutCard = () => {
  const [workoutList, setWorkoutList] = useState([]);
  const user = useContext(UserContext);

  useEffect(() => {
    axios
      .get("https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log("API Response:", res.data);
        if (Array.isArray(res.data)) {
          setWorkoutList(res.data); // Directly set if it's an array
        } else {
          setWorkoutList(res.data.workouts || []); // Adjust based on the API structure
        }
      })
      .catch((error) => {
        console.error("Error fetching workouts:", error);
      });
  }, [user]);

  return (
    <div className="flex flex-wrap justify-center gap-4 pb-96">
      {workoutList.length === 0 ? (
        <Spinner />
      ) : (
        workoutList.map((workout) => (
          <div
            key={workout._id}
            className="max-w-sm p-14 bg-slate-800 bg-white rounded-lg"
          >
            <a href="#"></a>
            <div className="p-5">
              <a href="#">
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {workout.name || "Unnamed Workout"}
                </h1>
              </a>
              <h1 className="mb-3 text-xl font-normal text-white">
                {workout.duration ||
                  "No description available for this workout."}
              </h1>
              <h3 className="mb-3 font-normal text-white">{workout.status}</h3>
              <h3 className="mb-3 font-normal text-white">
                Added on: {dayjs(workout.dateAdded).format("MMM D, YYYY")}
              </h3>
              <div className="flex gap-4">
                <button className="inline-flex items-center px-5 py-2 text-md font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700">
                  Edit
                </button>
                <button className="inline-flex items-center px-5 py-2 text-md font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:outline-none ">
                  Complete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WorkoutCard;
