import React, { useState } from "react";
import { Shield, Plane, Heart, AlertCircle, ChevronDown, ChevronUp, Phone, ArrowLeft } from "lucide-react";

export default function AssurancesPage({ navigateTo }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const assurances = [
    {
      id: 'voyage',
      icon: Plane,
      title: 'Assurance voyage',
      color: 'blue',
      description: 'Protection complète pour vos déplacements',
      details: [
        'Assistance rapatriement médical 24h/24',
        'Frais médicaux à l\'étranger jusqu\'à 150 000€',
        'Assurance annulation de voyage',
        'Retard de transport et de bagages',
        'Responsabilité civile à l\'étranger'
      ]
    },
    {
      id: 'achat',
      icon: Shield,
      title: 'Assurance et garantie achats',
      color: 'green',
      description: 'Vos achats protégés',
      details: [
        'Extension de garantie constructeur jusqu\'à 2 ans',
        'Assurance vol et dommages accidentels (90 jours)',
        'Couverture jusqu\'à 2 500€ par sinistre',
        'Protection des achats en ligne',
        'Franchise de 50€ par sinistre'
      ]
    },
    {
      id: 'sante',
      icon: Heart,
      title: 'Assistance santé',
      color: 'red',
      description: 'Soutien médical en cas de besoin',
      details: [
        'Téléconsultation médicale 24h/24',
        'Aide à domicile en cas d\'hospitalisation',
        'Livraison de médicaments d\'urgence',
        'Information médicale par téléphone',
        'Assistance psychologique'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="w-full bg-red-600 pt-8 pb-6">
        <div className="max-w-md mx-auto px-4">
          <button 
            onClick={() => navigateTo('main')}
            className="flex items-center text-white mb-4 hover:opacity-80 transition"
          >
            <ArrowLeft size={24} />
            <span className="ml-2">Retour</span>
          </button>
          <h1 className="text-2xl font-bold text-white">Assurances et assistance</h1>
          <p className="text-white opacity-90 mt-2">CB Gold Evolution</p>
        </div>
      </div>

      {/* Introduction */}
      <div className="max-w-md mx-auto px-4 -mt-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="text-red-600 mt-1" size={24} />
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                Votre protection au quotidien
              </h2>
              <p className="text-gray-700 text-sm">
                Votre carte CB Gold Evolution vous offre des assurances et assistances complètes pour vous protéger dans toutes vos activités.
              </p>
            </div>
          </div>
        </div>

        {/* Liste des assurances */}
        <div className="space-y-4 mb-6">
          {assurances.map((assurance) => {
            const colors = getColorClasses(assurance.color);
            const Icon = assurance.icon;
            const isExpanded = expandedSection === assurance.id;

            return (
              <div key={assurance.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleSection(assurance.id)}
                  className="w-full p-5 flex items-start gap-4 hover:bg-gray-50 transition"
                >
                  <div className={`${colors.bg} p-3 rounded-lg `}>
                    <Icon className={colors.text} size={24} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 mb-1">{assurance.title}</h3>
                    <p className="text-sm text-gray-600">{assurance.description}</p>
                  </div>
                  {isExpanded ? 
                    <ChevronUp className="text-gray-400  mt-1" size={20} /> : 
                    <ChevronDown className="text-gray-400  mt-1" size={20} />
                  }
                </button>

                {isExpanded && (
                  <div className={`border-t ${colors.border} px-5 pb-5`}>
                    <ul className="space-y-3 mt-4">
                      {assurance.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${colors.text.replace('text-', 'bg-')}  mt-2`} />
                          <span className="text-sm text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact assistance */}
        <div className="bg-red-600 to-red-700 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone size={24} />
            <h3 className="text-lg font-bold">Assistance 24h/24</h3>
          </div>
          <p className="text-white opacity-90 mb-4 text-sm">
            En cas d'urgence, notre service d'assistance est disponible 24 heures sur 24, 7 jours sur 7.
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-sm font-medium mb-1">Numéro d'assistance</p>
            <p className="text-2xl font-bold">+33 1 45 16 65 65</p>
            <p className="text-xs opacity-90 mt-2">Depuis l'étranger</p>
          </div>
        </div>

        {/* Notice importante */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <div className="flex gap-3">
            <AlertCircle className="text-yellow-600 " size={20} />
            <div>
              <p className="text-sm text-gray-800 font-medium mb-1">
                Notice d'information
              </p>
              <p className="text-xs text-gray-700">
                Pour connaître l'ensemble des conditions, exclusions et modalités de mise en œuvre de vos assurances, consultez la notice d'information complète disponible sur votre espace client ou sur demande.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}