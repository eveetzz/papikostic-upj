import React from "react";
import * as XLSX from "xlsx";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../firebase";

export const importUsers = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(ws));
      } catch (err) {
        reject(new Error("Gagal membaca format Excel."));
      }
    };
    reader.readAsArrayBuffer(file);
  });
};

export const checkExistingUsers = async (data) => {
  // Terima parameter 'data'
  if (!data || data.length === 0) return [];

  const emailsInFile = data
    .map((item) => item.Email?.toLowerCase().trim())
    .filter(Boolean);

  const batchSize = 30;
  let existingEmailsInFirestore = [];

  for (let i = 0; i < emailsInFile.length; i += batchSize) {
    const batch = emailsInFile.slice(i, i + batchSize);
    const q = query(collection(db, "users"), where("email", "in", batch));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      existingEmailsInFirestore.push(doc.data().email.toLowerCase().trim());
    });
  }
  return data.map((item) => ({
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    isDuplicate: existingEmailsInFirestore.includes(
      item.Email?.toLowerCase().trim(),
    ),
  }));
};

export const generateRandomPassword = (
  name = "user",
  timeStamp = Date.now(),
) => {
  const firstLetter = name
    .trim()
    .replace(/\s+/g, "")
    .substring(0, 3)
    .toLowerCase();

  const date = new Date(Number(timeStamp));
  const validDate = isNaN(date.getTime()) ? new Date() : date;

  const dateRegistered = `${validDate.getFullYear()}${String(validDate.getMonth() + 1).padStart(2, "0")}${String(validDate.getDate()).padStart(2, "0")}`;

  return `${firstLetter}${"."}${dateRegistered}`;
};
