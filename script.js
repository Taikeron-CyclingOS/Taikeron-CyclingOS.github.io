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
    .product-card[data-product="mobile"] .app-icon{
      object-position:center center!important;
      align-self:center!important;
      justify-self:center!important;
    }
  `;
  document.head.appendChild(fix);

  const cache = new Map();

  function mimeFromBase64(b64){
    if(b64.startsWith('/9j/')) return 'image/jpeg';
    if(b64.startsWith('iVBOR')) return 'image/png';
    if(b64.startsWith('UklG')) return 'image/webp';
    return 'image/jpeg';
  }

  async function fetchText(file){
    const r = await fetch(`${file}?v=brand-repair-20260807-2`, {cache:'no-store'});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.text()).trim();
  }

  async function loadData(file){
    if(cache.has(file)) return cache.get(file);

    let b64;
    if(file === 'logo-wordmark.b64.txt'){
      const pieces = [
        'logo-wordmark-prefix-1.b64.txt',
        'logo-wordmark-prefix-2.b64.txt',
        'logo-wordmark-prefix-3.b64.txt',
        'logo-wordmark-prefix-4.b64.txt',
        'logo-wordmark-prefix-5.b64.txt',
        'logo-wordmark.b64.txt'
      ];
      b64 = (await Promise.all(pieces.map(fetchText))).join('');
    } else {
      b64 = await fetchText(file);
    }

    const data = `data:${mimeFromBase64(b64)};base64,${b64}`;
    cache.set(file, data);
    return data;
  }

  async function hydrate(img){
    const file = img.dataset.b64File;
    if(!file) return;
    try{
      img.src = await loadData(file);
    }catch(e){
      console.warn('Image Taikeron indisponible', file, e);
    }
  }

  document.querySelectorAll('img[data-b64-file]').forEach(hydrate);

  (async () => {
    try{
      const tmbLogo = await loadData('logo-tmb.b64.txt');
      const tmb = document.querySelector('.developer-body > img[alt="Logo Taikeron Map Builder"]');
      if(tmb) tmb.src = tmbLogo;
    }catch(e){
      console.warn('Logo TMB indisponible', e);
    }
  })();

  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();
