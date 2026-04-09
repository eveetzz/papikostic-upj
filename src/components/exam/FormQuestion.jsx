import React, { memo, useCallback, useEffect, useState } from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { Timer } from "../timer";
import { Sidebar } from "../sidebar";

export const FormQuestion = memo(
  ({
    questions,
    answers,
    onAnswer,
    onSubmit,
    isSaving,
    visualDeadline,
    // onTimeUp,
    visitedQuestions = [],
    isTutorial = false,
    openSidebar = false,
    tutorialStep = 0,
    blink = false,
  }) => {
    const [index, setIndex] = useState(0);
    // kontrol sidebar dari tutorial
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showList, setShowList] = useState(false);

    useEffect(() => {
      if (isTutorial) {
        setSidebarOpen(openSidebar);
      }
    }, [openSidebar, isTutorial]);

    if (!questions || questions.length === 0) {
      return <LoadingSpinner />;
    }
    const next = () => {
      if (index < questions.length - 1) setIndex(index + 1);
    };

    const prev = () => {
      if (index > 0) setIndex(index - 1);
    };

    // const handleSidebar = useCallback((idx) => {
    //   setShowList(false);
    //   setIndex(idx);
    // }, []);

    const q = questions[index];

    return (
      <>
        <div
          className={`w-full min-h-screen flex flex-col items-center relative ${
            blink ? "animate-[blinkRed_0.7s_ease-in-out_infinite]" : "bg-white"
          }`}
        >
          {/* OVERLAY */}
          {isTutorial && <div className="fixed inset-0 bg-black/60 z-40" />}

          {/* BUTTON DAFTAR SOAL (STEP 1) */}
          <button
            className={`absolute top-24 -left-1 px-6 py-3 rounded-lg text-lg
          ${
            isTutorial && tutorialStep === 1
              ? "absolute z-50 bg-[#FFC72C] text-white shadow-[0_0_0_6px_rgba(255,199,44,0.95)]"
              : "bg-[#FFC72C] text-white"
          }`}
            onClick={() => !isTutorial && setSidebarOpen(true)}
            disabled={isTutorial}
          >
            Daftar Soal
          </button>

          {/* SIDEBAR (STEP 2) */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            questions={questions}
            answers={answers}
            onSelectQuestion={setIndex}
            selectedQuestion={index}
            visitedQuestions={visitedQuestions}
          />

          {/* HEADER */}
          <div className="w-full bg-[#1A5A9A] rounded-b-2xl flex justify-center py-[130px]">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mt-[-90px]">
              TEST PSIKOTES
            </h1>
          </div>

          {/* MAIN CARD */}
          <div className="relative w-[90%] md:w-[80%] lg:w-[70%] bg-[#F5F5F5] rounded-xl shadow-md py-16 px-10 mt-[-90px]">
            {/* TIMER (STEP 3) */}
            <div
              className={`absolute top-9 right-8
            ${
              isTutorial && tutorialStep === 3
                ? "absolute z-50 bg-white rounded-md shadow-[0_0_0_6px_rgba(255,199,44,0.95)]"
                : ""
            }`}
            >
              <Timer
                visualDeadline={visualDeadline}
                // onTimeUp={onTimeUp}
              />
            </div>

            {/* QUESTION */}
            <p className="absolute top-9 left-8 text-xl">
              Pertanyaan No. {q.number}
            </p>

            {/* OPTIONS (STEP 4) */}
            <div className="mt-16 space-y-8">
              {[
                { label: "A", text: q?.A, value: "a" },
                { label: "B", text: q?.B, value: "b" },
              ].map((opsi) => {
                const isSelected = answers[q?.number] === opsi.value;

                return (
                  <div
                    key={opsi.value}
                    onClick={() => onAnswer(q?.number, opsi.value)}
                    className={`flex items-start gap-4 p-5 rounded-lg cursor-pointer transition
          
          ${
            isTutorial && tutorialStep === 4
              ? "relative z-50 bg-white shadow-[0_0_0_6px_rgba(255,199,44,0.9)]"
              : isSelected
                ? "bg-[#1A5A9A] text-white"
                : "bg-white text-[#010E2B]"
          }
        `}
                  >
                    <input
                      type="radio"
                      checked={isSelected}
                      readOnly
                      className="mt-1 h-5 w-5 accent-[#1A5A9A]"
                    />
                    <p className="text-lg font-medium">{opsi.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* NAV BUTTONS (STEP 5) */}
          <div
            className={`w-[90%] md:w-[70%]
    ${
      isTutorial && tutorialStep === 5
        ? "relative z-50 mt-[-130px] md:mt-8"
        : "mt-8"
    }
  `}
          >
            <div className="flex flex-row gap-4 md:gap-0 md:justify-between">
              {/* BACK */}
              <button
                className={`w-1/2 md:w-[30%] py-3 rounded-lg transition-all
        ${
          isTutorial && tutorialStep === 5
            ? "relative z-50 bg-gray-500/60 text-white shadow-[0_0_0_6px_rgba(255,199,44,0.95)] md:ml-[-90px]"
            : "bg-gray-500/60 text-white"
        }`}
                disabled={isTutorial}
                onClick={prev}
              >
                Back
              </button>

              {/* NEXT */}
              <button
                className={`w-1/2 md:w-[30%] py-3 rounded-lg transition-all
        ${
          isTutorial && tutorialStep === 5
            ? "relative z-50 bg-[#FF9533] text-white shadow-[0_0_0_6px_rgba(255,199,44,0.95)] md:mr-[-90px]"
            : "bg-[#FF9533] text-white"
        }`}
                disabled={isTutorial}
                onClick={index === questions.length - 1 ? onSubmit : next}
              >
                {isSaving
                  ? "Saving..."
                  : index === questions.length - 1
                    ? "Submit"
                    : "Next"}
              </button>
            </div>
          </div>

          {/* DISCLAIMER */}
          <div className="w-full mt-10 text-center mb-5 border-t border-gray-300 pt-4">
            <h3 className="text-[#F94326] text-2xl font-semibold">
              Disclaimer!
            </h3>
            <p className="text-[#414141] text-lg mt-1">
              Apabila waktu sudah habis maka akan otomatis tersimpan oleh sistem
            </p>
          </div>
        </div>

        {/* versi lama */}
      </>
    );
  },
);
