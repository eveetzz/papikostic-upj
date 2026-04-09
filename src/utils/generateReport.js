import { rule } from "postcss";

export const generateReport = (rawScores, analysisRules, traits) => {
  try {
    const report = [];

    Object.keys(rawScores).forEach((traitCode) => {
      const score = rawScores[traitCode];
      const traitDetail = traits[traitCode];

      if (traitDetail) {
        const analysisRule = analysisRules.find(
          (rule) => score >= rule.min && score <= rule.max
        );
        const label = analysisRule ? analysisRule.label : "UNKNOWN";

        const interpretationData = traitDetail.interpretations.find(
          (inter) => score >= inter.min && score <= inter.max
        );

        const interpretation = interpretationData
          ? interpretationData.text
          : "-";

        report.push({
          trait: traitCode,
          score: score,
          category: traitDetail.category || "none",
          description: traitDetail.description || "none",
          label: label,
          interpretation: interpretation,
        });
      }
    });

    return report;
  } catch (error) {
    console.warn(`Data Trait untuk kode '${traitCode}' tidak ditemukan di traits.json`);
  }
};
