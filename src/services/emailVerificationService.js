// src/services/emailVerificationService.js
// ─────────────────────────────────────────────────────────────
// Service d'envoi de code de vérification par email via EmailJS
// + stockage temporaire dans Firestore (expiration 10 min)
// ─────────────────────────────────────────────────────────────

import { db } from "../firebase.js";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";

// ─── Config EmailJS ───────────────────────────────────────────
// 1. Crée un compte sur https://www.emailjs.com
// 2. Crée un service email (Gmail, Outlook…) → copie le Service ID
// 3. Crée un template avec les variables : {{prenom}}, {{code}}, {{message}}
//    (utilise le template HTML fourni dans ce projet)
// 4. Copie le Public Key depuis Account > API Keys

const EMAILJS_SERVICE_ID  = "service_k4ziul8";
const EMAILJS_TEMPLATE_ID = "template_ejo6psr";
const EMAILJS_PUBLIC_KEY  = "D7vDC7RcrTFMzROoO";

// Durée d'expiration du code (en millisecondes) → 10 minutes
const CODE_EXPIRY_MS = 10 * 60 * 1000;

// ─── Génère un code à 6 chiffres ─────────────────────────────
const genererCode6Chiffres = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─── Envoie un code de vérification par email ─────────────────
// Contexte : "inscription" | "connexion"
export const envoyerCodeVerification = async (email, prenom, contexte = "inscription") => {
  try {
    const code = genererCode6Chiffres();
    const expireAt = Date.now() + CODE_EXPIRY_MS;

    // 1. Stocker le code dans Firestore (collection "codesVerification")
    //    La clé est l'email encodé pour éviter les caractères spéciaux
    const emailKey = email.trim().toLowerCase().replace(/\./g, "_").replace(/@/g, "__at__");
    await setDoc(doc(db, "codesVerification", emailKey), {
      code,
      email: email.trim().toLowerCase(),
      expireAt,
      contexte,
      createdAt: Date.now(),
    });

    // 2. Préparer le message selon le contexte
    const message =
      contexte === "connexion"
        ? "Voici votre code de vérification pour confirmer votre connexion à votre espace Société Générale."
        : "Voici votre code de vérification pour finaliser la création de votre compte Société Générale.";

    // 3. Envoyer l'email via EmailJS
    //    Les variables {{prenom}}, {{code}}, {{message}}, {{email_to}}
    //    doivent correspondre exactement aux variables dans ton template EmailJS
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        email_to: email.trim().toLowerCase(),
        prenom:   prenom || "Client",
        code,
        message,
      },
      EMAILJS_PUBLIC_KEY
    );

    console.log("✅ Code envoyé à:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur envoi code:", error);
    return { success: false, message: "Impossible d'envoyer le code. Vérifiez votre email." };
  }
};

// ─── Vérifie le code saisi par l'utilisateur ──────────────────
export const verifierCode = async (email, codeSaisi) => {
  try {
    const emailKey = email.trim().toLowerCase().replace(/\./g, "_").replace(/@/g, "__at__");
    const snap = await getDoc(doc(db, "codesVerification", emailKey));

    if (!snap.exists()) {
      return { success: false, message: "Aucun code trouvé. Veuillez en demander un nouveau." };
    }

    const data = snap.data();

    // Vérifier l'expiration
    if (Date.now() > data.expireAt) {
      await deleteDoc(doc(db, "codesVerification", emailKey));
      return { success: false, message: "Code expiré. Veuillez en demander un nouveau.", expired: true };
    }

    // Vérifier le code
    if (data.code !== codeSaisi.trim()) {
      return { success: false, message: "Code incorrect. Vérifiez votre email." };
    }

    // Code valide → supprimer de Firestore (usage unique)
    await deleteDoc(doc(db, "codesVerification", emailKey));
    console.log("✅ Code vérifié pour:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur vérification code:", error);
    return { success: false, message: "Erreur de vérification. Réessayez." };
  }
};