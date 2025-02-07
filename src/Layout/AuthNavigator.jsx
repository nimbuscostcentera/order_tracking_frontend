import React from "react";
import PrivateLayout from "./PrivateLayout";
import { Navigate } from "react-router-dom";
import useFetchAuth from "../store/useFetchAuth";
function AuthNavigator() {
  const {AccessToken } = useFetchAuth();
  return AccessToken ? <PrivateLayout /> : <Navigate to="/" />;
}

export default AuthNavigator;
