import React from "react";
import { Link } from "react-router-dom";
import HeroImage from "../images/hero-image.png";

const Header = () => {
  return (
    <section className="text-center">
      <div className="flex flex-col justify-center items-center h-screen">
        <img className="w-40" src={HeroImage}></img>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to FitMeter
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          Track your fitness journey, set goals, and stay motivated every day!
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Header;
