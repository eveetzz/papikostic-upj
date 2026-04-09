import React from "react";

export const formatTime = (seconds) => {
  if (!seconds || seconds < 0) return "--.--";

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
