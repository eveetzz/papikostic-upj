import { db, firebaseConfig } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
  where,
} from "firebase/firestore";

export const getUsers = (callback) => {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(users);
  });
};

export const getUserResults = (callback) => {
  const q = query(
    collection(db, "user_results"),
    orderBy("submittedAt", "desc"),
  );
  return onSnapshot(q, (snapshot) => {
    const userResults = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(userResults);
  });
};

export const addUser = async (
  name,
  email,
  password,
  role,
  position,
  company,
) => {
  try {
    const signUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`;
    const signUpRes = await fetch(signUpUrl, {
      method: "POST",
      body: JSON.stringify({
        email: email.toLowerCase().trim(), // Pastikan email bersih
        password,
        returnSecureToken: true,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const signUpData = await signUpRes.json();

    // JIKA AUTH GAGAL, JANGAN LANJUT KE FIRESTORE
    if (!signUpRes.ok) {
      console.error("Auth Error:", signUpData.error.message);
      throw new Error(signUpData.error.message);
    }

    const newUid = signUpData.localId;

    await setDoc(doc(db, "users", newUid), {
      email: email.toLowerCase().trim(),
      displayName: name,
      password: password,
      role: role,
      position: position || "-",
      company: company || "-",
      examStatus: "-",
      examStartTime: null,
      examEndTime: null,
      createdAt: Date.now(),
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const editUser = async (uid, name, email, role) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      email: email,
      displayName: name,
      role: role,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (uid) => {
  try {
    await deleteDoc(doc(db, "users", uid));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateStatusReview = async (uid, newStatus) => {
  try {
    await updateDoc(doc(db, "users", uid), {
      hasReviewed: newStatus,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const resetStatusUser = async (uid) => {
  try {
    // 1. Inisialisasi batch baru
    const batch = writeBatch(db);

    // 2. Daftarkan operasi Update ke dalam batch
    const userRef = doc(db, "users", uid);
    batch.update(userRef, {
      examStatus: "-",
      emailSentAt: null,
    });

    // 2. CARI dokumen di 'user_results' yang field 'uid'-nya cocok
    const resultsRef = collection(db, "user_results");
    const q = query(resultsRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    // 3. Masukkan semua dokumen yang ditemukan ke dalam batch untuk dihapus
    querySnapshot.forEach((document) => {
      batch.delete(document.ref); // Menggunakan document.ref langsung jadi pasti akurat
    });

    // 4. Eksekusi semua operasi sekaligus secara atomik
    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error("Gagal reset user:", error); // Bagus untuk debugging di console
    return { success: false, message: error.message }; // Menggunakan 'message' agar cocok dengan alert sebelumnya
  }
};
