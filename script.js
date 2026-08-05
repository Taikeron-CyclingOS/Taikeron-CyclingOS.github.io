(() => {
  const hydrateBase64Images = async () => {
    const nodes = [...document.querySelectorAll('img[data-b64-file]')];
    const cache = new Map();
    await Promise.all(nodes.map(async img => {
      const file = img.dataset.b64File;
      try {
        if (!cache.has(file)) {
          const text = await fetch(file, {cache:'force-cache'}).then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.text();
          });
          cache.set(file, `data:image/webp;base64,${text.trim()}`);
        }
        img.src = cache.get(file);
      } catch (err) {
        console.error('Taikeron image asset load failed', file, err);
      }
    }));
  };
  hydrateBase64Images();

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const cards = [...document.querySelectorAll('.product-card')];
  const productGrid = document.querySelector('.products-grid');
  const primary = document.getElementById('primaryDownload');
  const secondary = document.getElementById('secondaryDownload');
  const hint = document.getElementById('deviceHint');

  const ua = navigator.userAgent || '';
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const narrow = window.matchMedia?.('(max-width: 820px)').matches;
  const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const isMobile = mobileUA || coarse || narrow;

  const mobile = cards.find(c => c.dataset.product === 'mobile');
  const desktop = cards.find(c => c.dataset.product === 'desktop');

  cards.forEach(c => c.classList.remove('priority'));

  if (isMobile) {
    if (mobile && productGrid) productGrid.prepend(mobile);
    mobile?.classList.add('priority');
    if (primary) { primary.textContent = '↓ Télécharger TA'; primary.href = '#app'; }
    if (secondary) { secondary.textContent = '↓ Télécharger TL'; secondary.href = '#lab'; }
    if (hint) hint.textContent = 'Mobile détecté : Taikeron App est prioritaire.';
  } else {
    if (desktop && productGrid) productGrid.prepend(desktop);
    desktop?.classList.add('priority');
    if (primary) { primary.textContent = '↓ Télécharger TL'; primary.href = '#lab'; }
    if (secondary) { secondary.textContent = '↓ Télécharger TA'; secondary.href = '#app'; }
    if (hint) hint.textContent = 'Ordinateur détecté : Taikeron Lab est prioritaire.';
  }

  const toast = document.getElementById('toast');
  let timer;
  document.querySelectorAll('.download-button, .hero-actions .btn').forEach(el => {
    el.addEventListener('click', evt => {
      if (el.classList.contains('btn')) return;
      evt.preventDefault();
      const name = el.dataset.name || 'Taikeron';
      if (!toast) return;
      toast.textContent = `${name} : le téléchargement public sera relié à la prochaine vraie Release GitHub.`;
      toast.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('show'), 3300);
    });
  });
})();
