
export const getTopTraits = (report) => {
  if (!report || report.length === 0) return [];

  // exclude trait yang tidak diinginkan
  const excludedTraits = ["Z", "E", "K"];

  const filtered = report.filter(
    (item) => !excludedTraits.includes(item.trait.toUpperCase())
  );

  // urutkan dari score terbesar
  const sorted = [...filtered].sort((a, b) => b.score - a.score);

  return sorted.slice(0, 3);
};

// jika kurang dari 3 trait, return semua
// if (sorted.length <= 3) return sorted;

// dapatkan score untuk posisi 3
// const thirdScore = sorted[2].score;

// ambil semua trait yang skornya >= thirdscore
// const finalTraits = sorted.filter((item) => item.score >= thirdScore);
