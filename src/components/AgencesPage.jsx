import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, Phone, Clock, Navigation, Star } from 'lucide-react';

export default function AgencesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgence, setSelectedAgence] = useState(null);

  const agences = [
    {
      id: 1,
      nom: 'Société Générale - Paris Opéra',
      adresse: '29 Boulevard Haussmann',
      codePostal: '75009',
      ville: 'Paris',
      telephone: '01 42 14 20 00',
      distance: '2.3 km',
      horaires: {
        lundi: '9h00 - 18h00',
        mardi: '9h00 - 18h00',
        mercredi: '9h00 - 18h00',
        jeudi: '9h00 - 18h00',
        vendredi: '9h00 - 18h00',
        samedi: 'Fermé',
        dimanche: 'Fermé'
      },
      services: ['Conseiller', 'GAB', 'Distributeur de billets'],
      note: 4.5
    },
    {
      id: 2,
      nom: 'Société Générale - Paris Champs-Élysées',
      adresse: '91 Avenue des Champs-Élysées',
      codePostal: '75008',
      ville: 'Paris',
      telephone: '01 40 75 25 25',
      distance: '3.1 km',
      horaires: {
        lundi: '9h00 - 18h00',
        mardi: '9h00 - 18h00',
        mercredi: '9h00 - 18h00',
        jeudi: '9h00 - 18h00',
        vendredi: '9h00 - 18h00',
        samedi: '10h00 - 16h00',
        dimanche: 'Fermé'
      },
      services: ['Conseiller', 'GAB', 'Distributeur de billets', 'Coffre-fort'],
      note: 4.7
    },
    {
      id: 3,
      nom: 'Société Générale - Paris Montparnasse',
      adresse: '17 Rue de la Gaîté',
      codePostal: '75014',
      ville: 'Paris',
      telephone: '01 43 20 85 85',
      distance: '4.8 km',
      horaires: {
        lundi: '9h00 - 17h30',
        mardi: '9h00 - 17h30',
        mercredi: '9h00 - 17h30',
        jeudi: '9h00 - 17h30',
        vendredi: '9h00 - 17h30',
        samedi: 'Fermé',
        dimanche: 'Fermé'
      },
      services: ['Conseiller', 'GAB', 'Distributeur de billets'],
      note: 4.2
    },
    {
      id: 4,
      nom: 'Société Générale - Paris Bastille',
      adresse: '2 Place de la Bastille',
      codePostal: '75011',
      ville: 'Paris',
      telephone: '01 48 05 40 40',
      distance: '5.2 km',
      horaires: {
        lundi: '9h00 - 18h00',
        mardi: '9h00 - 18h00',
        mercredi: '9h00 - 18h00',
        jeudi: '9h00 - 18h00',
        vendredi: '9h00 - 18h00',
        samedi: 'Fermé',
        dimanche: 'Fermé'
      },
      services: ['Conseiller', 'GAB'],
      note: 4.3
    }
  ];

  const filteredAgences = agences.filter(agence =>
    agence.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agence.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agence.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCall = (telephone) => {
    window.location.href = `tel:${telephone.replace(/\s/g, '')}`;
  };

  const handleGetDirections = (agence) => {
    const address = encodeURIComponent(`${agence.adresse}, ${agence.codePostal} ${agence.ville}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
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
          <h1 className="text-xl font-bold flex-1">Trouver une agence</h1>
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
              placeholder="Rechercher par ville ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Liste des agences */}
        <div className="space-y-4">
          {filteredAgences.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MapPin size={64} className="mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-semibold text-gray-600 mb-2">Aucune agence trouvée</p>
              <p className="text-sm text-gray-500">Essayez de modifier votre recherche</p>
            </div>
          ) : (
            filteredAgences.map((agence) => (
              <div key={agence.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{agence.nom}</h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold">{agence.note}</span>
                        <span className="text-sm text-gray-500">/ 5</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-red-600">
                      <Navigation size={16} />
                      {agence.distance}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 mb-3">
                    <MapPin size={18} className="text-gray-400 mt-0.5 " />
                    <div className="text-sm text-gray-700">
                      <p>{agence.adresse}</p>
                      <p>{agence.codePostal} {agence.ville}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Phone size={18} className="text-gray-400" />
                    <a 
                      href={`tel:${agence.telephone.replace(/\s/g, '')}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {agence.telephone}
                    </a>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agence.services.map((service, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Boutons actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedAgence(selectedAgence === agence.id ? null : agence.id)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                    >
                      <Clock size={18} />
                      Horaires
                    </button>
                    <button
                      onClick={() => handleGetDirections(agence)}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                    >
                      <Navigation size={18} />
                      Itinéraire
                    </button>
                  </div>

                  {/* Horaires détaillés */}
                  {selectedAgence === agence.id && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock size={18} className="text-red-600" />
                        Horaires d'ouverture
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(agence.horaires).map(([jour, horaire]) => (
                          <div key={jour} className="flex justify-between text-sm">
                            <span className="capitalize font-medium text-gray-700">{jour}</span>
                            <span className={horaire === 'Fermé' ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                              {horaire}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Conseil :</strong> Prenez rendez-vous avec votre conseiller pour éviter l'attente. 
            Vous pouvez le faire depuis la section "Contacter un conseiller".
          </p>
        </div>
      </main>
    </div>
  );
}