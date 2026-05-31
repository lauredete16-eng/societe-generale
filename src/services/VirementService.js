// VirementService.js - VERSION FIREBASE FIRESTORE (sans emails ni blocage auto)
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

export const STATUT_VIREMENT = {
  EN_ATTENTE: "en_attente",
  EN_COURS:   "en_cours",
  VALIDATION: "validation",
  ANNULE:     "annule"
};

export class VirementService {

  // ─── Charger les virements ───────────────────────────────────────
  static async chargerVirements(code) {
    try {
      const q = query(
        collection(db, "virements"),
        where("numeroCompte", "==", code)
      );
      const snap = await getDocs(q);
      const virements = snap.docs.map(d => ({ id: d.id, ...d.data() }));

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
      return virementAvecId;
    } catch (error) {
      console.error("❌ Erreur creerVirement:", error);
      return null;
    }
  }

  // ─── Calculer progression ────────────────────────────────────────
  static calculerProgression(virement) {
    const maintenant   = new Date();
    const creation     = new Date(virement.dateCreation);
    const tempsEcoule  = maintenant - creation;
    // Progression sur 10 minutes (600 000 ms), plafonnée à 98 %
    const tempsTotal   = 10 * 60 * 1000;
    const pourcentage  = Math.floor((tempsEcoule / tempsTotal) * 98);
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

  // ─── Mettre à jour la progression (sans blocage) ─────────────────
  static async mettreAJourProgression(code) {
    const virements = await this.chargerVirements(code);
    let modifie = false;

    for (const virement of virements) {
      if (virement.statut === STATUT_VIREMENT.ANNULE) continue;

      const nouveauPourcentage = this.calculerProgression(virement);

      if (nouveauPourcentage !== virement.pourcentageProgression) {
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

  // ─── Annuler un virement ─────────────────────────────────────────
  static async annulerVirement(virementId, virement) {
    return this.mettreAJourStatut(
      virementId,
      STATUT_VIREMENT.ANNULE,
      0,
      "Virement annulé",
      virement
    );
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

  static getStatutLibelle(statut, pourcentage) {
    switch (statut) {
      case STATUT_VIREMENT.EN_ATTENTE: return { label: `En attente (${pourcentage}%)`, color: "blue" };
      case STATUT_VIREMENT.EN_COURS:   return { label: `En cours (${pourcentage}%)`,   color: "orange" };
      case STATUT_VIREMENT.VALIDATION: return { label: `Validation (${pourcentage}%)`, color: "yellow" };
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