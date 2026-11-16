# SANAD (سند)
### Application mobile intelligente de sensibilisation, de protection et d'accompagnement juridique des femmes au Maroc

> **Slogan principal :** « Vous n'êtes jamais seule. »  
> **Slogan secondaire :** « Connaître ses droits, c'est renforcer sa liberté. »  
> **Signature :** DROITS • PROTECTION • ACCOMPAGNEMENT  
> **Cadre :** Campagne nationale du Conseil National des Droits de l'Homme (CNDH) contre les violences faites aux femmes et aux filles

---

## 1. VISION DU PRODUIT

**SANAD** est une plateforme numérique marocaine complète, moderne et rassurante, conçue dès le départ pour accompagner les femmes et les filles dans la compréhension de leurs droits, la prévention des violences (notamment numériques), l'orientation vers les centres d'écoute et l'accès d'urgence aux secours.

### Les 3 Axes Stratégiques CNDH :
1. **Axe A — Prévention :** Guides pédagogiques sur le cyberharcèlement, la sextorsion, les deepfakes et quiz éducatifs interactifs.
2. **Axe B — Accès à la Justice :** Textes du droit positif marocain (Loi 103-13, Code Pénal, Moudawana) expliqués simplement, avec assistant intelligent **SmartLegal AI** comprenant le Français, l'Arabe classique et la Darija marocaine (en caractères arabes et Arabizi).
3. **Axe C — Signalement & Accompagnement :** Numéros d'urgence nationaux (Police 19, Gendarmerie 177, Protection Civile 15) avec confirmation anti-déclenchement accidentel, annuaire des centres d'hébergement et d'écoute par ville, et plan de sécurité personnel.

---

## 2. ARCHITECTURE TECHNIQUE

```text
SANAD/
├── mobile/                     # Application mobile React Native (Expo SDK 52)
│   ├── app/                    # Navigation basée sur Expo Router
│   │   ├── (tabs)/             # 4 Onglets principaux : Accueil, Mes Droits, Assistant IA, Aide
│   │   ├── quiz/               # Module de quiz éducatifs interactifs
│   │   ├── prevention/         # Guides et campagnes de prévention
│   │   ├── safety/             # Plan de sécurité personnel discret
│   │   ├── evidence/           # Journal confidentiel des faits et incidents
│   │   ├── onboarding/         # Onboarding doux en 3 étapes
│   │   └── profile/            # Paramètres de langue et vie privée
│   ├── src/
│   │   ├── components/         # Header, SanadLogo, QuickExitButton, SosModal
│   │   ├── i18n/               # Multilingue complet (FR, AR, Darija) avec support RTL
│   │   ├── store/              # AppStore React Context (Contacts, Langue, SOS)
│   │   ├── theme/              # Palette officielle (#29483B, #47765D, #C95B4B...)
│   │   └── services/           # Client API Axios avec données fallbacks résilientes
│   └── assets/                 # Icônes et écrans de démarrage
│
├── server/                     # Backend Node.js & Express API
│   ├── src/
│   │   ├── config/             # Variables d'environnement & Connexion MongoDB
│   │   ├── controllers/        # Logique métier (AI, Legal, Centers, Quizzes, Contacts)
│   │   ├── models/             # Schémas Mongoose (User, LegalDocument, SupportCenter...)
│   │   ├── routes/             # Endpoints REST validés par Zod
│   │   ├── services/           # RAG Engine, Google Gemini API, Tavily Search API
│   │   ├── utils/              # Base juridique marocaine officielle vérifiée (Loi 103-13...)
│   │   └── server.js           # Point d'entrée avec Helmet, Rate Limiting & CORS
│   └── __tests__/              # Tests automatisés Jest pour la détection Darija, SOS et RAG
│
├── docs/                       # Spécifications d'API et architecture
├── TEST_REPORT.md              # Rapport complet de validation qualité
└── README.md
```

---

## 3. IDENTITÉ VISUELLE & PALETTE OFFICIELLE

Le design system privilégie une atmosphère chaleureuse, protectrice et élégante :

| Nom | Code HEX | Rôle dans l'interface |
|---|---|---|
| **Deep Forest** | `#29483B` | Identité de marque principale & boutons maîtres |
| **Emerald** | `#47765D` | Actions positives et validation |
| **Terracotta** | `#C95B4B` | Urgence SOS, alertes critiques |
| **Warm Cream** | `#FFF8F0` | Fond principal apaisant |
| **Soft Sand** | `#F1E5D8` | Surfaces secondaires et badges |
| **Golden Honey** | `#D6A65D` | Accents visuels et étoiles |
| **Dark Cocoa** | `#30251F` | Typographie des titres |
| **Warm Grey** | `#807A73` | Textes secondaires et métadonnées |

