import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { auth, db } from "../firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { startExam } from "../services/fetchData";
import { useAuth } from "../components/security/AuthGuard";
import headLogo from "../assets/image 38.png";
import { InstructionScreen } from "./InstructionScreen";
import { Footer } from "../components/Footer";

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
      const examDuration = 1;
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
    <div className="min-h-screen w-full bg-[#1A5A9A] overflow-y-auto flex flex-col items-center">
      <Navbar user={userData} />

      {/* Container tengah yang fleksibel */}
      <div className="flex-1 flex flex-col items-center justify-start w-full px-4 pt-10 mt-10 pb-20 gap-10">
        {/* Profile Group */}
        <div className="flex flex-col items-center">
          <img
            src={headLogo}
            alt="profile"
            className="w-auto h-[180px] md:h-[200px] rounded-full shadow-lg object-cover"
          />

          <div className="text-center mt-6">
            <h1 className="text-white font-black text-[24px] md:text-[28px]">
              Halo {userData?.displayName},
            </h1>
            <h3 className="text-white font-bold text-[26px] md:text-[32px] leading-tight mt-2">
              Selamat Datang di <br className="sm:hidden" /> Tes PAPIKOSTICK!
            </h3>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[330px]">
          <button
            onClick={handleOpenTutorial}
            className="w-full h-[52px] bg-[#003366] rounded-md shadow-md text-white text-[18px] font-medium hover:bg-[#004080] transition-all active:scale-95"
          >
            Lihat Tutorial
          </button>

          <button
            onClick={handleOpenInstruction}
            disabled={
              !tutorialDone ||
              userStatus === "completed" ||
              userStatus === "uncompleted" ||
              userStatus === "loading"
            }
            className={`w-full h-[52px] rounded-md shadow-md text-[18px] font-medium transition-all active:scale-95
            ${
              userStatus === "completed" || userStatus === "uncompleted" || !tutorialDone
                ? "bg-gray-400 text-gray-200 cursor-not-allowed opacity-60"
                : "bg-[#2563EB] text-white cursor-pointer hover:bg-[#1088ff]"
            }`}
          >
            Ikuti Tes
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};
