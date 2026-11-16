(function () {
  const S = SITE, { $, el, HEART } = WU;
  $('#dv').innerHTML = HEART;
  const root = $('#rsvp');
  const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const evAll = S.events.map(e => ({ id: e.id, label: e.title }));
  const eventsOf = g => g.events || evAll.map(e => e.id);

  root.innerHTML = `
    <div class="card paper" id="step1">
      <div class="field"><label for="q">Seu nome</label>
        <input type="text" id="q" autocomplete="off" placeholder="Comece a digitar…" aria-controls="sugg">
        <ul class="sugg hidden" id="sugg"></ul><p class="msg hidden" id="nf"></p></div>
    </div>
    <div class="card paper hidden" id="step2"></div>
    <div class="card paper done hidden" id="step3"></div>`;
  const q = $('#q'), sugg = $('#sugg'), nf = $('#nf');

  q.addEventListener('input', () => {
    const t = norm(q.value).split(/\s+/).filter(Boolean); sugg.innerHTML = ''; nf.classList.add('hidden');
    if (t.join('').length < 2) { sugg.classList.add('hidden'); return; }
    const hits = S.guests.filter(g => { const n = norm(g.name); return t.every(x => n.includes(x)); }).slice(0, 6);
    sugg.classList.toggle('hidden', !hits.length);
    hits.forEach(g => { const li = el('li'), b = el('button', '', g.name); b.type = 'button'; b.onclick = () => choose(g); li.appendChild(b); sugg.appendChild(li); });
    if (!hits.length) { nf.textContent = 'Não encontramos esse nome na lista. Confira a grafia ou fale com a gente ♡'; nf.classList.remove('hidden'); }
  });

  function choose(g) {
    const members = g.group ? S.guests.filter(x => x.group === g.group) : [g];
    $('#step1').classList.add('hidden');
    const s2 = $('#step2'); s2.classList.remove('hidden');
    let saved = null; try { saved = JSON.parse(localStorage.getItem('rsvp:' + (g.group || g.name)) || 'null'); } catch (_) {}
    s2.innerHTML = `<p class="eyebrow" style="text-align:center">olá, ${g.name.split(' ')[0]}</p>
      <h2 class="script" style="text-align:center;font-size:2.6rem">Você vem?</h2><div class="divider">${HEART}</div>
      <form id="f" novalidate>${members.map((m, i) => `<div class="person"><h4>${m.name}</h4>${eventsOf(m).map(id => {
        const ev = evAll.find(e => e.id === id); const v = saved && saved.answers[i] && saved.answers[i].events[id];
        return `<div class="ev-row"><span>${ev.label}</span><div class="seg">
          <label><input type="radio" name="m${i}-${id}" value="1" ${v === true ? 'checked' : ''}>Vou</label>
          <label class="no"><input type="radio" name="m${i}-${id}" value="0" ${v === false ? 'checked' : ''}>Não vou</label></div></div>`;
      }).join('')}</div>`).join('')}
      <div class="field" style="margin-top:14px"><label for="msg">Recadinho (opcional)</label><textarea id="msg">${saved ? saved.message || '' : ''}</textarea></div>
      <p class="msg hidden" id="err"></p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:22px">
        <button class="btn ghost" type="button" id="back">Voltar</button><button class="btn rose" type="submit" id="send">Enviar confirmação</button></div></form>`;
    $('#back').onclick = () => { s2.classList.add('hidden'); $('#step1').classList.remove('hidden'); q.value = ''; sugg.classList.add('hidden'); q.focus(); };
    $('#f').onsubmit = async e => {
      e.preventDefault();
      const answers = members.map((m, i) => ({ name: m.name, events: Object.fromEntries(eventsOf(m).map(id => {
        const r = document.querySelector(`input[name="m${i}-${id}"]:checked`); return [id, r ? r.value === '1' : null]; })) }));
      if (answers.some(a => Object.values(a.events).includes(null))) { const er = $('#err'); er.textContent = 'Responda “Vou” ou “Não vou” para cada item, por favor ♡'; er.classList.remove('hidden'); return; }
      const payload = { guest: g.name, answers, message: $('#msg').value.trim(), at: new Date().toISOString() };
      try { localStorage.setItem('rsvp:' + (g.group || g.name), JSON.stringify(payload)); } catch (_) {}
      $('#send').disabled = true; $('#send').textContent = 'Enviando…';
      let ok = false;
      if (S.rsvpEndpoint) { try { ok = (await fetch(S.rsvpEndpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) })).ok; } catch (_) {} }
      done(payload, ok);
    };
  }

  function done(p, sent) {
    $('#step2').classList.add('hidden');
    const s3 = $('#step3'); s3.classList.remove('hidden');
    const lines = p.answers.map(a => `${a.name}: ` + Object.entries(a.events).map(([id, v]) => `${evAll.find(e => e.id === id).label} ${v ? '✔' : '✘'}`).join(' · ')).join('\n');
    const text = `Olá, Fernando e Larissa! Confirmação de presença:\n${lines}${p.message ? '\n\n' + p.message : ''}`;
    const wa = `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`;
    s3.innerHTML = `<h2 class="script">Obrigado!</h2><div class="divider">${HEART}</div>
      <p>${p.answers.length > 1 ? 'Recebemos as respostas de vocês' : 'Recebemos a sua resposta'} com muito carinho.</p>
      <pre style="font:inherit;white-space:pre-wrap;margin:14px 0;color:var(--sage-d)">${lines.replace(/</g, '&lt;')}</pre>
      ${sent ? '' : '<p class="msg" style="font-style:normal">Para garantir, envie também por WhatsApp:</p><p style="margin-top:12px"><a class="btn" target="_blank" rel="noopener" href="' + wa + '">Enviar por WhatsApp</a></p>'}
      <p style="margin-top:18px"><a class="btn ghost" href="index.html">Voltar ao início</a></p>`;
  }
})();