---

## 4. DÉMARRAGE RAPIDE

### Prérequis
- Node.js (version 18 ou supérieure, testé sous Node v22)
- npm ou yarn
- (Optionnel) MongoDB local ou MongoDB Atlas pour la persistance avancée

### 4.1 Lancement du Backend

1. Rendez-vous dans le dossier serveur :
   ```bash
   cd server
   ```
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez vos clés dans le fichier `.env` :
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/sanad
   JWT_SECRET=votre_cle_secrete_jwt
   GEMINI_API_KEY=VOTRE_CLE_GEMINI
   GEMINI_MODEL=gemini-1.5-flash
   TAVILY_API_KEY=VOTRE_CLE_TAVILY
   MAPTILER_API_KEY=VOTRE_CLE_MAPTILER
   ```
4. Lancez le serveur :
   ```bash
   npm start
   ```
   *Le serveur démarre sur `http://localhost:5000`. Grâce à son architecture résiliente, il fonctionne immédiatement même si MongoDB n'est pas encore démarré grâce à son moteur in-memory intégré.*

5. Exécutez la suite de tests automatisés :
   ```bash
   npm test
   ```

---

### 4.2 Lancement de l'Application Mobile

1. Rendez-vous dans le dossier mobile :
   ```bash
   cd mobile
   ```
2. Installez les dépendances :
   ```bash
   npm install --legacy-peer-deps
   ```
3. Vérifiez la compilation TypeScript :
   ```bash
   npx tsc --noEmit
   ```
4. Démarrez le serveur Expo :
   ```bash
   npx expo start
   ```
   - Pour lancer sur **Android** : appuyez sur `a` ou connectez un smartphone avec l'application Expo Go.
   - Pour lancer sur **Navigateur Web** : appuyez sur `w`.

---

## 5. FONCTIONNALITÉS CLÉS

### 5.1 SmartLegal AI (RAG Multilingue)
- **Compréhension culturelle :** Détecte et répond couramment en Français, en Arabe et en Darija marocaine (y compris les formulations en Arabizi : *"Chno ndir ila chi wahed kayhaddedni b tsawer dyali ?"*).
- **Zéro Hallucination :** S'appuie exclusivement sur les lois marocaines réelles (Loi 103-13, Code Pénal, Moudawana) et les sources officielles du Ministère de la Justice (`adala.justice.gov.ma`) et du CNDH (`cndh.ma`).
- **Garde-fous déontologiques :** Rappelle systématiquement qu'il s'agit d'une information juridique et non d'une consultation d'avocat.
- **Détection des urgences :** Déclenche instantanément une bannière d'alerte avec les numéros de secours (19, 177, 15) dès qu'une détresse vitale est détectée.

### 5.2 Sécurité & Confidentialité
- **Bouton Sortie Rapide (Quick Exit) :** Présent en permanence dans le header, il permet de basculer instantanément l'écran vers une page neutre en cas de situation délicate.
- **Aucun compte obligatoire :** L'application est utilisable en mode invité (Guest Mode) pour garantir l'anonymat complet.
- **Protection des appels :** Aucun numéro n'est appelé automatiquement ; une boîte de confirmation explicite s'affiche toujours avant d'ouvrir le composeur téléphonique.

### 5.3 Annuaire des Centres d'Écoute
- Filtre par ville marocaine (Casablanca, Rabat, Fès, Marrakech, Tanger, Agadir, Oujda).
- Affichage des horaires, services (hébergement, écoute, assistance juridique) et bouton d'appel direct.

---

## 6. INSTRUCTIONS DE BUILD POUR ANDROID (APK / AAB)

Pour générer un fichier APK autonome pour Android :

1. Installez EAS CLI :
   ```bash
   npm install -g eas-cli
   ```
2. Connectez-vous à votre compte Expo :
   ```bash
   eas login
   ```
3. Configurez et lancez le build :
   ```bash
   cd mobile
   eas build --platform android --profile preview
   ```

---

## 7. ENGAGEMENT ÉTHIQUE

SANAD s'engage à :
- Ne jamais afficher d'images choquantes ou victimisantes.
- Ne pas collecter de coordonnées géographiques sans consentement préalable et action de l'utilisatrice.
- Ne jamais simuler des lois ou des numéros de téléphone inexistants.
- Accompagner chaque femme avec respect, bienveillance et rigueur.

**SANAD — Vous n'êtes jamais seule.**
