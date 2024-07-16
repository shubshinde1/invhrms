// components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  // Optionally: verify the token with the server here
  // If invalid, clear the token and redirect to login

  return <Component {...rest} />;
};

export default ProtectedRoute;
