import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { persona, validatePersona } from '../public/js/persona.js';

// Tests rouges SPEC BalconVert, critères 1 à 5. Échouent tant que public/js/persona.js manque.
const NOM_ATTENDU = 'BalconVert';
const EMOJI_ATTENDU = '🌱';
const ACCUEIL_ATTENDU = 'Bonjour ! Je suis BalconVert 🌱, votre assistant pour réussir votre jardinage sur balcon.';
const SUGGESTIONS_ATTENDUES = [
  'Quelles plantes choisir pour mon balcon ?',
  'Comment bien arroser mes plantes ?',
  'Comment faire pousser des légumes sur un balcon ?',
];

describe('Identité BalconVert — données persona (critères 1 à 4)', () => {
  it('critère 1 : le nom vaut BalconVert, 2 à 20 caractères après trim', () => {
    assert.equal(persona.nom, NOM_ATTENDU);
    const longueur = persona.nom.trim().length;
    assert.ok(longueur >= 2 && longueur <= 20, `longueur attendue 2-20, reçue : ${longueur}`);
  });

  it('critère 2 : l’emoji vaut 🌱, exactement un emoji visible', () => {
    assert.equal(persona.emoji, EMOJI_ATTENDU);
    assert.equal([...persona.emoji].length, 1);
  });

  it('critère 3 : l’accueil vaut le texte exact et contient le nom', () => {
    assert.equal(persona.accueil, ACCUEIL_ATTENDU);
    assert.ok(persona.accueil.includes(persona.nom), 'l’accueil doit contenir le nom');
  });

  it('critère 4 : les suggestions sont exactement les trois questions attendues', () => {
    assert.deepEqual(persona.suggestions, SUGGESTIONS_ATTENDUES);
  });
});

describe('validatePersona — nom, cas limites du critère 1', () => {
  it('refuse un nom d’un seul caractère', () => {
    const resultat = validatePersona({ ...persona, nom: 'A' });
    assert.equal(resultat.ok, false);
    assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
  });

  it('accepte un nom de 2 caractères', () => {
    const resultat = validatePersona({ ...persona, nom: 'AB' });
    assert.deepEqual(resultat, { ok: true });
  });

  it('accepte un nom de 20 caractères', () => {
    const resultat = validatePersona({ ...persona, nom: 'A'.repeat(20) });
    assert.deepEqual(resultat, { ok: true });
  });

  it('refuse un nom de 21 caractères', () => {
    const resultat = validatePersona({ ...persona, nom: 'A'.repeat(21) });
    assert.equal(resultat.ok, false);
    assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
  });
});

describe('validatePersona — autres refus (critères 2 à 4)', () => {
  it('valide l’identité correcte avec { ok: true }', () => {
    assert.deepEqual(validatePersona(persona), { ok: true });
  });

  it('critère 2 : refuse un emoji vide, double ou non-emoji', () => {
    for (const emoji of ['', '🌱🌱', 'X']) {
      const resultat = validatePersona({ ...persona, emoji });
      assert.equal(resultat.ok, false, `emoji refusé attendu pour : ${emoji}`);
      assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
    }
  });

  it('critère 3 : refuse un accueil qui ne contient pas le nom', () => {
    const resultat = validatePersona({ ...persona, accueil: 'Bonjour, votre assistant jardinage.' });
    assert.equal(resultat.ok, false);
    assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
  });

  it('critère 4 : refuse un nombre de suggestions différent de trois', () => {
    for (const suggestions of [[], SUGGESTIONS_ATTENDUES.slice(0, 2), [...SUGGESTIONS_ATTENDUES, 'Et les herbes ?']]) {
      const resultat = validatePersona({ ...persona, suggestions });
      assert.equal(resultat.ok, false, `3 suggestions exigées, reçues : ${suggestions.length}`);
      assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
    }
  });

  it('critère 4 : refuse toute suggestion vide ou faite d’espaces', () => {
    for (const suggestions of [['', SUGGESTIONS_ATTENDUES[1], SUGGESTIONS_ATTENDUES[2]], ['   ', SUGGESTIONS_ATTENDUES[1], SUGGESTIONS_ATTENDUES[2]]]) {
      const resultat = validatePersona({ ...persona, suggestions });
      assert.equal(resultat.ok, false);
      assert.ok(Array.isArray(resultat.erreurs) && resultat.erreurs.length > 0);
    }
  });
});
