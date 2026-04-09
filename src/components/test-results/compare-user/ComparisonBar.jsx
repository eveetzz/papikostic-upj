import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export const ComparisonBar = ({ users, themeColors, groupedData, activeIndex, setActiveIndex, currentCategory }) => {

  // Penanganan jika data kosong
  if (!currentCategory)
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex items-center justify-center p-6 text-slate-500">
        Data kategori tidak tersedia.
      </div>
    );

  const [categoryName, traits] = currentCategory;

  const nextCategory = () =>
    setActiveIndex((prev) => (prev + 1) % groupedData.length);
  const prevCategory = () =>
    setActiveIndex(
      (prev) => (prev - 1 + groupedData.length) % groupedData.length,
    );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full max-h-[800px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#1e5a9e] rounded-t-xl shrink-0">
        <button
          onClick={prevCategory}
          className="p-1 hover:bg-gray-100 rounded-full shadow-sm transition bg-gray-50"
        >
          <ChevronLeft size={20} className=" text-blue-950" />
        </button>

        <div className="text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-200 font-bold block">
            Kategori Analisis
          </span>
          <h3 className="font-bold text-white uppercase">{categoryName}</h3>
        </div>

        <button
          onClick={nextCategory}
          className="p-1 hover:bg-gray-100 rounded-full shadow-sm transition bg-gray-50"
        >
          <ChevronRight size={20} className=" text-blue-950" />
        </button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
        {traits.map(({ traits, description }) => (
          <div key={traits} className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {traits} - {description}
              </label>
              <div className="flex gap-1">
                {users.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${themeColors[i % themeColors.length].bg}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-slate-100 space-y-3">
              {users.map((user, uIdx) => {
                const theme = themeColors[uIdx % themeColors.length];
                const reportItem = user.report?.find((r) => r.trait === traits);
                const score = reportItem?.score || 0;
                const interpretation = reportItem?.interpretation || "-";
                const percentage = (score / 9) * 100;

                return (
                  <div key={uIdx} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-medium text-slate-400">
                      <span>{user.displayName}</span>
                      <span className={theme.text}>
                        {interpretation} (Skor: {score})
                      </span>
                    </div>
                    <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full ${theme.bg} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-slate-50 flex justify-center gap-1.5 shrink-0">
        {groupedData.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all ${idx === activeIndex ? "w-6 bg-blue-500" : "w-1.5 bg-slate-200"}`}
          />
        ))}
      </div>
    </div>
  );
};
