(() => {
  const fix = document.createElement('style');
  fix.textContent = `
    @media (min-width:1101px){
      .hero{overflow:visible!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;column-gap:86px!important}
      .hero-copy{transform:translateX(-44px)!important;padding-left:0!important;padding-right:0!important;overflow:visible!important}
      .hero h1{font-size:clamp(3.1rem,4.7vw,5.15rem)!important;letter-spacing:.055em!important;white-space:nowrap!important;overflow:visible!important}
      .hero-visual{transform:translateX(42px)!important;padding-left:28px!important;overflow:visible!important}
      .ecosystem-summary{transform:none!important}
    }
    @media (max-width:1100px){.hero-copy,.hero-visual,.ecosystem-summary{transform:none!important}}
    .brand-logo{width:46px!important;height:46px!important;max-height:46px!important;object-fit:cover!important;border-radius:11px!important;display:block!important}
    .footer-brand{display:flex!important;align-items:center!important;gap:12px!important}
    .footer-brand .taikeron-global-footer-logo{width:52px!important;height:52px!important;object-fit:cover!important;border-radius:12px!important;display:block!important}
    .developer-body>img{width:72px!important;height:72px!important;object-fit:cover!important;border-radius:16px!important;display:block!important}
    @media(max-width:760px){.brand-logo{width:38px!important;height:38px!important;max-height:38px!important}}
  `;
  document.head.appendChild(fix);

  const GLOBAL_LOGO = 'data:image/jpeg;base64,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';
  const TMB_LOGO = 'data:image/jpeg;base64,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';

  const header = document.querySelector('.brand-logo');
  if (header) {
    header.removeAttribute('data-b64-file');
    header.src = GLOBAL_LOGO;
  }

  const footer = document.querySelector('.footer-brand');
  if (footer) {
    footer.innerHTML = `<img class="taikeron-global-footer-logo" src="${GLOBAL_LOGO}" alt="Taikeron"><div><strong>TAIKERON</strong><small>Conçu pour le cyclisme, pensé hors ligne.</small></div>`;
  }

  const tmb = document.querySelector('.developer-body > img[alt="Logo Taikeron Map Builder"]');
  if (tmb) {
    tmb.removeAttribute('data-b64-file');
    tmb.src = TMB_LOGO;
  }

  const cache = new Map();
  const mimeFromBase64 = b64 => b64.startsWith('/9j/') ? 'image/jpeg' : b64.startsWith('iVBOR') ? 'image/png' : 'image/webp';
  async function hydrate(img) {
    const file = img.dataset.b64File;
    if (!file || file === 'logo-global-taikeron.b64.txt' || file === 'logo-tmb.b64.txt') return;
    try {
      if (!cache.has(file)) {
        const r = await fetch(`${file}?v=20260807-assets-2`, {cache:'no-store'});
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const b64 = (await r.text()).trim();
        cache.set(file, `data:${mimeFromBase64(b64)};base64,${b64}`);
      }
      img.src = cache.get(file);
    } catch (e) {
      console.warn('Image Taikeron indisponible', file, e);
    }
  }
  document.querySelectorAll('img[data-b64-file]').forEach(hydrate);

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();