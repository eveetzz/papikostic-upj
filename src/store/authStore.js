import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";

export const register = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      displayName: name,
      role: "user", //by default
      examStatus: "-",
      examStartTime: null,
      examEndTime: null,
      createdAt: Date.now(),
    });
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const login = async (email, password) => {
  try {

    await setPersistence(auth, browserSessionPersistence);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const snap = await getDoc(doc(db, "users", userCredential.user.uid));
    let role = "user";

    if (snap.exists()) {
      role = snap.data().role || "user";
    }

    return { success: true, user: userCredential.user, role: role };
  } catch (error) {
    // return { success: false, error: error.message };
    throw error
  }
};

export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { success: true, user: result.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("tutorialDone");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkAuth = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      callback(null, null);
      return;
    }
    try {
      const snap = doc(db, "users", user.uid);
      const ref = await getDoc(snap);
      callback(user, ref);
    } catch (error) {
      console.error("Error fetch doc:", error);
      callback(user, null); // user ada tapi gagal ambil role
    }
  });
};
