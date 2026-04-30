import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Download,
  MoreVertical,
  ArrowUpDown,
  Scale,
} from "lucide-react";
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
import { PreviewPDF } from "../../components/export/PreviewPDF";
import { UserReportPDF } from "../../components/export/UserReportPDF";
import { submitDate } from "../../utils/formatDate";
import { getDisplayReport } from "../../services/fetchData";
import { ScoreRadar } from "../../components/test-results/ScoreRadar";
import { toPng } from "html-to-image";

export const TestResult = () => {
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

  // fitur export PDF
  const [openPDF, setOpenPDF] = useState(false);

  const chartRef = useRef(null);
  const [chartImage, setChartImage] = useState(null);
  const [dataForChart, setDataForChart] = useState([]);

  const [userToProcessExport, setUserToProcessExport] = useState(null);

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
        nama: userData ? userData.displayName : result.displayName,
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
      item.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, rowsPerPage]);

  // logic export user ke PDF
  const userToExport = useMemo(() => {
    if (selectedDetailUser) return selectedDetailUser;

    if (selectedUsers.length > 0) {
      return combinedData.find(
        (u) => u.uid === selectedUsers[0] || u.id === selectedUsers[0],
      );
    }

    return null;
  }, [selectedDetailUser, selectedUsers, combinedData]);

  // logic export chart ke PDF
  const handleExportWithChart = async (user) => {
    // Gunakan state baru, jangan setSelectedDetailUser(user)
    setUserToProcessExport(user);

    setTimeout(async () => {
      if (chartRef.current) {
        try {
          const dataUrl = await toPng(chartRef.current, { cacheBust: true });
          setChartImage(dataUrl);
          setOpenPDF(true);
        } catch (err) {
          console.error("Gagal generate gambar chart:", err);
        }
      }
    }, 2000);
  };

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

  const handleSortDate = () => {
    const sortByDate = [...results].sort((a, b) => {
      // Ambil tanggal asli dari a (bukan hasil format string)
      const dateA = a.submittedAt?.toDate
        ? a.submittedAt.toDate()
        : new Date(a.submittedAt);
      // Ambil tanggal asli dari b
      const dateB = b.submittedAt?.toDate
        ? b.submittedAt.toDate()
        : new Date(b.submittedAt);

      const timeA = dateA.getTime() || 0; // Jika null/invalid, beri 0
      const timeB = dateB.getTime() || 0;

      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });

    setResults(sortByDate);
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

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

  const dataToCompare = useMemo(() => {
    return combinedData.filter(
      (users) =>
        // Pastikan user.id / user.targetId / user.uid sesuai dengan yang kamu simpan di selectedUsers
        selectedUsers.includes(users.uid) || selectedUsers.includes(users.id),
    );
  }, [combinedData, selectedUsers]);

  const mainContain = () => {
    if (selectedDetailUser) {
      return (
        <DetailTestResult
          // Ambil data terbaru dari combinedData agar statusnya sinkron
          user={
            combinedData.find((d) => d.uid === selectedDetailUser.uid) ||
            selectedDetailUser
          }
          onBack={() => setSelectedDetailUser(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      );
    }

    if (showCompareModal) {
      return (
        <CompareModal
          users={dataToCompare}
          onClose={() => setShowCompareModal(false)}
        />
      );
    }

    return (
      <>
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
              <Scale className="w-4 h-4" /> {/* Boleh ganti icon Trophy */}
              Compare User ({selectedUsers.length})
            </button>

            <button
              onClick={() => handleExportWithChart(userToExport)}
              disabled={selectedUsers.length < 1}
              className={`px-4 py-2 rounded-md w-full sm:w-auto flex items-center justify-center gap-2 ${
                selectedUsers.length < 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg transform active:scale-95"
              }`}
            >
              <Download className="w-4 h-4" />
              Export
            </button>

            <PreviewPDF
              isOpen={openPDF}
              onClose={() => {
                setOpenPDF(false);
                setUserToProcessExport(null);
              }}
            >
              <UserReportPDF
                user={userToProcessExport}
                chartImage={chartImage}
              />
            </PreviewPDF>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#1e5a9e] text-white">
                  {isSelectionMode && (
                    <th className="w-12 px-4 py-3 text-left text-sm font-semibold">
                      {/* Checkbox Master */}
                    </th>
                  )}
                  <th className="w-16 px-4 py-3 text-left text-sm font-semibold">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  {/* Gunakan whitespace-nowrap agar judul tidak turun ke bawah (wrap) */}
                  <th className="w-32 px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    Hasil Tes
                  </th>
                  <th className="w-48 px-4 py-3 text-left text-sm font-semibold whitespace-nowrap">
                    <button
                      onClick={handleSortDate}
                      className="flex items-center gap-2 hover:text-gray-200"
                    >
                      Tanggal <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="w-24 px-4 py-3 text-center text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => {
                  const globalIndex =
                    (currentPage - 1) * rowsPerPage + index + 1;

                  return (
                    <ResultRow
                      key={item.id}
                      item={item}
                      index={globalIndex}
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
                  );
                })}

                {paginatedData.length === 0 && (
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

        {/* Kontainer Gaib untuk Capture Chart */}
        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
          <div
            ref={chartRef}
            style={{ width: "600px", height: "400px", background: "white" }}
          >
            {userToProcessExport && (
              <ScoreRadar results={userToProcessExport.report || []} />
            )}
          </div>
        </div>
      </>
    );
  };

  return <div className="p-6 bg-gray-50 min-h-screen">{mainContain()}</div>;
};
