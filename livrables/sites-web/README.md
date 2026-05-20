# Sites Web

Sites internet produits dans le cadre des activités business.

## Ce que ce dossier contient

- Landing pages (offres de service, lead capture, waitlist)
- Sites vitrines complets
- Sections de sites (hero, pricing, FAQ, etc.)
- Maquettes HTML/CSS statiques
- Prototypes interactifs

## Conventions

Chaque site = un sous-dossier nommé `AAAA-MM-JJ_nom-du-site/`.

Structure type d'un projet site :

```
2026-05-20_landing-appels-offre/
├── index.html
├── styles.css
├── script.js
└── assets/
```

## Déploiement

Les sites sont déployables sur Vercel. Référencer la clé `VERCEL_TOKEN` dans `.env` à la racine du workspace.
