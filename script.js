(() => {
  /* Layout corrections: keep the Taikeron hero visual on the RIGHT,
     and keep TA/TL artwork optically centered instead of cropped. */
  const layoutFixes = document.createElement('style');
  layoutFixes.textContent = `
    .app-icon{
      object-fit:contain !important;
      object-position:50% 50% !important;
      justify-self:center !important;
      align-self:center !important;
      padding:5px !important;
      background:#0a0c0e !important;
    }
    .cover>img,
    .cover-transfer img{
      object-fit:contain !important;
      object-position:50% 50% !important;
    }

    @media (max-width:1100px){
      .hero{
        grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr) !important;
        align-items:stretch !important;
      }
      .hero-copy{
        padding:30px 20px 28px !important;
      }
      .hero-visual{
        border-top:0 !important;
        border-left:1px solid rgba(255,255,255,.05) !important;
        min-width:0 !important;
      }
      .hero-visual img{
        width:100% !important;
        height:100% !important;
        min-height:365px !important;
        object-fit:cover !important;
        object-position:center center !important;
      }
    }

    @media (max-width:760px){
      .hero{
        grid-template-columns:minmax(0,1.18fr) minmax(145px,.82fr) !important;
        min-height:300px !important;
      }
      .hero-copy{
        padding:20px 10px 18px 12px !important;
        min-width:0 !important;
      }
      .hero h1{
        font-size:clamp(2rem,9vw,2.85rem) !important;
        letter-spacing:.035em !important;
      }
      .hero h2{
        margin:13px 0 10px !important;
        font-size:.96rem !important;
        line-height:1.2 !important;
      }
      .hero p{
        font-size:.73rem !important;
        line-height:1.38 !important;
      }
      .kicker{
        font-size:.58rem !important;
        letter-spacing:.15em !important;
      }
      .hero-actions{
        margin-top:15px !important;
        gap:7px !important;
      }
      .hero-actions .btn{
        min-height:38px !important;
        padding:0 10px !important;
        font-size:.66rem !important;
      }
      .device-hint{
        font-size:.58rem !important;
      }
      .hero-visual{
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        overflow:hidden !important;
        background:#07090a !important;
      }
      .hero-visual:before{
        background:linear-gradient(90deg,rgba(7,9,10,.35),transparent 22%) !important;
      }
      .hero-visual img{
        width:auto !important;
        max-width:none !important;
        height:100% !important;
        min-height:300px !important;
        object-fit:cover !important;
        object-position:34% center !important;
      }
      .product-card{
        grid-template-columns:88px minmax(0,1fr) !important;
      }
      .app-icon{
        width:76px !important;
        height:76px !important;
        padding:4px !important;
        margin:auto !important;
      }
    }
  `;
  document.head.appendChild(layoutFixes);

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
