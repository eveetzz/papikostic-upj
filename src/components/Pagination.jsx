import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const Pagination = ({
  rowsPerPage,
  setRowsPerPage,
  setCurrentPage,
  filteredUsers,
  currentPage,
  totalPages,
}) => {
  return (
    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Tampilkan</span>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={10}>10 baris</option>
          <option value={25}>25 baris</option>
          <option value={50}>50 baris</option>
        </select>
        <span className="text-sm text-gray-700">
          dari {filteredUsers.length} data
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded transition ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(totalPages, prev + 1))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
