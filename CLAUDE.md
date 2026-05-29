# La Maison du Bonheur 2026

App de planification de vacances collaboratives entre familles.
Séjour prévu : 11–25 juillet 2026, gîte de Nougerède (Salles-Lavalette, Charente).

## Stack

- **Frontend** : React 18 + Vite 5 (JSX, pas TypeScript)
- **Style** : 100% inline styles, pas de CSS externe ni Tailwind
- **Fonts** : DM Sans + Playfair Display (via Google Fonts)
- **Thème** : dark mode, dégradé bleu-vert, accents dorés (#FFD166, #FF8C42)
- **State** : useState + localStorage (pas de backend/DB)
- **Paiement** : Stripe Checkout (clés test), serverless function Vercel
- **Déploiement** : Vercel (auto-deploy depuis `main`)
- **URL prod** : https://maison-du-bonheur-2026.vercel.app

## Structure du projet

```
index.html              → Point d'entrée HTML
src/
  main.jsx              → Bootstrap React
  App.jsx               → TOUT le code (1930 lignes, fichier unique)
api/
  checkout.js            → Serverless function Stripe Checkout
public/                  → Assets statiques (vide)
.env                     → STRIPE_SECRET_KEY (gitignored)
vite.config.js           → Config Vite minimale
```

## Architecture de App.jsx

Tout est dans un seul fichier. Les composants sont des fonctions déclarées
les unes après les autres. La navigation se fait par un state `active`
qui affiche conditionnellement chaque section.

### Utilitaires (lignes 1–320)
- `DEFAULT_FAMILIES`, `ROOMS_LIST`, `DATES`, `DEFAULT_PLANNING`, `ACTIVITIES_LIST` — données statiques
- `computeNights`, `computeShares` — calcul budget proportionnel aux nuits
- `calculateDebts` — algorithme type Tricount (simplification de dettes)
- `generateCookingPairs` — algo de binômes cuisine équitables
- `loadData` / `saveData` — wrappers localStorage

### Composants (par ordre d'apparition)
| Composant | Onglet | Description |
|---|---|---|
| `Nav` | — | Barre de navigation sticky, scrollable |
| `Hero` | Accueil | Countdown, familles, stats du gîte |
| `SectionTitle` | — | Réutilisable : icône + titre + sous-titre |
| `RoomsSection` | 🛏️ Chambres | Affectation membres → chambres avec dates |
| `PlanningSection` | 📅 Planning | Planning jour par jour, RSVP, propositions |
| `CookingSection` | 👨‍🍳 Cuisine | Binômes auto-générés + menus éditables |
| `ActivitiesSection` | 🎯 Activités | Catalogue filtrable (sport/culture/gastro) |
| `ProfilesSection` | 👥 Profils | Gestion familles, membres, avatars, tags |
| `ShoppingSection` | 🛒 Courses | Liste de courses liée aux menus |
| `ExpensesSection` | 💸 Dépenses | Suivi dépenses + soldes type Tricount |
| `RulesSection` | 📜 Règles d'or | Règles du séjour (statique) |
| `BudgetSection` | 💰 Budget | Répartition coût proportionnelle aux nuits |
| `PricingSection` | ⭐ Abonnement | Page d'abonnement avec Stripe Checkout |
| `App` | — | Composant racine, state global, routing |

## Stripe (page Abonnement)

- 3 plans : Free (0€), Petit Kiff (12€/mois), Gros Kiff (49€/mois)
- Toggle mensuel/annuel avec -20% sur l'annuel
- Petit Kiff : 14 jours d'essai gratuit, sans carte bancaire
- `api/checkout.js` crée une Stripe Checkout Session côté serveur
- Variable d'env requise sur Vercel : `STRIPE_SECRET_KEY`
- Clé publique : `pk_test_51TcSGR...` (non utilisée côté front pour l'instant)
- Les boutons CTA redirigent vers la page Stripe hébergée
- Retour sur `?checkout=success` ou `?checkout=cancel`

## Persistance (localStorage)

Toutes les données sont en localStorage avec le préfixe `bonheur-` :
- `bonheur-families`, `bonheur-roomAssignments`, `bonheur-totalCost`
- `bonheur-rsvps`, `bonheur-proposals`, `bonheur-meals`
- `bonheur-shopping`, `bonheur-expenses`, `bonheur-currentUser`

## Conventions de code

- JSX, pas TypeScript
- Styles 100% inline (objets JS), pas de classes CSS
- Constantes de fonts : `F` = DM Sans, `PF` = Playfair Display
- Pas de routeur (react-router), juste un state `active`
- Pas de composant library externe (tout est custom)
- Fichier unique volontaire — ne pas splitter sans raison

## Commandes

```bash
npm run dev      # Dev server (Vite, port 5173)
npm run build    # Build production → dist/
npm run preview  # Preview du build
```

## Déploiement

Push sur `main` → Vercel auto-deploy.
Les serverless functions dans `api/` sont déployées automatiquement.
La variable `STRIPE_SECRET_KEY` doit être configurée dans Vercel > Settings > Environment Variables.
