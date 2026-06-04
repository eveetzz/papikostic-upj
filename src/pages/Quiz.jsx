import React, { useCallback, useEffect, useRef, useState } from "react";
import { auth, db } from "../firebase";
import { saveResult, updateExamStatus } from "../services/fetchData";
import {
  getQuestions,
  getAnalysisRules,
  getScoringRules,
  getTraits,
} from "../services/fetchJson";

import Swal from "sweetalert2";

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

  const [isExtraTime, setIsExtraTime] = useState(false);

  const { userData } = useAuth();

  const [answers, setAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("temp_answers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [visualDeadline, setVisualDeadline] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [actualDeadline, setActualDeadline] = useState(null);
  const [extraDeadline, setExtraDeadline] = useState(null);
  const [duration, setDuration] = useState(null);

  // ✅ Ref untuk menghindari stale closure di dalam interval
  const answersRef = useRef(answers);
  const questionsRef = useRef(questions);
  const scoringRulesRef = useRef(scoringRules);
  const analysisRulesRef = useRef(analysisRules);
  const traitsRef = useRef(traits);
  const startTimeRef = useRef(startTime);
  const handleSubmitRef = useRef(null);

  // ✅ Sync semua ref setiap kali state terkait berubah
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { scoringRulesRef.current = scoringRules; }, [scoringRules]);
  useEffect(() => { analysisRulesRef.current = analysisRules; }, [analysisRules]);
  useEffect(() => { traitsRef.current = traits; }, [traits]);
  useEffect(() => { startTimeRef.current = startTime; }, [startTime]);

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
          setVisualDeadline(realDeadline);
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

  // PERINGATAN JIKA MAU TUTUP TAB
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

// =========================================================================
  // 🎯 1. TIMER UTAMA (Hanya butuh SATU blok ini saja, duplikatnya dibuang)
  // =========================================================================
  useEffect(() => {
    if (!actualDeadline || isExtraTime || questions.length === 0) return;

    const checkTime = setInterval(() => {
      const now = Date.now();
      if (now >= actualDeadline) {
        clearInterval(checkTime); // Langsung matikan biar gak looping!

        const allAnswered =
          Object.keys(answersRef.current).length === questions.length;

        if (allAnswered) {
          handleSubmitRef.current();
        } else {
          Swal.fire({
            title: "Waktu Habis!",
            text: "Waktu utama telah habis. Apakah Anda ingin menggunakan waktu tambahan 5 menit untuk menyelesaikan jawaban yang tersisa?",
            icon: "warning",
            confirmButtonText: "Mengerti & Lanjutkan",
            confirmButtonColor: "#3085d6",
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            const extra = Date.now() + 5 * 60 * 1000;
            setExtraDeadline(extra);
            setIsExtraTime(true); // Mengunci timer utama ini agar berhenti total
            setVisualDeadline(extra);
          });
        }
      }
    }, 1000);

    return () => clearInterval(checkTime);
  }, [actualDeadline, isExtraTime, questions.length]); // Dependencies lengkap

  // =========================================================================
  // ⏱️ 2. TIMER WAKTU TAMBAHAN (Ini pengganti duplikatnya, tugasnya beda!)
  // =========================================================================
  useEffect(() => {
    if (!extraDeadline) return;

    const checkExtraTime = setInterval(() => {
      const now = Date.now();
      if (now >= extraDeadline) {
        clearInterval(checkExtraTime); // Matikan timer bonus
        Swal.fire({
          title: "Waktu Tambahan Habis!",
          text: "Waktu tambahan telah habis. Jawaban akan otomatis dikumpulkan.",
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#d33",
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          handleSubmitRef.current({ forceSubmit: true, status: "uncompleted" });
        });
      }
    }, 1000);

    return () => clearInterval(checkExtraTime);
  }, [extraDeadline]); // ✅ Pastikan mendengarkan perubahan jumlah soal

  const handleSubmit = async (options = {}) => {
    // Guard: jika options adalah event object (dari form submit), reset ke {}
    if (options && typeof options.preventDefault === "function") {
      options.preventDefault();
      options = {};
    }

    const { forceSubmit = false, status = "completed" } = options;

    const user = auth.currentUser;
    if (!user) return alert("User tidak ditemukan");

    if (
      Object.keys(scoringRulesRef.current).length === 0 ||
      Object.keys(traitsRef.current).length === 0 ||
      Object.keys(analysisRulesRef.current).length === 0
    ) {
      alert("Data konfigurasi (scoring/traits) belum siap.");
      return;
    }

    if (questionsRef.current.length === 0) {
      alert("Data soal belum siap.");
      return;
    }

    // Validasi manual: jika bukan force submit, wajib semua soal terjawab
    if (
      !forceSubmit &&
      Object.keys(answersRef.current).length !== questionsRef.current.length
    ) {
      alert("Masih ada jawaban yang kosong, harap diisi terlebih dahulu.");
      return;
    }

    try {
      setIsSaving(true);

      const scores = calculateScore(answersRef.current, scoringRulesRef.current);
      const report = generateReport(scores, analysisRulesRef.current, traitsRef.current);

      const dataDuration = getDuration(startTimeRef.current);
      const duration = dataDuration.durationFormatted;

      const topTraits = getTopTraits(report);

      await saveResult({
        user,
        userData,
        answers: answersRef.current,
        report,
        duration,
        topTraits,
        status,
      });

      localStorage.removeItem("temp_answers");
      await updateExamStatus(status);

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

  // ✅ Sync handleSubmit ke ref setiap render agar timer selalu pakai versi terbaru
  handleSubmitRef.current = handleSubmit;

  const handleAnswer = useCallback((questionId, choice) => {
    setAnswers((prevAnswers) => {
      if (prevAnswers[questionId] === choice) return prevAnswers;
      return {
        ...prevAnswers,
        [questionId]: choice,
      };
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
    />
  );
};