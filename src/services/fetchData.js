import React from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../firebase";

export const fetchQuestions = async () => {
  try {
    const snapshot = await getDocs(collection(db, "questions"));
    const data = [];
    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    return data.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  } catch (error) {
    console.error("Soal tidak tersedia atau terjadi kesalahan:", error);
  }
};

export const fetchScoringRules = async () => {
  try {
    const snap = await getDocs(collection(db, "scoring_rules"));
    if (snap.empty) return null;

    const rules = {};
    snap.docs.forEach((doc) => {
      rules[doc.id] = doc.data();
    });

    // const rules = snap.docs.reduce((acc, doc) => {
    //   acc[doc.id] = doc.data();
    //   return acc;
    // }, {});

    return rules;

    // return snap.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }));
  } catch (error) {
    console.error("Tidak dapat memuat data", error);
    return {};
  }
};

export const fetchScoringKey = async () => {
  try {
    const snap = await getDoc(doc(db, "app_config", "scoringKey_mvp"));
    return snap.exists() ? snap.data().keys : null;
  } catch (error) {
    console.error("Kunci skor tidak tersedia atau terjadi kesalahan:", error);
  }
};

export const fetchAnalysisRules = async () => {
  try {
    const snap = await getDoc(doc(db, "app_config", "analysisRules_mvp"));
    return snap.exists() ? snap.data().rules : null;
  } catch (error) {
    console.error("Data tidak tersedia atau terjadi kesalahan:", error);
  }
};

export const fetchTraits = async () => {
  try {
    const snap = await getDocs(collection(db, "traitDefinitions"));
    const result = {};
    snap.forEach((doc) => {
      result[doc.id] = {
        category: doc.data().category,
        description: doc.data().description,
        interpretations: doc.data().interpretations || [],
      };
    });
    return result;
  } catch (error) {
    console.error("Data tidak tersedia atau terjadi kesalahan:", error);
  }
};

export const saveResult = async ({
  user,
  userData,
  answers,
  report,
  duration,
  topTraits,
}) => {
  try {
    const docId = `${user.uid}_${Date.now()}`;
    await setDoc(doc(db, "user_results", docId), {
      uid: user.uid,
      displayName: userData?.displayName || "Anonymous",
      email: user.email,
      duration: duration,
      answers: answers,
      submittedAt: serverTimestamp(),
      report: report,
      topTraits: topTraits,
    });
  } catch (error) {
    console.error("Gagal menyimpan hasil:", error);
  }
};

export const updateExamStatus = async () => {
  try {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      examStatus: "completed",
    });
  } catch (error) {
    console.error("Gagal memperbarui status ujian:", error);
  }
};

export const startExam = async (user, now, deadline) => {
  try {
    await updateDoc(doc(db, "users", user.uid), {
      examStatus: "in_progress",
      examStartTime: now,
      examEndTime: deadline,
      hasReviewed: false,
    });
  } catch (error) {
    console.error("Error starting exam:", error);
  }
};

export const getDisplayReport = (results) => {
  return results.reduce((acc, item) => {
    const category = item.category || "Lainnya";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
};
