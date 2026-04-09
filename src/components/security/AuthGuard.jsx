import React, { createContext, useContext, useEffect, useState } from "react";
import { Outlet, replace, useNavigate } from "react-router-dom";
import { checkAuth } from "../../store/authStore";
import { Navbar } from "../Navbar";
import { LoadingSpinner } from "../LoadingSpinner";

const AuthContext = createContext();

export default function AuthGuard({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = checkAuth((currentUser, snap) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          if (snap?.exists()) {
            const data = snap.data();
            // setRole(snap?.exists() ? snap.data().role : "user");
            setUserData(data);
            setRole(data.role || "user");
          }
        } catch (error) {
          console.error("Error fetch role:", error);
          setRole("user"); // Default fallback
        }
      } else {
        setUser(null);
        setRole(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const path = window.location.pathname;
    const isAuthPage =
      // path === "/" ||
      path.startsWith("/Login") || path.startsWith("/register");

    // user belum login
    if (!user && !isAuthPage) {
      navigate("/Login", { replace: true });
      return;
    }

    // user sudah login dan sudah mau buka halaman auth
    if (user && isAuthPage) {
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else navigate("/Index", { replace: true });
      return;
    }

    // root
    if (path === "/" && user) {
      if (role === "admin") navigate("/admin/dashboard", { replace: true });
      else if (user && role === "user") navigate("/Index", { replace: true });
      return;
    }
  }, [user, role, loading, navigate]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {/* <Outlet /> */}
      <AuthContext.Provider value={{ user, userData, role, loading }}>
        {!loading && children}
      </AuthContext.Provider>
    </>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider/AuthGuard");
  }
  return context;
};
