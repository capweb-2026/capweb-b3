export const persona = {
  nom: 'BalconVert',
  emoji: '🌱',
  accueil: 'Bonjour ! Je suis BalconVert 🌱, votre assistant pour réussir votre jardinage sur balcon.',
  suggestions: [
    'Quelles plantes choisir pour mon balcon ?',
    'Comment bien arroser mes plantes ?',
    'Comment faire pousser des légumes sur un balcon ?',
  ],
};

function compterGraphemes(texte) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    return [...new Intl.Segmenter('fr', { granularity: 'grapheme' }).segment(texte)].map((s) => s.segment);
  }
  return [...texte];
}

function estEmojiUnique(emoji) {
  if (typeof emoji !== 'string') {
    return false;
  }
  const graphemes = compterGraphemes(emoji);
  if (graphemes.length !== 1) {
    return false;
  }
  return /\p{Extended_Pictographic}/u.test(graphemes[0]);
}

export function validatePersona(candidate) {
  const erreurs = [];

  if (!candidate || typeof candidate !== 'object') {
    return { ok: false, erreurs: ['identité invalide'] };
  }

  const longueurNom =
    typeof candidate.nom === 'string' ? candidate.nom.trim().length : 0;
  if (typeof candidate.nom !== 'string' || longueurNom < 2 || longueurNom > 20) {
    erreurs.push('le nom doit faire de 2 à 20 caractères après suppression des espaces autour');
  }

  if (!estEmojiUnique(candidate.emoji)) {
    erreurs.push('l’emoji doit être exactement un emoji visible');
  }

  if (
    typeof candidate.accueil !== 'string' ||
    !candidate.accueil.includes(persona.nom)
  ) {
    erreurs.push('l’accueil doit contenir le nom de l’assistant');
  }

  if (!Array.isArray(candidate.suggestions) || candidate.suggestions.length !== 3) {
    erreurs.push('les suggestions doivent être exactement trois questions');
  } else {
    const invalide = candidate.suggestions.some(
      (suggestion) => typeof suggestion !== 'string' || suggestion.trim().length === 0,
    );
    if (invalide) {
      erreurs.push('chaque suggestion doit être un texte non vide');
    }
  }

  if (erreurs.length === 0) {
    return { ok: true };
  }
  return { ok: false, erreurs };
}
