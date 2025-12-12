// UserService.js - VERSION AVEC MONTANT DE DÉBLOCAGE PAR UTILISATEUR

export const usersDB = {
  "12345678": {
    nom: "Dubois Christine",
    numeroCompte: "FR76 3000 6000 0112 3456 7890 189",
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
    montantDeblocage: 100 // Montant spécifique à l'utilisateur
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

// Récupérer un utilisateur par code ou numéro de compte
export const loginUser = (code) => {
  return usersDB[code] || null;
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
