import "./App.css";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/Footer";
import axios from "axios";

// Page Routes
import Register from "./pages/RegisterPage";
import Workouts from "./pages/WorkoutsPage";
import Login from "./pages/LoginPage";
import Homepage from "./pages/HomePage";
import Logout from "./pages/Logout";

// React Hooks
import { useEffect, useState } from "react";
import { UserProvider } from "./context/UserContext";

function App() {
  const [user, setUser] = useState({
    id: null,
  });

  const unsetUser = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser({ id: null });
      return;
    }

    axios
      .get("https://fitnessapp-api-ln8u.onrender.com/users/details", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((data) => {
        if (typeof data !== "undefined") {
          setUser({ id: data._id });
        } else {
          setUser({ id: null });
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        setUser({ id: null });
      });
  }, []);

  return (
    <>
      <UserProvider value={{ user, setUser, unsetUser }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/" element={<Homepage />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Router>
      </UserProvider>
      <Footer />
    </>
  );
}

export default App;
