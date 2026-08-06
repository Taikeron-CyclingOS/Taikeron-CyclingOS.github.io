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
    @media (max-width:1100px){
      .hero-copy,.hero-visual,.ecosystem-summary{transform:none!important}
    }
    .brand-logo{width:46px!important;height:46px!important;max-height:46px!important;object-fit:cover!important;border-radius:11px!important}
    .footer-brand{display:flex!important;align-items:center!important;gap:12px!important}
    .footer-brand .taikeron-global-footer-logo{width:52px!important;height:52px!important;object-fit:cover!important;border-radius:12px!important;display:block!important}
    .developer-body>img{width:72px!important;height:72px!important;object-fit:cover!important;border-radius:16px!important;display:block!important}
    @media(max-width:760px){.brand-logo{width:38px!important;height:38px!important;max-height:38px!important}}
  `;
  document.head.appendChild(fix);

  const cache = new Map();
  const mimeFromBase64 = (b64) => b64.startsWith('/9j/') ? 'image/jpeg' : b64.startsWith('iVBOR') ? 'image/png' : 'image/webp';

  async function loadData(file){
    if(cache.has(file)) return cache.get(file);
    const r = await fetch(`${file}?v=logos-user-exact-20260807-1`, {cache:'no-store'});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const b64 = (await r.text()).trim();
    const data = `data:${mimeFromBase64(b64)};base64,${b64}`;
    cache.set(file, data);
    return data;
  }

  async function hydrate(img){
    const file = img.dataset.b64File;
    if(!file) return;
    try{ img.src = await loadData(file); }
    catch(e){ console.warn('Image Taikeron indisponible', file, e); }
  }

  document.querySelectorAll('img[data-b64-file]').forEach(hydrate);

  (async () => {
    try{
      const globalLogo = await loadData('logo-global-taikeron.b64.txt');
      const header = document.querySelector('.brand-logo');
      if(header) header.src = globalLogo;

      const footer = document.querySelector('.footer-brand');
      if(footer){
        footer.innerHTML = `<img class="taikeron-global-footer-logo" src="${globalLogo}" alt="Taikeron"><div><strong>TAIKERON</strong><small>Conçu pour le cyclisme, pensé hors ligne.</small></div>`;
      }

      const tmbLogo = await loadData('logo-tmb.b64.txt');
      const tmb = document.querySelector('.developer-body > img[alt="Logo Taikeron Map Builder"]');
      if(tmb) tmb.src = tmbLogo;
    }catch(e){ console.warn('Logos Taikeron indisponibles', e); }
  })();

  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();
