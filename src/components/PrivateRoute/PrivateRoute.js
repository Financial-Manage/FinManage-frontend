import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("sessionToken"); // Verifica se o token está salvo no localStorage
  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
