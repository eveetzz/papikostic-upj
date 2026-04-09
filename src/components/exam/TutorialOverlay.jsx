import React from "react";

export const TutorialOverlay = ({ step, onNext, onBack, onSkip }) => {
  const steps = [
    {
      title: "Daftar Soal",
      desc: "Klik Daftar Soal untuk melihat seluruh soal.",
    },
    {
      title: "Sidebar Soal",
      desc: "Sidebar menampilkan status soal yang sudah dan belum dijawab.",
    },
    {
      title: "Timer",
      desc: "Perhatikan timer, Jika waktu habis, jawaban otomatis disimpan.",
    },
    {
      title: "Menjawab Soal",
      desc: "Klik salah satu opsi jawaban. Jawaban dapat diubah.",
    },
    {
      title: "Navigasi Soal",
      desc: "Gunakan tombol Next dan Back untuk berpindah soal.",
    },
  ];

  const isLast = step === steps.length;

  return (
    <>
      {/* Overlay gelap */}
      <div className="fixed inset-0 bg-black/50 z-40" />

      {/* Box tutorial */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-xl">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{steps[step - 1].title}</h3>
          <span className="text-sm text-gray-500">
            {step}/{steps.length}
          </span>
        </div>

        {/* DESKRIPSI */}
        <p className="text-gray-700 mb-6">{steps[step - 1].desc}</p>

        {/* ACTION */}
        <div className="flex items-center justify-between">
          {/* BACK */}
          <button
            onClick={onBack}
            disabled={step === 1}
            className={`px-4 py-2 rounded-md ${
              step === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300"
            }`}
          >
            Back
          </button>

          {/* LEWATI (TEXT) */}
          <span
            onClick={onSkip}
            className="text-sm text-gray-500 cursor-pointer hover:underline"
          >
            Lewati Tutorial
          </span>

          {/* NEXT */}
          <button
            onClick={onNext}
            className="px-4 py-2 bg-[#2563EB] text-white rounded-md"
          >
            {isLast ? "Selesai" : "Lanjut"}
          </button>
        </div>
      </div>
    </>
  );
};
