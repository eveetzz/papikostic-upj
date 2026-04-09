import React, { useMemo } from "react";

export const getCategory = (results) => {
  // 1. Ambil semua array 'report' dari setiap user dan gabungkan jadi satu
  const allReports = results.flatMap((user) => user.report || []);

  // 2. Ambil field 'category' saja
  const allCategoryNames = allReports.map((rep) => rep.category?.toUpperCase());

  // 3. Ambil nilai yang unik (tidak duplikat) dan buang nilai kosong (null/undefined)
  const uniqueCategories = [...new Set(allCategoryNames)].filter(Boolean);

  // 4. Urutkan secara abjad (opsional)
  return uniqueCategories.sort();
};

export const getScores = (results) => {
  // 1. Ambil semua array 'report' dari setiap user dan gabungkan jadi satu
  const allReports = results.flatMap((user) => user.report || []);

  // 2. Ambil field 'category' saja
  const allCategoryNames = allReports.map((rep) => rep.score?.toUpperCase());

  // 3. Ambil nilai yang unik (tidak duplikat) dan buang nilai kosong (null/undefined)
  const uniqueCategories = [...new Set(allCategoryNames)].filter(Boolean);

  // 4. Urutkan secara abjad (opsional)
  return uniqueCategories.sort();
};

export const getTraits = (results) => {
  // 1. Ambil semua array 'report' dari setiap user dan gabungkan jadi satu
  const allReports = results.Map((user) => user.report || []);

  // 2. Ambil field 'category' saja
  const allCategoryNames = allReports.map((rep) => rep.trait?.toUpperCase());

  // 3. Ambil nilai yang unik (tidak duplikat) dan buang nilai kosong (null/undefined)
  const uniqueCategories = [...new Set(allCategoryNames)].filter(Boolean);

  // 4. Urutkan secara abjad (opsional)
  return uniqueCategories.sort();
};
