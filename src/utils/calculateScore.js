import { rule } from "postcss";

export const calculateScore = (answers, scoringRules) => {
  try {
    // 1. Inisialisasi semua skor 0
    let finalScores = {
      N: 0,
      G: 0,
      A: 0,
      L: 0,
      P: 0,
      I: 0,
      T: 0,
      V: 0,
      X: 0,
      S: 0,
      B: 0,
      O: 0,
      R: 0,
      D: 0,
      C: 0,
      Z: 0,
      E: 0,
      K: 0,
      F: 0,
      W: 0,
    };

    console.log("--- MULAI PERHITUNGAN SKOR ---");
    console.log("Rules Loaded:", scoringRules.length, "items");
    console.log("User Answers:", answers);

    Object.keys(answers).forEach((questionKey) => {
      const userAnswer = answers[questionKey].toString().toUpperCase();
      const qNumInt = parseInt(questionKey); // Ubah "1" jadi 1

      // LOGIKA FILTER
      const matchedRules = scoringRules.filter(
        (rule) =>
          rule.number === qNumInt && rule.answer.toUpperCase() === userAnswer,
      );

      // DEBUGGING LOG (Cek jika tidak ada match)
      if (matchedRules.length === 0) {
        console.warn(
          `Soal No ${qNumInt} (Jawab: ${userAnswer}) -> TIDAK COCOK dengan Rule manapun! Cek JSON.`,
        );
      } else {
        console.log(
          `Soal No ${qNumInt} Match! -> Tambah poin ke: ${matchedRules
            .map((r) => r.trait)
            .join(", ")}`,
        );
      }

      matchedRules.forEach((rule) => {
        const trait = rule.trait.toUpperCase();
        if (finalScores[trait] !== undefined) {
          finalScores[trait] += 1;
        }
      });
    });

    console.log("--- HASIL SKOR AKHIR ---", finalScores);
    return finalScores;
  } catch (error) {
    console.log("Error on finalscore:", error);
  }
};
