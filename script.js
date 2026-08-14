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

    .brand,.footer-brand{display:flex!important;align-items:center!important;gap:10px!important}
    .brand-logo{display:block!important;width:42px!important;height:42px!important;max-height:42px!important;object-fit:cover!important;object-position:center!important;border-radius:10px!important;flex:0 0 auto!important}
    .footer-global-logo{display:block!important;width:48px!important;height:48px!important;max-height:48px!important;object-fit:cover!important;object-position:center!important;border-radius:11px!important;flex:0 0 auto!important}
    .brand-wordmark{display:block!important;width:220px!important;height:auto!important;max-height:46px!important;object-fit:contain!important;object-position:left center!important;flex:0 0 auto!important;background:transparent!important}
    .footer-wordmark{display:block!important;width:230px!important;height:auto!important;max-height:56px!important;object-fit:contain!important;object-position:left center!important;flex:0 0 auto!important;background:transparent!important}

    #app>.app-icon,.product-card[data-product="mobile"]>.app-icon{
      object-position:center center!important;object-fit:contain!important;align-self:center!important;justify-self:center!important;margin:auto!important;transform:none!important
    }

    @media (max-width:760px){
      .brand,.footer-brand{gap:7px!important}
      .brand-logo{width:34px!important;height:34px!important;max-height:34px!important;border-radius:8px!important}
      .footer-global-logo{width:40px!important;height:40px!important;max-height:40px!important}
      .brand-wordmark{width:172px!important;max-height:40px!important}
      .footer-wordmark{width:180px!important;max-height:46px!important}
    }
  `;
  document.head.appendChild(fix);

  const cache = new Map();
  const CACHE_TAG = 'wordmark-direct-20260807-1';

  function mimeFromBase64(b64){
    if(b64.startsWith('/9j/')) return 'image/jpeg';
    if(b64.startsWith('iVBOR')) return 'image/png';
    if(b64.startsWith('UklG')) return 'image/webp';
    return 'image/jpeg';
  }

  async function loadData(file){
    if(cache.has(file)) return cache.get(file);
    const r = await fetch(`${file}?v=${CACHE_TAG}`, {cache:'no-store'});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    const b64 = (await r.text()).trim();
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
    }catch(e){ console.warn('Logo TMB indisponible', e); }
  })();

  const releaseTargets = [
    {
      product: 'TA',
      manifest: 'releases/ta/stable.json',
      platformKeys: ['android-universal', 'android-apk'],
      selectors: ['.hero-actions .btn.btn-gold', '.product-card[data-product="mobile"] .static-download']
    },
    {
      product: 'TL',
      manifest: 'releases/tl/stable.json',
      platformKeys: ['windows-x64'],
      selectors: ['.hero-actions .btn.btn-dark', '.product-card[data-product="desktop"] .static-download']
    },
    {
      product: 'TMB',
      manifest: 'releases/tmb/stable.json',
      platformKeys: ['windows-x64-nsis', 'windows-x64-portable'],
      selectors: ['#tmbDownload']
    }
  ];

  function resolveReleaseUrl(manifest, platformKeys){
    if(!manifest || manifest.available !== true || !manifest.platforms) return '';
    for(const key of platformKeys){
      const url = manifest.platforms?.[key]?.url;
      if(typeof url === 'string' && /^https:\/\//i.test(url)) return url;
    }
    return '';
  }

  async function applyStableRelease(target){
    try{
      const separator = target.manifest.includes('?') ? '&' : '?';
      const response = await fetch(`${target.manifest}${separator}v=${Date.now()}`, {cache:'no-store'});
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const manifest = await response.json();
      if(manifest.product !== target.product || manifest.channel !== 'stable') return;
      const url = resolveReleaseUrl(manifest, target.platformKeys);
      if(!url) return;

      for(const selector of target.selectors){
        document.querySelectorAll(selector).forEach(link => {
          link.href = url;
          link.dataset.downloadUrl = url;
          if(manifest.version) link.title = `${target.product} ${manifest.version}`;
        });
      }
    }catch(error){
      console.warn(`Manifeste stable ${target.product} indisponible`, error);
    }
  }

  Promise.allSettled(releaseTargets.map(applyStableRelease));

  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();
})();
