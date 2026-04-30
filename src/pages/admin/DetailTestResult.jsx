import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { submitDate } from "../../utils/formatDate";
import { ScoreRadar } from "../../components/test-results/ScoreRadar";
import { getUsers, updateStatusReview } from "../../services/manageUser";
import { PDFViewer } from "@react-pdf/renderer";
import { PreviewPDF } from "../../components/export/PreviewPDF";
import { UserReportPDF } from "../../components/export/UserReportPDF";
import { getDisplayReport } from "../../services/fetchData";
import { toPng } from "html-to-image";

export const DetailTestResult = ({ user, onBack, onUpdateStatus }) => {
  const [loading, setLoading] = useState(true);
  const [openPDF, setOpenPDF] = useState(false);

  const results = user.report || [];

  const report = getDisplayReport(results);

  const formattedDate = submitDate(user);

  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);

  const handleExportWithChart = async (user) => {
    // 1. Set user yang mau diekspor agar data masuk ke ScoreRadar tersembunyi

    // 2. Beri jeda sedikit agar Recharts selesai rendering (animasi)
    setTimeout(async () => {
      if (chartRef.current) {
        try {
          const dataUrl = await toPng(chartRef.current, {
            cacheBust: true,
            filter: (node) => {
              // Mengabaikan elemen <link> agar tidak diproses saat generate gambar
              return node.tagName !== "LINK";
            },
          });
          setChartImage(dataUrl); // Simpan Base64 ke state
          setOpenPDF(true); // Buka Preview PDF
        } catch (err) {
          console.error("Gagal generate gambar chart:", err);
        }
      }
    }, 1200);
  };

  return (
    <>
      <div className="flex-1 bg-gray-50 overflow-auto">
        {/* HEADER */}
        <div className="mb-6 space-y-4">
          {/* BARIS ATAS: JUDUL */}
          <div className="flex items-center gap-3">
            {/* spacer untuk hamburger */}
            <div className="w-8 md:hidden" />

            <h1 className="text-xl md:text-2xl font-bold text-black">
              Detail Hasil Tes
            </h1>
          </div>

          {/* BARIS BAWAH: AKSI */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* KEMBALI */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-black hover:underline text-sm md:text-base"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Daftar Hasil
            </button>

            {/* ACTION BUTTON */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={user.hasReviewed ? "true" : "false"}
                onChange={(e) => {
                  const isSuccess = e.target.value === "true";
                  onUpdateStatus(user.uid, isSuccess);
                }}
                className={`px-4 py-2 rounded shadow border text-sm font-medium w-full sm:w-auto outline-none transition-colors ${
                  user.hasReviewed
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-red-600 text-white border-red-600"
                }`}
              >
                <option value="false" className="text-black bg-white">
                  Pending Review
                </option>
                <option value="true" className="text-black bg-white">
                  Success Review
                </option>
              </select>

              <button
                onClick={() => handleExportWithChart(user)}
                className="flex text-sm font-medium items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 w-full sm:w-auto"
              >
                <Download className="w-6 h-5" />
                Download PDF
              </button>

              <PreviewPDF isOpen={openPDF} onClose={() => setOpenPDF(false)}>
                <UserReportPDF user={user} chartImage={chartImage} />
              </PreviewPDF>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 items-stretch">
          <div className="flex flex-col gap-6">
            {/* DETAIL PENGGUNA */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="bg-[#1A5A9A] text-white px-4 py-2 rounded-t-2xl -mt-6 -mx-6 mb-6 text-center font-semibold">
                Detail Pengguna
              </div>

              <p className="text-lg mb-3">
                <b>Nama Peserta:</b> {user.displayName}
              </p>
              <p className="text-lg mb-3">
                <b>Email:</b> {user.email}
              </p>
              <p className="text-lg">
                <b>Tanggal Pengerjaan:</b> {formattedDate}
              </p>
            </div>

            {/* SCORE TES TABEL DINAMIS */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="bg-[#1A5A9A] text-white px-4 py-2 rounded-t-2xl -mt-6 -mx-6 mb-6 text-center font-semibold">
                Score Tes
              </div>
              <div className="overflow-x-auto pb-3 ">
                <div className="border border-[#8E8E93] rounded-md w-max">
                  <div className="grid grid-cols-[62px_repeat(20,28px)] text-center">
                    <div className="flex items-center justify-center text-xs border-b border-[#8E8E93] text-gray-700">
                      Code
                    </div>
                    {results.map((item, i) => (
                      <div
                        key={i}
                        className="bg-[#C2ECFF] py-2 border-b border-l border-[#8E8E93] text-xs font-medium"
                      >
                        {item.trait}
                      </div>
                    ))}
                    <div className="flex items-center justify-center text-xs text-gray-700">
                      Score
                    </div>
                    {/* Mapping Score Dinamis */}
                    {results.map((item, i) => (
                      <div
                        key={i}
                        className="bg-[#E1FFC2] py-2 border-l border-[#8E8E93] text-xs font-medium"
                      >
                        {item.score}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ===== KANAN (Radar) ===== */}
          <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
            <div className="bg-[#1A5A9A] text-white px-4 py-2 rounded-t-2xl -mt-6 -mx-6 mb-6 text-center font-semibold">
              Jaring Laba-Laba
            </div>

            <div className="flex-1 flex items-center justify-center">
              {/* BATAS UKURAN RADAR */}
              <div className="w-full h-full max-w-[310px] aspect-square">
                <ScoreRadar results={results} />
              </div>
            </div>
          </div>
        </div>

        {/* DETAIL HASIL TES */}
        <div className="bg-white rounded-2xl shadow">
          <div className="bg-[#1A5A9A] text-white px-6 py-3 rounded-t-2xl font-semibold text-center text-xl">
            DETAIL HASIL TES
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2">
            {/* PANEL */}
            {Object.entries(report).map(([category, items], index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-2xl p-4"
              >
                <div className="bg-[#e5f2ff] rounded-t-xl text-center py-2 text-xl font-semibold mb-4 text-[#1A5A9A]">
                  {category}
                </div>

                {items.map((item, index) => (
                  <div key={index} className="mb-6 p-2">
                    <div className="flex justify-between mb-2 text-[15px] font-normal">
                      <span>{item.description}</span>
                      <span>{item.score}</span>
                    </div>

                    <div className="h-2 bg-[#E5E7EB] rounded-full mb-2">
                      <div
                        className={`h-full rounded-full ${item.score > 4 ? " bg-[#0D9488]" : " bg-[#F59E0B]"}`}
                        style={{ width: `${(item.score / 9) * 100}%` }}
                      />
                    </div>

                    <span
                      className={`inline-block p-1  text-sm font-medium ${item.label === "HIGH ANALYSIS" ? " text-[#0D9488]" : " text-[#F59E0B]"}`}
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div
          ref={chartRef}
          style={{ width: "600px", height: "400px", background: "white" }}
        >
          <ScoreRadar results={results} />
        </div>
      </div>
    </>
  );
};
