// UserService.js - VERSION FIREBASE FIRESTORE
import { db } from "../firebase";
import {
  doc, setDoc, getDoc, updateDoc, collection, getDocs
} from "firebase/firestore";

export const DB_VERSION = 8;
export const getDBVersion = () => DB_VERSION;

// =============================================
// DONNÉES INITIALES (pour seeder Firestore)
// =============================================
export const usersDB = {
  "12345678": {
    nom: "Dubois Christine",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 4000000.0,
    email: "christine.dubois@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "12 Rue de la République, 75001 Paris",
    carte: "4567",
    numeroComplet: "4567 8912 3456 7890",
    exp: "12/25",
    decouvertAutorise: 500,
    decouvertUtilise: 0,
    compteBloque: true,
    notifications: 2,
    password: "000000",
    montantDeblocage: 100
  },
  "02345679": {
    nom: "ELISABETH DURAND",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 286000.0,
    email: "elisabeth.durand@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "12 Rue de la République, 75001 Paris",
    carte: "4567",
    numeroComplet: "4567 8912 3456 7890",
    exp: "12/25",
    decouvertAutorise: 500,
    decouvertUtilise: 0,
    compteBloque: true,
    notifications: 2,
    password: "000001",
    montantDeblocage: 15000
  },
  "07014860": {
    nom: "Fabrice Leveque",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 300978000.10,
    email: "fabrice.leveque@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "12 Rue de la République, 75001 Paris",
    carte: "4567",
    numeroComplet: "4567 8912 3456 7890",
    exp: "12/25",
    decouvertAutorise: 500,
    decouvertUtilise: 0,
    compteBloque: false,
    notifications: 2,
    password: "260823",
    montantDeblocage: 0
  },
  "22232425": {
    nom: "Alexandre Roussel",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 1000000.0,
    email: "Alexandreroussel07050@email.com",
    telephone: "+33 7 56 84 42 55",
    adresse: "10 Rue Roger Salengro, 69009 Lyon",
    carte: "4567",
    numeroComplet: "4567 8912 3456 7890",
    exp: "12/25",
    decouvertAutorise: 700,
    decouvertUtilise: 0,
    compteBloque: true,
    notifications: 2,
    password: "260823",
    montantDeblocage: 12000
  },
  "22232426": {
    nom: "Alex Bisson",
    numeroCompte: "FR76 1744 8000 0200 1874 7255 507",
    solde: 1000000.0,
    email: "Alexbissonl07050@email.com",
    telephone: "+33 6 44 67 61 30",
    adresse: "10 Rue Roger Salengro, 69009 Lyon",
    carte: "4567",
    numeroComplet: "4567 8912 3456 7890",
    exp: "12/25",
    decouvertAutorise: 500,
    decouvertUtilise: 0,
    compteBloque: true,
    notifications: 2,
    password: "260824",
    montantDeblocage: 1200
  },
  "22232427": {
    nom: "Alexandre Rousseau",
    numeroCompte: "FR76 1744 8000 0200 1671 7152 507",
    solde: 1000000.0,
    email: "Alexandrerousseau07050@email.com",
    telephone: "+33 7 56 44 42 35",
    adresse: "10 Rue Roger Salengro, 69009 Lyon",
    carte: "4567",
    numeroComplet: "4567 8912 3456 7890",
    exp: "12/25",
    decouvertAutorise: 500,
    decouvertUtilise: 0,
    compteBloque: true,
    notifications: 2,
    password: "260823",
    montantDeblocage: 10000
  },
  "56789012": {
    nom: "Martin Pierre",
    numeroCompte: "FR76 3000 6000 0156 7890 1234 567",
    solde: 15230.5,
    email: "pierre.martin@email.com",
    telephone: "+33 6 98 76 54 32",
    adresse: "45 Avenue des Champs, 69002 Lyon",
    carte: "8901",
    numeroComplet: "8901 2356 9876 1234",
    exp: "08/27",
    decouvertAutorise: 1000,
    decouvertUtilise: 0,
    compteBloque: false,
    notifications: 0,
    password: "123456",
    montantDeblocage: 50
  },
  "9999": {
    nom: "Lefebvre Sophie",
    numeroCompte: "FR76 3000 6000 0199 9988 7766 554",
    solde: 8750.25,
    email: "sophie.lefebvre@email.com",
    telephone: "+33 6 45 67 89 10",
    adresse: "78 Rue Victor Hugo, 33000 Bordeaux",
    carte: "2345",
    numeroComplet: "2345 9988 3322 5511",
    exp: "04/26",
    decouvertAutorise: 750,
    decouvertUtilise: 150,
    compteBloque: false,
    notifications: 1,
    password: "2222",
    montantDeblocage: 80
  }
};

