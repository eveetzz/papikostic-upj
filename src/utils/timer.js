import React, { useEffect, useState } from 'react'

export const Timer = ({ duration, onTimeUp, isFinished }) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem("examEndTime");
    if (savedEndTime) {
      const remaining = Math.floor(
        (parseInt(savedEndTime) - Date.now()) / 1000
      );
      return remaining > 0 ? remaining : 0;
    }
    return duration;
  });

  // set deadline jika belum ada
  useEffect(() => {
    if (!localStorage.getItem("examEndTime")) {
      const now = Date.now();
      localStorage.setItem("examStartTime", now);
      localStorage.setItem("examEndTime", now + duration * 1000);
    }
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0 || isFinished) {
      if (timeLeft <= 0 && !isFinished) onTimeUp();
      return;
    }

    const timerId = setInterval(() => {
      const endTime = parseInt(localStorage.getItem("examEndTime"));
      const secondsLeft = Math.floor((endTime - Date.now()) / 1000);

      if (secondsLeft <= 0) {
        setTimeLeft(0);
        clearInterval(timerId);
      } else {
        setTimeLeft(secondsLeft);
      }
    }, 1000);
    return () => clearInterval(timerId)
  }, [timeLeft, isFinished, onTimeUp]);

  return timeLeft, clearTimeout;
};
