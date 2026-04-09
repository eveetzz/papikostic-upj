import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, Download, MoreVertical, ArrowUpDown } from "lucide-react";
import {
  getUserResults,
  getUsers,
  updateStatusReview,
} from "../../services/manageUser";
import { ResultRow } from "../../components/test-results/ResultRow";
import { Pagination } from "../../components/Pagination";
import { DetailTestResult } from "./DetailTestResult";
import { getCategory } from "../../services/getUserResults";
import { CompareModal } from "../../components/test-results/CompareModal";

export const DummyPage = () => {
  const [results, setResults] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("desc");

  // State Detail User
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);

  // state open compare
  const [showCompareModal, setShowCompareModal] = useState(false);

  // State untuk Filter
  const [filterCategory, setFilterCategory] = useState("WORK DIRECTION");
  const [filterStatus, setFilterStatus] = useState("Semua"); // Semua, Pending, Reviewed
  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Fitur Komparasi
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Mock Categories (Bisa diambil dari DB juga kalo ada master datanya)
  const categories = useMemo(() => {
    return getCategory(results);
  }, [results]);

  // ambil user results
  useEffect(() => {
    try {
      const unsubscribe = getUserResults((data) => {
        setResults(data);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ambil data users
  useEffect(() => {
    try {
      const unsubscribe = getUsers((data) => {
        setUsers(data);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // penggabungan
  const combinedData = useMemo(() => {
    return results.map((result) => {
      const userData = users.find((u) => u.id === result.uid);
      return {
        ...result,
        uid: result.uid,
        hasReviewed: userData ? userData.hasReviewed : false,
        nama: userData ? userData.nama : result.nama,
      };
    });
  }, [results, users]);

  const handleUpdateStatus = async (uid, newStatus) => {
    const result = await updateStatusReview(uid, newStatus);
    if (!result.success) {
      alert("Gagal update: " + result.error);
    }
  };

  // --- LOGIC FILTERING ---
  const filteredData = combinedData.filter((item) => {
    // 1. Filter Search (Nama/Email)
    const matchSearch =
      item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Filter Status Review
    // hasReviewed null/undefined = Pending. Ada isi = Success.
    let matchStatus = true;
    if (filterStatus === "pending") {
      matchStatus = !item.hasReviewed;
    } else if (filterStatus === "success") {
      matchStatus = !!item.hasReviewed;
    }

    return matchSearch && matchStatus;
  });

  // --- LOGIC KOMPARASI ---
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedUsers([]); // Reset saat mode berubah
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((uid) => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const sortByDate = [...results].sort((a, b) => {
    const dateA = new Date(a.submittedAt).getTime();
    const dateB = new Date(b.submittedAt).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });
  // total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const dropdownRef = useRef(null);
  // popup select user
  useEffect(() => {
    function handleClickOutside(event) {
      // Jika dropdown sedang terbuka dan yang diklik bukan bagian dari dropdownRef
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    // Pasang event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Bersihkan listener saat komponen dibongkar
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (selectedDetailUser) {
    const currentUserData = combinedData.find(
      (d) => d.id === selectedDetailUser.id,
    );
    return (
      <DetailTestResult
        user={currentUserData || selectedDetailUser}
        onBack={() => setSelectedDetailUser(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  // Di dalam DummyPage component, sebelum return
  const dataToCompare = useMemo(() => {
    return combinedData.filter(
      (users) =>
        // Pastikan user.id / user.targetId / user.uid sesuai dengan yang kamu simpan di selectedUsers
        selectedUsers.includes(users.uid) || selectedUsers.includes(users.id),
    );
  }, [combinedData, selectedUsers]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hasil Tes</h1>

        {/* Container Dropdown */}
        <div className="relative">
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

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              ref={dropdownRef} // Menghubungkan elemen ini dengan ref
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1"
            >
              <button
                onClick={() => {
                  toggleSelectionMode();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                {isSelectionMode ? "Kembali" : "Pilih User"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Actions */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="flex-1">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua</option>
              <option value="pending">Pending Review</option>
              <option value="success">Success Review</option>
            </select>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Cari"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            disabled={selectedUsers.length < 2}
            onClick={() => setShowCompareModal(true)} // <--- TRIGGER MODAL
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 transition
    ${
      selectedUsers.length < 2
        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700 shadow-lg transform active:scale-95"
    }`}
          >
            <Download className="w-4 h-4" /> {/* Boleh ganti icon Trophy */}
            Compare User ({selectedUsers.length})
          </button>

          {/* <button
            disabled={selectedUsers.length < 2}
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 transition
    ${
      selectedUsers.length < 2
        ? "bg-gray-100 text-gray cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700"
    }`}
          >
            <Download className="w-4 h-4" />
            Compare User ({selectedUsers.length})
          </button> */}

          <button className="bg-blue-600 text-white px-4 py-2 rounded-md w-full sm:w-auto flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                {isSelectionMode && (
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Select
                  </th>
                )}
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Nama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Hasil Tes
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold ">
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="flex items-center gap-2 hover:text-gray-400"
                  >
                    Tanggal Pengerjaan <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <ResultRow
                  key={item.id}
                  item={item}
                  index={index}
                  filterCategory={filterCategory}
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedUsers.includes(item.id)}
                  onSelect={() => handleSelectUser(item.id)}
                  onView={() => {
                    setSelectedDetailUser(item);
                  }}
                  // buat ganti status review
                  onStatusChange={handleUpdateStatus}
                />
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder (sesuai gambar) */}

        <Pagination
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          setCurrentPage={setCurrentPage}
          filteredUsers={filteredData}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>

      {/* MODAL KOMPARASI */}
      {showCompareModal && (
        <CompareModal
          users={dataToCompare}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
};
