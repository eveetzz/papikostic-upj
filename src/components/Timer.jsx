import React, { memo, useEffect, useState } from "react";
import { playBeep } from "../utils/beepSound";
import { formatTime } from "../utils/formatTime";

export const Timer = memo(({ visualDeadline, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    // timer logic
    const timerId = setInterval(() => {
      const now = Date.now();
      const distance = visualDeadline - now;
      const secondsLeft = Math.floor(distance / 1000);

      if (secondsLeft <= 0) {
        setTimeLeft(0);
        clearInterval(timerId);
        // onTimeUp();
      } else {
        setTimeLeft(secondsLeft);
      }

      if (secondsLeft > 0 && secondsLeft <= 30) {
        playBeep();
      }
    }, 1000);
    return () => clearInterval(timerId);
  }, [visualDeadline, onTimeUp]);

  return (
    <>
      <div
        className={`w-20 px-5 py-1 rounded-md text-white font-semibold text-xl transition-all ${
          timeLeft <= 300 ? "bg-red-500 animate-pulse" : "bg-[#22C55E]"
        }`}
      >
        {formatTime(timeLeft)}
      </div>
    </>
  );
});
