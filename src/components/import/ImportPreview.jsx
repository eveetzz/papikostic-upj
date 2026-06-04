import React, { useState } from "react";
// import { addUser } from "../../services/manageUser";
import { Trash, X } from "lucide-react";
import { generateRandomPassword } from "../../services/importService";

import Swal from "sweetalert2";

export const ImportPreview = ({ data, setData, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCellChange = (id, field, value) => {
    setData(
      data.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const startImport = async () => {
    const validData = data.filter((item) => !item.isDuplicate);
    if (validData.length === 0) {
      return Swal.fire({
        title: "Tidak Ada Data Baru",
        text: "Semua data kandidat pada daftar ini sudah terdaftar di sistem.",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
    } 
      
    setLoading(true);
    for (let i = 0; i < validData.length; i++) {
      const user = validData[i];

      const generatedPassword = user.Password
        ? user.Password.toString()
        : generateRandomPassword(user.Nama);
        
      // Menggunakan data dari Excel (Nama, Email, Password, dll)
      await onConfirm(
        user.Nama, // || row[""] sesuaikan isi string dengan header di file excel
        user.Email,
        generatedPassword,
        "user",
        user.Posisi,
        user.Perusahaan,
      );
      setProgress(Math.round(((i + 1) / validData.length) * 100));
    }
    setLoading(false);
    Swal.fire({
      title: "Import Selesai!",
      text: `Berhasil menambahkan ${validData.length} data pengguna baru ke sistem.`,
      icon: "success",
      confirmButtonColor: "#2563eb",
    }).then((result) => {
      if (result.isConfirmed || result.isDismissed) {
        onClose(); // Modal baru ditutup setelah klik OK pada SweetAlert
      }
    });
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      {/* MODAL BOX */}
      {/* h-[85vh] membuat tinggi modal tetap konsisten di 85% tinggi layar */}
      <div className="bg-white w-full max-w-5xl h-[80vh] max-h-[700px] rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="py-4 px-6 border-b border-gray-300 flex justify-between items-center bg-white shrink-0">
          <div>
            <h3 className="font-bold text-gray-800 text-base sm:text-lg">
              Review Data Kandidat
            </h3>
            <p className="text-[11px] text-gray-500 hidden sm:block">
              Pastikan kembali kecocokan data sebelum disimpan ke sistem
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* BODY / TABLE AREA */}
        {/* flex-1 agar area ini mengambil sisa ruang yang ada */}
        <div className="flex-1 overflow-auto bg-white ">
          {/* Bungkus tabel dengan div overflow-x-auto agar bisa di-scroll kiri-kanan di HP */}
          <div className="min-w-[600px] ">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Nama
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Email
                  </th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Status
                  </th>
                  <th className="p-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 ">
                {data.map((row) => (
                  <tr
                    key={row.id}
                    className={`group transition-all duration-200 ${
                      row.isDuplicate
                        ? "bg-orange-50/60 hover:bg-orange-100/80"
                        : "hover:bg-blue-50/50"
                    }`}
                  >
                    <td className="p-2 relative">
                      {/* Indikator garis vertikal untuk duplikat */}
                      {row.isDuplicate && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400" />
                      )}
                      <input
                        value={row.Nama || ""}
                        onChange={(e) =>
                          handleCellChange(row.id, "Nama", e.target.value)
                        }
                        className="w-full bg-transparent px-3 py-2 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="Masukkan nama..."
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={row.Email || ""}
                        onChange={(e) =>
                          handleCellChange(row.id, "Email", e.target.value)
                        }
                        className="w-full bg-transparent px-3 py-2 rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                        placeholder="nama@email.com"
                      />
                    </td>
                    <td className="p-2 text-center">
                      {row.isDuplicate ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                          <span className="w-1 h-1 rounded-full bg-orange-500 mr-1.5"></span>
                          TERDAFTAR
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5"></span>
                          BARU
                        </span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() =>
                          setData(data.filter((d) => d.id !== row.id))
                        }
                        className="p-2 text-gray-400 hover:text-red-500 transition-all opacity-50 group-hover:opacity-100"
                        title="Hapus baris"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 sm:p-5 border-t border-gray-300 flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Keterangan
            </span>
            <span className="text-xs text-orange-600 italic text-center sm:text-left">
              * Baris oranye akan dilewati otomatis ketika melakukan import
            </span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
            {loading && (
              <div className="hidden sm:flex items-center gap-2">
                {/* Progress bar hanya muncul di desktop agar tidak sempit */}
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-blue-600">
                  {progress}%
                </span>
              </div>
            )}

            <button
              onClick={startImport}
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium  transition-all"
            >
              {loading ? "Memproses..." : "Import"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
