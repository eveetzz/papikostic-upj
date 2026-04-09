import React from "react";
import { formatTime } from "./formatTime";

export const getDuration = (startTime) => {
  try {
    if (!startTime) {
      return { durationSeconds: 0, durationFormatted: "00:00" };
    }

    const endTime = Date.now();
    const timeDiff = Math.floor((endTime - startTime) / 1000);

    const durationSeconds = Math.max(0, timeDiff);

    return {
      durationFormatted: formatTime(durationSeconds),
    };
  } catch (error) {
    console.error("error di ngambil menit");
  }
};
