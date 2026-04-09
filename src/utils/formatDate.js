import React from "react";

export const submitDate = (item) => {
  const dateObj = item.submittedAt?.toDate
    ? item.submittedAt.toDate()
    : new Date(item.submittedAt);

  return dateObj.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
