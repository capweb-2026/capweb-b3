# Retour d'expérience — CAP WEB

## 1. Répartition du travail

### Travail réalisé

J'ai réalisé les différentes manipulations nécessaires au projet, notamment :

* utilisation de Git et gestion des branches ;
* création des commits et push sur GitHub ;
* création et vérification des Pull Requests ;
* lecture des diffs avant fusion ;
* vérification des résultats de GitHub Actions ;
* configuration du projet Vercel ;
* configuration des environnements `preview` et `production` ;
* gestion des secrets GitHub/Vercel ;
* vérification des previews ;
* décision et réalisation des merges ;
* approbation des déploiements en production ;
* tests manuels de l'application ;
* vérification de `/version.json` ;
* mise à jour du `README.md` et de la carte des défenses.

### Agent de développement

DeepSeek a été utilisé comme agent pour les tâches de développement qui lui ont été explicitement déléguées.
---

## 2. Tests écrits avant l'implémentation

Pour le CP2, les nouveaux tests concernant l'identité de l'assistant ont été exécutés avant l'implémentation.

La CI est devenue rouge car le fichier nécessaire à l'implémentation de l'identité n'existait pas encore. Cela permettait de vérifier que les nouveaux tests étaient réellement capables de détecter l'absence de la fonctionnalité.

Après l'implémentation, l'ensemble des tests est passé au vert.

### Ce que j'ai appris

Voir un test rouge avant d'écrire le code permet de vérifier que le test contrôle réellement le comportement attendu. Un test qui serait déjà vert avant l'implémentation serait beaucoup moins convaincant.

---

## 3. Cassure volontaire du code

Pour vérifier qu'un test protégeait réellement la limite définie dans la spécification, j'ai volontairement changé la longueur maximale autorisée pour le nom de l'assistant de 20 à 30 caractères.

Le test « refuse un nom de 21 caractères » est alors devenu rouge.

Résultat : 55 tests réussis sur 56.

J'ai ensuite restauré la limite correcte et les 56 tests sont repassés au vert.

### Ce que j'ai appris

Une suite de tests entièrement verte ne suffit pas à démontrer qu'un test est utile. En cassant volontairement le comportement protégé, j'ai pu constater que le test détectait réellement la régression.

---

## 4. Première configuration Vercel incorrecte

Lors de la première configuration du déploiement, certains secrets nécessaires à Vercel n'avaient pas été configurés correctement.

La chaîne pouvait donc donner une impression de fonctionnement alors que le déploiement Vercel attendu n'était pas encore correctement configuré.

### Correction

J'ai vérifié les environnements GitHub `preview` et `production`, supprimé les mauvaises configurations puis recréé correctement les secrets nécessaires.

J'ai ensuite relancé la chaîne et vérifié le résultat réel du déploiement.

### Ce que j'ai appris

Une chaîne verte ne suffit pas toujours. Il faut comprendre ce que chaque job a réellement effectué et vérifier le résultat final.

Pour un déploiement, je dois donc contrôler à la fois la CI et l'application réellement disponible en ligne.

---

## 5. Gestion d'un commit créé au mauvais moment

J'avais créé le commit `preuves CP2` alors que mon `main` local n'était plus au même niveau que le `main` distant.

Pousser directement ce travail aurait pu créer un historique incorrect ou compliquer la fusion.

### Correction

J'ai d'abord sauvegardé le commit sur une branche dédiée.

J'ai ensuite remis mon `main` local au même niveau que `origin/main`.

À partir du `main` à jour, j'ai créé une nouvelle branche propre et récupéré uniquement les modifications nécessaires de `CARTE-DEFENSES.md`.

J'y ai également ajouté l'adresse de production dans le `README.md`.

Ces changements ont ensuite suivi le processus normal : commit, push, Pull Request, CI, merge et déploiement.

### Ce que j'ai appris

Avant de commencer une nouvelle modification, je dois vérifier que ma branche `main` est à jour.

Lorsqu'un historique Git devient incohérent, il est préférable de sauvegarder le travail existant puis de repartir d'une base propre plutôt que de forcer un push.

---

## 6. Preview avant production

La branche contenant l'identité de BalconVert a été déployée en Preview avant d'être fusionnée dans `main`.

J'ai vérifié notamment :

* le nom `BalconVert` ;
* l'emoji 🌱 ;
* le message d'accueil ;
* les trois suggestions ;
* l'envoi d'un message ;
* le refus d'un message vide ;
* l'affichage de `<b>gras</b>` comme du texte ;
* la conservation de la conversation après un rafraîchissement.

Les jobs `verifier`, `preview` et `smoke-preview` étaient verts avant la fusion.

### Ce que j'ai appris

La Preview permet de tester la version qui pourrait entrer dans `main` dans un environnement réellement déployé, sans modifier directement la production.

