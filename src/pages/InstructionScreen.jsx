import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Clock, ChevronLeft } from "lucide-react";

export const InstructionScreen = ({ handleStartExam, onback }) => {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-[100px]">
        {/* Back Button */}
        <button
          onClick={onback}
          className="mb-6 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg transition cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">INSTRUKSI PENGERJAAN</h1>
            <h2 className="text-gray-600">
              Harap baca teks di bawah ini dengan cermat!
            </h2>
          </div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Icons */}
            <div className="space-y-6">
              {/* 90 Pertanyaan */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">90 Pertanyaan</h3>
                  <p className="text-sm text-gray-600">
                    Terdapat pilihan A dan B
                  </p>
                </div>
              </div>

              {/* 15 Menit */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold">15 Menit</h3>
                  <p className="text-sm text-gray-600">
                    Total waktu pengerjaan
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Instructions */}
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-2">
                <span>•</span>
                <p>
                  Klik opsi untuk memilih jawaban yang paling sesuai dengan diri
                  Anda
                </p>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <p>Klik submit jika Anda telah yakin ingin menyelesaikan tes</p>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <p>
                  Apabila waktu telah sisa 5 menit maka akan muncul peringatan
                </p>
              </div>
              <div className="flex gap-2">
                <span>•</span>
                <p>
                  Apabila waktu telah habis maka pertanyaan yang belum terisi
                  akan otomatis diisi oleh sistem
                </p>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStartExam}
              className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition shadow-md cursor-pointer"
            >
              Mulai Tes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
