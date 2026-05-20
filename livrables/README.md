# Livrables

Ce dossier contient tout ce que Claude produit pour toi — sites, outils, contenus, formations.

**Règle fondamentale :**
- Ce que TU fournis (documents, PDFs, exports, captures) → `context/import/`
- Ce que Claude PRODUIT → `livrables/`

---

## Structure

```
livrables/
├── sites-web/      # Sites internet complets ou partiels
├── applications/   # Outils, scripts, automatisations
├── youtube/        # Contenus pour la chaîne YouTube
├── cabinet/        # Livrables pour le cabinet de conseil
└── ecole/          # Livrables pour l'académie / la formation
```

---

## Conventions de nommage

**Format général :** `AAAA-MM-JJ_nom-descriptif`

Exemples :
- `2026-05-20_landing-page-appels-offre/`
- `2026-05-20_script-youtube-intro-ia/`
- `2026-06-01_module-formation-prompt-engineering.md`

**Règles :**
- Toujours en minuscules
- Tirets à la place des espaces
- Date en préfixe pour pouvoir trier chronologiquement
- Pas de caractères spéciaux ni accents dans les noms de fichiers
- Un dossier par projet si plusieurs fichiers, un seul fichier sinon

---

## Ce qui va où

| Type de livrable | Dossier |
|------------------|---------|
| Site vitrine, landing page, mini-site | `sites-web/` |
| Script Python, automatisation n8n, outil CLI | `applications/` |
| Script vidéo, hook, titre, calendrier éditorial | `youtube/` |
| Offre de service, template client, rapport, pitch deck | `cabinet/` |
| Module de formation, exercice, support de cours | `ecole/` |
