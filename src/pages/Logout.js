import { useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";

import UserContext from "../context/UserContext";

export default function Logout() {
  const { setUser, unsetUser } = useContext(UserContext);

  useEffect(() => {
    unsetUser();
    setUser({
      id: null,
    });
  }, []);

  return <Navigate to="/login" />;
}
