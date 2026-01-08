import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ChevronDown, ChevronUp, HelpCircle, CreditCard, Send, Shield, FileText, Phone } from 'lucide-react';

export default function FaqPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const categories = [
    { id: 'all', nom: 'Toutes', icon: HelpCircle },
    { id: 'compte', nom: 'Compte', icon: FileText },
    { id: 'virement', nom: 'Virements', icon: Send },
    { id: 'carte', nom: 'Cartes', icon: CreditCard },
    { id: 'securite', nom: 'Sécurité', icon: Shield }
  ];

  const questions = [
    {
      id: 1,
      categorie: 'compte',
      question: 'Comment consulter mon solde ?',
      reponse: 'Vous pouvez consulter votre solde directement sur la page d\'accueil de l\'application. Il est affiché en temps réel sur votre compte principal.'
    },
    {
      id: 2,
      categorie: 'compte',
      question: 'Comment télécharger mon RIB ?',
      reponse: 'Allez dans le menu > Opérations > Télécharger mon RIB. Vous pourrez ensuite télécharger votre RIB au format PDF ou le partager directement.'
    },
    {
      id: 3,
      categorie: 'virement',
      question: 'Comment faire un virement ?',
      reponse: 'Cliquez sur "Virement" depuis la page d\'accueil, sélectionnez un bénéficiaire existant ou ajoutez-en un nouveau, puis saisissez le montant et confirmez.'
    },
    {
      id: 4,
      categorie: 'virement',
      question: 'Quel est le délai pour un virement SEPA ?',
      reponse: 'Les virements SEPA sont généralement traités sous 24 heures ouvrées. Pour les virements instantanés, le délai est de quelques secondes.'
    },
    {
      id: 5,
      categorie: 'virement',
      question: 'Puis-je annuler un virement ?',
      reponse: 'Oui, vous pouvez annuler un virement tant qu\'il n\'a pas été traité. Allez dans l\'historique des virements et cliquez sur "Annuler".'
    },
    {
      id: 6,
      categorie: 'carte',
      question: 'Comment activer ma carte bancaire ?',
      reponse: 'Allez dans Menu > Mes cartes, sélectionnez votre carte et cliquez sur "Activer". Suivez ensuite les instructions pour finaliser l\'activation.'
    },
    {
      id: 7,
      categorie: 'carte',
      question: 'Comment faire opposition à ma carte ?',
      reponse: 'En cas de perte ou vol, allez dans Menu > Mes cartes > Opposition, ou appelez immédiatement le 09 69 39 77 77 (disponible 24h/24).'
    },
    {
      id: 8,
      categorie: 'carte',
      question: 'Comment modifier mon code PIN ?',
      reponse: 'Vous pouvez modifier votre code PIN depuis Menu > Mes cartes > Paramètres de la carte > Changer le code PIN.'
    },
    {
      id: 9,
      categorie: 'securite',
      question: 'Comment sécuriser mon compte ?',
      reponse: 'Activez l\'authentification à deux facteurs dans Menu > Sécurité. Nous recommandons également d\'activer les notifications de connexion et l\'authentification biométrique.'
    },
    {
      id: 10,
      categorie: 'securite',
      question: 'Que faire si je reçois un email suspect ?',
      reponse: 'Ne cliquez sur aucun lien et ne communiquez jamais vos identifiants. La Société Générale ne vous demandera jamais vos codes par email. Signalez-nous immédiatement tout email suspect.'
    },
    {
      id: 11,
      categorie: 'compte',
      question: 'Comment modifier mes informations personnelles ?',
      reponse: 'Allez dans Menu > Paramètres > Informations personnelles. Vous pourrez y modifier votre adresse, email et numéro de téléphone.'
    },
    {
      id: 12,
      categorie: 'securite',
      question: 'Comment changer mon mot de passe ?',
      reponse: 'Allez dans Menu > Sécurité > Changer mon mot de passe. Votre nouveau mot de passe doit contenir au moins 8 caractères avec des majuscules, minuscules et chiffres.'
    }
  ];

  const filteredQuestions = questions.filter(q => {
    const matchCategory = activeCategory === 'all' || q.categorie === activeCategory;
    const matchSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       q.reponse.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleQuestion = (id) => {
    setExpandedQuestion(expandedQuestion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/compte')}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold flex-1">Questions fréquentes</h1>
          <img 
            src="images/logo sg.jpg" 
            alt="SG" 
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {/* Recherche */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Catégories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {cat.nom}
              </button>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-3 mb-6">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <HelpCircle size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-600 mb-2">Aucune question trouvée</p>
              <p className="text-sm text-gray-500">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleQuestion(q.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-semibold text-left pr-4">{q.question}</span>
                  {expandedQuestion === q.id ? (
                    <ChevronUp size={20} className="text-gray-400 "/>
                  ) : (
                    <ChevronDown size={20} className="text-gray-400"/>
                  )}
                </button>
                {expandedQuestion === q.id && (
                  <div className="px-4 pb-4 text-gray-700 border-t">
                    <p className="pt-4">{q.reponse}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact support */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center ">
              <Phone size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2">Besoin d'aide supplémentaire ?</h3>
              <p className="text-sm text-blue-800 mb-4">
                Notre équipe est disponible pour répondre à toutes vos questions.
              </p>
              <button
                onClick={() => navigate('/conseiller')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Contacter un conseiller
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}