// UserService.js

import { db } from "../firebase";

import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export const DB_VERSION = 2;

export const getDBVersion = () => DB_VERSION;

// =====================================================
// COLLECTION FIRESTORE
// =====================================================

const USERS_COLLECTION = "users";

// =====================================================
// DONNÉES INITIALES
// =====================================================

export const usersDB = {
  "12345678": {
    nom: "Dubois",
    prenom: "Christine",
    identifiant: "12345678",
    codeSecret: "000000",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 4000000,
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
    montantDeblocage: 100,
    devise: "$",
    transactions: [],
    virements: [],
  },

  "02345679": {
    nom: "DURAND",
    prenom: "ELISABETH",
    identifiant: "02345679",
    codeSecret: "000001",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 286000,
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
    montantDeblocage: 15000,
    devise: "$",
    transactions: [],
    virements: [],
  },

  "07014860": {
    nom: "Leveque",
    prenom: "Fabrice",
    identifiant: "07014860",
    codeSecret: "260823",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 300978000.1,
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
    montantDeblocage: 0,
    devise: "$",
    transactions: [],
    virements: [],
  },

  "22232425": {
    nom: "Roussel",
    prenom: "Alexandre",
    identifiant: "22232425",
    codeSecret: "260823",
    numeroCompte: "FR76 1744 8000 0200 1674 7155 507",
    solde: 1000000,
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
    montantDeblocage: 12000,
    devise: "$",
    transactions: [],
    virements: [],
  },

  "22232426": {
    nom: "Bisson",
    prenom: "Alex",
    identifiant: "22232426",
    codeSecret: "260824",
    numeroCompte: "FR76 1744 8000 0200 1874 7255 507",
    solde: 1000000,
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
    montantDeblocage: 1200,
    devise: "$",
    transactions: [],
    virements: [],
  },

  "22232427": {
    nom: "Rousseau",
    prenom: "Alexandre",
    identifiant: "22232427",
    codeSecret: "260823",
    numeroCompte: "FR76 1744 8000 0200 1671 7152 507",
    solde: 1000000,
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
    montantDeblocage: 10000,
    devise: "$",
    transactions: [],
    virements: [],
  },

  "56789012": {
    nom: "Pierre",
    prenom: "Martin",
    identifiant: "56789012",
    codeSecret: "123456",
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
    montantDeblocage: 50,
    devise: "$",
    transactions: [],
    virements: [],
  },

  "9999": {
    nom: "Lefebvre",
    prenom: "Sophie",
    identifiant: "9999",
    codeSecret: "2222",
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
    montantDeblocage: 80,
    devise: "$",
    transactions: [],
    virements: [],
  },

  // =====================================================
  // NOUVEL UTILISATEUR
  // =====================================================

  "48291573": {
    nom: "Mureau Gordon",
    prenom: "Nicolas",
    identifiant: "48291573",
    codeSecret: "260829",

    numeroCompte: "SG-48291573",

    solde: 8200000,

    email: "",
    telephone: "",
    adresse: "",

    carte: "0000",
    numeroComplet: "2345 3450 2456 4768",
    exp: "12/30",

    decouvertAutorise: 0,
    decouvertUtilise: 0,

    compteBloque: true,

    notifications: 0,
    montantDeblocage: 0,

    devise: "€",

    transactions: [],
    virements: [],
  },
};

// =====================================================
// INITIALISATION FIRESTORE
// =====================================================

export const initialiserUtilisateurs = async () => {
  try {
    console.log(
      "🔄 Initialisation des utilisateurs dans Firestore..."
    );

    for (const [identifiant, user] of Object.entries(usersDB)) {
      const userRef = doc(
        db,
        USERS_COLLECTION,
        identifiant
      );

      await setDoc(userRef, {
        ...user,
        identifiant,
        codeSecret: user.codeSecret,
        montantDeblocage:
          user.montantDeblocage ?? 0,
      });

      console.log(
        `✅ Utilisateur ${user.nom} enregistré`
      );
    }

    console.log(
      "🎉 Utilisateurs Firestore initialisés !"
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Erreur initialisation Firestore :",
      error
    );

    return false;
  }
};

// =====================================================
// RÉCUPÉRER UN UTILISATEUR PAR IDENTIFIANT
// =====================================================