// =============================================
// FIRESTORE : Seeder tous les utilisateurs
// À appeler UNE SEULE FOIS depuis App.jsx
// =============================================
export const initialiserUtilisateurs = async () => {
  try {
    console.log("🔄 Initialisation des utilisateurs dans Firestore...");
    for (const [code, user] of Object.entries(usersDB)) {
      await setDoc(doc(db, "utilisateurs", code), {
        ...user,
        code,
        montantDeblocage: user.montantDeblocage ?? 0
      });
      console.log(`✅ Utilisateur ${user.nom} créé`);
    }
    console.log("🎉 Tous les utilisateurs sont dans Firestore !");
    return true;
  } catch (error) {
    console.error("❌ Erreur initialisation:", error);
    return false;
  }
};

// =============================================
// FIRESTORE : CRUD Utilisateurs
// =============================================

// Récupérer un utilisateur par code
export const getUser = async (code) => {
  try {
    const snap = await getDoc(doc(db, "utilisateurs", code));
    if (snap.exists()) {
      return { ...snap.data(), code };
    }
    console.warn(`⚠️ Aucun utilisateur avec le code: ${code}`);
    return null;
  } catch (error) {
    console.error("❌ Erreur getUser:", error);
    return null;
  }
};

// Connexion : vérifier code + password
export const loginUser = async (code, password) => {
  console.log(`🔍 Tentative de connexion avec le code: ${code}`);
  const user = await getUser(code);
  if (!user) {
    console.log("❌ Utilisateur non trouvé");
    return null;
  }
  if (user.password !== password) {
    console.log("❌ Mot de passe incorrect");
    return null;
  }
  console.log(`✅ Connexion réussie: ${user.nom}`);
  return user;
};

// Mettre à jour le solde
export const updateSolde = async (code, nouveauSolde) => {
  try {
    await updateDoc(doc(db, "utilisateurs", code), { solde: nouveauSolde });
    console.log(`💰 Solde mis à jour pour ${code}: ${nouveauSolde}`);
    return true;
  } catch (error) {
    console.error("❌ Erreur updateSolde:", error);
    return false;
  }
};

// Mettre à jour le montant de déblocage
export const setMontantDeblocage = async (code, montant) => {
  try {
    await updateDoc(doc(db, "utilisateurs", code), { montantDeblocage: montant });
    return true;
  } catch (error) {
    console.error("❌ Erreur setMontantDeblocage:", error);
    return false;
  }
};

// Récupérer le montant de déblocage
export const getMontantDeblocage = async (code) => {
  const user = await getUser(code);
  return user?.montantDeblocage ?? 0;
};

// Mettre à jour n'importe quel champ
export const updateUser = async (code, data) => {
  try {
    await updateDoc(doc(db, "utilisateurs", code), data);
    return true;
  } catch (error) {
    console.error("❌ Erreur updateUser:", error);
    return false;
  }
};

// Tous les utilisateurs (debug)
export const getAllUsers = async () => {
  try {
    const snap = await getDocs(collection(db, "utilisateurs"));
    return snap.docs.map(d => ({ code: d.id, nom: d.data().nom, email: d.data().email }));
  } catch (error) {
    console.error("❌ Erreur getAllUsers:", error);
    return [];
  }
};

console.log(`🔄 UserService Firebase chargé - Version ${DB_VERSION}`);