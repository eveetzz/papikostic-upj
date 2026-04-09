import React from "react";
import { logout } from "../store/authStore";
import { LogOut } from "lucide-react";

export const Logout = () => {
  return (
    <div className="cursor-pointer w-full">
      <button onClick={logout} className="cursor-pointer px-4 py-3 flex items-center gap-3">
        <LogOut className="w-5 h-5"/> <span>Logout</span>
      </button>
    </div>
  );
};
