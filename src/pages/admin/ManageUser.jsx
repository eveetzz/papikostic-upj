import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  ImportIcon,
  MoreVertical,
  Mail,
  Check,
} from "lucide-react";
import { AddUser } from "../../components/admin/AddUser";
import {
  addUser,
  deleteUser,
  editUser,
  getUsers,
} from "../../services/manageUser";
import { EditUser } from "../../components/admin/EditUser";
import { DeleteUser } from "../../components/admin/deleteUser";
import { Pagination } from "../../components/Pagination";
import { importUsers } from "../../services/importService";
import { ImportUser } from "../../components/import/ImportUser";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { sendEmail } from "../../services/emailService";

export const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  // State untuk Fitur Komparasi
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let unsubscribe = () => {};
      try {
        unsubscribe = getUsers((usersList) => {
          setUsers(usersList);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
      return () => unsubscribe();
    };
    fetchData();
  }, []);

  const handleAddUser = async (formData) => {
    const { name, email, password, role } = formData;
    const result = await addUser(name, email, password, role);
    if (result.success) {
      alert("User Berhasil Ditambahkan");
      setIsAddModalOpen(false);
    } else {
      alert("Gagal: " + result.error);
    }
  };

  const handleEditUser = async (formData) => {
    const { name, email, role } = formData;
    const result = await editUser(selectedUser.id, name, email, role);
    if (result.success) {
      alert("update user berhasil");
      setIsEditModalOpen(false);
    } else {
      alert("Gagal: " + result.error);
    }
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser(selectedUser.id);
    if (result.success) {
      alert("User Berhasil Dihapus");
      setIsDeleteModalOpen(false);
    } else {
      alert("Gagal: " + result.error);
    }
  };

  // PERBAIKAN 1: Proteksi optional chaining (?.) jika displayName/email kosong agar tidak crash
  const filteredUsers = users.filter((user) => {
    return (
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedUsers([]);
  };

  // PERBAIKAN 2: Menerima parameter `isEmailSent` dengan benar saat baris diklik
  const handleSelectUser = (id, isEmailSent) => {
    if (isEmailSent) return; // Kunci Keamanan: Abaikan jika email sudah dikirim

    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // PERBAIKAN 3: Menyediakan variabel `selectableItems` (Hanya user di halaman aktif yang BELUM dikirim email)
  const selectableItems = currentItems.filter((user) => !user.emailSentAt);

  // Perhitungan Master Checkbox berdasarkan items yang memang bisa dipilih saja
  const allSelectedItems =
    selectableItems.length > 0 &&
    selectableItems.every((user) => selectedUsers.includes(user.id));

  const handleAllSelectedItems = () => {
    const selectableIds = selectableItems.map((u) => u.id);

    if (allSelectedItems) {
      // Uncheck yang ada di halaman ini saja
      setSelectedUsers(
        selectedUsers.filter((id) => !selectableIds.includes(id)),
      );
    } else {
      // Gabungkan pilihan sebelumnya dengan ID baru yang valid tanpa duplikat
      const newSelection = Array.from(
        new Set([...selectedUsers, ...selectableIds]),
      );
      setSelectedUsers(newSelection);
    }
  };

  const handleSendEmail = async () => {
    if (selectedUsers.length === 0) return;

    const confirmSend = window.confirm(
      `Kirim email ke ${selectedUsers.length} pengguna?`,
    );

    if (!confirmSend) return;

    try {
      setLoading(true);
      const result = await sendEmail(selectedUsers, users);
      if (result.success) {
        alert(`Email berhasil terkirim ke ${selectedUsers.length} pengguna`);
        setSelectedUsers([]);
      } else {
        alert("Gagal:" + result.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan pada sistem.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-5 md:hidden" />
            <h1 className="text-xl md:text-2xl font-bold">Kelola Pengguna</h1>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`p-2 rounded-full transition hover:bg-gray-200 ${
                showDropdown || isSelectionMode
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600"
              }`}
            >
              <MoreVertical size={24} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                <button
                  onClick={() => {
                    toggleSelectionMode();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
                >
                  {isSelectionMode ? "Kembali" : "Pilih Users"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari Pengguna"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2 justify-center transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Tambah
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2 justify-center transform active:scale-95"
            >
              <ImportIcon className="w-5 h-5" />
              Import
            </button>
            <button
              disabled={selectedUsers.length < 1}
              onClick={handleSendEmail}
              className={`px-6 py-2 rounded-md flex items-center gap-2 justify-center ${
                selectedUsers.length < 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-amber-500 text-white hover:bg-amber-600 transform active:scale-95"
              }`}
            >
              <Mail className="w-5 h-5" />
              Kirim Email
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#1e5a9e] text-white">
                  {isSelectionMode && (
                    <th className="w-12 px-6 py-3.5 text-sm font-semibold">
                      {/* Master Checkbox */}
                      <div
                        onClick={handleAllSelectedItems}
                        title="Pilih Semua"
                        className={`w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center transition-colors ${
                          allSelectedItems
                            ? "bg-amber-500 border-amber-500 "
                            : "border-gray-300 cursor-pointer hover:border-amber-500"
                        }`}
                      >
                        {allSelectedItems && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </th>
                  )}
                  <th className="w-16 px-6 py-3.5 text-sm font-semibold">No</th>
                  <th className="px-6 py-3.5 text-sm font-semibold">Email</th>
                  <th className="px-6 py-3.5 text-sm font-semibold">Nama</th>
                  <th className="px-6 py-3.5 text-sm font-semibold whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-6 py-3.5 text-sm font-semibold whitespace-nowrap">
                    Status Ujian
                  </th>
                  <th className="px-6 py-3.5 text-sm font-semibold whitespace-nowrap">
                    Tanggal Terkirim
                  </th>
                  <th className="w-28 px-6 py-3.5 text-center text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isSelectionMode ? 8 : 7}
                      className="px-6 py-12 text-center text-gray-400 text-sm"
                    >
                      Tidak ada data pengguna yang ditemukan
                    </td>
                  </tr>
                ) : (
                  currentItems.map((user, index) => {
                    const isSelected = selectedUsers.includes(user.id);
                    const isEmailSent = !!user.emailSentAt;
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50/70 transition-colors duration-150"
                      >
                        {isSelectionMode && (
                          <td className="px-6 py-4 text-sm">
                            <div
                              onClick={() =>
                                handleSelectUser(user.id, isEmailSent)
                              }
                              title={
                                isEmailSent
                                  ? "Email sudah terkirim"
                                  : isSelected
                                    ? "Batalkan pilih"
                                    : "Pilih pengguna"
                              }
                              className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                                isEmailSent
                                  ? "bg-gray-200 border-gray-200 cursor-not-allowed text-gray-400"
                                  : isSelected
                                    ? "bg-blue-600 border-blue-600 cursor-pointer"
                                    : "border-gray-300 cursor-pointer hover:border-blue-500"
                              }`}
                            >
                              {isEmailSent ? (
                                <Check className="w-4 h-4 text-gray-400" />
                              ) : (
                                isSelected && (
                                  <Check className="w-4 h-4 text-white" />
                                )
                              )}
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm text-gray-400 font-medium">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {user.displayName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border transition-colors duration-200 ${
                              user.role === "admin"
                                ? "bg-purple-50 text-purple-700 border-purple-200/60"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200/60"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border transition-colors duration-200 ${
                              user.examStatus === "completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                                : user.examStatus === "in_progress"
                                  ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                  : user.examStatus === "uncompleted"
                                    ? "bg-rose-50 text-rose-700 border-rose-200/60"
                                    : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {user.examStatus || "not_started"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {user.emailSentAt || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm alignment-fix">
                          <div className="flex gap-1.5 justify-center items-center">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-150"
                              title="Edit pengguna"
                            >
                              <Edit className="w-5 h-6" />
                            </button>

                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-all duration-150"
                              title="Hapus pengguna"
                            >
                              <Trash2 className="w-5 h-6" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <Pagination
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              setCurrentPage={setCurrentPage}
              filteredUsers={filteredUsers}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>

        <AddUser
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddUser}
        />
        <EditUser
          users={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditUser}
        />
        {selectedUser && (
          <DeleteUser
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleDeleteUser}
            userName={selectedUser?.displayName}
          />
        )}
        <ImportUser
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
        />
      </div>
    </>
  );
};
