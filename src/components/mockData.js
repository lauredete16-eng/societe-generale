// Fonction pour formater le nom de la carte
export const formatCardName = (cardType) => {
  const cardTypes = {
    'gold': 'CB Gold Evolution',
    'classic': 'CB Classic',
    'platinum': 'CB Platinum',
    'premier': 'CB Premier',
    'visa': 'Visa Classic',
    'mastercard': 'Mastercard Standard'
  };
  return cardTypes[cardType] || 'CB Gold Evolution';
};

// Fonction pour formater le numéro de carte (masqué)
export const formatCardNumber = (cardNumber) => {
  if (!cardNumber) return '•••• •••• •••• ••••';
  
  // Si c'est un numéro complet (16 chiffres)
  if (cardNumber.length === 16) {
    return `•••• •••• •••• ${cardNumber.slice(-4)}`;
  }
  
  // Si c'est juste les 4 derniers chiffres
  if (cardNumber.length === 4) {
    return `•••• •••• •••• ${cardNumber}`;
  }
  
  return cardNumber;
};

// Fonction pour formater le montant en euros
export const formatAmount = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Fonction pour formater la date
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

// Fonction pour formater la date et l'heure
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

// Fonction pour masquer le numéro de téléphone
export const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Garde les 2 premiers et 2 derniers chiffres
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    return `${cleaned.slice(0, 2)} •• •• •• ${cleaned.slice(-2)}`;
  }
  return phone;
};

// Fonction pour masquer l'email
export const maskEmail = (email) => {
  if (!email) return '';
  
  const [username, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedUsername = username.slice(0, 2) + '***' + username.slice(-1);
  return `${maskedUsername}@${domain}`;
};

// Types de cartes disponibles
export const cardTypes = [
  {
    id: 'gold',
    name: 'CB Gold Evolution',
    description: 'Carte haut de gamme avec assurances voyage',
    plafondMax: 5000,
    retraitMax: 2000,
    color: 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  },
  {
    id: 'platinum',
    name: 'CB Platinum',
    description: 'Carte premium avec services exclusifs',
    plafondMax: 10000,
    retraitMax: 3000,
    color: 'bg-gradient-to-br from-gray-300 to-gray-500'
  },
  {
    id: 'classic',
    name: 'CB Classic',
    description: 'Carte bancaire standard',
    plafondMax: 2000,
    retraitMax: 1000,
    color: 'bg-gradient-to-br from-blue-400 to-blue-600'
  },
  {
    id: 'premier',
    name: 'CB Premier',
    description: 'Carte d\'entrée de gamme',
    plafondMax: 1000,
    retraitMax: 500,
    color: 'bg-gradient-to-br from-green-400 to-green-600'
  }
];

// Liste des pays pour la déclaration de voyage
export const countries = [
  'Espagne', 'Italie', 'Allemagne', 'Royaume-Uni', 'Portugal',
  'Belgique', 'Pays-Bas', 'Suisse', 'Grèce', 'Autriche',
  'États-Unis', 'Canada', 'Maroc', 'Tunisie', 'Sénégal',
  'Côte d\'Ivoire', 'Japon', 'Chine', 'Thaïlande', 'Australie'
];

// Raisons de blocage/verrouillage
export const lockReasons = [
  { value: 'perte', label: 'Perte de la carte' },
  { value: 'vol', label: 'Vol de la carte' },
  { value: 'fraude', label: 'Fraude suspectée' },
  { value: 'securite', label: 'Mesure de sécurité préventive' },
  { value: 'autre', label: 'Autre raison' }
];

// Messages d'information
export const infoMessages = {
  verrouillage: "Le verrouillage temporaire bloque toutes les transactions. Vous pouvez déverrouiller votre carte à tout moment.",
  opposition: "L'opposition est définitive et entraîne l'émission d'une nouvelle carte sous 3 à 5 jours ouvrés.",
  plafond: "Le plafond de paiement est le montant maximum que vous pouvez dépenser par période (jour/semaine/mois).",
  retrait: "La capacité de retrait est le montant maximum que vous pouvez retirer aux distributeurs automatiques par jour.",
  voyage: "Déclarez vos voyages pour éviter le blocage de votre carte lors de transactions à l'étranger.",
  codeSecret: "Votre code secret est strictement confidentiel. Ne le communiquez jamais à personne."
};

// Utilisateur fictif par défaut (pour les tests)
export const mockUser = {
  nom: "Dubois Christine",
  solde: 4000000.0,
  email: "christine.dubois@email.com",
  telephone: "+33 6 12 34 56 78",
  adresse: "12 Rue de la République, 75001 Paris",
  carte: "9527",
  numeroComplet: "4567 8912 3456 9527",
  exp: "12/25",
  cvv: "123",
  cardType: "gold",
  decouvertAutorise: 500,
  decouvertUtilise: 0,
  compteBloque: false,
  notifications: 2,
  plafondPaiement: 3000,
  capaciteRetrait: 1000,
  password: "000000"
};

// Transactions fictives
export const mockTransactions = [
  {
    id: 1,
    date: new Date('2024-12-11T14:30:00'),
    libelle: 'Carrefour Market',
    montant: -45.80,
    type: 'paiement',
    statut: 'effectue'
  },
  {
    id: 2,
    date: new Date('2024-12-10T18:15:00'),
    libelle: 'Station Total',
    montant: -60.00,
    type: 'paiement',
    statut: 'effectue'
  },
  {
    id: 3,
    date: new Date('2024-12-09T12:00:00'),
    libelle: 'Retrait DAB',
    montant: -100.00,
    type: 'retrait',
    statut: 'effectue'
  },
  {
    id: 4,
    date: new Date('2024-12-08T16:45:00'),
    libelle: 'Amazon.fr',
    montant: -89.99,
    type: 'paiement',
    statut: 'effectue'
  },
  {
    id: 5,
    date: new Date('2024-12-05T09:30:00'),
    libelle: 'Virement reçu',
    montant: 1500.00,
    type: 'virement',
    statut: 'effectue'
  }
];

export default {
  formatCardName,
  formatCardNumber,
  formatAmount,
  formatDate,
  formatDateTime,
  maskPhoneNumber,
  maskEmail,
  cardTypes,
  countries,
  lockReasons,
  infoMessages,
  mockUser,
  mockTransactions
};