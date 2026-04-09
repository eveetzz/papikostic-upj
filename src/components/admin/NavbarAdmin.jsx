import React, { useState } from "react";
import { Home, FileText, Users, Menu, X } from "lucide-react";
import { Logout } from "../Logout";
import logoImg from "../../assets/864.jpg";
import { NavLink } from "react-router-dom";

export const NavbarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { to: "/admin/dashboard", label: "Beranda", icon: Home },
    { to: "/admin/test-result", label: "Hasil Tes", icon: FileText },
    // { to: "/admin/dummy-page", label: "dummy", icon: FileText },
    { to: "/admin/manage-user", label: "Kelola Pengguna", icon: Users },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-[#1e5a9e] text-white p-2 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#1e5a9e] text-white flex flex-col z-40 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center gap-3 border-b border-blue-700">
          <div className="flex items-center justify-center">
            <img
              src={logoImg}
              alt="logo"
              className=" bg-white rounded-full w-12 h-12"
            />
          </div>
          <div>
            <h1 className="font-bold">HRD UPJ</h1>
          </div>
          {/* <button className="ml-auto">
              <Menu className="w-6 h-6" />
            </button> */}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  setIsOpen(false);
                }}
                className={({ isActive }) =>
                  `w-full px-4 py-3 flex items-center gap-3 transition ${
                    isActive
                      ? "bg-yellow-500 font-semibold"
                      : "hover:bg-blue-700"
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className=" hover:text-[#ff5050] font-semibold transition-colors duration-200">
          <Logout />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-700">
          <p className="text-xs text-blue-300">PAPIKOSTICK</p>
        </div>
      </aside>
    </>
  );
};
