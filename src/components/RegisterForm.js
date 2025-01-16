import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Notyf } from "notyf";
import axios from "axios";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  const notyf = new Notyf();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset validation states
    setIsEmailValid(true);
    setIsPasswordValid(true);

    let isValid = true;

    if (!email.includes("@")) {
      setIsEmailValid(false);
      isValid = false;
    }

    if (password.length < 8) {
      setIsPasswordValid(false);
      isValid = false;
    }

    if (isValid) {
      axios
        .post(
          "https://fitnessapp-api-ln8u.onrender.com/users/register",
          {
            email: email,
            password: password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((data) => {
          console.log("Registered Successfully", data);
          notyf.success("Registered Successfully");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          console.error(error);
          notyf.error("Something went wrong");
        });
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col h-screen justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
          Register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 sm:text-sm/6"
              />
              {!isEmailValid && (
                <p className="py-2 text-red-500">
                  Invalid email. Please use the right format
                </p>
              )}
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 sm:text-sm/6"
              />
              {!isPasswordValid && (
                <p className="py-2 text-red-500">
                  Password must be at least 8 characters
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-slate-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Submit
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
