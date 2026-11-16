(function () {
  const S = SITE, { $, el, HEART, mapsUrl } = WU;
  $('#dv').innerHTML = HEART;
  const wd = new Date(S.weddingDate);
  const host = $('#items');
  S.events.forEach(ev => {
    const it = el('article', 'tl-item');
    it.innerHTML = `<div class="tl-dot" aria-hidden="true">${ev.icon}</div>
      <div class="tl-card paper"><span class="fl fl-tr"></span>
        <div class="tl-time">${ev.time}</div>
        <h3>${ev.title}</h3><div class="tl-place">${ev.place}</div>
        <p>${ev.text}</p>
        <div class="tl-btns"></div></div>`;
    const btns = $('.tl-btns', it);
    btns.appendChild(el('a', 'btn', 'Endereço')).setAttribute('href', mapsUrl(ev.address));
    const a = btns.lastChild; a.target = '_blank'; a.rel = 'noopener';
    ev.buttons.forEach(b => { const x = el('button', 'btn ghost', b.label); x.type = 'button'; x.onclick = () => openContentModal(b.modal); btns.appendChild(x); });
    host.appendChild(it);
  });

  const tl = $('#tl'), fill = $('#fill'), end = $('#end'), items = [...document.querySelectorAll('.tl-item')];
  let ticking = false;
  function update() {
    ticking = false;
    const r = tl.getBoundingClientRect(), trigger = innerHeight * .6;
    const h = Math.max(0, Math.min(r.height, trigger - r.top));
    fill.style.height = h + 'px';
    items.forEach(it => it.classList.toggle('on', it.querySelector('.tl-dot').getBoundingClientRect().top + 27 <= trigger));
    end.classList.toggle('on', h >= r.height - 4);
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', req); update();
})();