Une CI verte ne remplace pas complètement une vérification humaine du comportement de l'application.

---

## 7. Approbation humaine de la production

Le déploiement en production n'est pas automatique dès qu'une Pull Request est fusionnée.

L'environnement `production` demande une approbation humaine.

Cette approbation n'a été donnée qu'après la vérification de la Preview et des résultats de la chaîne.

Après l'approbation, les étapes `production`, `smoke-production` et `tag-production` ont pu s'exécuter.

### Ce que j'ai appris

La dernière barrière avant la production reste humaine.

Les tests permettent de réduire les risques, mais c'est à nous de décider si une version vérifiée doit réellement être mise en production.

---

## 8. Vérification du commit réellement servi en production

La production expose un fichier `/version.json`.

Après le dernier déploiement vérifié, celui-ci indiquait notamment le commit :

`4ff49f1fcd10b314c94ed8990d85ab57bdce2972`

Le dernier commit de `main` commençait également par :

`4ff49f1`

Cela permet de relier la version réellement servie en production à une version précise de l'historique Git.

### Ce que j'ai appris

Il ne suffit pas de dire que « la dernière version est en production ».

Avec `/version.json`, je peux identifier précisément le commit servi et le comparer à `main`.

---

## 9. Carte des défenses

La carte des défenses permet d'associer un risque à une barrière et à une preuve concrète.

Par exemple :

* une régression peut être détectée par les tests et la CI ;
* un test affaibli ou supprimé est contrôlé par `check:tests` et la revue ;
* une dépendance ajoutée est contrôlée par `check:deps`.

Les preuves utilisées sont des runs provenant de notre propre dépôt plutôt que de simples affirmations.

### Ce que j'ai appris

Une protection est beaucoup plus convaincante lorsqu'on peut montrer une situation réelle dans laquelle elle a détecté un problème.

La preuve doit être traçable : run GitHub Actions, Pull Request ou autre élément vérifiable du dépôt.

---

## 10. PR non fiables et revue humaine

Une Pull Request ne doit pas être considérée comme sûre uniquement parce que son titre semble correct, que son auteur paraît fiable ou que sa CI est verte.

Avant une fusion, il faut regarder le diff, les fichiers modifiés, les tests, les dépendances et les résultats de la chaîne.

Au moment de ce retour d'expérience, aucune PR piégée du formateur n'était encore ouverte dans notre dépôt. Je n'ai donc pas fabriqué artificiellement une fausse preuve.

### Ce que j'ai appris

La CI constitue une barrière importante, mais elle n'est pas la seule.

La revue humaine reste nécessaire pour comprendre ce qu'une modification fait réellement avant de l'autoriser à atteindre `main`.

---

## 11. Ce que j'améliorerais

Si je recommençais le projet, je ferais plusieurs choses plus tôt :

* vérifier systématiquement que `main` est à jour avant de créer une branche ;
* vérifier la configuration des environnements et des secrets avant le premier déploiement ;
* conserver immédiatement les liens des runs importants ;
* vérifier le résultat réel d'une action plutôt que de me fier uniquement à son statut vert ;
* documenter les problèmes et leurs corrections au moment où ils se produisent ;
* continuer à provoquer volontairement certaines erreurs contrôlées pour vérifier que les barrières fonctionnent réellement.

---

## 12. Ce que le projet m'a apporté

Au début, l'objectif principal était surtout de faire fonctionner un chatbot.

Le projet a ensuite ajouté une autre dimension : être capable de faire évoluer une application sans laisser entrer n'importe quelle modification en production.

J'ai travaillé avec une spécification, des tests, des Pull Requests, une CI, des previews, des smoke tests, une approbation humaine de la production, une identification du commit déployé et une carte des défenses.

Le principal changement dans ma manière de travailler est donc de ne plus seulement me demander « est-ce que le code fonctionne ? », mais également :

**Comment puis-je prouver qu'il fonctionne, détecter lorsqu'il casse et contrôler ce qui arrive réellement en production ?**

## Chemin parcouru depuis le premier projet

### Premier chatbot — lundi

Au début de la semaine, l'objectif était principalement d'avoir un chatbot fonctionnel capable de recevoir un message et d'y répondre.

### Projet actuel — CAP WEB

Le projet est maintenant beaucoup plus structuré : nous avons ajouté une spécification, des tests automatisés et navigateur, une CI, des Pull Requests, des previews, des smoke tests et un déploiement en production avec approbation humaine.

La production permet également d'identifier précisément le commit déployé grâce à `/version.json` et de conserver des points de retour avec les tags `prod-*`.

### Ce que je retiens

Je suis passé d'un projet qui devait simplement **fonctionner** à un projet où je dois aussi être capable de **tester, vérifier et prouver** qu'une modification peut arriver en production sans casser l'existant.
