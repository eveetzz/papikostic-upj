import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { LoadingSpinner } from "../LoadingSpinner";

export const ExamGuard = (  ) => {
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const checkExamStatus = async () => {
      const user = auth.currentUser;
      if (!user) return navigate("/login", { replace: true });

      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists()) {
        const data = docSnap.data();

        // check if user has completed the exam
        if (data.examStatus === "completed") {
          alert("Anda Sudah Menyelesaikan Tes");
          navigate("/index");
          return;
        }

        // check if user is taking the exam
        if (data.examStatus === "in_progress" && data.examEndTime) {
          const now = new Date();
          const deadline = data.examEndTime.toDate();

          if (now > deadline) {
            alert("Time is up! thanks for completing the exam");
            navigate("/index");
            return;
          }
        }
      }
      setStatus("allowed");
    };
    checkExamStatus();
  }, [navigate]);

  if (status === "loading") {
    return <LoadingSpinner />;
  }

  return <Outlet/>;
};
