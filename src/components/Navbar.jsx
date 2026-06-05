import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { User } from "lucide-react";
import { logout } from "../store/authStore";
import upjLogo from "../assets/upj.png";
import { Logout } from "./Logout";

export const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-white w-full h-20 flex items-center justify-between px-6 sm:px-10">
        <div>
          <img src={upjLogo} alt="left-logo" className="h-14 object-contain" />
        </div>

        {/* Profile Icon */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer"
          >
            <User size={25} />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-max min-w-[14rem] bg-white shadow-lg rounded-xl border p-3 z-50">
              {/* Nama User (Satu Baris) */}
              <p className="text-[1rem] font-semibold text-gray-800 px-4 py-1 whitespace-nowrap">
                {user?.displayName || "No Name Found"}
              </p>

              {/* Email User (Satu Baris, Memaksa Kotak Melebar ke Samping) */}
              <p className="text-sm text-gray-500 px-4 pb-2 whitespace-nowrap">
                {user?.email || "No Email Found"}
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100 my-1"></div>
              <button className="w-full text-left text-red-600 font-medium hover:text-red-500">
                <Logout />
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};
