import React, { useState } from "react";
import { FormQuestion } from "../components/exam/FormQuestion";

import { useNavigate } from "react-router-dom";
import { TutorialOverlay } from "../components/exam/TutorialOverlay";

export const TutorialScreen = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const mockQuestions = [
    { number: 1, A: "Jawaban A Contoh", B: "Jawaban B Contoh" },
  ];

  const finishTutorial = () => {
    localStorage.setItem("tutorialDone", "true");
    navigate("/index");
  };
  return (
    <>
      <FormQuestion
        answers={{}}
        questions={mockQuestions}
        isTutorial
        tutorialStep={step}
        openSidebar={step === 2}
        visitedQuestions={[]}
      />
      <TutorialOverlay
        step={step}
        onNext={() => {
          if (step < 5) setStep(step + 1);
          else finishTutorial();
        }}
        onBack={() => {
          if (step > 1) setStep(step - 1);
        }}
        onSkip={finishTutorial}
      />
    </>
  );
};
