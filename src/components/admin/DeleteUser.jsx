import React, { useState } from "react";

export const DeleteUser = ({ isOpen, onClose, onConfirm, userName }) => {
  const [loading, setLoading] = useState(true);
  
  if (!isOpen) return null;
  
  return (
    <>
      <div className="fixed inset-0 bg-stone-950/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin menghapus <strong>{userName}</strong>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
