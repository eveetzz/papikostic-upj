import React from "react";
import { Info, Check } from "lucide-react";
import { submitDate } from "../../utils/formatDate";

export const ResultRow = ({
  item,
  index,
  filterCategory,
  isSelectionMode,
  isSelected,
  onSelect,
  onView,
}) => {
  // Format Tanggal
  const formattedDate = submitDate(item);

  // Filter Report Item berdasarkan Dropdown Kategori
  // Jika "Semua", tampilkan semua. Jika ada kategori dipilih, filter array report.
  const displayReport =
    item.report?.filter(
      (r) =>
        filterCategory === "Semua" ||
        r.category?.toUpperCase() === filterCategory,
    ) || [];

  // Warna bar untuk variasi visual (Cycle colors)
  const getBarColor = (idx) => {
    const colors = [
      "bg-orange-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
    ];
    return colors[idx % colors.length];
  };

  const getBgColor = (idx) => {
    const colors = [
      "bg-orange-100",
      "bg-green-100",
      "bg-blue-100",
      "bg-purple-100",
    ];
    return colors[idx % colors.length];
  };

  return (
    <>
      <tr
        key={item.no}
        className="border-b border-gray-200 hover:bg-gray-50 transition"
      >
        {/* Checkbox Selection - Mengikuti desain Kode 1 (Custom Checkbox) */}
        {isSelectionMode && (
          <td className="px-4 py-3 text-sm">
            <div
              onClick={onSelect}
              className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center ${
                isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
              }`}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </div>
          </td>
        )}

        {/* No, Email, & Nama */}
        <td className="px-4 py-3 text-sm">{index}</td>
        <td className="px-4 py-3 text-sm">{item.displayName}</td>
        <td className="px-4 py-3 text-sm">{item.email}</td>

        {/* Hasil Tes (Bar Charts) - Mengikuti Layout Kode 1 yang Presisi */}
        <td className="px-4 py-3 text-sm">
          <div className="w-[335px] p-2">
            {displayReport.map((rep, idx) => (
              <div key={idx} className="mb-5">
                {/* Bar Info: Kotak Kategori - Label - Kotak Skor */}
                <div className="flex items-center gap-3 mb-4">
                  {/* Kotak Kategori Kiri */}
                  <div className="w-10 h-9 rounded-md bg-gray-300/80 flex items-center justify-center text-black font-medium">
                    {rep.trait}
                  </div>

                  {/* Label */}
                  <span className="text-sm font-light">{rep.description}</span>

                  {/* Kotak Score Kanan (Biru seperti Kode 1) */}
                  <div className="w-10 h-9 rounded-md bg-blue-200 flex items-center justify-center text-blue-600 ml-auto font-bold">
                    {rep.score}
                  </div>
                </div>

                {/* Progress Bar Container */}
                <div className={`w-full h-2 rounded-full ${getBgColor(idx)}`}>
                  <div
                    className={`h-full rounded-full ${getBarColor(idx)}`}
                    style={{ width: `${(rep.score / 9) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

            {displayReport.length === 0 && (
              <span className="text-xs text-gray-400 italic">
                Tidak ada data untuk kategori ini.
              </span>
            )}
          </div>
        </td>

        {/* Tanggal */}
        <td className="px-4 py-3 text-sm text-gray-600">{formattedDate}</td>

        {/* Kolom Aksi - Mengikuti Desain Tombol & Dropdown Kode 1 */}
        <td className="px-4 py-3 text-sm">
          <div className="flex flex-col gap-2">
            {/* Tombol Detail */}
            <button
              onClick={onView}
              className="px-3 py-1 rounded shadow border text-sm font-medium w-full sm:w-auto outline-none transition-colors bg-blue-600 text-white hover:bg-blue-700  flex items-center gap-2 justify-center"
            >
              <Info className="w-4 h-4" />
              Detail
            </button>

            {/* Select Status Review */}
            <div className="flex flex-col gap-2">
              <span
                className={`px-3 py-1 text-center rounded shadow border text-sm font-medium w-full sm:w-auto outline-none transition-colors ${
                  item.hasReviewed
                    ? "bg-green-500 text-white border-green-200"
                    : "bg-red-500 text-white border-red-200"
                }`}
              >
                {item.hasReviewed ? "Reviewed" : "Pending"}
              </span>
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};
