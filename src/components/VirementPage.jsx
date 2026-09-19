
import React, { useState, useEffect } from "react";

import {
  Power,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  CheckCircle,
  Loader,
  History,
  Download,
} from "lucide-react";

import jsPDF from "jspdf";

import { useAuth } from "../context/AuthContext";
import {
  VirementService,
  STATUT_VIREMENT,
} from "../services/VirementService";

export default function VirementPage() {
  const { currentUser, setCurrentUser } = useAuth();

  const [currentPage, setCurrentPage] = useState("list");
  const [showBeneficiaries, setShowBeneficiaries] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [amount, setAmount] = useState("");
  const [virements, setVirements] = useState([]);
  const [isLoadingVirements, setIsLoadingVirements] = useState(false);

  const soldeCompte = parseFloat(currentUser?.solde) || 0;
  const numeroCompte = currentUser?.numeroCompte || "";

  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      nom: "Van Butsele",
      prenom: "Liege",
      iban: "FR76 1751 5900 0004 1405 4735 344",
      email: "van.butsele@example.com",
      bic: "BNPAFRPP",
      type: "SEPA",
    },
    {
      id: 2,
      nom: "Lamar",
      prenom: "Valerie",
      iban: "FR55 2004 1010 0101 1249 0R02 138",
      email: "valerie.lamar@example.com",
      bic: "SOGEFRPP",
      type: "SEPA",
    },
  ]);

  const [newBeneficiary, setNewBeneficiary] = useState({
    nom: "",
    prenom: "",
    iban: "",
    email: "",
    bic: "",
  });

  // Charger les virements depuis Firestore
  const chargerVirements = async () => {
    if (!currentUser?.numeroCompte) return;

    setIsLoadingVirements(true);

    try {
      const data = await VirementService.chargerVirements(
        currentUser.numeroCompte
      );

      setVirements(data);
    } catch (e) {
      console.error("Erreur chargement virements:", e);
    }

    setIsLoadingVirements(false);
  };

  // Chargement initial
  useEffect(() => {
    if (!currentUser?.numeroCompte) return;

    chargerVirements();
  }, [currentUser?.numeroCompte]);

  // Navigation avec loader
  const showLoadingThenNavigate = (page) => {
    setCurrentPage("loading");

    setTimeout(() => {
      setCurrentPage(page);
    }, 1500);
  };

  // Supprimer bénéficiaire
  const deleteBeneficiary = (id, e) => {
    e.stopPropagation();

    setBeneficiaries(
      beneficiaries.filter((b) => b.id !== id)
    );
  };

  // Sélectionner bénéficiaire
  const handleSelectBeneficiary = (b) => {
    setSelectedBeneficiary(b);

    showLoadingThenNavigate("amount");
  };

  // Ajouter bénéficiaire
  const handleAddBeneficiary = () => {
    const {
      nom,
      prenom,
      iban,
      email,
      bic,
    } = newBeneficiary;

    if (!nom || !prenom || !iban || !email || !bic) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const newBen = {
      id: Date.now(),
      ...newBeneficiary,
      type: "SEPA",
    };

    setBeneficiaries([
      ...beneficiaries,
      newBen,
    ]);

    setSelectedBeneficiary(newBen);

    setNewBeneficiary({
      nom: "",
      prenom: "",
      iban: "",
      email: "",
      bic: "",
    });

    showLoadingThenNavigate("amount");
  };

  // Confirmer le virement
  const handleConfirmAmount = async () => {
    const montantVirement = parseFloat(amount);

    if (!montantVirement || montantVirement <= 0) {
      alert("Veuillez saisir un montant valide.");
      return;
    }

    const soldeReel =
      parseFloat(currentUser?.solde) || 0;

    if (montantVirement > soldeReel) {
      alert(
        `Solde insuffisant. Votre solde : ${soldeReel.toFixed(
          2
        )} € — Montant demandé : ${montantVirement.toFixed(2)} €`
      );

      return;
    }

    try {
      const virement =
        await VirementService.creerVirement({
          numeroCompte: currentUser.numeroCompte,
          expediteurNom: currentUser.nom,
          beneficiaire: selectedBeneficiary,
          montant: montantVirement,
          devise: "EUR",
        });

      if (!virement) {
        alert(
          "Erreur lors de la création du virement. Réessayez."
        );

        return;
      }

      const newSolde =
        soldeReel - montantVirement;

      await setCurrentUser({
        ...currentUser,
        solde: newSolde,
      });

      await chargerVirements();

      showLoadingThenNavigate("success");
    } catch (error) {
      console.error(
        "❌ Erreur virement:",
        error
      );

      alert(
        "Erreur lors de la création du virement : " +
          error.message
      );
    }
  };

  // Annuler un virement
  const annulerVirement = async (virementId) => {
    const virement = virements.find(
      (v) => v.id === virementId
    );

    if (!virement) return;

    if (
      virement.statut ===
      STATUT_VIREMENT.ANNULE
    ) {
      alert("Virement déjà annulé.");
      return;
    }

    if (
      window.confirm(
        "Annuler ce virement ?"
      )
    ) {
      await VirementService.annulerVirement(
        virementId,
        virement
      );

      const newSolde =
        soldeCompte + virement.montant;

      await setCurrentUser({
        ...currentUser,
        solde: newSolde,
      });

      await chargerVirements();

      alert(
        "Virement annulé. Le montant a été recrédité."
      );
    }
  };

  // Supprimer un virement
  const supprimerVirement = async (
    virementId
  ) => {
    if (
      window.confirm(
        "Supprimer ce virement de l'historique ?"
      )
    ) {
      await VirementService.supprimerVirement(
        virementId
      );

      await chargerVirements();
    }
  };

  // Retour à la liste
  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedBeneficiary(null);
    setAmount("");

    chargerVirements();
  };

  // Déconnexion
  const handleLogout = () => {
    window.location.href = "/login";
  };

  // Télécharger le reçu PDF
  const telechargerRecu = async (virement) => {
    try {
      const doc = new jsPDF();

      // Charger le logo depuis public/images
      const response = await fetch(
        "/images/logo sg.jpg"
      );

      if (response.ok) {
        const blob = await response.blob();

        const logoData =
          await new Promise(
            (resolve, reject) => {
              const reader =
                new FileReader();

              reader.onloadend = () =>
                resolve(reader.result);

              reader.onerror = reject;

              reader.readAsDataURL(blob);
            }
          );

        // Logo
        doc.addImage(
          logoData,
          "JPEG",
          75,
          10,
          60,
          25
        );
      }

      // Titre
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(16);

      doc.text(
        "Reçu de virement",
        105,
        50,
        {
          align: "center",
        }
      );

      // Ligne rouge
      doc.setDrawColor(
        230,
        0,
        40
      );

      doc.setLineWidth(1);

      doc.line(
        20,
        58,
        190,
        58
      );

      // Numéro du virement
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(11);

      doc.text(
        `N° du virement : ${virement.id}`,
        20,
        72
      );

      // Montant
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(22);

      const montant =
        Number(
          virement.montant || 0
        ).toLocaleString(
          "fr-FR",
          {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }
        );

      doc.text(
        `${montant} ${
          virement.devise || "EUR"
        }`,
        105,
        92,
        {
          align: "center",
        }
      );

      // Informations
      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(11);

      let y = 115;

      const ajouterLigne = (
        label,
        valeur
      ) => {
        doc.setFont(
          "helvetica",
          "bold"
        );

        doc.text(
          label,
          20,
          y
        );

        doc.setFont(
          "helvetica",
          "normal"
        );

        doc.text(
          String(valeur || ""),
          75,
          y
        );

        doc.setDrawColor(
          230,
          230,
          230
        );

        doc.line(
          20,
          y + 4,
          190,
          y + 4
        );

        y += 16;
      };

      ajouterLigne(
        "Expéditeur",
        virement.expediteurNom
      );

      ajouterLigne(
        "Compte",
        virement.numeroCompte
      );

      ajouterLigne(
        "Bénéficiaire",
        `${virement.beneficiaire?.prenom || ""} ${
          virement.beneficiaire?.nom || ""
        }`
      );

      ajouterLigne(
        "IBAN",
        virement.beneficiaire?.iban
      );

      ajouterLigne(
        "BIC",
        virement.beneficiaire?.bic ||
          "N/A"
      );

      ajouterLigne(
        "Date",
        new Date(
          virement.dateCreation
        ).toLocaleString(
          "fr-FR"
        )
      );

      // Pied de page
      doc.setFontSize(9);

      doc.setTextColor(
        100,
        100,
        100
      );

      doc.text(
        "SOCIÉTÉ GÉNÉRALE — 29 Boulevard Haussmann, 75009 Paris",
        105,
        245,
        {
          align: "center",
        }
      );

      doc.text(
        `Document généré le ${new Date().toLocaleString(
          "fr-FR"
        )}`,
        105,
        253,
        {
          align: "center",
        }
      );

      // Télécharger le PDF
      doc.save(
        `Recu_${virement.id}.pdf`
      );
    } catch (error) {
      console.error(
        "Erreur génération du reçu PDF :",
        error
      );

      alert(
        "Impossible de générer le reçu PDF."
      );
    }
  };

  // ─────────────────────────────────────────────
  // PAGE LOADING
  // ─────────────────────────────────────────────

  if (currentPage === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img
            src="/images/logo sg.jpg"
            alt="Société Générale"
            className="h-12 object-contain"
          />
        </div>

        <div className="flex flex-col items-center justify-center flex-1 mt-20">
          <Loader className="w-20 h-20 text-gray-800 animate-spin mb-6" />

          <p className="text-lg text-gray-700">
            Un instant...
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // PAGE LISTE
  // ─────────────────────────────────────────────

  if (currentPage === "list") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="hidden md:block w-12"></div>

            <img
              src="/images/logo sg.jpg"
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
          <h1 className="text-2xl font-bold mb-6">
            Faire un virement
          </h1>

          <div className="bg-white py-5 px-4 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-center">
              VIREMENTS INTERNATIONAUX
            </h2>
          </div>

          {/* Compte source */}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Depuis quel compte ?
            </h3>

            <div className="bg-white border-l-4 border-teal-500 shadow-sm p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1 text-sm">
                  Compte
                </div>

                <div className="text-gray-600 text-xs">
                  {numeroCompte}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">
                  {soldeCompte.toLocaleString(
                    "fr-FR",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}{" "}
                  €
                </span>

                <ChevronDown className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Bénéficiaires */}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Vers quel bénéficiaire ?
            </h3>

            <div className="bg-white shadow-sm">
              <button
                onClick={() =>
                  setShowBeneficiaries(
                    !showBeneficiaries
                  )
                }
                className="w-full p-3 flex items-center justify-end border-b"
              >
                {showBeneficiaries ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {showBeneficiaries && (
                <div className="p-4">
                  <button
                    onClick={() =>
                      showLoadingThenNavigate(
                        "addBeneficiary"
                      )
                    }
                    className="flex items-center gap-2 text-red-500 font-semibold mb-5 hover:text-red-600 text-sm"
                  >
                    <Plus className="w-5 h-5" />

                    <span>
                      Ajouter un bénéficiaire
                    </span>
                  </button>

                  <div className="mb-3">
                    <span className="font-semibold text-sm">
                      BÉNÉFICIAIRE ZONE SEPA DONT FRANCE
                    </span>
                  </div>

                  <div className="space-y-2">
                    {beneficiaries.map(
                      (b) => (
                        <div
                          key={b.id}
                          onClick={() =>
                            handleSelectBeneficiary(
                              b
                            )
                          }
                          className="border border-gray-300 rounded p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                        >
                          <div>
                            <div className="font-semibold mb-1 text-sm">
                              {b.prenom}{" "}
                              {b.nom}
                            </div>

                            <div className="text-gray-600 text-xs">
                              {b.iban}
                            </div>
                          </div>

                          <button
                            onClick={(e) =>
                              deleteBeneficiary(
                                b.id,
                                e
                              )
                            }
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Historique */}

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <History className="w-5 h-5" />

              Historique ({virements.length})

              {isLoadingVirements && (
                <Loader className="w-4 h-4 animate-spin text-gray-400" />
              )}
            </h3>

            <div className="bg-white shadow-sm p-4">
              {virements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <History className="w-20 h-20 mx-auto mb-4 text-gray-300" />

                  <p className="text-xl font-semibold mb-2">
                    Aucun virement
                  </p>

                  <p className="text-sm">
                    Vos virements apparaîtront ici
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {virements.map(
                    (virement) => (
                      <div
                        key={virement.id}
                        className="border-2 rounded-lg p-4 hover:shadow-md transition border-gray-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-base mb-1">
                              {
                                virement
                                  .beneficiaire
                                  .prenom
                              }{" "}
                              {
                                virement
                                  .beneficiaire
                                  .nom
                              }
                            </div>

                            <div className="text-gray-500 text-xs">
                              {new Date(
                                virement.dateCreation
                              ).toLocaleDateString(
                                "fr-FR"
                              )}
                              {" à "}
                              {new Date(
                                virement.dateCreation
                              ).toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="font-bold text-xl text-emerald-600">
                              {Number(
                                virement.montant
                              ).toLocaleString(
                                "fr-FR",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}{" "}
                              €
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  telechargerRecu(
                                    virement
                                  )
                                }
                                className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition flex items-center gap-1"
                              >
                                <Download className="w-3 h-3" />
                                Reçu
                              </button>

                              <button
                                onClick={() =>
                                  supprimerVirement(
                                    virement.id
                                  )
                                }
                                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // AJOUT BÉNÉFICIAIRE
  // ─────────────────────────────────────────────

  if (currentPage === "addBeneficiary") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img
            src="/images/logo sg.jpg"
            alt="Société Générale"
            className="h-12 object-contain"
          />
        </div>

        <div className="pt-20 px-4 py-6 flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Ajouter un bénéficiaire
            </h2>

            <div className="space-y-4">
              {[
                [
                  "nom",
                  "Nom",
                  "Nom du bénéficiaire",
                ],
                [
                  "prenom",
                  "Prénom",
                  "Prénom",
                ],
                [
                  "iban",
                  "IBAN",
                  "FR76 1234...",
                ],
                [
                  "email",
                  "Email",
                  "email@example.com",
                ],
                [
                  "bic",
                  "BIC",
                  "BNPAFRPP",
                ],
              ].map(
                ([
                  field,
                  label,
                  placeholder,
                ]) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 text-center">
                      {label}
                    </label>

                    <input
                      type={
                        field === "email"
                          ? "email"
                          : "text"
                      }
                      value={
                        newBeneficiary[
                          field
                        ]
                      }
                      onChange={(e) =>
                        setNewBeneficiary(
                          {
                            ...newBeneficiary,
                            [field]:
                              e.target.value,
                          }
                        )
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 text-center"
                      placeholder={
                        placeholder
                      }
                    />
                  </div>
                )
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() =>
                  setCurrentPage("list")
                }
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded font-semibold hover:bg-gray-400 transition"
              >
                Annuler
              </button>

              <button
                onClick={
                  handleAddBeneficiary
                }
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

  // ─────────────────────────────────────────────
  // MONTANT
  // ─────────────────────────────────────────────

  if (currentPage === "amount") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img
            src="/images/logo sg.jpg"
            alt="Société Générale"
            className="h-12 object-contain"
          />
        </div>

        <div className="pt-20 px-4 py-6 flex justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              Montant du virement
            </h2>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Bénéficiaire
              </h3>

              <div className="bg-gray-50 border border-gray-300 rounded p-3 text-center">
                <div className="font-semibold mb-1">
                  {selectedBeneficiary?.prenom}{" "}
                  {selectedBeneficiary?.nom}
                </div>

                <div className="text-gray-600 text-sm">
                  {selectedBeneficiary?.iban}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 text-center">
                Montant
              </h3>

              <div className="flex justify-center">
                <div className="relative w-64">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    className="w-full border-2 border-gray-300 rounded px-3 py-2 text-xl font-semibold text-center pr-10"
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-semibold text-gray-600">
                    €
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mt-2 text-center">
                Solde disponible :{" "}
                <strong>
                  {soldeCompte.toLocaleString(
                    "fr-FR",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}{" "}
                  €
                </strong>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() =>
                  setCurrentPage("list")
                }
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded font-semibold hover:bg-gray-400 transition"
              >
                Retour
              </button>

              <button
                onClick={
                  handleConfirmAmount
                }
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

  // ─────────────────────────────────────────────
  // SUCCÈS
  // ─────────────────────────────────────────────

  if (currentPage === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-3 flex justify-center border-b z-50">
          <img
            src="/images/logo sg.jpg"
            alt="Société Générale"
            className="h-12 object-contain"
          />
        </div>

        <div className="pt-20 px-4 py-6 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <CheckCircle className="w-24 h-24 text-green-500 mb-6" />

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Virement initié !
          </h2>

          <p className="text-gray-600 text-center mb-6">
            Votre virement a été créé avec succès.
          </p>

          <div className="bg-gray-50 border border-gray-300 rounded p-4 w-full max-w-md mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                Bénéficiaire
              </span>

              <span className="font-semibold">
                {selectedBeneficiary?.prenom}{" "}
                {selectedBeneficiary?.nom}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                IBAN
              </span>

              <span className="font-semibold text-sm">
                {selectedBeneficiary?.iban}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                Montant
              </span>

              <span className="font-semibold">
                {parseFloat(
                  amount
                ).toFixed(2)}{" "}
                €
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">
                Nouveau solde
              </span>

              <span className="font-semibold">
                {(
                  soldeCompte -
                  parseFloat(
                    amount || 0
                  )
                ).toLocaleString(
                  "fr-FR",
                  {
                    minimumFractionDigits: 2,
                  }
                )}{" "}
                €
              </span>
            </div>
          </div>

          <button
            onClick={
              handleBackToList
            }
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
