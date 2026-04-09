import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { getDocs } from "firebase/firestore";
import {
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
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

export const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // onSnapshot akan terpanggil setiap kali ada data yang tambah/ubah/hapus
        const unsubscribe = getUsers((usersList) => {
          setUsers(usersList);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const handleAddUser = async (formData) => {
    const { name, email, password, role } = formData;
    const result = await addUser(name, email, password, role);

    if (result.success) {
      alert("User Berhasil Ditambahkan");
      fetchData();
    } else {
      alert("Gagal: " + result.error);
    }
  };

  const handleEditUser = async (formData) => {
    const { name, email, role } = formData;
    const result = await editUser(selectedUser.id, name, email, role);

    if (result.success) {
      alert("update user berhasil");
      fetchData();
    } else {
      alert("Gagal: " + result.error);
    }
  };

  const handleDeleteUser = async () => {
    const result = await deleteUser(selectedUser.id);
    if (result.success) {
      setIsDeleteModalOpen(false);
    } else {
      alert("Gagal: " + result.error);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // total pages
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  return (
    <>
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        {/* HEADER */}
        <div className="mb-6 space-y-4">
          {/* BARIS JUDUL */}
          <div className="flex items-center gap-3">
            {/* Spacer untuk hamburger */}
            <div className="w-8 md:hidden" />

            <h1 className="text-xl md:text-2xl font-bold">Kelola Pengguna</h1>
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
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Tambah
            </button>
          </div>
        </div>

        {/* Table */}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#1e5a9e] text-white">
                  <th className="w-px px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Role
                  </th>
                  <th className="w-px px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Exam Status
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Tidak ada data pengguna yang ditemukan
                    </td>
                  </tr>
                ) : (
                  currentItems.map((user, index) => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3 text-sm">{user.displayName}</td>
                      <td className="px-4 py-3 text-sm">{user.role}</td>
                      <td className="px-4 py-3 text-sm">{user.examStatus}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 transition"
                            title="Edit pengguna"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700 transition"
                            title="Hapus pengguna"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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
      </div>
    </>
  );
};
