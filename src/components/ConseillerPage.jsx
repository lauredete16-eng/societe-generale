import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone, Mail, Clock, User, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ConseillerPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [messageForm, setMessageForm] = useState({
    sujet: '',
    message: '',
    urgence: 'normale'
  });
  const [messageSent, setMessageSent] = useState(false);

  const conseiller = {
    nom: 'Marie Dupont',
    role: 'Conseillère bancaire',
    telephone: '01 23 45 67 89',
    email: 'marie.dupont@sg.fr',
    disponibilite: 'Lun-Ven 9h-18h'
  };

  const sujetsRapides = [
    'Question sur mon compte',
    'Problème de virement',
    'Question carte bancaire',
    'Crédit / Prêt',
    'Épargne / Placements',
    'Réclamation',
    'Autre'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageForm.sujet || !messageForm.message) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    // Simulation envoi
    setTimeout(() => {
      setMessageSent(true);
      setTimeout(() => {
        setMessageSent(false);
        setMessageForm({ sujet: '', message: '', urgence: 'normale' });
      }, 3000);
    }, 500);
  };

  const handleCall = () => {
    window.location.href = `tel:${conseiller.telephone.replace(/\s/g, '')}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${conseiller.email}?subject=Contact depuis l'application&body=Bonjour,%0D%0A%0D%0A`;
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
          <h1 className="text-xl font-bold flex-1">Contacter mon conseiller</h1>
          <img 
            src="images/logo sg.jpg" 
            alt="SG" 
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {messageSent && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3 animate-fade-in">
            <CheckCircle size={24} className="text-green-600" />
            <div>
              <p className="font-bold text-green-800">Message envoyé avec succès !</p>
              <p className="text-sm text-green-700">Votre conseiller vous répondra sous 24-48h</p>
            </div>
          </div>
        )}

        {/* Carte conseiller */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-l-4 border-red-600">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{conseiller.nom}</h2>
              <p className="text-gray-600 text-sm mb-3">{conseiller.role}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{conseiller.disponibilite}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleCall}
              className="flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              <Phone size={20} />
              Appeler
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Mail size={20} />
              Email
            </button>
          </div>
        </div>

        {/* Formulaire de contact */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle size={24} className="text-red-600" />
            <h2 className="text-lg font-bold">Envoyer un message</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sujet */}
            <div>
              <label className="block text-sm font-semibold mb-2">Sujet de votre demande</label>
              <select
                value={messageForm.sujet}
                onChange={(e) => setMessageForm({...messageForm, sujet: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Sélectionnez un sujet</option>
                {sujetsRapides.map((sujet, index) => (
                  <option key={index} value={sujet}>{sujet}</option>
                ))}
              </select>
            </div>

            {/* Urgence */}
            <div>
              <label className="block text-sm font-semibold mb-2">Niveau d'urgence</label>
              <div className="flex gap-3">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="urgence"
                    value="faible"
                    checked={messageForm.urgence === 'faible'}
                    onChange={(e) => setMessageForm({...messageForm, urgence: e.target.value})}
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-green-600 peer-checked:bg-green-50 transition">
                    <p className="font-semibold text-sm">Faible</p>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="urgence"
                    value="normale"
                    checked={messageForm.urgence === 'normale'}
                    onChange={(e) => setMessageForm({...messageForm, urgence: e.target.value})}
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 transition">
                    <p className="font-semibold text-sm">Normale</p>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="urgence"
                    value="urgente"
                    checked={messageForm.urgence === 'urgente'}
                    onChange={(e) => setMessageForm({...messageForm, urgence: e.target.value})}
                    className="sr-only peer"
                  />
                  <div className="p-3 border-2 border-gray-300 rounded-lg text-center cursor-pointer peer-checked:border-red-600 peer-checked:bg-red-50 transition">
                    <p className="font-semibold text-sm">Urgente</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold mb-2">Votre message</label>
              <textarea
                value={messageForm.message}
                onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[150px]"
                placeholder="Décrivez votre demande en détail..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {messageForm.message.length} / 1000 caractères
              </p>
            </div>

            {/* Coordonnées */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Informations de contact :</strong>
              </p>
              <p className="text-sm text-blue-700">
                📧 {currentUser?.email || 'email@exemple.com'}
              </p>
              <p className="text-sm text-blue-700">
                📞 {currentUser?.telephone || 'Non renseigné'}
              </p>
            </div>

            {/* Bouton envoi */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition flex items-center justify-center gap-2 text-lg"
            >
              <Send size={24} />
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Info délai de réponse */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⏱️ <strong>Délai de réponse :</strong> Votre conseiller vous répondra sous 24 à 48 heures ouvrées. 
            Pour les demandes urgentes, privilégiez le contact téléphonique.
          </p>
        </div>
      </main>
    </div>
  );
}