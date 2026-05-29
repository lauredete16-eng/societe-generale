// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDdssksSiBtzzHV_7NnG7Z0en9twUljnXM",
  authDomain: "projet-sg-e9bc0.firebaseapp.com",
  projectId: "projet-sg-e9bc0",
  storageBucket: "projet-sg-e9bc0.firebasestorage.app",
  messagingSenderId: "914971251615",
  appId: "1:914971251615:web:6c253162988f89344fe3aa"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);