// PrivateRoute.jsx - AVEC MODAL COMPTE BLOQUÉ
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// ─── Modal compte bloqué ───────────────────────────────────────────────────────
function CompteBloquéModal({ user, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  const montant = user?.montantDeblocage ?? 0;
  const nom = user?.nom || 'Client';

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.65)',
      backdropFilter: 'blur(5px)',
      padding: '16px',
      animation: 'fadeInBg 0.3s ease',
    }}>
      <style>{`
        @keyframes fadeInBg {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(36px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0   rgba(220,38,38,0.45); }
          50%      { box-shadow: 0 0 0 12px rgba(220,38,38,0);   }
        }
        .sg-modal-card {
          background:#fff; border-radius:18px;
          width:100%; max-width:430px; overflow:hidden;
          box-shadow: 0 40px 90px rgba(0,0,0,0.4);
          animation: slideUp 0.42s cubic-bezier(0.34,1.56,0.64,1) both;
          animation-delay: 0.06s;
        }
        .sg-modal-header {
          background: linear-gradient(135deg,#e60028 0%,#b0001e 100%);
          padding: 30px 28px 24px; text-align:center;
        }
        .sg-modal-icon {
          width:68px; height:68px; border-radius:50%;
          background:rgba(255,255,255,0.18);
          display:flex; align-items:center; justify-content:center;
          margin:0 auto 14px;
          animation: pulse 2.2s ease infinite;
        }
        .sg-modal-body { padding:26px 28px 28px; }
        .sg-amount-box {
          background:#fff5f5; border:2px solid #fca5a5;
          border-radius:14px; padding:22px; text-align:center; margin-bottom:20px;
        }
        .sg-amount {
          font-size:46px; font-weight:900; color:#e60028;
          letter-spacing:-2px; line-height:1;
        }
        .sg-steps { display:flex; flex-direction:column; gap:10px; margin-bottom:22px; }
        .sg-step {
          display:flex; align-items:flex-start; gap:12px;
          background:#f9fafb; border-radius:10px; padding:12px 14px;
          font-size:13px; color:#374151; line-height:1.5;
        }
        .sg-step-num {
          min-width:24px; height:24px; border-radius:50%;
          background:#e60028; color:#fff; font-size:12px; font-weight:700;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .sg-btn-primary {
          width:100%; background:#e60028; color:#fff;
          border:none; border-radius:10px; padding:15px;
          font-size:15px; font-weight:700; cursor:pointer;
          transition:background 0.2s, transform 0.1s; letter-spacing:0.3px;
        }
        .sg-btn-primary:hover  { background:#c0001f; }
        .sg-btn-primary:active { transform:scale(0.98); }
        .sg-btn-close {
          display:block; margin:12px auto 0; background:none;
          border:none; color:#9ca3af; font-size:13px;
          cursor:pointer; padding:6px 12px; border-radius:6px;
          transition:color 0.2s;
        }
        .sg-btn-close:hover { color:#374151; }
      `}</style>

      <div className="sg-modal-card">

        {/* Header */}
        <div className="sg-modal-header">
          <div className="sg-modal-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div style={{ color:'#fff', fontSize:21, fontWeight:800, marginBottom:5 }}>
            Compte bloqué
          </div>
          <div style={{ color:'rgba(255,255,255,0.82)', fontSize:13 }}>
            Bonjour {nom}, une action est requise
          </div>
        </div>

        {/* Body */}
        <div className="sg-modal-body">

          {/* Montant */}
          <div className="sg-amount-box">
            <div style={{ fontSize:11, color:'#9ca3af', fontWeight:700,
              textTransform:'uppercase', letterSpacing:1.2, marginBottom:8 }}>
              Montant de déblocage requis
            </div>
            <div className="sg-amount">
              {montant.toLocaleString('fr-FR', { minimumFractionDigits:2 })} €
            </div>
            <div style={{ fontSize:12, color:'#6b7280', marginTop:7 }}>
              À régler pour réactiver l'accès à votre compte
            </div>
          </div>

          {/* Étapes */}
          <div className="sg-steps">
            <div className="sg-step">
              <div className="sg-step-num">1</div>
              <div>Contactez notre <strong>service client</strong> pour recevoir les coordonnées de paiement.</div>
            </div>
            <div className="sg-step">
              <div className="sg-step-num">2</div>
              <div>Réglez <strong>{montant.toLocaleString('fr-FR', { minimumFractionDigits:2 })} €</strong> par virement bancaire ou en agence.</div>
            </div>
            <div className="sg-step">
              <div className="sg-step-num">3</div>
              <div>Votre compte sera <strong>réactivé sous 24h</strong> après réception du paiement.</div>
            </div>
          </div>

          {/* CTA */}
          <button className="sg-btn-primary" onClick={() => window.location.href = 'tel:+33800940940'}>
            📞 Contacter le service client
          </button>
          <button className="sg-btn-close" onClick={onClose}>
            Fermer et consulter mon compte
          </button>

        </div>
      </div>
    </div>
  );
}

// ─── PrivateRoute ──────────────────────────────────────────────────────────────
export default function PrivateRoute({ children }) {
  const { isLoggedIn, loading, currentUser } = useAuth();
  const [modalFermé, setModalFermé] = useState(false);

  if (loading) {
    return (
      <div style={{
        display:'flex', justifyContent:'center', alignItems:'center',
        height:'100vh', fontSize:'18px'
      }}>
        Chargement...
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {/* Modal affiché automatiquement si compte bloqué et pas encore fermé */}
      {currentUser?.compteBloque && !modalFermé && (
        <CompteBloquéModal
          user={currentUser}
          onClose={() => setModalFermé(true)}
        />
      )}
      {children}
    </>
  );
}