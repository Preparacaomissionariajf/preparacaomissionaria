(function () {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const HEART = '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-9.2C1.8 7.6 4 4.5 7.1 4.5c2 0 3.6 1.1 4.9 3 1.3-1.9 2.9-3 4.9-3 3.1 0 5.3 3.1 4.1 6.3C19 15.600 12 20 12 20z"/></svg>';
  const mapsUrl = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
  window.WU = { $, el, HEART, mapsUrl };

  /* filtro de papel rasgado */
  document.body.insertAdjacentHTML('afterbegin',
    '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="deckle" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter></svg>');

  /* placeholders de imagem */
  window.watchImages = function (root = document) {
    root.querySelectorAll('img[data-fb]').forEach(img => {
      const box = img.parentElement, bad = () => box.classList.add('no-img');
      if (img.complete && !img.naturalWidth) bad(); else img.addEventListener('error', bad, { once: true });
    });
  };

  /* nav + footer */
  const page = document.body.dataset.page;
  const links = [['index.html', 'Início', 'home'], ['programacao.html', 'Programação', 'prog'], ['presenca.html', 'Presença', 'rsvp']];
  const header = el('header', 'nav', `<a class="logo" href="index.html">${S.couple.a[0]} &amp; ${S.couple.b[0]}</a><nav>${links.map(l => `<a href="${l[0]}"${l[2] === page ? ' aria-current="page"' : ''}>${l[1]}</a>`).join('')}</nav>`);
  document.body.insertBefore(header, document.body.children[1]);
  document.body.appendChild(el('footer', '', `<div class="divider">${HEART}</div><p class="script">${S.couple.a} &amp; ${S.couple.b}</p><p class="eyebrow" style="margin-top:6px">com amor</p>`));

  /* modal */
  const modal = el('div', 'modal', '<div class="sheet" role="dialog" aria-modal="true"></div>');
  document.body.appendChild(modal);
  const sheet = $('.sheet', modal);
  let lastFocus = null;
  function close() { modal.classList.remove('on'); document.body.classList.remove('lock'); lastFocus && lastFocus.focus && lastFocus.focus(); }
  window.Modal = {
    open(html, after) {
      lastFocus = document.activeElement;
      sheet.innerHTML = '<span class="fl fl-tl"></span><span class="fl fl-br"></span><button class="close" aria-label="Fechar">×</button>' + html;
      sheet.scrollTop = 0;
      $('.close', sheet).onclick = close;
      watchImages(sheet);
      modal.classList.add('on'); document.body.classList.add('lock');
      $('.close', sheet).focus({ preventScroll: true });
      after && after(sheet);
    }, close
  };
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('on')) close(); });

  /* modal de conteúdo (dress code, selamento, o que levar) */
  window.openContentModal = function (id) {
    const m = S.modals[id]; if (!m) return;
    Modal.open(`<h3>${m.title}</h3><div class="divider">${HEART}</div>${m.html}${m.refs ? `<div class="refs-title">${m.refsTitle || 'Referências'}</div><div data-car></div>` : ''}`, sh => {
      if (m.refs) $('[data-car]', sh).appendChild(createCarousel(m.refs));
    });
  };

  /* carrossel infinito, arrasta para os dois lados */
  window.createCarousel = function (srcs) {
    const n = srcs.length, root = el('div', 'carousel');
    const view = el('div', 'car-view'), dots = el('div', 'car-dots');
    const slides = srcs.map((s, i) => {
      const d = el('div', 'car-slide'), img = new Image();
      img.src = s; img.alt = 'Referência ' + (i + 1); img.draggable = false;
      img.onerror = () => { d.classList.add('ph'); img.remove(); d.textContent = 'referência ' + (i + 1); };
      d.appendChild(img); view.appendChild(d);
      const b = el('button'); b.setAttribute('aria-label', 'Foto ' + (i + 1)); b.onclick = () => go(i); dots.appendChild(b);
      return d;
    });
    const prev = el('button', 'car-arrow prev', '‹'), next = el('button', 'car-arrow next', '›');
    prev.setAttribute('aria-label', 'Anterior'); next.setAttribute('aria-label', 'Próxima');
    view.append(prev, next); root.append(view, dots);
    let idx = 0, dx = 0, down = false, sx = 0, st = 0; const last = slides.map(() => 0);
    const off = i => { let o = (((i - idx) % n) + n) % n; if (o > n / 2) o -= n; return o; };
    function layout(anim) {
      const w = view.clientWidth || 300;
      slides.forEach((s, i) => {
        const o = off(i), jump = Math.abs(o - last[i]) > 1.5; last[i] = o;
        s.style.transition = (anim && !jump && !down) ? 'transform .45s cubic-bezier(.2,.8,.2,1)' : 'none';
        s.style.transform = `translateX(${o * w + dx}px)`;
        s.style.visibility = Math.abs(o) > 1 ? 'hidden' : 'visible';
      });
      [...dots.children].forEach((d, i) => d.classList.toggle('on', i === idx));
    }
    function go(i) { idx = ((i % n) + n) % n; dx = 0; layout(true); }
    prev.onclick = () => go(idx - 1); next.onclick = () => go(idx + 1);
    view.addEventListener('pointerdown', e => { if (e.target.closest('.car-arrow')) return; down = true; sx = e.clientX; st = Date.now(); view.setPointerCapture(e.pointerId); });
    view.addEventListener('pointermove', e => { if (!down) return; dx = e.clientX - sx; layout(false); });
    const end = e => { if (!down) return; down = false; const w = view.clientWidth, v = Math.abs(dx) / Math.max(1, Date.now() - st);
      if (Math.abs(dx) > w * .18 || v > .5) go(idx + (dx < 0 ? 1 : -1)); else { dx = 0; layout(true); } };
    view.addEventListener('pointerup', end); view.addEventListener('pointercancel', end);
    root.tabIndex = 0; root.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(idx + 1); if (e.key === 'ArrowLeft') go(idx - 1); });
    requestAnimationFrame(() => layout(false)); addEventListener('resize', () => layout(false));
    return root;
  };
})();
