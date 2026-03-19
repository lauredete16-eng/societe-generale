import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Smartphone, Leaf, CreditCard, PiggyBank,
  TrendingUp, Users, Smile, Eye, ChevronRight, MapPin,
  HelpCircle, Facebook, Instagram, Twitter, Lock, Menu, X
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      {/* ===== HEADER ===== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col items-center text-gray-700">
            <Menu size={22} />
            <span className="text-xs font-semibold mt-0.5">MENU</span>
          </button>

          {/* LOGO */}
          <img src="images/logo sg.jpg" alt="Société Générale" className="h-10 object-contain" />

          <button
            onClick={() => navigate("/login")}
            className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white"
          >
            <Lock size={18} />
          </button>
        </div>

        {/* Menu déroulant */}
        {menuOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-4 space-y-2 shadow-lg relative">
            <button onClick={() => setMenuOpen(false)} className="absolute top-3 right-4 text-gray-500">
              <X size={22} />
            </button>
            {["Ouvrir un compte", "Nos cartes bancaires", "Épargne", "Emprunter", "Assurances", "Nos agences"].map((item) => (
              <div key={item} className="py-2 border-b border-gray-100 text-gray-700 font-medium text-sm flex justify-between items-center">
                {item} <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </header>

      {/* ===== BANNIÈRE PRINCIPALE - IMAGE I1 ===== */}
      <section className="bg-blue-50 px-4 py-8">
        <div className="max-w-xl mx-auto">
          {/* Image I1 en haut de la bannière */}
          <div className="rounded-2xl overflow-hidden mb-6">
            <img src="images/I7.jpeg" alt="Offre Société Générale" className="w-full object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            votre cotisation Sobrio à 1 € / mois la première année
            <sup className="text-sm font-normal">(1)(2)(3)</sup>
          </h1>
          <p className="text-gray-800 mb-2">
            <strong>20 € offerts</strong> pour l'ouverture en ligne d'un premier compte bancaire SG<sup>(1)</sup>
          </p>
          <p className="text-gray-800 mb-2">
            <strong>+ Sobrio à 1 € / mois la première année</strong> s'il est souscrit en même temps<sup>(2)</sup>
          </p>
          <p className="text-gray-800 mb-6">
            <strong>+ 80 € offerts</strong> pour la souscription au service gratuit d'aide à la mobilité bancaire SG<sup>(3)</sup>
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full w-full text-center transition"
          >
            Sélectionnez une carte
          </button>
          <p className="text-center mt-3 text-sm text-blue-700 underline cursor-pointer">
            (1)(2)(3) Voir conditions et durée de l'offre
          </p>
        </div>
      </section>

      {/* ===== OFFRE DE BIENVENUE - IMAGE I2 ===== */}
      <section className="max-w-xl mx-auto px-4 py-6">
        <div className="rounded-2xl overflow-hidden relative">
          <img src="images/I8.jpeg" alt="Offre de bienvenue" className="w-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent p-5">
            <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded mb-3 inline-block">
              OFFRE DE BIENVENUE
            </span>
            <h2 className="text-white text-xl font-bold leading-snug mb-3">
              Vous avez entre 18 et 24 ans ? Découvrez nos offres pour vous !
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-red-600 font-bold py-2 px-6 rounded-full text-sm"
            >
              Devenez client
            </button>
          </div>
        </div>
      </section>

      {/* ===== DEVENEZ CLIENT - CARTE - IMAGE I3 ===== */}
      <section className="max-w-xl mx-auto px-4 py-4">
        <div className="rounded-2xl overflow-hidden relative">
          <img src="images/I1.jpeg" alt="Ouvrir un compte" className="w-full object-cover" />
          <div className="absolute bottom-0 right-0 p-4 bg-gradient-to-t from-gray-900/80 to-transparent w-full">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded mb-2 inline-block">
              DEVENEZ CLIENT
            </span>
            <h3 className="text-white text-lg font-bold leading-snug mb-2">
              Gagnez du temps en ouvrant en ligne votre 1<sup>er</sup> compte bancaire.
            </h3>
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-red-600 font-bold py-2 px-5 rounded-full text-sm"
            >
              J'en profite
            </button>
          </div>
        </div>
      </section>

      {/* ===== LES AVANTAGES DE SG ===== */}
      <section className="max-w-xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-extrabold text-center mb-6">Les avantages de SG</h2>
        <div className="space-y-6">
          {[
            {
              icon: <Building2 size={36} className="text-gray-800" />,
              title: "Une banque plus proche",
              desc: "Avec 11 régions ancrées dans votre territoire, retrouvez des agences et des experts qui connaissent votre quotidien."
            },
            {
              icon: <Smartphone size={36} className="text-gray-800" />,
              title: "Une banque plus innovante",
              desc: "Avec l'Appli SG, profitez d'une des applications bancaires les mieux notées."
            },
            {
              icon: <Leaf size={36} className="text-red-600" />,
              title: "Une banque responsable",
              desc: "SG a pour ambition d'accompagner la transition écologique et le développement durable économique et social en proposant des solutions de finance durable."
            }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="mt-1">{item.icon}</div>
              <div>
                <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== QUE POUVONS-NOUS FAIRE POUR VOUS ===== */}
      <section className="bg-gray-50 px-4 py-8">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-6">Que pouvons-nous faire pour vous ?</h2>
          <div className="space-y-3">
            {[
              {
                icon: <Building2 size={28} className="text-indigo-800" />,
                title: "Ouvrir un compte",
                desc: "Gagnez du temps, ouvrez en ligne votre premier compte bancaire, profitez de l'offre du moment et rencontrez plus tard votre conseiller en agence."
              },
              {
                icon: <CreditCard size={28} className="text-indigo-800" />,
                title: "Gérer votre carte",
                desc: "Choisissez une carte bancaire et des services associés adaptés à vos besoins et votre mode de vie."
              },
              {
                icon: <TrendingUp size={28} className="text-indigo-800" />,
                title: "Emprunter",
                desc: "Parlons de vos projets : un futur logement, un nouveau véhicule, des travaux... Concrétisez vos projets d'avenir."
              },
              {
                icon: <PiggyBank size={28} className="text-indigo-800" />,
                title: "Épargner",
                desc: "Pour préparer un projet, anticiper un imprévu ou faire fructifier votre argent, vous avez une bonne raison d'épargner."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-4 flex items-start gap-4 shadow-sm">
                <div className="mt-1">{item.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-base mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
                <ChevronRight size={20} className="text-gray-400 mt-1 flex-shrink-0" />
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full mt-6 transition"
          >
            Ouvrir un compte
          </button>
        </div>
      </section>

      {/* ===== ON S'ADAPTE - IMAGE I4 ===== */}
      <section className="max-w-xl mx-auto px-4 py-8">
        <div className="rounded-xl overflow-hidden mb-6">
          <img src="images/I2.jpeg" alt="On s'adapte" className="w-full object-cover" />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">On s'adapte. À vos projets, votre vie, à vous.</h2>
        <p className="text-gray-500 text-sm mb-5">Découvrez toutes nos solutions en fonction de votre besoin.</p>

        <div className="space-y-3">
          {[
            {
              icon: <span className="text-2xl">🎒</span>,
              title: "Lycéens, étudiants, jeunes actifs",
              desc: "Nous sommes à vos côtés pour vous accompagner à chaque étape de la construction de votre avenir"
            },
            {
              icon: <Users size={28} className="text-indigo-800" />,
              title: "Pour votre famille, quel que soit le moment de votre vie",
              desc: "Découvrez nos solutions pour chacun de vos projets, petits ou grands"
            },
            {
              icon: <TrendingUp size={28} className="text-indigo-800" />,
              title: "Pour mieux vous projeter",
              desc: "Simulez vos placements, votre épargne, vos assurances, vos prêts etc. avec nos simulateurs"
            },
            {
              icon: <Smile size={28} className="text-indigo-800" />,
              title: "Pour vous simplifier la vie",
              desc: "Bénéficiez de partenaires qui vous facilitent la vie au quotidien."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4 shadow-sm">
              <div className="mt-1">{item.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400 mt-1 flex-shrink-0" />
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full mt-6 transition"
        >
          Ouvrir un compte
        </button>
      </section>

      {/* ===== L'APPLI SG - IMAGE I5 ===== */}
      <section className="bg-pink-50 px-4 py-8">
        <div className="max-w-xl mx-auto">
          <div className="rounded-xl overflow-hidden mb-6">
            <img src="images/I3.jpeg" alt="L'Appli SG" className="w-full object-cover" />
          </div>
          <h2 className="text-2xl font-extrabold mb-4">
            <span className="text-red-600">L'Appli SG</span>, votre banque au bout des doigts
          </h2>
          <div className="space-y-3">
            {[
              { icon: <Eye size={22} className="text-gray-700" />, text: "L'essentiel en un coup d'œil" },
              { icon: <CreditCard size={22} className="text-gray-700" />, text: "Prenez le contrôle de votre carte" },
              { icon: <Users size={22} className="text-gray-700" />, text: "Un Conseiller dans votre poche" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                {item.icon}
                <span className="text-gray-700 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full mt-6 transition"
          >
            Ouvrir un compte
          </button>
        </div>
      </section>

      {/* ===== CONSEILS VIDÉOS - IMAGE I6 ===== */}
      <section className="bg-blue-900 px-4 py-8">
        <div className="max-w-xl mx-auto space-y-4">
          {[
            { titre: "L'assurance auto est incontournable", img: "images/I4.jpeg" },
            { titre: "Automates bancaires Cash Services", img: "images/I5.jpeg" },
            { titre: "Placer son argent dans une assurance vie", img: "images/I6.jpeg" }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden">
              <div className="relative">
                <img src={item.img} alt={item.titre} className="w-full h-40 object-cover" />
                <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">5 MIN</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-2">{item.titre}</h3>
                <span className="text-red-600 font-semibold text-sm flex items-center gap-1 cursor-pointer">
                  Voir la vidéo <ChevronRight size={16} />
                </span>
              </div>
            </div>
          ))}
          <button className="w-full border-2 border-white text-white font-bold py-4 rounded-full mt-4 hover:bg-white hover:text-blue-900 transition">
            Voir tous nos conseils
          </button>
        </div>
      </section>

      {/* ===== SATISFACTION ===== */}
      <section className="max-w-xl mx-auto px-4 py-8">
        <div className="relative rounded-xl overflow-hidden mb-5">
          <img src="images/I4.jpeg" alt="Satisfaction client" className="w-full h-48 object-cover" />
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow text-yellow-400 text-xl">
            ★★★★☆
          </div>
        </div>
        <h2 className="text-2xl font-extrabold mb-2">Votre satisfaction, notre priorité</h2>
        <p className="text-gray-500 text-sm mb-5">
          Nous sommes à votre écoute pour mieux vous accompagner. 1 million de clients nous ont déjà adressé un avis et donné l'opportunité d'agir !
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full transition">
          En savoir plus
        </button>
      </section>

      {/* ===== PARLONS DE VOTRE PROJET ===== */}
      <section className="bg-gray-50 px-4 py-8 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-extrabold mb-3">Parlons de votre projet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Pour ouvrir un compte, vous renseigner sur l'épargne ou un projet immobilier, nos conseillers vous accompagnent.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full transition"
          >
            Ouvrir un compte
          </button>
        </div>
      </section>

      {/* ===== FOOTER LIENS ===== */}
      <footer className="bg-gray-800 text-white px-4 py-8">
        <div className="max-w-xl mx-auto">
          {[
            {
              title: "Offres Bancaires",
              links: ["Notre offre parrainage", "Nos cartes bancaires", "Épargne et placements", "Nos assurances vie", "Personnaliser sa carte bancaire"]
            },
            {
              title: "Emprunter",
              links: ["Nos crédits à la consommation", "Notre Crédit conso Expresso", "Notre Crédit Auto", "Nos crédits immobiliers", "Notre Prêt étudiant", "Notre Prêt Jeune Actif"]
            },
            {
              title: "Ouvrir un compte",
              links: ["Ouvrir un compte bancaire", "Nos comptes bancaires", "Offre jeunes", "Offre Sobrio", "Changer de banque"]
            },
            {
              title: "Se protéger",
              links: ["Nos assurances auto", "Nos assurances habitation", "Nos complémentaires santé", "Notre assurance accidents de la vie"]
            },
            {
              title: "Conseils & Services",
              links: ["Nos conseils", "Tous les simulateurs", "En cas de sinistre", "Services"]
            }
          ].map((section, i) => (
            <div key={i} className="mb-6 text-center">
              <h3 className="font-bold text-base mb-3">{section.title}</h3>
              {section.links.map((link, j) => (
                <p key={j} className="text-gray-400 text-sm py-1 cursor-pointer hover:text-white">{link}</p>
              ))}
            </div>
          ))}
        </div>
      </footer>

      {/* ===== FOOTER BAS ===== */}
      <div className="bg-black text-white px-4 py-6 text-center">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 cursor-pointer hover:text-red-400">
              <HelpCircle size={20} />
              <span className="text-sm">Questions fréquentes</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4 cursor-pointer hover:text-red-400">
            <MapPin size={20} />
            <span className="text-sm">Trouver une agence</span>
          </div>
          <p className="text-gray-400 text-sm mb-4 cursor-pointer">Autres sites SG ∨</p>

          <div className="flex justify-center gap-6 mb-6">
            <Facebook size={22} className="cursor-pointer hover:text-blue-400" />
            <Instagram size={22} className="cursor-pointer hover:text-pink-400" />
            <Twitter size={22} className="cursor-pointer hover:text-sky-400" />
          </div>

          <img src="images/logo sg.jpg" alt="Société Générale" className="h-10 object-contain mx-auto mb-4" />

          <div className="text-gray-400 text-xs space-y-1">
            {["Sécurité", "Gestion des Cookies", "Données personnelles", "Documentation et Tarifs",
              "Résilier une prestation", "Contestation et réclamation", "Informations légales",
              "Fonds de Garantie des Dépôts et de Résolution", "Accessibilité Numérique (partiellement conforme)", "Label « Engagé RSE »"
            ].map((item, i) => (
              <p key={i} className="cursor-pointer hover:text-white">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ===== BOUTON FIXE EN BAS ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
        <button
          onClick={() => navigate("/login")}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-full transition max-w-xl mx-auto block"
        >
          Se connecter
        </button>
      </div>

      {/* Espace pour le bouton fixe */}
      <div className="h-20" />
    </div>
  );
}