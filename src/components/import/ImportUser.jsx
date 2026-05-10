import React, { useCallback, useState } from "react";
import { checkExistingUsers, importUsers } from "../../services/importService";
import { useDropzone } from "react-dropzone";
import { ImportPreview } from "./ImportPreview";
import { addUser } from "../../services/manageUser";
import { Upload, X } from "lucide-react";

export const ImportUser = ({ isOpen, onClose }) => {
  const [previewData, setPreviewData] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  // Fungsi untuk reset semua saat modal ditutup
  const handleClose = () => {
    setPreviewData([]);
    setIsChecking(false);
    onClose();
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsChecking(true);
      const rawData = await importUsers(file);
      const processedData = await checkExistingUsers(rawData);
      setPreviewData(processedData);
      // Begitu previewData terisi, tampilan otomatis pindah ke ImportPreview
    } catch (err) {
      alert("Gagal memproses file: " + err.message);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
    disabled: isChecking,
  });

  if (!isOpen) return null;

  return (
    <>
      {previewData.length > 0 ? (
        <ImportPreview
          data={previewData}
          setData={setPreviewData}
          onClose={handleClose}
          onConfirm={addUser}
        />
      ) : (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-gray-300 flex justify-between items-center">
              <h3 className="font-bold text-gray-700">Import Data Kandidat</h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
              ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
              ${isChecking ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-3">
                  {/* Icon Sederhana */}
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-gray-700 font-semibold">
                      {isChecking
                        ? "Memproses File..."
                        : "Pilih file atau tarik ke sini"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Hanya mendukung format .xlsx
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 text-center">
              <button
                onClick={handleClose}
                className="text-md text-gray-500 hover:underline hover:text-red-500 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
