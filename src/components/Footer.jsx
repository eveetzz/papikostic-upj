// Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[white] mt-4">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Dibuat Oleh */}
          <div>
            <h3 className="text-[#3d6f8e] font-bold uppercase text-sm mb-3">
              Dibuat Oleh:
            </h3>

            <ul className="space-y-1 text-gray-400 text-sm">
              <li>Mutiara Fitria Azzahra, SIF 2023</li>
              <li>Evan Alfiansyah, SIF 2023</li>
              <li>Adie Suryo Saputro, SIF 2023</li>
            </ul>
          </div>

          {/* Pembimbing */}
          <div>
            <h3 className="text-[#3d6f8e] font-bold uppercase text-sm text-center mb-3">
              Pembimbing:
            </h3>

            <p className="text-gray-400 text-sm text-center">
              Augury El Rayeb, S.Kom., M.MSI.
            </p>
          </div>

          {/* Institusi */}
          <div>
            <h3 className="text-[#3d6f8e] font-bold uppercase text-sm text-right mb-3">
              Institusi:
            </h3>

            <ul className="space-y-1 text-gray-400 text-sm text-right">
             <li>Biro SDM UPJ</li>
             <li>Biro TIK UPJ</li>
            </ul>
          </div>
        </div>

        {/* Garis */}
        <div className="border-t border-gray-300 mt-6 pt-4 text-center">
          <p className="text-xs text-gray-400">
            ©2026, All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;