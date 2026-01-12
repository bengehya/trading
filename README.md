# 🎯 Trading Growth Assistant (TGA)

Application web intelligente pour suivre et optimiser votre challenge de trading.

## 📋 Fonctionnalités

### ✅ Phase 1 (MVP) - Implémenté

- **🔐 Dashboard Principal**
  - Capital actuel et objectif du jour
  - Progression en temps réel
  - Messages dynamiques de coaching
  - Statistiques clés

- **📝 Journal de Trading**
  - Enregistrement des trades
  - Analyse des setups
  - États émotionnels
  - Historique complet

- **🎯 Gestion du Challenge**
  - Suivi jour par jour
  - Courbe de progression
  - Paramètres personnalisés
  - Calendrier visuel

- **📊 Statistiques Avancées**
  - Win rate et profit factor
  - Performance par setup
  - Meilleur/pire trade
  - Analyses et conseils

- **📅 Planning & Checklist**
  - Sessions recommandées
  - Checklist pré-trading
  - Horaires optimaux

- **⚙️ Paramètres & Règles**
  - Règles de discipline
  - Limites personnalisables
  - Système d'alertes

## 🎨 Design

L'application utilise un thème dark professionnel avec :

- **🟦 Bleu nuit (#0F172A)** : Couleur principale
- **🟩 Vert (#16A34A)** : Succès et profits
- **🟥 Rouge (#DC2626)** : Alertes et pertes
- **🟨 Jaune/Or (#FACC15)** : Objectifs et accents

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Lancer en production
npm start
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

```
trading-growth-assistant/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux
├── components/
│   ├── Dashboard.tsx       # Dashboard principal
│   ├── TradesList.tsx      # Liste des trades
│   ├── ChallengeView.tsx   # Vue du challenge
│   ├── Statistics.tsx      # Statistiques
│   └── Sidebar.tsx         # Navigation latérale
├── lib/
│   └── calculations.ts     # Calculs et logique métier
├── types/
│   └── index.ts            # Types TypeScript
├── data/
│   └── demo-data.ts        # Données de démonstration
└── README.md
```

## 🧠 Concept du Challenge

- **Capital initial** : 100$
- **Objectif** : +20% par jour
- **Durée** : 30 jours
- **Capital cible** : 2300$
- **Risque max par trade** : 1-3%
- **Trades max/jour** : 3

## 💡 Fonctionnalités Intelligentes

### Messages Dynamiques
- ✅ "Tu es dans le plan !" (Statut positif)
- ⚠️ "Attention au sur-trading" (Avertissement)
- 🛑 "Stop trading aujourd'hui" (Blocage)

### Système de Discipline
- Blocage après objectif atteint
- Limite de trades respectée
- Détection de revenge trading
- Gestion du drawdown

## 🔮 Roadmap (Phase 2)

- [ ] Intelligence Artificielle avancée
- [ ] Intégration avec brokers (lecture seule)
- [ ] Application mobile (PWA)
- [ ] Graphiques interactifs avec Recharts
- [ ] Système de notifications
- [ ] Multi-challenges
- [ ] Rapports automatiques
- [ ] Communauté et partage

## 🛠️ Technologies Utilisées

- **Framework** : Next.js 15
- **Langage** : TypeScript
- **Styling** : TailwindCSS
- **Icônes** : Lucide React
- **Graphiques** : Recharts (à implémenter)

## 📊 Données de Démonstration

L'application utilise des données de démonstration pour illustrer les fonctionnalités :
- Challenge actif (jour 8/30)
- Capital : 158.40$ (objectif : 100$ → 2300$)
- 5 trades historiques avec différents setups
- Statistiques calculées en temps réel

## 🎯 Objectifs du Projet

⚠️ **Important** : Cette application NE PASSE PAS d'ordres sur les marchés. Elle sert uniquement à :

1. Structurer votre plan de trading
2. Suivre votre progression
3. Maintenir la discipline
4. Éviter le sur-trading
5. Analyser vos performances

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont les bienvenues !

## 📝 License

Ce projet est sous license MIT.

---

**Made with 💚 for traders by traders**
