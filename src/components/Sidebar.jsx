import React, { memo } from "react";

export const Sidebar = memo(
  ({
    questions =[],
    answers={},
    isOpen,
    onClose,
    visitedQuestions=[],
    onSelectQuestion,
    selectedQuestion,
  }) => {
    return (
      <>
        <div
          className={`fixed top-0 left-0 h-full w-[360px] bg-white bg-opacity-95 shadow-lg z-50 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold"
          >
            X
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold text-center mt-6 mb-4">
            Daftar Soal
          </h2>

          {/* Grid of Questions */}
          <div className="grid grid-cols-5 gap-4 p-4 overflow-y-auto h-[calc(100%-100px)]">
            {questions.map((q, index) => {
              const isAnswered = answers[q.number] !== undefined;
              const isSelected = selectedQuestion === index;
              const isVisited = visitedQuestions.includes(q.number) || false;

              let bgColor = "bg-gray-300 text-black";

              if (isSelected) {
                bgColor = "bg-yellow-400 text-white";
              } else if (isAnswered) {
                bgColor = "bg-[#1A5A9A] text-white";
              } else if (isVisited) {
                bgColor = "bg-red-500 text-white";
              }

              return (
                <button
                  key={q.number}
                  onClick={() => onSelectQuestion(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${bgColor}`}
                >
                  {q.number}
                </button>
              );
            })}
          </div>
        </div>
        {/* <div className="p-4 grid grid-cols-4 gap-3 overflow-y-auto h-[calc(100%-70px)]">
          {questions.map((item, idx) => {
            const isSelected = currrentIndex === idx;
            const isAnswered = !!answers[item.number];

            return (
              <button
                key={item.number}
                className={`border rounded-md py-2 text-sm font-semibold transition ${
                  isSelected
                    ? "bg-[#1A5A9A] text-white"
                    : isAnswered
                    ? "bg-green-500 text-white"
                    : "bg-white hover:bg-blue-50"
                }`}
                onClick={() => {
                  onJumpToIndex(idx);
                }}
              >
                {item.number}
              </button>
            );
          })}
        </div> */}
      </>
    );
  },
);
