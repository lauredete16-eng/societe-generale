// UserService.js - VERSION AVEC SYSTÈME DE VERSIONING

// 🔄 INCRÉMENTEZ CE NUMÉRO À CHAQUE MODIFICATION (1, 2, 3, 4...)
export const DB_VERSION = 3;

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
    solde:286000.0,
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
    montantDeblocage: null  
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

// Log automatique de la version au chargement
console.log(`🔄 UserService chargé - Version ${DB_VERSION}`);
console.log(`📊 Nombre d'utilisateurs: ${Object.keys(usersDB).length}`);
console.log(`🔑 Codes disponibles:`, Object.keys(usersDB));

// Récupérer un utilisateur par code ou numéro de compte
export const loginUser = (code) => {
  console.log(`🔍 Tentative de connexion avec le code: ${code}`);
  const user = usersDB[code] || null;
  console.log(user ? `✅ Utilisateur trouvé: ${user.nom}` : `❌ Aucun utilisateur avec ce code`);
  return user;
};

// Récupérer le montant de déblocage d'un utilisateur
export const getMontantDeblocage = (code) => {
  const user = usersDB[code];
  return user ? user.montantDeblocage : 0;
};

// Mettre à jour le montant de déblocage pour un utilisateur
export const setMontantDeblocage = (code, montant) => {
  if (usersDB[code]) {
    usersDB[code].montantDeblocage = montant;
    return true;
  }
  return false;
};

// Obtenir la version de la base de données
export const getDBVersion = () => DB_VERSION;

// Obtenir tous les utilisateurs (pour debug)
export const getAllUsers = () => {
  return Object.entries(usersDB).map(([code, user]) => ({
    code,
    nom: user.nom,
    email: user.email
  }));
};