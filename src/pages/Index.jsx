import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { auth, db } from "../firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { startExam } from "../services/fetchData";
import { useAuth } from "../components/security/AuthGuard";
import headLogo from "../assets/image 38.png";
import { InstructionScreen } from "./InstructionScreen";

export const Index = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { userData, loading } = useAuth();
  const [userStatus, setUserStatus] = useState("loading");

  // check apakah tutorial sudah dilihat
  const [tutorialDone, setTutorialDone] = useState(false);

  // tampilkan instruction jika
  const [showInstruction, setShowInstruction] = useState(false);

  useEffect(() => {
    const checkTutorial = () => {
      const done = localStorage.getItem("tutorialDone") === "true";
      setTutorialDone(done);
    };
    checkTutorial();

    window.addEventListener("storage", checkTutorial);
    return () => window.removeEventListener("storage", checkTutorial);
  }, []);

  const handleOpenTutorial = () => {
    navigate("/Tutorial");
  };

  const handleOpenInstruction = () => {
    if (!tutorialDone) {
      alert("Silakan lihat tutorial terlebih dahulu sebelum memulai tes.");
      return;
    }
    setShowInstruction(true);
  };

  useEffect(() => {
    // Tidak perlu fetch manual lagi jika userData sudah ada di context
    if (userData) {
      setUserStatus(userData.examStatus);
    }
  }, [userData]);

  const handleExamStart = async () => {
    try {
      const examDuration = 20;
      const now = new Date();
      const deadline = new Date(now.getTime() + examDuration * 60000);

      await startExam(user, now, deadline);

      navigate("/Quiz");
    } catch (error) {
      console.error("Error starting exam:", error);
    }
  };

  if (showInstruction) {
    return (
      <InstructionScreen
        handleStartExam={handleExamStart}
        onback={() => setShowInstruction(false)}
      />
    );
  }

  return (
    // Ganti bagian class pembungkus utama
    <div className="h-screen w-screen bg-[#1A5A9A] overflow-hidden flex flex-col items-center relative">
      <Navbar user={userData} />

      {/* Container Utama: Gunakan flex-1 dan justify-evenly agar konten menyebar otomatis */}
      <div className="flex-1 flex flex-col items-center justify-evenly w-full px-4 py-6 max-h-screen">
        {/* Profile - Ukuran responsif menggunakan h-[20vh] agar proporsional dengan tinggi layar */}
        <div className="flex flex-col items-center">
          <img
            src={headLogo}
            alt="profile"
            className="w-auto h-[20vh] min-h-[120px] max-h-[215px] rounded-full shadow-lg"
          />

          {/* Text Group */}
          <div className="text-center mt-4">
            <h1 className="text-white font-black text-[clamp(18px,4vw,25px)]">
              Halo {userData?.displayName},
            </h1>
            <h3 className="text-white font-bold text-[clamp(20px,5vw,30px)] leading-tight mt-2">
              Selamat Datang di <br className="sm:hidden" /> Tes PAPIKOSTICK!
            </h3>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[330px]">
          <button
            onClick={handleOpenTutorial}
            className="w-full h-[50px] bg-[#003366] rounded-md shadow-md text-white text-[18px] font-medium hover:bg-[#004080] transition-all"
          >
            Lihat Tutorial
          </button>

          <button
            onClick={handleOpenInstruction}
            disabled={
              !tutorialDone ||
              userStatus === "completed" ||
              userStatus === "loading"
            }
            className={`w-full h-[50px] rounded-md shadow-md text-[18px] font-medium transition-all
        ${
          userStatus === "completed" || !tutorialDone
            ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
            : "bg-[#2563EB] text-white cursor-pointer hover:bg-[#1088ff]"
        }`}
          >
            Ikuti Tes
          </button>
        </div>
      </div>
    </div>
  );
};
