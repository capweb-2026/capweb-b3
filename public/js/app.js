import { validateMessage, replyTo } from './brain.js';
import { renderMessages } from './view.js';

const formulaire = document.querySelector('#chat-form');
const statut = document.querySelector('#status');
const versionElt = document.querySelector('#version');
const champ = document.querySelector('#message');
const liste = document.querySelector('#messages');
const boutonEffacer = document.querySelector('#effacer');

const historique = [];

function sauvegarderHistorique() {
  localStorage.setItem('capweb.historique', JSON.stringify(historique));
}

function chargerHistorique() {
  const sauvegarde = localStorage.getItem('capweb.historique');

  if (!sauvegarde) {
    return;
  }

  try {
    const donnees = JSON.parse(sauvegarde);

    if (Array.isArray(donnees)) {
      historique.push(...donnees);
      renderMessages(historique, liste);
    }
  } catch {
    historique.length = 0;
    statut.textContent = 'La conversation sauvegardée est invalide. Une nouvelle conversation commence.';
  }
}

formulaire?.addEventListener('submit', (event) => {
  event.preventDefault();

  const resultat = validateMessage(champ.value);

  if (!resultat.ok) {
    statut.textContent = resultat.error;
    champ.focus();
    return;
  }

  const value = resultat.value;

  historique.push({
    role: 'user',
    text: value
  });

  historique.push({
    role: 'assistant',
    text: replyTo(value)
  });

  sauvegarderHistorique();
  renderMessages(historique, liste);

  champ.value = '';
  statut.textContent = '';
  champ.focus();
});

boutonEffacer?.addEventListener('click', () => {
  if (confirm('Voulez-vous vraiment effacer la conversation ?')) {
    historique.length = 0;
    localStorage.removeItem('capweb.historique');
    renderMessages(historique, liste);
    statut.textContent = '';
    champ.focus();
  }
});

chargerHistorique();

fetch('/version.json', { headers: { accept: 'application/json' } })
  .then((reponse) => (reponse.ok ? reponse.json() : null))
  .then((donnees) => {
    if (donnees && typeof donnees.version === 'string' && versionElt) {
      versionElt.textContent = `version ${donnees.version}`;
    }
  })
  .catch(() => {}); 