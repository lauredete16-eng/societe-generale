import { db } from "../firebase.js";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";

const EMAILJS_SERVICE_ID  = "service_k4ziul8";
const EMAILJS_TEMPLATE_ID = "template_ejo6psr";
const EMAILJS_PUBLIC_KEY  = "D7vDC7RcrTFMzROoO";

const CODE_EXPIRY_MS = 10 * 60 * 1000;

const genererCode6Chiffres = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const envoyerCodeVerification = async (email, prenom, contexte = "inscription") => {
  try {
    const code = genererCode6Chiffres();
    const expireAt = Date.now() + CODE_EXPIRY_MS;

    const emailKey = email.trim().toLowerCase().replace(/\./g, "_").replace(/@/g, "__at__");
    await setDoc(doc(db, "codesVerification", emailKey), {
      code,
      email: email.trim().toLowerCase(),
      expireAt,
      contexte,
      createdAt: Date.now(),
    });

    const message =
      contexte === "connexion"
        ? "Voici votre code de vérification pour confirmer votre connexion à votre espace Société Générale."
        : "Voici votre code de vérification pour finaliser la création de votre compte Société Générale.";

    // Utilisation de l'API REST directement (pas de dépendance npm)
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          email_to: email.trim().toLowerCase(),
          prenom: prenom || "Client",
          code,
          message,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ EmailJS erreur:", response.status, errText);
      return { success: false, message: "Impossible d'envoyer le code. Vérifiez votre email." };
    }

    console.log("✅ Code envoyé à:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur envoi code:", error);
    return { success: false, message: "Impossible d'envoyer le code. Vérifiez votre email." };
  }
};

export const verifierCode = async (email, codeSaisi) => {
  try {
    const emailKey = email.trim().toLowerCase().replace(/\./g, "_").replace(/@/g, "__at__");
    const snap = await getDoc(doc(db, "codesVerification", emailKey));

    if (!snap.exists()) {
      return { success: false, message: "Aucun code trouvé. Veuillez en demander un nouveau." };
    }

    const data = snap.data();

    if (Date.now() > data.expireAt) {
      await deleteDoc(doc(db, "codesVerification", emailKey));
      return { success: false, message: "Code expiré. Veuillez en demander un nouveau.", expired: true };
    }

    if (data.code !== codeSaisi.trim()) {
      return { success: false, message: "Code incorrect. Vérifiez votre email." };
    }

    await deleteDoc(doc(db, "codesVerification", emailKey));
    console.log("✅ Code vérifié pour:", email);
    return { success: true };
  } catch (error) {
    console.error("❌ Erreur vérification code:", error);
    return { success: false, message: "Erreur de vérification. Réessayez." };
  }
};