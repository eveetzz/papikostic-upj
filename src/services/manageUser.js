import { uid } from "chart.js/helpers";
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

export const addUser = async (name, email, password, role) => {
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

    // Baru simpan ke Firestore setelah Auth dipastikan sukses
    await setDoc(doc(db, "users", newUid), {
      email: email.toLowerCase().trim(),
      displayName: name,
      role: role,
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

// export const addUser = async (name, email, password, role) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password,
//     );

//     await updateProfile(userCredential.user, {
//       displayName: name,
//     });

//     await setDoc(doc(db, "users", userCredential.user.uid), {
//       email,
//       displayName: name,
//       role: role, //by default
//       examStatus: "-",
//       examStartTime: null,
//       examEndTime: null,
//       createdAt: Date.now(),
//     });
//     return { success: true, user: userCredential.user };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// };
