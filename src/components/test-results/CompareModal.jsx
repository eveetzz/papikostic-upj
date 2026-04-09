import React, { useMemo, useState } from "react";

import { ArrowLeft } from "lucide-react";
import { ComparisonBar } from "./compare-user/ComparisonBar";
import { RadarSection } from "./compare-user/RadarSection";

export const CompareModal = ({ users, onClose }) => {
  if (!users || users.length === 0) return null;
  const [activeIndex, setActiveIndex] = useState(0);
  // 1. STATE & CONSTANTS

  const groupedData = useMemo(() => {
    const grouped = {};
    users.forEach((u) => {
      u.report?.forEach((r) => {
        if (!grouped[r.category]) grouped[r.category] = [];

        const isExist = grouped[r.category].find(
          (item) => item.traits === r.trait,
        );
        if (!isExist) {
          grouped[r.category].push({
            traits: r.trait,
            description: r.description || "-",
          });
        }
      });
    });
    return Object.entries(grouped);
  }, [users]);

  const currentCategory = groupedData[activeIndex];

  const THEME_COLORS = [
    {
      bg: "bg-blue-500",
      text: "text-blue-600",
      border: "border-blue-200",
      stroke: "#3b82f6",
      fill: "#3b82f6",
      bgLight: "bg-blue-50",
    },
    {
      bg: "bg-emerald-500",
      text: "text-emerald-600",
      border: "border-emerald-200",
      stroke: "#10b981",
      fill: "#10b981",
      bgLight: "bg-emerald-50",
    },
    {
      bg: "bg-purple-500",
      text: "text-purple-600",
      border: "border-purple-200",
      stroke: "#a855f7",
      fill: "#a855f7",
      bgLight: "bg-purple-50",
    },
    {
      bg: "bg-orange-500",
      text: "text-orange-600",
      border: "border-orange-200",
      stroke: "#f97316",
      fill: "#f97316",
      bgLight: "bg-orange-50",
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gray-50 min-h-screen">
      {/* 1. HEADER (Fixed at top) */}
      {/* HEADER */}

      <div className="mb-6 space-y-4">
        {/* BARIS ATAS: JUDUL */}

        <div className="flex items-center gap-3">
          {/* spacer untuk hamburger */}

          <div className="w-8 md:hidden" />

          <h1 className="text-xl md:text-2xl font-bold text-black">
            Analisis Komparasi Kandidat
          </h1>
        </div>

        {/* BARIS BAWAH: AKSI */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* KEMBALI */}

          <button
            onClick={onClose}
            className="flex items-center gap-2 text-black hover:underline text-sm md:text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Daftar Hasil
          </button>

          {/* ACTION BUTTON */}

          <div className="flex flex-col sm:flex-row gap-3">
            <p className="text-gray-500 text-sm mt-1">
              Membandingkan {users.length} kandidat
            </p>
          </div>
        </div>
      </div>

      {/* 2. WRAPPER UTAMA */}
      <div className="space-y-8">
        {/* BARIS ATAS: TINGGI DIKUNCI AGAR SEJAJAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM KIRI: DETAIL (Scrollable) */}
          {/* h-[600px] adalah kunci agar tinggi kedua kolom sama. Silakan ganti angkanya sesuai kebutuhan */}
          <div className="lg:col-span-2 h-[600px] overflow-y-auto custom-scrollbar">
            <ComparisonBar
              users={users}
              themeColors={THEME_COLORS}
              groupedData={groupedData}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              currentCategory={currentCategory}
            />
          </div>

          {/* KOLOM KANAN: RADAR (Sama Tinggi) */}
          <div className="lg:col-span-1 h-[600px]">
            {/* RadarSection akan memenuhi 100% tinggi h-[600px] tadi */}
            <RadarSection
              users={users}
              colors={THEME_COLORS}
              activeTraits={currentCategory[1].map((t) => t.traits)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
