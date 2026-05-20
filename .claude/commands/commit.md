# /commit

> Sauvegarder l'état actuel du workspace via Git.

---

## Mission

Quand je lance `/commit` (ou `/commit <message optionnel>`), tu vas suivre les étapes ci-dessous, sans jamais sauter la vérification des secrets.

---

### Étape 1 : Vérifier l'état du repo Git

Lance `git status` à la racine du workspace.

**Cas A, le workspace n'est PAS un repo Git :**
- Préviens-moi clairement
- Propose d'initialiser avec `git init`
- Attends ma confirmation explicite avant de l'exécuter
- Une fois `git init` fait, configure ma branche par défaut sur `main` (`git branch -M main`) et enchaîne sur l'étape 2

**Cas B, le workspace EST un repo Git :**
- Passe directement à l'étape 2

---

### Étape 2 : Inspecter les changements

En parallèle, lance :
- `git status` (vue d'ensemble)
- `git diff` (changements non staged)
- `git diff --cached` (changements déjà staged)
- `git log --oneline -5` (5 derniers commits, si l'historique existe)

Si rien n'a changé, dis-le-moi simplement, n'essaie pas de créer un commit vide.

---

### Étape 3 : Vérifier qu'aucun secret n'est sur le point d'être commité

**Vérification critique, à ne JAMAIS sauter :**

- Vérifier que `.env` n'apparaît PAS dans la liste des fichiers à commiter
- Vérifier qu'aucun fichier `.key`, `.pem`, `credentials`, ou contenant des clés d'API en clair n'est dans la liste
- Vérifier que `.gitignore` existe à la racine et couvre bien `.env` (et les autres patterns sensibles)

**Si un secret risque d'être commité** : ARRÊTE-TOI immédiatement, alerte-moi, attends ma correction (ajouter au `.gitignore`, faire `git rm --cached`, etc.), et attends ma validation avant de continuer.

---

### Étape 4 : Rédiger le message de commit

- **Si j'ai passé un message en argument** : utilise-le tel quel
- **Sinon** : génère un message automatique en français qui décrit le sens du changement (pas juste le diff technique)

Conventions :
- Première ligne courte (idéalement 50 caractères max), verbe à l'infinitif
- Verbes types : "Ajouter", "Mettre à jour", "Supprimer", "Documenter", "Refactoriser", "Corriger"
- Décrire la valeur du changement, pas les fichiers modifiés
- Si plusieurs changements indépendants, ajouter un paragraphe de détail sous la première ligne

Exemples :
- `Ajouter la structure de livrables et les README`
- `Mettre à jour le contexte personnel avec le déménagement à Lyon`
- `Corriger le formulaire de contact de la landing page`

---

### Étape 5 : Demander confirmation

Affiche-moi :
1. La liste des fichiers qui vont être stagés
2. Le message de commit proposé

Attends mon accord explicite ("ok", "oui", "go", ou toute confirmation claire) avant de continuer.

---

### Étape 6 : Commiter

1. Stage les fichiers (`git add` fichier par fichier, jamais `git add -A` sans vérification)
2. Crée le commit avec le message validé
3. Affiche `git log --oneline -3` pour confirmer

---

## Règles absolues

- `.env` et tout fichier listé dans `.gitignore` : jamais commité, sans exception
- Pas de `git push` sauf si je le demande explicitement
- Pas de `--no-verify` sauf si je le demande explicitement
- Si quelque chose est ambigu, demande plutôt que de deviner
