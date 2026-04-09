import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthGuard";
import { LoadingSpinner } from "../LoadingSpinner";

export const ProtectedLayout = ({ allowedRoles }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <LoadingSpinner/>;

    if (!user) {
        return <Navigate to="/Login" replace/>
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace/>
    }

  return <Outlet/>;
};
