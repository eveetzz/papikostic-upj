import React, { useEffect, useState } from "react";
import successImg from "../../assets/successful.png";
import waLogo from "../../assets/logo wa.png";
import gmailLogo from "../../assets/Gmail-Logo.png";

export const ResultScreen = ({ userData, onRestart }) => {
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-8 transform transition-all duration-500 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="flex flex-col items-center text-center mt-6">
          <h2 className="text-2xl font-extrabold text-[#333] mb-6 tracking-tight">
            SELAMAT!
          </h2>

          <div className="mb-6">
            <img
              src={successImg}
              alt="Success"
              className="w-44 h-44 object-contain"
            />
          </div>

          <p className="text-gray-800 font-semibold text-lg mb-1">
            Terima Kasih Telah Mengerjakan Tes
          </p>

          <p className="text-[13px] sm:text-sm text-gray-600 mb-8 leading-relaxed">
            Apabila ada pertanyaan atau perlu penjelasan lebih lanjut silakan
            hubungi <br />
            <a
              className="text-[#2B6CB0] hover:text-blue-800 underline font-medium cursor-pointer"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=jaya.assessmentcenter@upj.ac.id&su=${encodeURIComponent(`Permohonan Hasil Tes PAPI Kostick - ${userData?.displayName || ""}`)}&body=${encodeURIComponent(`Halo Admin Jaya Assessment Center,\n\nSaya ${userData?.displayName || "User"}, baru saja menyelesaikan tes. Mohon informasi lebih lanjut mengenai hasil tes PAPI Kostick saya.\n\nTerima kasih.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              jaya.assessmentcenter@upj.ac.id
            </a>
          </p>

          <button
            className="w-full max-w-xs py-3.5 bg-[#FF9533] hover:bg-[#f08a2e] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 mb-8"
            onClick={onRestart}
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    </div>
  );
};
