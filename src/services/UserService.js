export const usersDB = {
  "12345678": {
    nom: "Dubois Christine",
    solde: 4000000.0,
    email: "christine.dubois@email.com",
    telephone: "+33 6 12 34 56 78",
    adresse: "12 Rue de la République, 75001 Paris",
    carte: "4567",
    decouvertAutorise: 500,
    decouvertUtilise: 0,
    compteBloque: true,
    notifications: 2,
    password:'000000'
  },
  "56789012": {
    nom: "Martin Pierre",
    solde: 15230.5,
    email: "pierre.martin@email.com",
    telephone: "+33 6 98 76 54 32",
    adresse: "45 Avenue des Champs, 69002 Lyon",
    carte: "8901",
    decouvertAutorise: 1000,
    decouvertUtilise: 0,
    compteBloque: false,
    notifications: 0,
    password:'1234'
  },
  "9999": {
    nom: "Lefebvre Sophie",
    solde: 8750.25,
    email: "sophie.lefebvre@email.com",
    telephone: "+33 6 45 67 89 10 ",
    adresse: "78 Rue Victor Hugo, 33000 Bordeaux",
    carte: "2345",
    decouvertAutorise: 750,
    decouvertUtilise: 150,
    compteBloque: false,
    notifications: 1,
    password:'2222'
  }
};

export const loginUser = (code) => {
  return usersDB[code] || null;
};
