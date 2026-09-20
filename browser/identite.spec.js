import { test, expect } from '@playwright/test';
/* global localStorage -- callbacks exécutés dans la page */

// Tests rouges SPEC BalconVert, critères 1 à 5. Échouent tant que l’identité n’est pas affichée.
const ACCUEIL_ATTENDU = 'Bonjour ! Je suis BalconVert 🌱, votre assistant pour réussir votre jardinage sur balcon.';
const SUGGESTIONS_ATTENDUES = [
  'Quelles plantes choisir pour mon balcon ?',
  'Comment bien arroser mes plantes ?',
  'Comment faire pousser des légumes sur un balcon ?',
];

function surveiller(page) {
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  return erreurs;
}

async function pageNeuve(page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

async function envoyer(page, texte) {
  await page.locator('#message').fill(texte);
  await page.getByRole('button', { name: /envoyer/i }).click();
}

const lignes = (page) => page.locator('#messages li');

test.describe('Identité BalconVert — nom et emoji (critères 1 et 2)', () => {
  test('critère 1 : le titre principal affiche BalconVert, 2 à 20 caractères après trim', async ({ page }) => {
    await pageNeuve(page);
    const titre = page.locator('header h1');
    await expect(titre).toContainText('BalconVert');
    const texte = await titre.textContent();
    const longueur = texte.trim().length;
    expect(longueur).toBeGreaterThanOrEqual(2);
    expect(longueur).toBeLessThanOrEqual(20);
  });

  test('critère 2 : exactement un emoji 🌱 visible à côté du nom', async ({ page }) => {
    await pageNeuve(page);
    const entete = await page.locator('header').textContent();
    expect(entete).toContain('🌱');
    expect(entete.split('🌱').length - 1).toBe(1);
  });
});

test.describe('Identité BalconVert — accueil (critère 3)', () => {
  test('conversation vide : #accueil affiche le texte exact, hors de #messages', async ({ page }) => {
    const erreurs = surveiller(page);
    await pageNeuve(page);
    await expect(page.locator('#accueil')).toBeVisible();
    await expect(page.locator('#accueil')).toHaveText(ACCUEIL_ATTENDU);
    await expect(page.locator('#messages #accueil')).toHaveCount(0);
    await expect(lignes(page)).toHaveCount(0);
    expect(erreurs).toHaveLength(0);
  });

  test('l’accueil disparaît dès le premier message envoyé', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    await expect(page.locator('#accueil')).toHaveCount(1);
    await expect(page.locator('#accueil')).toBeHidden();
  });

  test('l’accueil revient quand la conversation est effacée', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    page.once('dialog', (d) => d.accept());
    await page.locator('#effacer').click();
    await expect(lignes(page)).toHaveCount(0);
    await expect(page.locator('#accueil')).toBeVisible();
    await expect(page.locator('#accueil')).toHaveText(ACCUEIL_ATTENDU);
  });
});

test.describe('Identité BalconVert — suggestions (critère 4)', () => {
  test('la page propose exactement les trois questions, hors de #messages', async ({ page }) => {
    await pageNeuve(page);
    const boutons = page.locator('#suggestions button');
    await expect(page.locator('#suggestions')).toBeVisible();
    await expect(page.locator('#messages #suggestions')).toHaveCount(0);
    await expect(boutons).toHaveCount(3);
    for (let i = 0; i < SUGGESTIONS_ATTENDUES.length; i += 1) {
      await expect(boutons.nth(i)).toHaveText(SUGGESTIONS_ATTENDUES[i]);
    }
  });

  test('cliquer une suggestion remplit le champ sans envoyer ni ajouter de ligne', async ({ page }) => {
    await pageNeuve(page);
    const boutons = page.locator('#suggestions button');
    await expect(boutons).toHaveCount(3);
    for (let i = 0; i < SUGGESTIONS_ATTENDUES.length; i += 1) {
      await pageNeuve(page);
      await page.locator('#suggestions button').nth(i).click();
      await expect(page.locator('#message')).toHaveValue(SUGGESTIONS_ATTENDUES[i]);
      await expect(lignes(page)).toHaveCount(0);
    }
  });
});

test.describe('Identité BalconVert — réponses signées (critère 5)', () => {
  test('la réponse de l’assistant commence par BalconVert, pas Cap Web', async ({ page }) => {
    await pageNeuve(page);
    await envoyer(page, 'salut');
    await expect(lignes(page)).toHaveCount(2);
    const texte = await lignes(page).nth(1).textContent();
    expect(texte.trimStart().startsWith('BalconVert')).toBe(true);
    expect(texte.includes('Cap Web')).toBe(false);
  });
});