export const getUser = async (identifiant) => {
  try {
    const identifiantNormalise =
      String(identifiant).trim();

    const userRef = doc(
      db,
      USERS_COLLECTION,
      identifiantNormalise
    );

    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return {
        ...snap.data(),
        identifiant:
          snap.data().identifiant ||
          identifiantNormalise,
      };
    }

    console.warn(
      `⚠️ Aucun utilisateur avec l'identifiant : ${identifiantNormalise}`
    );

    return null;
  } catch (error) {
    console.error(
      "❌ Erreur getUser :",
      error
    );

    return null;
  }
};

// =====================================================
// CONNEXION
// IDENTIFIANT CLIENT + CODE SECRET
// =====================================================

export const loginUser = async (
  identifiant,
  codeSecret
) => {
  try {
    const identifiantNormalise =
      String(identifiant).trim();

    const codeNormalise =
      String(codeSecret).trim();

    console.log(
      `🔍 Recherche utilisateur : ${identifiantNormalise}`
    );

    const user = await getUser(
      identifiantNormalise
    );

    if (!user) {
      console.log(
        "❌ Identifiant client introuvable"
      );

      return null;
    }

    if (
      String(user.codeSecret).trim() !==
      codeNormalise
    ) {
      console.log(
        "❌ Code secret incorrect"
      );

      return null;
    }

    console.log(
      `✅ Connexion réussie : ${user.nom}`
    );

    return user;
  } catch (error) {
    console.error(
      "❌ Erreur loginUser :",
      error
    );

    return null;
  }
};

// =====================================================
// VÉRIFIER SI UN IDENTIFIANT EXISTE
// =====================================================

export const identifierExists = async (
  identifiant
) => {
  try {
    const user = await getUser(
      identifiant
    );

    return !!user;
  } catch (error) {
    console.error(
      "❌ Erreur identifierExists :",
      error
    );

    return false;
  }
};

// =====================================================
// VÉRIFIER SI UN NUMÉRO EXISTE
// =====================================================

export const phoneExists = async (
  numero
) => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("numero", "==", numero)
    );

    const snap = await getDocs(q);

    return !snap.empty;
  } catch (error) {
    console.error(
      "❌ Erreur phoneExists :",
      error
    );

    return false;
  }
};

// =====================================================
// METTRE À JOUR LE SOLDE
// =====================================================

export const updateSolde = async (
  identifiant,
  nouveauSolde
) => {
  try {
    await updateDoc(
      doc(
        db,
        USERS_COLLECTION,
        String(identifiant)
      ),
      {
        solde: Number(nouveauSolde),
      }
    );

    console.log(
      `💰 Solde mis à jour : ${identifiant} → ${nouveauSolde}`
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Erreur updateSolde :",
      error
    );

    return false;
  }
};

// =====================================================
// METTRE À JOUR LE MONTANT DE DÉBLOCAGE
// =====================================================

export const setMontantDeblocage = async (
  identifiant,
  montant
) => {
  try {
    await updateDoc(
      doc(
        db,
        USERS_COLLECTION,
        String(identifiant)
      ),
      {
        montantDeblocage: Number(montant),
      }
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Erreur setMontantDeblocage :",
      error
    );

    return false;
  }
};

// =====================================================
// RÉCUPÉRER LE MONTANT DE DÉBLOCAGE
// =====================================================

export const getMontantDeblocage = async (
  identifiant
) => {
  const user = await getUser(identifiant);

  return user?.montantDeblocage ?? 0;
};

// =====================================================
// METTRE À JOUR UN UTILISATEUR
// =====================================================

export const updateUser = async (
  identifiant,
  data
) => {
  try {
    await updateDoc(
      doc(
        db,
        USERS_COLLECTION,
        String(identifiant)
      ),
      data
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Erreur updateUser :",
      error
    );

    return false;
  }
};

// =====================================================
// TOUS LES UTILISATEURS
// =====================================================

export const getAllUsers = async () => {
  try {
    const snap = await getDocs(
      collection(db, USERS_COLLECTION)
    );

    return snap.docs.map((d) => ({
      ...d.data(),
      identifiant:
        d.data().identifiant || d.id,
    }));
  } catch (error) {
    console.error(
      "❌ Erreur getAllUsers :",
      error
    );

    return [];
  }
};

console.log(
  `🔄 UserService Firebase chargé - Version ${DB_VERSION}`
);