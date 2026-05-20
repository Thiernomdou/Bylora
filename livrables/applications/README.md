# Applications

Scripts, outils et automatisations produits pour gagner du temps ou livrer de la valeur.

## Ce que ce dossier contient

- Scripts Python (analyse, traitement de données, automatisations)
- Workflows n8n ou Make exportés
- Outils CLI (command-line tools)
- Bots (Telegram, Slack, Discord)
- Intégrations API (Notion, Google Sheets, etc.)
- Templates de prompt réutilisables

## Conventions

Chaque outil = un sous-dossier ou un fichier selon la complexité.

```
2026-05-20_analyseur-appels-offre/
├── main.py
├── requirements.txt
└── README.md      # Comment lancer l'outil
```

## Clés API

Les scripts utilisant des APIs doivent lire leurs clés depuis les variables d'environnement définies dans `.env` à la racine, jamais en dur dans le code.

```python
import os
api_key = os.getenv("ANTHROPIC_API_KEY")
```
