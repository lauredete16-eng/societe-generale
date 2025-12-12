/**
 * Génère et télécharge des documents bancaires au format texte
 * @param {string} type - Type de document : 'rib', 'attestation', ou 'releve'
 * @param {object} currentUser - Objet contenant les informations de l'utilisateur
 */
export const downloadDocument = (type, currentUser) => {
  const today = new Date().toLocaleDateString('fr-FR');
  let content = '';
  let filename = '';

  if (type === 'rib') {
    filename = `RIB_${currentUser.nom.trim().replace(/\s+/g, '_')}.txt`;
    content = generateRIB(currentUser, today);
  } else if (type === 'attestation') {
    filename = `Attestation_${currentUser.nom.trim().replace(/\s+/g, '_')}.txt`;
    content = generateAttestation(currentUser, today);
  } else if (type === 'releve') {
    filename = `Releve_${currentUser.nom.trim().replace(/\s+/g, '_')}.txt`;
    content = generateReleve(currentUser, today);
  }

  // Création et téléchargement du fichier
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Génère le contenu du RIB (Relevé d'Identité Bancaire)
 */
const generateRIB = (user, date) => {
  return `
╔════════════════════════════════════════════════════════════╗
║          RELEVÉ D'IDENTITÉ BANCAIRE (RIB)                  ║
╚════════════════════════════════════════════════════════════╝

SOCIÉTÉ GÉNÉRALE
----------------------------------------

TITULAIRE DU COMPTE
Nom : ${user.nom}
Adresse : ${user.adresse}

COORDONNÉES BANCAIRES
Code Banque : 30003
Code Guichet : 03620
Numéro de compte : ${user.numeroComplet.replace(/\s/g, '')}
Clé RIB : 47

IBAN : FR76 3000 3036 20${user.numeroComplet.replace(/\s/g, '').slice(-10)} 47
BIC/SWIFT : SOGEFRPP

Date d'édition : ${date}

Ce document certifie l'exactitude des coordonnées bancaires
du compte mentionné ci-dessus.

________________________________________________________
Ce RIB est valable pour tous vos prélèvements et virements.
`;
};

/**
 * Génère le contenu de l'attestation de compte bancaire
 */
const generateAttestation = (user, date) => {
  return `
╔════════════════════════════════════════════════════════════╗
║           ATTESTATION DE COMPTE BANCAIRE                   ║
╚════════════════════════════════════════════════════════════╝

SOCIÉTÉ GÉNÉRALE
Siège social : 29 Boulevard Haussmann, 75009 Paris
RCS Paris 552 120 222

----------------------------------------

La Société Générale atteste que :

${user.nom}
Résidant : ${user.adresse}

est titulaire d'un compte bancaire ouvert dans nos livres :

Numéro de compte : •••• ${user.carte}
Type de compte : Compte Courant
Date d'ouverture : 15/03/2020
Statut du compte : ${user.compteBloque ? 'Temporairement bloqué' : 'Actif'}

PRODUITS ASSOCIÉS
- Carte bancaire CB Gold Evolution
- Découvert autorisé : ${user.decouvertAutorise.toLocaleString('fr-FR')} €
- Services bancaires en ligne

Cette attestation est délivrée à la demande de l'intéressé(e)
pour faire valoir ce que de droit.

Fait à Paris, le ${date}

________________________________________________________
Document authentique généré électroniquement
Service Client : 09 69 39 99 00
`;
};

/**
 * Génère le contenu du relevé de compte
 */
const generateReleve = (user, date) => {
  return `
╔════════════════════════════════════════════════════════════╗
║              RELEVÉ DE COMPTE BANCAIRE                     ║
╚════════════════════════════════════════════════════════════╝

SOCIÉTÉ GÉNÉRALE
Relevé du ${date}

----------------------------------------

TITULAIRE : ${user.nom}
COMPTE N° : •••• ${user.carte}
PÉRIODE : Décembre 2024

========================================
SOLDE ET DÉCOUVERT
========================================

Solde actuel : ${user.solde.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
Découvert autorisé : ${user.decouvertAutorise.toLocaleString('fr-FR')} €
Découvert utilisé : ${user.decouvertUtilise.toLocaleString('fr-FR')} €

========================================
DERNIÈRES OPÉRATIONS
========================================

Date       | Libellé                      | Débit    | Crédit
-----------|------------------------------|----------|----------
05/12/2024 | Virement reçu SALAIRE        |          | 3 500,00 €
04/12/2024 | Achat CB CARREFOUR           | 125,50 € |
03/12/2024 | Prélèvement EDF              | 89,00 €  |
02/12/2024 | Retrait DAB SG PARIS         | 200,00 € |
01/12/2024 | Achat CB AMAZON              | 67,99 €  |

========================================
INFORMATIONS CARTE BANCAIRE
========================================

Type : CB Gold Evolution
Numéro : •••• •••• •••• ${user.carte}
Expiration : ${user.exp}
Plafond paiement : 300 000,00 €
Plafond retrait : 50 000,00 €

========================================

Pour toute réclamation : serviceclient@socgen.fr
Numéro d'urgence 24h/24 : +33 (0)9 69 39 99 00

________________________________________________________
Document confidentiel - À conserver précieusement
`;
};