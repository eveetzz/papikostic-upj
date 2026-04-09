import React, { useCallback, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { saveResult, updateExamStatus } from "../services/fetchData";
import {
  getQuestions,
  getAnalysisRules,
  getScoringRules,
  getTraits,
} from "../services/fetchJson";

import { FormQuestion } from "../components/exam/FormQuestion";
import { ResultScreen } from "../components/exam/ResultScreen";

import { useNavigate } from "react-router-dom";

import { getDuration } from "../utils/getDuration";
import { calculateScore } from "../utils/calculateScore";
import { generateReport } from "../utils/generateReport";
import { getTopTraits } from "../utils/getTopTraits";

import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../components/security/AuthGuard";

export const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [scoringRules, setScoringRules] = useState([]);
  const [analysisRules, setAnalysisRules] = useState([]);
  const [traits, setTraits] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [topTraits, setTopTraits] = useState([]);

  const { userData } = useAuth();

  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("temp_answers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [visualDeadline, setVisualDeadline] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [actualDeadline, setActualDeadline] = useState(null);

  const [duration, setDuration] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const initTimer = async () => {
      try {
        const user = await getDoc(doc(db, "users", auth.currentUser.uid));
        const data = user.data();

        if (data && data.examEndTime) {
          const realDeadline = data.examEndTime.toMillis();
          const startDeadline = data.examStartTime.toMillis();

          setStartTime(startDeadline);

          setActualDeadline(realDeadline);

          const buffer = 5 * 60 * 1000;
          setVisualDeadline(realDeadline - buffer);
        }
      } catch (error) {
        console.error("error cant set timer", error);
      } finally {
        setLoading(false);
      }
    };
    initTimer();
  }, []);

  useEffect(() => {
    setQuestions(getQuestions());
    setScoringRules(getScoringRules());
    setAnalysisRules(getAnalysisRules());
    setTraits(getTraits());
  }, []);

  // === 4. TAMBAHAN: PERINGATAN JIKA MAU TUTUP TAB ===
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!result) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [result]);

  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem("temp_answers", JSON.stringify(answers));
    }
  }, [answers]);

  // auto submit

  useEffect(() => {
    if (!actualDeadline) return;

    const checkTime = setInterval(() => {
      const now = Date.now()
      if (now >= actualDeadline) {
        clearInterval(checkTime)
        alert("Waktu Habis! Terima kasih telah mengikuti tes. Soal akan otomatis tertutup dan hasil akan diproses.");
        handleSubmit()
      }
    }, 1000)

    return () => clearInterval(checkTime)
  },[actualDeadline])

  // const handleTimeUp = () => {
  //   alert("Waktu Habis! Soal akan otomatis tertutup");
  //   handleSubmit();
  // };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("User tidak ditemukan");

    if (
      Object.keys(scoringRules).length === 0 ||
      Object.keys(traits).length === 0 ||
      Object.keys(analysisRules).length === 0
    ) {
      alert("Data konfigurasi (scoring/traits) belum siap.");
      return;
    }
    try {
      setIsSaving(true);
      // if (Object.keys(answers).length !== questions.length)
      //   return alert("Silahkan jawab semua pertanyaan sebelum submit");

      const scores = calculateScore(answers, scoringRules);

      const report = generateReport(scores, analysisRules, traits);

      const dataDuration = getDuration(startTime);
      const duration = dataDuration.durationFormatted;

      const topTraits = getTopTraits(report);

      await saveResult({
        user,
        userData,
        answers,
        report,
        duration,
        topTraits,
      });

      localStorage.removeItem("temp_answers");
      await updateExamStatus();

      setDuration(duration);
      setResult(report);
      setTopTraits(topTraits);

      setShowTable(true);
    } catch (error) {
      console.error("Detail Error Submit:", error);
      alert("Terjadi kesalahan saat menyimpan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnswer = useCallback((questionId, choice) => {
    setAnswers((prevAnswers) => {
      if (prevAnswers[questionId] === choice) return prevAnswers;
      const newAnswers = {
        ...prevAnswers,
        [questionId]: choice,
      };
      return newAnswers;
    });
  }, []);

  return showTable ? (
    <ResultScreen
      userData={userData}
      result={result}
      topTraits={topTraits}
      onRestart={() => {
        window.location.href = "/Index";
      }}
    />
  ) : (
    <FormQuestion
      questions={questions}
      answers={answers}
      onAnswer={handleAnswer}
      onSubmit={handleSubmit}
      isSaving={isSaving}
      visualDeadline={visualDeadline}
      // onTimeUp={handleTimeUp}
    />
  );
};
