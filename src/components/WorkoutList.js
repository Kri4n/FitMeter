import React from "react";
import AddWorkoutModal from "../components/AddWorkoutModal";
import WorkoutCard from "../components/WorkoutCard";

const WorkoutList = () => {
  return (
    <>
      <div className="flex items-center gap-2 justify-center h-80 pt-16">
        <h1 className="text-4xl font-extrabold text-white">Workouts</h1>
        <AddWorkoutModal />
      </div>
      <WorkoutCard />
    </>
  );
};

export default WorkoutList;
