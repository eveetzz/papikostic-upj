import React, { useEffect, useState } from "react";
import successImg from "../../assets/successful.png";
import waLogo from "../../assets/logo wa.png";
import gmailLogo from "../../assets/Gmail-Logo.png";

export const ResultScreen = ({ userData, onRestart }) => {
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    // Beri sedikit delay agar transisi CSS terasa halus
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div
        className={`relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-8 transform transition-all duration-500 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Tombol Close (X)*/}
        <button
          onClick={onRestart}
          className="absolute top-8 left-8 text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center mt-6">
          <h2 className="text-2xl font-extrabold text-[#333] mb-6 tracking-tight">
            SELAMAT!
          </h2>

          {/* Ilustrasi Utama */}
          <div className="mb-6">
            <img
              src={successImg}
              alt="Success"
              className="w-44 h-44 object-contain"
            />
          </div>

          <p className="text-gray-800 font-semibold text-lg mb-1">
            Kamu telah menyelesaikan tes.
          </p>

          <p className="text-[13px] sm:text-sm text-gray-600 mb-8 leading-relaxed">
            Apabila ada pertanyaan atau perlu penjelasan lebih lanjut silakan
            hubungi <br />
            <span className="text-[#2B6CB0] font-bold">
              jaya.assessmentcenter@upj.ac.id
            </span>{" "}
            atau
            <span className="text-[#2B6CB0] font-bold">(021) 745 5555</span>
          </p>

          {/* Tombol Kembali ke Home */}
          <button
            className="w-full max-w-xs py-3.5 bg-[#FF9533] hover:bg-[#f08a2e] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 mb-8"
            onClick={onRestart}
          >
            Kembali ke Home
          </button>

          {/* Tombol Kontak Sosmed */}
          <div className="flex gap-4 w-full justify-center">
            {/* WhatsApp - Background Hijau */}
            {/* <button className="flex items-center px-2.5 py-2 bg-[#059669] text-white rounded-xl text-sm font-bold hover:bg-[#047857] transition shadow-sm">
              <img src={waLogo} alt="WA" className="w-7 h-7 object-contain" />
              WhatsApp
            </button> */}
            <a
              href={`https://wa.me/62217455555?text=Halo,%20saya%20${userData?.displayName || "User"}%20ingin%20menanyakan%20hasil%20tes%20PAPI%20Kostick%20saya.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#059669] text-white rounded-xl text-sm font-bold hover:bg-[#047857] transition shadow-sm"
            >
              <img src={waLogo} alt="WA" className="w-7 h-7 object-contain" />
              WhatsApp
            </a>
            {/* Gmail - Background Gray Muda */}
            {/* <button className="flex items-center px-2.5 py-2.5 bg-[#F3F4F6] text-gray-700 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-200 transition shadow-sm">
              <img
                src={gmailLogo}
                alt="Gmail"
                className="w-7 h-7 object-contain"
              />
              Gmail
            </button> */}

            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=jaya.assessmentcenter@upj.ac.id&su=${encodeURIComponent(`Permohonan Hasil Tes PAPI Kostick - ${userData?.displayName || ""}`)}&body=${encodeURIComponent(`Halo Admin Jaya Assessment Center,\n\nSaya ${userData?.displayName || "User"}, baru saja menyelesaikan tes. Mohon informasi lebih lanjut mengenai hasil tes PAPI Kostick saya.\n\nTerima kasih.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#F3F4F6] text-gray-700 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-200 transition shadow-sm"
            >
              <img
                src={gmailLogo}
                alt="Gmail"
                className="w-7 h-7 object-contain"
              />
              Gmail
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
