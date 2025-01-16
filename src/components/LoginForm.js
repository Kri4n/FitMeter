import React from "react";
import { Link } from "react-router-dom";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import axios from "axios";
import { Notyf } from "notyf";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const notyf = new Notyf();

  const loginUser = (e) => {
    e.preventDefault();

    axios
      .post("https://fitnessapp-api-ln8u.onrender.com/users/login", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (response.data && response.data.access) {
          // Check for access token
          localStorage.setItem("token", response.data.access);
          retrieveUserId(response.data.access);
        } else {
          notyf.error("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error(error);
        notyf.error("Something went wrong");
      });
  };

  const retrieveUserId = (token) => {
    axios
      .get("https://fitnessapp-api-ln8u.onrender.com/users/details", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser({ id: response.data._id });
        notyf.success("Welcome Back to FitMeter!");
        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error retrieving user details:", error);
        notyf.error("Failed to get user details");
      });
  };

  if (isLoggedIn || user.id !== null) {
    return <Navigate to="/workouts" />;
  }

  return (
    <>
      <div className="flex min-h-full flex-1 h-screen flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={loginUser} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-white"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-white"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-300">
            Not a member?{" "}
            <Link to="/register" className="font-bold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
