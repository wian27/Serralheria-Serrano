'use strict';
const $ = id => document.getElementById(id);
const form = $('quoteForm');
const result = $('result');

function buildMessage({ name, service, city, description }) {
  return [
    'Olá! Gostaria de solicitar um orçamento à Serralheria Serrano.',
    'Nome: ' + name,
    'Serviço: ' + service,
    city ? 'Cidade: ' + city : '',
    'Descrição: ' + description
  ].filter(Boolean).join('\n');
}

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = $('name').value.trim();
  const service = $('service').value.trim();
  const city = $('city').value.trim();
  const description = $('description').value.trim();
  if (!name || !service || !description) {
    result.textContent = 'Preencha o nome, o serviço e a descrição.';
    return;
  }

  const message = buildMessage({ name, service, city, description });
  result.replaceChildren();

  const info = document.createElement('p');
  info.textContent = 'Mensagem preparada. Confira os dados e copie ou compartilhe com o contato oficial da empresa.';
  result.append(info);

  const previewLabel = document.createElement('label');
  previewLabel.textContent = 'Mensagem para envio';
  const preview = document.createElement('textarea');
  preview.value = message;
  preview.readOnly = true;
  preview.rows = 8;
  preview.setAttribute('aria-label', 'Mensagem preparada para copiar');
  previewLabel.append(preview);

  const copy = document.createElement('button');
  copy.type = 'button';
  copy.textContent = 'Copiar mensagem';
  copy.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Área de transferência indisponível');
      await navigator.clipboard.writeText(preview.value);
      info.textContent = 'Mensagem copiada. Envie pelo aplicativo de sua preferência.';
    } catch {
      preview.focus();
      preview.select();
      info.textContent = 'Selecione e copie o texto destacado. O navegador não permitiu a cópia automática.';
    }
  });
  result.append(copy);

  if (navigator.share) {
    const share = document.createElement('button');
    share.type = 'button';
    share.textContent = 'Compartilhar';
    share.addEventListener('click', async () => {
      try {
        await navigator.share({ text: preview.value });
      } catch (error) {
        if (error?.name !== 'AbortError') info.textContent = 'Compartilhamento indisponível. Você pode copiar o texto.';
      }
    });
    result.append(share);
  }
  result.append(previewLabel);
});
