import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import dayjs from "dayjs";
import MoreIcon from "../images/more.png";
import { Notyf } from "notyf";
import AddWorkoutModal from "../components/AddWorkoutModal";
import UserContext from "../context/UserContext";

const WorkoutList = () => {
  const [workoutList, setWorkoutList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const user = useContext(UserContext);
  const notyf = new Notyf();

  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");

  useEffect(() => {
    axios
      .get("https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) =>
        setWorkoutList(
          Array.isArray(res.data) ? res.data : res.data.workouts || []
        )
      )
      .catch((error) => console.error("Error fetching workouts:", error));
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (workoutId) =>
    setOpenMenuId(openMenuId === workoutId ? null : workoutId);

  const toggleModal = (workout = null) => {
    if (workout) {
      setCurrentWorkout(workout);
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      notyf.success("Workout deleted successfully");
      const updatedWorkoutList = workoutList.filter(
        (workout) => workout._id !== id
      );
      setWorkoutList(updatedWorkoutList);
    } catch (error) {
      console.error("Error deleting workout:", error);
      notyf.error("Error deleting workout");
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.patch(
        `https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      notyf.success("Workout marked as complete");
      const updatedWorkoutList = workoutList.map((workout) => {
        if (workout._id === id) {
          workout.status = "Completed";
        }
        return workout;
      });
      setWorkoutList(updatedWorkoutList);
    } catch (error) {
      console.error("Error completing workout:", error);
      notyf.error("Error completing workout");
    }
  };

  const handleUpdateWorkout = async (e) => {
    e.preventDefault();

    const updatedWorkout = {
      name: newName,
      duration: newDuration,
    };

    try {
      const response = await axios.patch(
        `https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${currentWorkout._id}`,
        updatedWorkout,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle success response
      notyf.success("Workout updated successfully");

      // Update the workout list in the state with the updated workout data
      const updatedWorkoutList = workoutList.map((workout) =>
        workout._id === currentWorkout._id
          ? { ...workout, name: newName, duration: newDuration } // Update specific workout
          : workout
      );
      setWorkoutList(updatedWorkoutList);

      toggleModal(); // Close the modal after updating
    } catch (error) {
      console.error("Error updating workout:", error);
      notyf.error("Error updating workout");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-center h-80 pt-16">
        <h1 className="text-4xl font-extrabold text-white">Workouts</h1>
        <AddWorkoutModal
          onWorkoutAdded={(newWorkout) => {
            const updatedWorkoutList = [...workoutList, newWorkout];
            setWorkoutList(updatedWorkoutList);
          }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4 pb-96">
        {workoutList.length === 0 ? (
          <p className="text-white">No Workouts</p>
        ) : (
          workoutList.map((workout) => (
            <div
              key={workout._id}
              className="max-w-sm p-14 bg-slate-800 rounded-lg relative"
            >
              <div className="dropdown-container">
                <button
                  className="p-2 rounded-2xl absolute top-4 right-4 hover:bg-gray-600"
                  onClick={() => toggleMenu(workout._id)}
                >
                  <img src={MoreIcon} className="size-5" alt="more options" />
                </button>
                {openMenuId === workout._id && (
                  <div className="absolute right-4 top-16 bg-gray-700 rounded-md shadow-lg py-1 z-10">
                    <button
                      onClick={() => {
                        toggleModal(workout);
                        setOpenMenuId(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {workout.name || "Unnamed Workout"}
                </h1>
                <h1 className="mb-3 text-xl font-normal text-white">
                  Duration: {workout.duration || "No description available"}
                </h1>
                <h3 className="mb-3 font-normal text-white">
                  {workout.status}
                </h3>
                <h3 className="mb-3 font-normal text-white">
                  Added on: {dayjs(workout.dateAdded).format("MMM D, YYYY")}
                </h3>
                <button
                  onClick={() => handleComplete(workout._id)}
                  className="inline-flex items-center px-5 py-2 text-md font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none absolute right-4 bottom-4"
                >
                  Complete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div
          id="crud-modal"
          className="overflow-y-auto fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-opacity-50 bg-black"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Workout
                </h3>
                <button
                  onClick={() => toggleModal()}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleUpdateWorkout}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type workout name"
                      onChange={(e) => setNewName(e.target.value)}
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="duration"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter duration"
                      onChange={(e) => setNewDuration(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Update Workout
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkoutList;
