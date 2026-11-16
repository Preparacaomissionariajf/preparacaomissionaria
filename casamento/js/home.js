(function () {
  const S = SITE, { $, el, HEART } = WU;
  const heart = () => `<div class="divider">${HEART}</div>`;
  ['dv', 'dv2', 'dv3'].forEach(id => { const d = $('#' + id); if (d) { d.innerHTML = HEART; } });

  /* ---------- hero ---------- */
  $('#names').innerHTML = `${S.couple.a}<em>&amp;</em>${S.couple.b}`;
  const wd = new Date(S.weddingDate);
  $('#meta').textContent = wd.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) + ' · ' + S.place;

  /* ---------- carta de abertura ---------- */
  const intro = $('#intro');
  const items = `
    <article class="item note" aria-label="Bilhete">${S.note.map(p => `<p>${p}</p>`).join('')}</article>
    <article class="item photo" aria-label="Foto">
      <div class="shot"><div class="imgbox" data-label="foto de vocês"><img src="${S.photo.src}" alt="" data-fb></div><span class="stamp">${S.photo.stamp}</span></div>
      <div class="cap">${S.photo.caption}</div>
    </article>
    <article class="item invite" aria-label="Convite">
      <span class="fl fl-tl"></span><span class="fl fl-br"></span>
      <p class="eyebrow">com muito amor</p>
      <p class="names">${S.couple.a}<em>&amp;</em>${S.couple.b}</p>
      <p class="line">${S.invite.line}</p>
      <p class="when">${S.invite.when}</p>
      <p class="where">${S.invite.where}</p>
      <p class="sc">${S.invite.script}</p>
    </article>`;
  const face = (withItems, cls) => `<div class="env-face ${cls}">
      <div class="env-body"></div>
      ${withItems ? `<div class="env-items">${items}</div>` : ''}
      <div class="env-pocket"></div><div class="env-flap"></div>
      <div class="seal">${S.couple.a[0]}&amp;${S.couple.b[0]}</div></div>`;
  intro.innerHTML = `
    <span class="fl fl-tl"></span><span class="fl fl-br"></span>
    <div class="intro-top"><p class="eyebrow">você recebeu uma carta</p></div>
    <div class="stage"><div class="env" id="env" role="button" tabindex="0" aria-label="Toque para abrir a carta">
      <div class="env-3d" id="env3d">${face(true, 'front')}${face(false, 'back')}</div></div></div>
    <p class="hint">toque para abrir</p>
    <button class="btn enter" id="enter">Entrar no site</button>`;
  watchImages(intro);

  let seen = false; try { seen = !!sessionStorage.getItem('introSeen'); } catch (_) {}
  if (seen) { intro.remove(); document.body.classList.remove('lock'); }
  else {
    const env = $('#env'), env3d = $('#env3d');
    let angle = 0, opened = false;
    const flip = setInterval(() => { angle += 180; env3d.style.transform = `rotateY(${angle}deg)`; }, 5200);
    const first = setTimeout(() => { angle += 180; env3d.style.transform = `rotateY(${angle}deg)`; }, 2200);

    function open() {
      if (opened) return; opened = true; clearInterval(flip); clearTimeout(first);
      let wait = 0;
      if (angle % 360 !== 0) { angle += 180; env3d.style.transform = `rotateY(${angle}deg)`; wait = 1100; }
      setTimeout(() => { env.classList.add('open'); intro.classList.add('opened'); setTimeout(fanOut, 1700); }, wait);
    }
    env.addEventListener('click', open);
    env.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });

    function fanOut() {
      const fan = el('div', 'fan'); intro.appendChild(fan);
      const its = [...env.querySelectorAll('.item')];
      const before = its.map(i => ({ r: i.getBoundingClientRect(), w: i.offsetWidth }));
      its.forEach(i => fan.appendChild(i));
      its.forEach((it, k) => {
        const r1 = it.getBoundingClientRect(), b = before[k];
        const dx = (b.r.left + b.r.width / 2) - (r1.left + r1.width / 2), dy = (b.r.top + b.r.height / 2) - (r1.top + r1.height / 2);
        const rot0 = it.classList.contains('photo') ? -5 : it.classList.contains('note') ? 4 : 0;
        const end = getComputedStyle(it).transform;
        it.animate([{ transform: `translate(${dx}px,${dy}px) scale(${b.w / it.offsetWidth}) rotate(${rot0}deg)` }, { transform: end === 'none' ? 'none' : end }],
          { duration: 1300, delay: k * 120, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
        it.addEventListener('click', () => { its.forEach(x => x.classList.remove('front')); it.classList.add('front'); });
      });
      env.classList.add('out');
      setTimeout(() => intro.classList.add('fanned'), 1400);
    }
    $('#enter').addEventListener('click', () => {
      try { sessionStorage.setItem('introSeen', '1'); } catch (_) {}
      intro.classList.add('gone'); document.body.classList.remove('lock');
      setTimeout(() => intro.remove(), 1100);
    });
  }

  /* ---------- cronômetro em tempo real ---------- */
  const since = new Date(S.togetherSince);
  function parts(from, to) {
    const c = new Date(from); let y = 0, m = 0;
    while (new Date(new Date(c).setFullYear(c.getFullYear() + 1)) <= to) c.setFullYear(c.getFullYear() + 1), y++;
    while (new Date(new Date(c).setMonth(c.getMonth() + 1)) <= to) c.setMonth(c.getMonth() + 1), m++;
    let ms = Math.floor((to - c) / 1000);
    const d = Math.floor(ms / 86400); ms %= 86400;
    const h = Math.floor(ms / 3600); ms %= 3600;
    return { anos: y, meses: m, dias: d, horas: h, min: Math.floor(ms / 60), seg: ms % 60 };
  }
  const labels = { anos: 'anos', meses: 'meses', dias: 'dias', horas: 'horas', min: 'minutos', seg: 'segundos' };
  const units = $('#units');
  units.innerHTML = Object.keys(labels).map(k => `<div class="unit"><b data-k="${k}">0</b><span>${labels[k]}</span></div>`).join('');
  function tick() {
    const now = new Date(), p = parts(since, now);
    Object.keys(p).forEach(k => { const e = $(`[data-k=${k}]`, units); const v = String(p[k]); if (e.textContent !== v) e.textContent = v; });
    const days = Math.ceil((wd - now) / 864e5);
    $('#countdown').textContent = days > 1 ? `E faltam ${days} dias para o nosso grande dia ♡` : days === 1 ? 'É amanhã! ♡' : days === 0 ? 'É hoje! ♡' : 'Obrigado por celebrar com a gente ♡';
  }
  tick(); setInterval(tick, 1000);

  /* ---------- mapa da nossa história ---------- */
  $('#storyIntro').textContent = S.story.intro;
  const map = $('#map');
  map.innerHTML = `<img src="${S.story.map}" alt="Mapa da nossa história" onerror="this.onerror=null;this.src='${S.story.mapFallback}'">`;
  S.story.chapters.forEach((c, i) => {
    const b = el('button', 'hs', `<i>${i + 1}</i>`);
    b.style.left = c.x + '%'; b.style.top = c.y + '%'; b.setAttribute('aria-label', c.title);
    b.onclick = () => chapter(i); map.appendChild(b);
  });
  function chapter(i) {
    const n = S.story.chapters.length, c = S.story.chapters[i];
    Modal.open(`${c.photo ? `<div class="chap-photo imgbox paper" data-label="${c.title}" style="aspect-ratio:4/3"><img src="${c.photo}" alt="" data-fb></div>` : ''}
      <p class="eyebrow" style="text-align:center">capítulo ${i + 1} · ${c.date}</p>
      <h3>${c.title}</h3><div class="divider">${HEART}</div><p>${c.text}</p>
      <div class="chapnav"><button class="btn ghost" id="pv">‹ anterior</button><button class="btn ghost" id="nx">próximo ›</button></div>`,
      sh => { $('#pv', sh).onclick = () => chapter((i - 1 + n) % n); $('#nx', sh).onclick = () => chapter((i + 1) % n); });
  }
})();
