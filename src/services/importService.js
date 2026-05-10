import React from "react";
import * as XLSX from "xlsx";
import { collection, getDocs, where, query } from "firebase/firestore";
import { db } from "../firebase";

// export const ImportUsers = async (file) => {
//   // Validasi: Cek apakah file benar-benar ada dan bertipe Blob/File
//   if (!file) {
//     throw new Error("File tidak ditemukan.");
//   }
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();

//     reader.onload = async (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });

//         const firstSheetName = workbook.SheetNames[0];

//         const jsonData = XLSX.utils.sheet_to_json(
//           workbook.Sheets[firstSheetName],
//         );
//         const summary = { success: 0, failed: 0, errors: [] };

//         for (const row of jsonData) {
//           const name = row.Nama; // || row[""] sesuaikan isi string dengan header di file excel
//           const email = row.Email;
//           const password = row.Password.toString();
//           const role = "user";
//           const position = row.Posisi;
//           const company = row.Perusahaan;

//           if (!email) continue;

//           const result = await addUser(
//             name,
//             email,
//             password,
//             role,
//             position,
//             company,
//           );

//           if (result.success) {
//             summary.success++;
//           } else {
//             summary.failed++;
//             summary.errors.push({ email, error: result.error });
//           }
//         }
//         resolve(summary);
//       } catch (error) {
//         reject(error);
//       }
//     };
//     reader.onerror = (error) => reject(error);
//     reader.readAsArrayBuffer(file);
//   });
// };

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
