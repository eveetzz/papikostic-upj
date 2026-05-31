import { doc, writeBatch } from "firebase/firestore";
import React from "react";
import { db } from "../firebase";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendEmail = async (selectedUsersIds, usersData) => {
  try {
    const batch = writeBatch(db);
    const formattedDate = new Date().toLocaleString("id-ID", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const emailPromise = selectedUsersIds.map((id) => {
      const user = usersData.find((user) => user.id === id);

      if (user && user.email) {
        const userRef = doc(db, "users", id);
        batch.update(userRef, {
          emailSentAt: formattedDate,
        });

        const templateParams = {
          to_name: user.displayName,
          to_email: user.email,
          to_password: user.password,
        };

        return emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY,
        );
      }
      return Promise.resolve();
    });

    await Promise.all(emailPromise);

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error bulk email menggunakan EmailJS:", error);
    return {
      success: false,
      error: error.message || "Gagal mengirim beberapa email.",
    };
  }
};
