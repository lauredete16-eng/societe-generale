import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Check, Trash2, AlertCircle, CreditCard, Send, Shield, Settings as SettingsIcon } from 'lucide-react';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'virement',
      titre: 'Virement reçu',
      message: 'Vous avez reçu un virement de 2 500,00 €',
      date: '2026-01-08T10:30:00',
      lu: false,
      icon: Send
    },
    {
      id: 2,
      type: 'securite',
      titre: 'Connexion détectée',
      message: 'Nouvelle connexion depuis un nouvel appareil',
      date: '2026-01-07T18:45:00',
      lu: false,
      icon: Shield
    },
    {
      id: 3,
      type: 'carte',
      titre: 'Paiement carte bancaire',
      message: 'Paiement de 42,30 € chez Carrefour',
      date: '2026-01-06T15:20:00',
      lu: true,
      icon: CreditCard
    },
    {
      id: 4,
      type: 'alerte',
      titre: 'Solde faible',
      message: 'Votre solde est inférieur à 500 €',
      date: '2026-01-05T09:00:00',
      lu: true,
      icon: AlertCircle
    }
  ]);

  const [showOnlyUnread, setShowOnlyUnread] = useState(false);

  const notificationsNonLues = notifications.filter(n => !n.lu).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, lu: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, lu: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les notifications ?')) {
      setNotifications([]);
    }
  };

  const filteredNotifications = showOnlyUnread 
    ? notifications.filter(n => !n.lu)
    : notifications;

  const getTypeColor = (type) => {
    switch (type) {
      case 'virement': return 'bg-green-100 text-green-600';
      case 'securite': return 'bg-red-100 text-red-600';
      case 'carte': return 'bg-blue-100 text-blue-600';
      case 'alerte': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Il y a quelques minutes';
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
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
          <div className="flex-1">
            <h1 className="text-xl font-bold">Notifications</h1>
            {notificationsNonLues > 0 && (
              <p className="text-sm text-gray-500">{notificationsNonLues} non lue{notificationsNonLues > 1 ? 's' : ''}</p>
            )}
          </div>
          <img 
            src="images/logo sg.jpg" 
            alt="SG" 
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowOnlyUnread(!showOnlyUnread)}
              className={`flex-1 min-w-[140px] px-4 py-2 rounded-lg font-medium transition ${
                showOnlyUnread
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showOnlyUnread ? 'Voir toutes' : 'Non lues seulement'}
            </button>
            <button
              onClick={handleMarkAllAsRead}
              disabled={notificationsNonLues === 0}
              className="flex-1 min-w-[140px] px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check size={18} />
              Tout marquer lu
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={notifications.length === 0}
              className="flex-1 min-w-[140px] px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Tout supprimer
            </button>
          </div>
        </div>

        {/* Liste des notifications */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-semibold text-gray-600 mb-2">Aucune notification</p>
            <p className="text-sm text-gray-500">
              {showOnlyUnread 
                ? 'Toutes vos notifications ont été lues' 
                : 'Vous n\'avez aucune notification pour le moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`bg-white rounded-lg shadow-sm p-4 transition hover:shadow-md ${
                    !notif.lu ? 'border-l-4 border-red-600' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center  ${getTypeColor(notif.type)}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className={`font-semibold ${!notif.lu ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notif.titre}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(notif.date)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{notif.message}</p>
                      <div className="flex gap-2">
                        {!notif.lu && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center gap-1"
                          >
                            <Check size={14} />
                            Marquer comme lu
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notif.id)}
                          className="text-xs font-medium text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paramètres des notifications */}
        <button
          onClick={() => navigate('/parametres')}
          className="w-full mt-6 bg-white rounded-lg shadow-sm p-4 flex items-center justify-between hover:bg-gray-50 transition"
        >
          <div className="flex items-center gap-3">
            <SettingsIcon size={24} className="text-gray-600" />
            <span className="font-semibold">Gérer mes préférences de notifications</span>
          </div>
          <ArrowLeft size={20} className="text-gray-400 rotate-180" />
        </button>
      </main>
    </div>
  );
}