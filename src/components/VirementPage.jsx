import React, { useState } from 'react';
import { Menu, Power, ChevronDown, ChevronUp, Plus, Trash2, CheckCircle, Loader, Clock, History } from 'lucide-react';

export default function VirementPage() {
  const [currentPage, setCurrentPage] = useState('list');
  const [nextPage, setNextPage] = useState(null);
  const [showBeneficiaries, setShowBeneficiaries] = useState(true);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [amount, setAmount] = useState('');
  const [historique, setHistorique] = useState([]);
  
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

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const showLoadingThenNavigate = (page) => {
    setNextPage(page);
    setCurrentPage('loading');
    setTimeout(() => {
      setCurrentPage(page);
      setNextPage(null);
    }, 2000);
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

  const calculerJoursRestants = (dateCreation) => {
    const now = new Date();
    const creation = new Date(dateCreation);
    const diffTime = now - creation;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 3 - diffDays);
  };

  const handleConfirmAmount = async () => {
    if (amount && parseFloat(amount) > 0) {
      const newTransaction = {
        id: Date.now(),
        beneficiaire: selectedBeneficiary,
        montant: parseFloat(amount).toFixed(2),
        date: new Date().toLocaleDateString('fr-FR'),
        heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        dateCreation: new Date().toISOString(),
        statut: 'en_attente'
      };

      setHistorique([newTransaction, ...historique]);

      try {
        const templateParams = {
          to_email: selectedBeneficiary?.email,
          beneficiary_name: `${selectedBeneficiary?.prenom} ${selectedBeneficiary?.nom}`,
          amount: parseFloat(amount).toFixed(2),
          iban: selectedBeneficiary?.iban,
          date: new Date().toLocaleDateString('fr-FR')
        };

        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            service_id: 'service_k4ziul8',
            template_id: 'template_sbm9g23',
            user_id: 'D7vDC7RcrTFMzROoO',
            template_params: templateParams
          })
        });
        
        console.log('Email envoyé avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
      }
      
      showLoadingThenNavigate('success');
    }
  };

  const handleBackToList = () => {
    setCurrentPage('list');
    setSelectedBeneficiary(null);
    setAmount('');
  };

  if (currentPage === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-4 flex justify-center border-b z-50">
          <div className="w-14 h-14 bg-gradient-to-b from-red-500 to-black rounded-sm flex items-center justify-center">
            <div className="w-7 h-0.5 bg-white"></div>
          </div>
        </div>

        <div className="pt-24 px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">Virement & Bénéficiaires</h2>
          
          <div className="flex flex-col items-center justify-center mt-32">
            <Loader className="w-24 h-24 text-gray-800 animate-spin mb-8" />
            <p className="text-xl text-gray-700">Un instant ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'list') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <button className="md:hidden flex flex-col items-center gap-1">
              <Menu className="w-6 h-6" />
              <span className="text-xs font-semibold">MENU</span>
            </button>
            
            <div className="hidden md:block w-14"></div>
            
            <div className="w-14 h-14 bg-gradient-to-b from-red-500 to-black rounded-sm flex items-center justify-center">
              <div className="w-7 h-0.5 bg-white"></div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500 transition"
            >
              <Power className="w-8 h-8 text-white" />
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 pt-28">
          <h1 className="text-3xl font-bold mb-8">Faire un virement</h1>

          <div className="bg-white py-6 px-4 mb-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-center">VIREMENTS INTERNATIONAUX</h2>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Depuis quel compte ?</h3>
            <div className="bg-white border-l-4 border-teal-500 shadow-sm p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">Compte</div>
                <div className="text-gray-600 text-sm">FR76 3000 3015 8100 0501 3952 794</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-semibold">1 308 250 EUR</span>
                <ChevronDown className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Vers quel bénéficiaire ?</h3>
            
            <div className="bg-white shadow-sm">
              <button 
                onClick={() => setShowBeneficiaries(!showBeneficiaries)}
                className="w-full p-4 flex items-center justify-end border-b"
              >
                {showBeneficiaries ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </button>

              {showBeneficiaries && (
                <div className="p-4">
                  <button 
                    onClick={() => showLoadingThenNavigate('addBeneficiary')}
                    className="flex items-center gap-3 text-red-500 font-semibold mb-6 hover:text-red-600"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Ajouter un bénéficiaire</span>
                  </button>

                  <div className="mb-4">
                    <span className="font-semibold">BÉNÉFICIAIRE</span>                   
                    <span className="font-semibold"> ZONE SEPA DONT FRANCE</span>
                  </div>

                  <div className="space-y-3">
                    {beneficiaries.map((beneficiary) => (
                      <div 
                        key={beneficiary.id}
                        onClick={() => handleSelectBeneficiary(beneficiary)}
                        className="border border-gray-300 rounded p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                      >
                        <div>
                          <div className="font-semibold mb-1">{beneficiary.prenom} {beneficiary.nom}</div>
                          <div className="text-gray-600 text-sm">{beneficiary.iban}</div>
                        </div>
                        <button 
                          onClick={(e) => deleteBeneficiary(beneficiary.id, e)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION HISTORIQUE */}
          {historique.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <History className="w-6 h-6" />
                Historique des virements
              </h3>
              
              <div className="bg-white shadow-sm p-4">
                <div className="space-y-3">
                  {historique.map((transaction) => {
                    const joursRestants = calculerJoursRestants(transaction.dateCreation);
                    const estTraite = joursRestants === 0;
                    
                    return (
                      <div 
                        key={transaction.id}
                        className="border border-gray-300 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-semibold text-lg mb-1">
                              {transaction.beneficiaire.prenom} {transaction.beneficiaire.nom}
                            </div>
                            <div className="text-gray-600 text-sm mb-1">
                              {transaction.beneficiaire.iban}
                            </div>
                            <div className="text-gray-500 text-xs">
                              {transaction.date} à {transaction.heure}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-2xl text-emerald-600 mb-2">
                              {transaction.montant} €
                            </div>
                            {estTraite ? (
                              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                <span>Traité</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                                <Clock className="w-4 h-4" />
                                <span>En attente ({joursRestants}j)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (currentPage === 'addBeneficiary') {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-4 flex justify-center border-b z-50">
          <div className="w-14 h-14 bg-gradient-to-b from-red-500 to-black rounded-sm flex items-center justify-center">
            <div className="w-7 h-0.5 bg-white"></div>
          </div>
        </div>

        <div className="pt-24 flex flex-col max-w-2xl mx-auto w-full px-6 py-6">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-4 tracking-wide">
            AJOUT NOUVEAU BÉNÉFICIAIRE
          </h2>

          <h1 className="text-2xl font-normal text-gray-900 mb-8 text-center leading-tight">
            Confirmez les informations du nouveau bénéficiaires.
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 text-base mb-2">Nom</label>
              <input 
                type="text" 
                value={newBeneficiary.nom}
                onChange={(e) => setNewBeneficiary({...newBeneficiary, nom: e.target.value})}
                className="w-full px-0 py-2 border-0 border-b-2 border-gray-400 focus:border-gray-900 focus:outline-none bg-transparent text-base" 
              />
            </div>

            <div>
              <label className="block text-gray-700 text-base mb-2">Prénom</label>
              <input 
                type="text" 
                value={newBeneficiary.prenom}
                onChange={(e) => setNewBeneficiary({...newBeneficiary, prenom: e.target.value})}
                className="w-full px-0 py-2 border-0 border-b-2 border-gray-400 focus:border-gray-900 focus:outline-none bg-transparent text-base" 
              />
            </div>

            <div>
              <label className="block text-gray-700 text-base mb-2">Iban</label>
              <input 
                type="text" 
                value={newBeneficiary.iban}
                onChange={(e) => setNewBeneficiary({...newBeneficiary, iban: e.target.value})}
                className="w-full px-0 py-2 border-0 border-b-2 border-gray-400 focus:border-gray-900 focus:outline-none bg-transparent text-base" 
              />
            </div>

            <div>
              <label className="block text-gray-700 text-base mb-2">Email</label>
              <input 
                type="email" 
                value={newBeneficiary.email}
                onChange={(e) => setNewBeneficiary({...newBeneficiary, email: e.target.value})}
                className="w-full px-0 py-2 border-0 border-b-2 border-gray-400 focus:border-gray-900 focus:outline-none bg-transparent text-base" 
              />
            </div>

            <div>
              <label className="block text-gray-700 text-base mb-2">Bic</label>
              <input 
                type="text" 
                value={newBeneficiary.bic}
                onChange={(e) => setNewBeneficiary({...newBeneficiary, bic: e.target.value})}
                className="w-full px-0 py-2 border-0 border-b-2 border-gray-400 focus:border-gray-900 focus:outline-none bg-transparent text-base" 
              />
            </div>
          </div>

          <div className="mt-8 mb-6">
            <button 
              onClick={handleAddBeneficiary}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 rounded-full text-lg shadow-lg"
            >
              Confirmer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'amount') {
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-4 flex justify-center border-b z-50">
          <div className="w-14 h-14 bg-gradient-to-b from-red-500 to-black rounded-sm flex items-center justify-center">
            <div className="w-7 h-0.5 bg-white"></div>
          </div>
        </div>

        <div className="pt-24 max-w-2xl mx-auto px-6 py-6">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div>
              <div className="text-sm text-gray-600 font-semibold">VIREMENT INSTANTANÉ</div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Veuillez saisir le montant pour le virement</h1>
            </div>

            {selectedBeneficiary && (
              <div className="bg-gray-100 rounded-xl p-4 mb-6 mt-6">
                <div className="text-sm text-gray-600 mb-1">Bénéficiaire</div>
                <div className="font-semibold text-lg">{selectedBeneficiary.prenom} {selectedBeneficiary.nom}</div>
                <div className="text-sm text-gray-600">{selectedBeneficiary.iban}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Montant du virement (€)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none text-2xl font-semibold" 
                  placeholder="0.00" 
                  step="0.01"
                  min="0"
                />
              </div>

              <button 
                onClick={handleConfirmAmount}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl mt-4"
              >
                Confirmer le virement
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'success') {
    const lastTransaction = historique[0];
    
    return (
      <div className="min-h-screen bg-white">
        <div className="fixed top-0 left-0 right-0 bg-gray-100 py-4 flex justify-center border-b z-50">
          <div className="w-14 h-14 bg-gradient-to-b from-red-500 to-black rounded-sm flex items-center justify-center">
            <div className="w-7 h-0.5 bg-white"></div>
          </div>
        </div>

        <div className="pt-24 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-24 h-24 text-emerald-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Virement effectué avec succès</h1>
            
            <div className="bg-gray-100 rounded-xl p-6 mb-6 text-left">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Bénéficiaire</div>
                <div className="font-semibold text-lg">{selectedBeneficiary?.prenom} {selectedBeneficiary?.nom}</div>
                <div className="text-sm text-gray-600">{selectedBeneficiary?.iban}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Montant</div>
                <div className="font-bold text-3xl text-emerald-600">{parseFloat(amount).toFixed(2)} €</div>
              </div>
            </div>

            <button 
              onClick={handleBackToList}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }
}