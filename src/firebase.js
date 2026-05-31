// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBD5hyUtfswOUH-VPTtR8USq4_aziQ7LWI",
  authDomain: "projet-sg-7e34e.firebaseapp.com",
  projectId: "projet-sg-7e34e",
  storageBucket: "projet-sg-7e34e.firebasestorage.app",
  messagingSenderId: "283842651601",
  appId: "1:283842651601:web:66ced1765a4e13499bacf0",
  measurementId: "G-F26D56P40V"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);