// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBw4WB2yWSJg4EOF-sQksL5--04-2roZCI",
  authDomain: "societe1-8ffe6.firebaseapp.com",
  projectId: "societe1-8ffe6",
  storageBucket: "societe1-8ffe6.firebasestorage.app",
  messagingSenderId: "207310869055",
  appId: "1:207310869055:web:e825a0744117d1f4949e8a",
  measurementId: "G-MX5VLZH8C4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);