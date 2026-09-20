# Carte des défenses

Chaque ligne dit quelle connerie est arrêtée, par quoi, et **où est la preuve** : le lien d'un run rouge ou d'une PR bloquée. Une barrière sans preuve ne compte pas.

| Connerie | Barrière qui l'arrête | Preuve (lien) | Checkpoint |
|---|---|---|---|
| Régression | Tests de contrat et CI obligatoire sur `main` | | https://github.com/capweb-2026/capweb-b3/actions/runs/35209906403 : mutation volontaire 280 → 281 détectée et bloquée par `verifier` | CP1 |

| Test affaibli ou supprimé | `check:tests` (TEST-CHANGE obligatoire) et relecture | | https://github.com/capweb-2026/capweb-b3/actions/runs/35511015743 : nouveaux tests d’identité exécutés avant le code et CI rouge ; cassure volontaire de la limite 20 → 30 détectée localement par le test « refuse un nom de 21 caractères » (55/56 tests). | CP2 |

| Dépendance ajoutée | `check:deps` et `dependances-autorisees.json` | | https://github.com/capweb-2026/capweb-b3/actions/runs/35512392683 : CI finale verte ; `check:deps` confirme qu’aucune dépendance non autorisée n’a été ajoutée. | CP2 |

| Secret exposé | | | CP3 |
| IA qui sort de son thème | | | CP3 |
| Faille (`innerHTML`, injection) | | | CP4 |
| Contrôle désactivé | | | CP4 |
| Action destructrice | | | CP4 |
