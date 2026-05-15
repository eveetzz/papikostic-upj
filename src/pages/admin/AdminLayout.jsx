import React, { useState } from "react";
import { logout } from "../../store/authStore";
import { NavbarAdmin } from "../../components/admin/NavbarAdmin";
import { Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer";

export const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <NavbarAdmin />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
          <Footer />
        </main>
      </div>
    </>
  );
};
