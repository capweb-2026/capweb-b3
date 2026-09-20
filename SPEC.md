# SPEC.md — Identité de BalconVert

## Objectif

BalconVert est un assistant spécialisé dans le jardinage sur balcon. Son identité doit être reconnaissable dès l'ouverture de la page grâce à son nom, son emoji, son message d'accueil et ses trois questions suggérées.

## Critères d'acceptation

1. **Nom** — Quand la page s'ouvre, le système affiche le nom `BalconVert` dans le titre principal. Le nom, sans les espaces autour, fait de 2 à 20 caractères.

2. **Emoji** — Quand la page s'ouvre, le système affiche exactement un emoji `🌱` à côté du nom. Un emoji visible, même s'il est composé de plusieurs unités Unicode, compte comme un seul emoji.

3. **Accueil** — Quand la conversation est vide, le système affiche le message d'accueil `Bonjour ! Je suis BalconVert 🌱, votre assistant pour réussir votre jardinage sur balcon.` Ce message contient le nom `BalconVert`, n'est pas une ligne de `#messages`, disparaît dès le premier message envoyé et revient quand la conversation est effacée.

4. **Suggestions** — Quand la page s'ouvre, le système propose exactement trois questions suggérées :

   * `Quelles plantes choisir pour mon balcon ?`
   * `Comment bien arroser mes plantes ?`
   * `Comment faire pousser des légumes sur un balcon ?`

   Quand l'utilisateur clique sur une suggestion, le système place la question dans le champ `#message` sans l'envoyer et sans ajouter de ligne dans `#messages`.

5. **Réponses signées** — Quand l'assistant répond à un message, le système affiche une ligne dont l'identité de l'assistant commence par `BalconVert` au lieu de `Cap Web`.

6. **Contrat** — Quand les vérifications du projet sont lancées, le système conserve tous les tests du contrat CP1 au vert.

## Hors périmètre

L'utilisateur ne peut pas modifier le nom, l'emoji ou les suggestions de BalconVert. Cette fonctionnalité n'ajoute pas d'image d'avatar, d'appel à une IA, de nouvelle dépendance ni de fonctionnalité sans rapport avec l'identité de l'assistant.

## Données et fonctions attendues

* `public/js/persona.js` exporte `persona = { nom, emoji, accueil, suggestions }`.
* `persona.nom` vaut `BalconVert`.
* `persona.emoji` vaut `🌱`.
* `persona.accueil` vaut `Bonjour ! Je suis BalconVert 🌱, votre assistant pour réussir votre jardinage sur balcon.`
* `persona.suggestions` est un tableau contenant exactement les trois questions définies dans le critère 4.
* `public/js/persona.js` exporte `validatePersona(persona)`.
* `validatePersona(persona)` renvoie `{ ok: true }` lorsque l'identité respecte toutes les règles.
* En cas d'identité invalide, `validatePersona(persona)` renvoie `{ ok: false, erreurs: [texte, …] }`.
* `validatePersona` refuse un nom qui, après suppression des espaces autour, fait moins de 2 ou plus de 20 caractères.
* `validatePersona` refuse un emoji qui n'est pas exactement un emoji visible.
* `validatePersona` refuse un accueil qui ne contient pas le nom de l'assistant.
* `validatePersona` refuse un nombre de suggestions différent de trois et toute suggestion vide.
* La page contient `#accueil` et `#suggestions`, en dehors de `#messages`.
* `persona.js` est ajouté à la liste blanche du serveur local.

## Questions ouvertes

Aucune.
