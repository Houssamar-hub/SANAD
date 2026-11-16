# DOCUMENTATION DE L'API REST — SANAD (سند)

L'API SANAD fournit l'ensemble des services d'accompagnement juridique, de recherche RAG, d'accès aux centres d'écoute et de gestion sécurisée des urgences.

Base URL en développement : `http://localhost:5000/api` (ou `http://10.0.2.2:5000/api` sur émulateur Android).

---

## 1. SANTÉ DU SYSTÈME & STATUS

### `GET /api/health`
Vérifie la disponibilité du backend, l'état de la base de données et la configuration des clés d'IA (Gemini & Tavily).

**Réponse (200 OK) :**
```json
{
  "status": "online",
  "app": "SANAD API",
  "tagline": "Vous n'êtes jamais seule.",
  "version": "1.0.0",
  "db": {
    "connected": true,
    "database": "sanad"
  },
  "aiConfig": {
    "geminiConfigured": true,
    "tavilyConfigured": true
  },
  "timestamp": "2026-11-06T17:45:00.000Z"
}
```

---

## 2. ASSISTANT JURIDIQUE INTELLIGENT (SMARTLEGAL AI)

### `POST /api/ai/chat`
Point d'entrée du pipeline RAG pour poser une question juridique. Supporte le Français, l'Arabe et la Darija marocaine (en caractères arabes ou Arabizi latinisé).

**Corps de requête :**
```json
{
  "message": "Chno ndir ila chi wahed kayhaddedni b tsawer dyali ?",
  "language": "darija_arabizi",
  "history": []
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "answer": "Merhba bik f SANAD. 3la hsab l9anoun lmeghribi...",
  "modelUsed": "gemini-1.5-flash",
  "isEmergency": false,
  "emergencyHotlines": null,
  "detectedLanguage": "darija_arabizi",
  "sources": [
    {
      "title": "Cyberharcèlement et diffusion d'images sans consentement",
      "lawNumber": "Code Pénal Marocain Art. 447-1",
      "url": "https://adala.justice.gov.ma"
    }
  ]
}
```

*Remarque : Si une détresse immédiate est détectée, `isEmergency` passe à `true` et `emergencyHotlines` retourne les numéros 19 (Police), 177 (Gendarmerie) et 15 (Protection Civile).*

### `POST /api/ai/feedback`
Enregistre une évaluation qualitative (Utile / Pas utile) pour améliorer le service.

---

## 3. BIBLIOTHÈQUE JURIDIQUE

### `GET /api/legal/categories`
Retourne la liste des catégories juridiques (Droits fondamentaux, Cyberharcèlement, Harcèlement, Travail, Famille/Moudawana...).

### `GET /api/legal`
Retourne la liste des textes et articles de loi marocains simplifiés et vérifiés.

**Paramètres de requête optionnels :**
- `category` (string) : filtrer par catégorie (`droits_fondamentaux`, `cyberharcelement`, etc.)
- `search` (string) : recherche textuelle par mot-clé

### `GET /api/legal/:id`
Retourne le détail complet d'une fiche juridique avec les étapes recommandées et les sources officielles.

---

## 4. CENTRES D'ACCOMPAGNEMENT & D'ÉCOUTE

### `GET /api/centers`
Retourne la liste des centres d'écoute, d'hébergement d'urgence et d'orientation juridique au Maroc.

**Paramètres optionnels :**
- `city` (string) : `Casablanca`, `Rabat`, `Marrakech`, `Fès`, `Tanger`, `Agadir`, `Oujda`
- `service` (string) : `hébergement`, `écoute`, `juridique`

---

## 5. QUIZ ÉDUCATIFS

### `GET /api/quizzes`
Retourne la liste des quiz éducatifs disponibles.

### `POST /api/quizzes/:id/submit`
Soumet les réponses d'une utilisatrice et calcule le score avec explications juridiques détaillées pour chaque question.

---

## 6. SÉCURITÉ & CONTACTS DE CONFIANCE

### `GET /api/trusted-contacts`
Liste les contacts d'urgence enregistrés par l'utilisatrice ou sur l'identifiant matériel invité.

### `POST /api/trusted-contacts`
Ajoute un contact de confiance.
```json
{
  "name": "Sara (Sœur)",
  "phone": "0661234567",
  "relationship": "Famille"
}
```

### `DELETE /api/trusted-contacts/:id`
Supprime définitivement le contact.
