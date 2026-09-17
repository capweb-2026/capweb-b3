    export function renderMessages(messages, container) {
  const lignes = messages.map((msg) => {
    const li = document.createElement('li');

    if (msg.role === 'user') {
      li.textContent = `Vous : ${msg.text}`;
    } else {
      li.textContent = `Cap Web : ${msg.text}`;
    }

    return li;
  });

  container.replaceChildren(...lignes);
}