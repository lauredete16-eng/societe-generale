import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Copy, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RibPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [copied, setCopied] = React.useState(false);

  const infosRib = {
    titulaire: currentUser?.nom || 'Nom Titulaire',
    iban: currentUser?.numeroCompte || 'FR76 1751 5900 0004 1405 4735 344',
    bic: 'SOGEFRPP',
    banque: 'SOCIÉTÉ GÉNÉRALE',
    codeGuichet: '17515',
    numeroCompte: '90000041405',
    cleRib: '47'
  };

  const handleCopyIban = () => {
    navigator.clipboard.writeText(infosRib.iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadRib = () => {
    const ribHTML = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RIB - ${infosRib.titulaire}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; padding: 40px; background: #f5f5f5; }
        .rib-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border: 2px solid #e60028; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { text-align: center; border-bottom: 3px solid #e60028; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #e60028; font-size: 28px; margin-bottom: 10px; }
        .header p { color: #666; font-size: 14px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; color: #333; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }
        .info-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
        .info-label { color: #666; font-weight: 600; }
        .info-value { color: #333; font-weight: bold; text-align: right; }
        .iban-box { background: #f0f9f4; border: 2px solid #00a651; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .iban-box .label { color: #666; font-size: 14px; margin-bottom: 10px; }
        .iban-box .value { font-size: 24px; font-weight: bold; color: #00a651; letter-spacing: 2px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center; color: #666; font-size: 12px; }
        @media print {
            body { background: white; padding: 0; }
            .rib-container { box-shadow: none; border: none; }
        }
    </style>
</head>
<body>
    <div class="rib-container">
        <div class="header">
            <h1>🏦 SOCIÉTÉ GÉNÉRALE</h1>
            <p>Relevé d'Identité Bancaire (RIB)</p>
        </div>

        <div class="section">
            <div class="section-title">👤 Titulaire du compte</div>
            <div class="info-row">
                <span class="info-label">Nom</span>
                <span class="info-value">${infosRib.titulaire}</span>
            </div>
        </div>

        <div class="iban-box">
            <div class="label">IBAN</div>
            <div class="value">${infosRib.iban}</div>
        </div>

        <div class="section">
            <div class="section-title">🏦 Informations bancaires</div>
            <div class="info-row">
                <span class="info-label">BIC</span>
                <span class="info-value">${infosRib.bic}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Banque</span>
                <span class="info-value">${infosRib.banque}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Code guichet</span>
                <span class="info-value">${infosRib.codeGuichet}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Numéro de compte</span>
                <span class="info-value">${infosRib.numeroCompte}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Clé RIB</span>
                <span class="info-value">${infosRib.cleRib}</span>
            </div>
        </div>

        <div class="footer">
            <p><strong>SOCIÉTÉ GÉNÉRALE</strong></p>
            <p>29 Boulevard Haussmann, 75009 Paris, France</p>
            <p style="margin-top: 10px;">Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([ribHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RIB_${infosRib.titulaire.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <h1 className="text-xl font-bold flex-1">Mon RIB</h1>
          <img 
            src="images/logo sg.jpg" 
            alt="SG" 
            className="h-10 object-contain"
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-20 pb-6">
        {/* Carte RIB */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-red-600">
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="images/logo sg.jpg" 
              alt="SG" 
              className="h-12 object-contain"
            />
            <div>
              <p className="text-sm text-gray-500">Relevé d'Identité Bancaire</p>
              <p className="font-bold text-lg">{infosRib.banque}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Titulaire</p>
              <p className="font-semibold text-lg">{infosRib.titulaire}</p>
            </div>

            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-2">IBAN</p>
              <p className="font-bold text-lg text-green-700 tracking-wide">{infosRib.iban}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">BIC</p>
                <p className="font-semibold">{infosRib.bic}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Code guichet</p>
                <p className="font-semibold">{infosRib.codeGuichet}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">N° de compte</p>
                <p className="font-semibold">{infosRib.numeroCompte}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Clé RIB</p>
                <p className="font-semibold">{infosRib.cleRib}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleCopyIban}
            className="w-full bg-white rounded-lg p-4 shadow-sm flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              {copied ? (
                <CheckCircle size={24} className="text-green-600" />
              ) : (
                <Copy size={24} className="text-gray-600" />
              )}
              <span className="font-semibold">
                {copied ? 'IBAN copié !' : 'Copier l\'IBAN'}
              </span>
            </div>
          </button>

          <button
            onClick={handleDownloadRib}
            className="w-full bg-red-600 text-white rounded-lg p-4 shadow-sm flex items-center justify-center gap-3 hover:bg-red-700 transition"
          >
            <Download size={24} />
            <span className="font-semibold">Télécharger mon RIB</span>
          </button>

          <button
            className="w-full bg-white rounded-lg p-4 shadow-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <Share2 size={24} className="text-gray-600" />
            <span className="font-semibold">Partager mon RIB</span>
          </button>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Astuce :</strong> Utilisez votre RIB pour recevoir des virements, 
            mettre en place des prélèvements automatiques ou communiquer vos coordonnées bancaires.
          </p>
        </div>
      </main>
    </div>
  );
}