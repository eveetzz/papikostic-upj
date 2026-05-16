// Footer.jsx
import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-white w-full py-4 border-t border-gray-200">
      <div className="w-full px-4 md:px-10">
        {/* Menggunakan grid dengan 3 kolom yang proporsional */}
        <div className="grid grid-cols-3 gap-2 text-[10px] md:text-[11px] leading-tight items-start">
          {/* Kiri: Dibuat Oleh */}
          <div className="flex flex-col">
            <h3 className="text-[#3d6f8e] font-bold uppercase text-[8px] md:text-[9px] mb-1">
              Dibuat Oleh:
            </h3>
            <ul className="text-gray-400 space-y-0.5">
              <li>Mutiara Fitria Azzahra, SIF 2023</li>
              <li>Adie Suryo Saputro, SIF 2023</li>
              <li>Evan Alfiansyah, SIF 2023</li>
            </ul>
          </div>

          {/* Tengah: Pembimbing */}
          <div className="flex flex-col text-center border-x border-gray-100 px-1">
            <h3 className="text-[#3d6f8e] font-bold uppercase text-[8px] md:text-[9px] mb-1">
              Pembimbing:
            </h3>
            <p className="text-gray-400 break-words">
              Augury El Rayeb, S.Kom., M.MSI.
            </p>
          </div>

          {/* Kanan: Institusi */}
          <div className="flex flex-col text-right">
            <h3 className="text-[#3d6f8e] font-bold uppercase text-[8px] md:text-[9px] mb-1">
              Institusi:
            </h3>
            <p className="text-gray-400">Biro SDM & TIK UPJ</p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-3 pt-2 border-t border-gray-100 text-center">
          <p className="text-[9px] text-gray-300">
            ©2026, All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
