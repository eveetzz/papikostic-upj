import React, { useState } from "react";
import { logout } from "../../store/authStore";
import { NavbarAdmin } from "../../components/admin/NavbarAdmin";
import { Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer";

export const Admin = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <NavbarAdmin />
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="flex-grow">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
};
