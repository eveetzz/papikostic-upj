import { getDuration } from "./getDuration";
import { getInterpretation } from "./interpretationService";

export const calcuateResult = (answers, scoringKey, analysisRules, traits) => {
  try {
    const rawScores = Object.keys(traits).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    Object.keys(answers).forEach((questionId) => {
      const choice = answers[questionId].toUpperCase();
      const trait = scoringKey[questionId]?.[choice];
      if (trait && rawScores[trait] !== undefined) {
        rawScores[trait]++;
      }
    });

    // const { durationSeconds, durationFormatted } = getDuration();

    return Object.keys(rawScores).map((code) => ({
      CODE: code,
      SCORE: rawScores[code],
      CATEGORY: traits[code]?.category || "Tidak ada deskripsi",
      DESCRIPTION: traits[code]?.description || "Tidak ada deskripsi",
      ANALYSIS: analysisRules[rawScores[code]] || "Tidak ada analisis",
      INTERPRETATION:
        getInterpretation(rawScores[code], traits[code], analysisRules) ||
        "Tidak ada analisis",
      // DURATIONS: durationFormatted || "0:00",
      // DURATION_SECONDS: durationSeconds || 0,
    }));
  } catch (error) {
    console.log("Error calculating result:", error);
  }
};

