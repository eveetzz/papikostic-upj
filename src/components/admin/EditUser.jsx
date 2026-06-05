import React, { useEffect, useState } from "react";
import { Check, RefreshCcw, X } from "lucide-react";

export const EditUser = ({
  users,
  isOpen,
  onClose,
  onSave,
  handleResetUser,
}) => {
  const [formData, setFormData] = useState({
    name: "", // Di state pake 'name'
    email: "",
    role: "user",
  });

  useEffect(() => {
    if (users) {
      setFormData({
        name: users.displayName || "", // Di state pake 'name'
        email: users.email || "",
        role: users.role || "user",
      });
    }
  }, [users, isOpen]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Hapus error saat user mulai mengetik lagi
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {}; // Inisialisasi dengan objek kosong

    if (!formData.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    setErrors(newErrors);
    // Jika objek newErrors kosong, berarti tidak ada error (valid)
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData); // Pastikan parent (ManageUser) menerima objek ini
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-stone-950/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-300">
            <h2 className="text-xl font-semibold">Edit Pengguna</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nama */}
            <div>
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Masukkan email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Tindakan Destruktif / Manajemen Data Section */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg gap-4 text-left">
                {/* Teks Informasi - Ramping & Padat */}
                <div className="max-w-[65%]">
                  <h4 className="text-xs font-semibold text-gray-900 leading-none mb-0.5">
                    Atur Ulang Data Tes
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Seluruh riwayat, progres, dan nilai pengguna akan dihapus
                    permanen.
                  </p>
                </div>

                {/* Tombol Ramping */}
                <button
                  type="button"
                  onClick={handleResetUser}
                  className={`flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 text-white border border-gray-200 text-[11px] font-medium rounded-md transition-all duration-200 shadow-sm ${users.examStatus === "-" ? "bg-green-500" : "bg-red-500"}`}
                >
                  {users.examStatus === "-" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Berhasil Direset</span>
                    </>
                  ) : (
                    <>
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span>Reset Progres</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-red-500 hover:text-white transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
