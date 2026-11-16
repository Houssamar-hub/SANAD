# SANAD Intelligent AI Assistant — Documentation Technique

> **Plateforme Nationale d'Accompagnement, de Protection et d'Orientation Juridique des Femmes au Maroc**  
> *En partenariat avec la Campagne Nationale du CNDH contre les violences faites aux femmes et aux filles.*

---

## 1. Vue d'ensemble de l'Architecture

L'assistant intelligent **SANAD AI** (سند) est un système conversationnel multilingue conçu spécifiquement pour le contexte juridique et socioculturel marocain. Il combine détection de la langue, classification d'intention multi-niveaux, surveillance conservatrice de sécurité et RAG (Retrieval-Augmented Generation) adossé aux textes officiels de lois marocaines.

```
                              ┌─────────────────────────┐
                              │    Message Utilisatrice │
                              │ (Darija/Arabizi/Ar/Fr)  │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │    Language Detection   │
                              │ (languageService.js)    │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │  Safety & Risk Monitor  │
                              │  (safetyService.js)     │
                              │  [0% False Negatives]   │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │ Intent Classifier (12)  │
                              │   (intentService.js)    │
                              └────────────┬────────────┘
                                           │
                  ┌────────────────────────┼────────────────────────┐
                  ▼                        ▼                        ▼
           ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
           │    MODE A    │         │    MODE B    │         │    MODE C    │
           │ Conversation │         │   Juridique  │         │   Urgence    │
           │  Naturelle   │         │ (RAG Adala)  │         │  Protection  │
           └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
                  │                        │                        │
                  └────────────────────────┼────────────────────────┘
                                           ▼
                              ┌─────────────────────────┐
                              │  Conversation Service   │
                              │  (conversationService)  │
                              │ Gemini 2.5 Flash + RAG  │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │    Réponse Structurée   │
                              │ (Mode, Sources, Hotlines)
                              └─────────────────────────┘
```

---

## 2. Les 3 Modes Opératoires

### Mode A — Conversation Naturelle (General Conversation)
- **Objectif** : Offrir une expérience fluide, amicale et décontractée.
- **Principe fondamental** : **Ne JAMAIS forcer de discussion juridique ni de disclaimers lorsqu'une utilisatrice engage une conversation courante.**
- **Exemples** :
  - *« Salam kidayra labas »* $\rightarrow$ Réponse chaleureuse en Darija/Arabizi sans mention de tribunaux.
  - *« Bonjour, qui es-tu ? »* $\rightarrow$ Présentation claire et rassurante de SANAD.

### Mode B — Information Juridique Grounded (Legal Information)
- **Objectif** : Délivrer une information juridique marocaine vérifiée, accessible et pratique.
- **Corpus officiel intégré** :
  - **Loi 103-13** relative à la lutte contre les violences faites aux femmes.
  - **Code Pénal Marocain** (articles 444-1, 447-1, 480-1, 503-1-1).
  - **Code de la Famille (Moudawana)** (Articles 94 à 97 Chiqaq, Nafaqa, Hadana).
  - **Code du Travail (Loi 65-99)** (Harcèlement sexuel comme faute grave de l'employeur).
  - **Loi 09-08** sur la protection des données personnelles et la cybercriminalité.
- **Sources vérifiées** :
  - Portail Adala du Ministère de la Justice (`adala.justice.gov.ma`).
  - Bulletin Officiel du SGG (`sgg.gov.ma`).
  - Conseil National des Droits de l'Homme (`cndh.ma`).

### Mode C — Protection et Urgence (Safety & Emergency)
- **Objectif** : Priorité absolue à la sécurité physique et psychologique de l'utilisatrice.
- **Règles éthiques strictes** :
  - **Aucun blâme de la victime.**
  - **Aucune pression pour confronter l'agresseur.**
  - Présentation immédiate des numéros d'urgence nationaux :
    - **19** : Police Secours (zone urbaine - DGSN).
    - **177** : Gendarmerie Royale (zone rurale).
    - **15** : Protection Civile (Ambulance / Urgence vitale).
    - **0800000103** : Ligne d'écoute nationale.
  - Conseils pratiques de mise à l'abri et certificat médical gratuit à l'hôpital public.

---

## 3. Support Multilingue Natif

L'assistant supporte 4 langues et registres d'écriture :
1. **Darija marocaine en graphie arabe** (ديالي، واش، كيفاش، راجلي، كيهددني...).
2. **Arabizi marocain en caractères latins** (chiffres phonétiques : 3=ع, 7=ح, 9=ق...).
3. **Arabe Standard Moderne** (الفصحى القانونية والإرشادية).
4. **Français** (terminologie juridique et conversationnelle).

---

## 4. Endpoints d'API Disponibles

### `POST /api/ai/chat`
Endpoint principal conversationnel multi-tours.
- **Payload** :
  ```json
  {
    "message": "chnou kaygoul l9anoun 103-13 3la taharouch f chari3?",
    "history": [
      { "sender": "user", "text": "Salam" },
      { "sender": "assistant", "text": "Wa alaykom salam !" }
    ],
    "language": "arabizi"
  }
  ```
- **Réponse** :
  ```json
  {
    "success": true,
    "mode": "MODE_B",
    "response": "القانون المغربي (خصوصاً القانون 103-13)...",
    "sources": [
      {
        "code": "Loi 103-13",
        "article": "Article 503-1-1",
        "title": "التحرش الجنسي في الفضاء العام أو الإلكتروني",
        "url": "https://adala.justice.gov.ma"
      }
    ],
    "suggestedQuestions": [
      "كيفاش نحط شكاية عند وكيل الملك؟",
      "شنو هي عقوبة الابتزاز الإلكتروني؟"
    ]
  }
  ```

### `POST /api/ai/detect-intent`
Détection rapide de l'intention et du niveau de risque de sécurité.

### `POST /api/ai/legal-search`
Recherche sémantique dans le corpus juridique officiel marocain.

### `POST /api/ai/safety-guidance`
Protocole de mise en sécurité d'urgence et numéros d'assistance.

### `GET /api/ai/sources`
Liste des portails institutionnels officiels indexés.

### `POST /api/ai/feedback`
Évaluation utilisateur sans stockage intrusif de données personnelles.
