(() => {
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
    .cover>img,.cover-transfer img{
      object-fit:contain !important;
      object-position:50% 50% !important;
    }
    .hero-img-desktop{display:block !important;}
    .hero-img-mobile{display:none !important;}
    @media (max-width:1100px){
      .hero{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr) !important;align-items:stretch !important;}
      .hero-copy{padding:30px 20px 28px !important;}
      .hero-visual{border-top:0 !important;border-left:1px solid rgba(255,255,255,.05) !important;min-width:0 !important;}
      .hero-img-desktop{display:block !important;width:100% !important;height:100% !important;min-height:365px !important;object-fit:cover !important;object-position:center center !important;}
    }
    @media (max-width:760px){
      .hero{grid-template-columns:minmax(0,1.18fr) minmax(145px,.82fr) !important;min-height:470px !important;}
      .hero-copy{padding:20px 10px 18px 12px !important;min-width:0 !important;}
      .hero h1{font-size:clamp(2rem,9vw,2.85rem) !important;letter-spacing:.035em !important;}
      .hero h2{margin:13px 0 10px !important;font-size:.96rem !important;line-height:1.2 !important;}
      .hero p{font-size:.73rem !important;line-height:1.38 !important;}
      .kicker{font-size:.58rem !important;letter-spacing:.15em !important;}
      .hero-actions{margin-top:15px !important;gap:7px !important;}
      .hero-actions .btn{min-height:38px !important;padding:0 10px !important;font-size:.66rem !important;}
      .device-hint{font-size:.58rem !important;}
      .hero-visual{display:flex !important;align-items:stretch !important;justify-content:stretch !important;overflow:hidden !important;background:#07090a !important;min-height:470px !important;}
      .hero-visual:before{background:linear-gradient(90deg,rgba(7,9,10,.28),transparent 22%) !important;}
      .hero-img-desktop{display:none !important;}
      .hero-img-mobile{display:block !important;width:100% !important;height:100% !important;min-height:470px !important;object-fit:cover !important;object-position:center top !important;}
      .product-card{grid-template-columns:88px minmax(0,1fr) !important;}
      .app-icon{width:76px !important;height:76px !important;padding:4px !important;margin:auto !important;}
    }
  `;
  document.head.appendChild(layoutFixes);

  const hydrateBase64Images = async () => {
    const nodes=[...document.querySelectorAll('img[data-b64-file]')],cache=new Map(),version='20260806-hero4';
    await Promise.all(nodes.map(async img=>{
      const file=img.dataset.b64File;
      try{
        if(!cache.has(file)){
          const sep=file.includes('?')?'&':'?';
          const text=await fetch(`${file}${sep}v=${version}`,{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.text();});
          cache.set(file,`data:image/webp;base64,${text.trim()}`);
        }
        img.src=cache.get(file);
      }catch(err){console.error('Taikeron image asset load failed',file,err);}
    }));
  };
  hydrateBase64Images();

  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
  const cards=[...document.querySelectorAll('.product-card')],productGrid=document.querySelector('.products-grid');
  const primary=document.getElementById('primaryDownload'),secondary=document.getElementById('secondaryDownload'),hint=document.getElementById('deviceHint');
  const ua=navigator.userAgent||'',coarse=window.matchMedia?.('(pointer: coarse)').matches,narrow=window.matchMedia?.('(max-width: 820px)').matches,mobileUA=/Android|iPhone|iPad|iPod|Mobile/i.test(ua),isMobile=mobileUA||coarse||narrow;
  const mobile=cards.find(c=>c.dataset.product==='mobile'),desktop=cards.find(c=>c.dataset.product==='desktop');
  cards.forEach(c=>c.classList.remove('priority'));
  if(isMobile){if(mobile&&productGrid)productGrid.prepend(mobile);mobile?.classList.add('priority');if(primary){primary.textContent='↓ Télécharger TA';primary.dataset.product='mobile';}if(secondary){secondary.textContent='↓ Télécharger TL';secondary.dataset.product='desktop';}if(hint)hint.textContent='Mobile détecté : Taikeron App est prioritaire.';}
  else{if(desktop&&productGrid)productGrid.prepend(desktop);desktop?.classList.add('priority');if(primary){primary.textContent='↓ Télécharger TL';primary.dataset.product='desktop';}if(secondary){secondary.textContent='↓ Télécharger TA';secondary.dataset.product='mobile';}if(hint)hint.textContent='Ordinateur détecté : Taikeron Lab est prioritaire.';}

  const toast=document.getElementById('toast');let timer;
  function showToast(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),3600);}

  const releaseConfig={
    desktop:{manifest:'releases/tl/stable.json',platform:'windows-x64',name:'Taikeron Lab'},
    mobile:{manifest:'releases/ta/stable.json',platform:'android-universal',name:'Taikeron App'}
  };
  const releases={desktop:null,mobile:null};

  async function loadRelease(kind){
    const config=releaseConfig[kind];
    try{
      const response=await fetch(`${config.manifest}?v=${Date.now()}`,{cache:'no-store',headers:{Accept:'application/json'}});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const manifest=await response.json();
      if(manifest?.format!=='taikeron_release_manifest'||manifest?.available!==true)return null;
      const platform=manifest?.platforms?.[config.platform];
      if(!platform?.url||!/^https:\/\//i.test(platform.url)||!/^[0-9a-f]{64}$/i.test(String(platform.sha256||'')))return null;
      return{url:String(platform.url),version:String(manifest.version||''),sha256:String(platform.sha256||''),bytes:Number(platform.bytes||0)};
    }catch(error){console.warn(`Release ${kind} indisponible`,error);return null;}
  }

  function applyDownloadTargets(){
    document.querySelectorAll('.download-button').forEach(button=>{
      const kind=button.closest('.product-card')?.dataset.product||'',release=releases[kind];
      button.dataset.downloadUrl=release?.url||'';
      if(release?.version)button.title=`Télécharger ${releaseConfig[kind].name} ${release.version}`;
    });
    for(const anchor of [primary,secondary]){
      if(!anchor)continue;
      const kind=anchor.dataset.product||'',release=releases[kind];
      anchor.href=release?.url||`#${kind==='mobile'?'app':'lab'}`;
      if(release?.version)anchor.title=`Télécharger ${releaseConfig[kind].name} ${release.version}`;
    }
  }

  Promise.all([loadRelease('desktop'),loadRelease('mobile')]).then(([desktopRelease,mobileRelease])=>{releases.desktop=desktopRelease;releases.mobile=mobileRelease;applyDownloadTargets();});

  document.querySelectorAll('.download-button').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();
    const url=button.dataset.downloadUrl,kind=button.closest('.product-card')?.dataset.product||'';
    if(url){window.location.assign(url);return;}
    showToast(`${releaseConfig[kind]?.name||'Taikeron'} : aucune release publique n’est encore disponible.`);
  }));
  for(const anchor of [primary,secondary])anchor?.addEventListener('click',event=>{
    const kind=anchor.dataset.product||'',release=releases[kind];
    if(release?.url)return;
    event.preventDefault();document.querySelector(kind==='mobile'?'#app':'#lab')?.scrollIntoView({behavior:'smooth',block:'center'});
    showToast(`${releaseConfig[kind]?.name||'Taikeron'} : aucune release publique n’est encore disponible.`);
  });
})();
