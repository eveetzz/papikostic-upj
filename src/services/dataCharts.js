import React from "react";

export const calculateTotalPersonalityScores = (resultsList) => {
  if (!resultsList || resultsList.length === 0) return [];

  const traitCounts = {};

  resultsList.forEach((res) => {
    if (res.report && Array.isArray(res.report)) {
      res.report.forEach((item) => {
        const key = item.trait;
        const scoreValue = Number(item.score) || 0;

        if (key) {
          traitCounts[key] = (traitCounts[key] || 0) + scoreValue;
        }
      });
    }
  });
  return Object.keys(traitCounts).map((key) => ({
    name: key,
    value: traitCounts[key],
  }));
};

export const transformReverseTraits = (label, rawScore) => {
  const reverseTraits = ["K", "Z"];

  if (reverseTraits.includes(label)) {
    return 10 - rawScore;
  }

  return rawScore;
};
