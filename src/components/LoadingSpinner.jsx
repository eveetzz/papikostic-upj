import React from "react";

export const LoadingSpinner = () => {
  return (
    <div
      role="status"
      className="flex justify-center items-center h-screen bg-white"
    >
      <svg
        aria-hidden="true"
        className="w-8 h-8 animate-spin text-slate-100"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://w3.org"
      >
        {/* Lingkaran Basis (Muted Track) */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2.5"
          className="opacity-100 text-slate-200/70"
        />
        {/* Indikator Putar (Active Indicator) */}
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 13.5661 2.36015 15.048 3 16.3726"
          stroke="#3b82f6" /* Menggunakan Blue-500 standar profesional */
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
