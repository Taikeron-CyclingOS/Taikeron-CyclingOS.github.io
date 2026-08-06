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

    .hero-visual{
      position:relative !important;
      display:flex !important;
      align-items:center !important;
      justify-content:center !important;
      min-width:0 !important;
      padding:34px clamp(24px,4vw,56px) !important;
      background:
        radial-gradient(circle at 72% 28%,rgba(212,168,76,.08),transparent 32%),
        linear-gradient(145deg,#0b0e10,#07090a) !important;
      border-left:1px solid rgba(255,255,255,.055) !important;
      overflow:hidden !important;
    }
    .hero-visual::before,.hero-visual::after{display:none !important;}
    .ecosystem-summary{width:min(100%,560px);}
    .ecosystem-eyebrow{
      margin:0 0 12px;
      color:#d4a84c;
      font-size:.68rem;
      font-weight:800;
      letter-spacing:.19em;
    }
    .ecosystem-summary h3{
      margin:0 0 12px;
      color:#f0eee8;
      font-size:clamp(1.3rem,2.1vw,2rem);
      line-height:1.1;
      font-weight:700;
    }
    .ecosystem-summary>p{
      margin:0 0 22px;
      max-width:510px;
      color:#8f979b;
      font-size:.88rem;
      line-height:1.55;
    }
    .ecosystem-points{display:grid;gap:10px;}
    .ecosystem-point{
      display:grid;
      grid-template-columns:8px 1fr;
      gap:11px;
      align-items:start;
      padding:10px 0;
      border-top:1px solid rgba(255,255,255,.055);
    }
    .ecosystem-point:first-child{border-top:0;}
    .ecosystem-dot{
      width:6px;
      height:6px;
      margin-top:7px;
      border-radius:50%;
      background:#d4a84c;
      box-shadow:0 0 14px rgba(212,168,76,.35);
    }
    .ecosystem-point strong{display:block;color:#d8d9d6;font-size:.82rem;}
    .ecosystem-point span{display:block;margin-top:2px;color:#70787d;font-size:.72rem;line-height:1.42;}
    .developer-download{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:38px;
      margin-top:12px;
      padding:0 14px;
      border:1px solid rgba(212,168,76,.35);
      border-radius:8px;
      color:#e5c77d;
      background:#0b0d0f;
      text-decoration:none;
      font-size:.72rem;
      font-weight:800;
      letter-spacing:.04em;
    }
    .developer-download:hover{border-color:#d4a84c;color:#f3d993;}

    @media (max-width:1100px){
      .hero{grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr) !important;align-items:stretch !important;}
      .hero-copy{padding:30px 20px 28px !important;}
      .hero-visual{padding:28px 24px !important;}
    }

    @media (max-width:760px){
      .hero{grid-template-columns:1fr !important;min-height:0 !important;}
      .hero-copy{padding:24px 14px 20px !important;min-width:0 !important;}
      .hero h1{font-size:clamp(2.55rem,14vw,4rem) !important;letter-spacing:.045em !important;}
      .hero h2{margin:13px 0 10px !important;font-size:1.02rem !important;line-height:1.2 !important;}
      .hero p{font-size:.82rem !important;line-height:1.45 !important;}
      .kicker{font-size:.58rem !important;letter-spacing:.15em !important;}
      .hero-actions{margin-top:16px !important;gap:7px !important;}
      .hero-actions .btn{min-height:40px !important;padding:0 11px !important;font-size:.7rem !important;}
      .device-hint{font-size:.6rem !important;}
      .hero-visual{
        border-left:0 !important;
        border-top:1px solid rgba(255,255,255,.055) !important;
        padding:22px 15px 24px !important;
        justify-content:flex-start !important;
      }
      .ecosystem-summary{width:100%;}
      .ecosystem-summary h3{font-size:1.28rem;}
      .ecosystem-summary>p{font-size:.79rem;margin-bottom:14px;}
      .ecosystem-point{padding:8px 0;}
      .ecosystem-point strong{font-size:.78rem;}
      .ecosystem-point span{font-size:.68rem;}
      .product-card{grid-template-columns:88px minmax(0,1fr) !important;}
      .app-icon{width:76px !important;height:76px !important;padding:4px !important;margin:auto !important;}
    }
  `;
  document.head.appendChild(layoutFixes);

  const heroVisual=document.querySelector('.hero-visual');
  if(heroVisual){
    heroVisual.setAttribute('aria-label','Présentation de l’écosystème Taikeron');
    heroVisual.innerHTML=`
      <div class="ecosystem-summary">
        <p class="ecosystem-eyebrow">UN ÉCOSYSTÈME · DEUX OUTILS</p>
        <h3>Du vélo à l’analyse, sans dépendre du cloud.</h3>
        <p>Taikeron relie le terrain et l’ordinateur dans un environnement pensé pour rester utile hors connexion.</p>
        <div class="ecosystem-points">
          <div class="ecosystem-point">
            <span class="ecosystem-dot"></span>
            <div><strong>Taikeron App</strong><span>Enregistrement, suivi de séance, navigation et données essentielles sur Android.</span></div>
          </div>
          <div class="ecosystem-point">
            <span class="ecosystem-dot"></span>
            <div><strong>Taikeron Lab</strong><span>Analyse détaillée, planification et suivi de progression sur Windows.</span></div>
          </div>
          <div class="ecosystem-point">
            <span class="ecosystem-dot"></span>
            <div><strong>Offline-first</strong><span>Les fonctions principales et les données restent locales par conception.</span></div>
          </div>
        </div>
      </div>`;
  }

  const imageCache = new Map();
  const imageVersion = '20260806-release-downloads-1';

  async function loadBase64Image(img, file){
    if(!img || !file) return;
    try{
      if(!imageCache.has(file)){
        const sep=file.includes('?')?'&':'?';
        const text=await fetch(`${file}${sep}v=${imageVersion}`,{cache:'no-store'}).then(r=>{
          if(!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.text();
        });
        imageCache.set(file,`data:image/webp;base64,${text.trim()}`);
      }
      img.src=imageCache.get(file);
    }catch(err){
      console.error('Taikeron image asset load failed',file,err);
    }
  }

  const hydrateBase64Images = async () => {
    const nodes=[...document.querySelectorAll('img[data-b64-file]:not(.hero-img)')];
    await Promise.all(nodes.map(img=>loadBase64Image(img,img.dataset.b64File)));
  };
  hydrateBase64Images();

  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();

  const cards=[...document.querySelectorAll('.product-card')];
  const productGrid=document.querySelector('.products-grid');
  const primary=document.getElementById('primaryDownload');
  const secondary=document.getElementById('secondaryDownload');
  const hint=document.getElementById('deviceHint');
  const ua=navigator.userAgent||'';
  const coarse=window.matchMedia?.('(pointer: coarse)').matches;
  const narrow=window.matchMedia?.('(max-width: 820px)').matches;
  const mobileUA=/Android|iPhone|iPad|iPod|Mobile/i.test(ua);
  const isMobile=mobileUA||coarse||narrow;
  const mobile=cards.find(c=>c.dataset.product==='mobile');
  const desktop=cards.find(c=>c.dataset.product==='desktop');

  cards.forEach(c=>c.classList.remove('priority'));
  if(isMobile){
    if(mobile&&productGrid) productGrid.prepend(mobile);
    mobile?.classList.add('priority');
    if(primary){primary.textContent='↓ Télécharger TA';primary.dataset.product='mobile';}
    if(secondary){secondary.textContent='↓ Télécharger TL';secondary.dataset.product='desktop';}
    if(hint) hint.textContent='Mobile détecté : Taikeron App est prioritaire.';
  }else{
    if(desktop&&productGrid) productGrid.prepend(desktop);
    desktop?.classList.add('priority');
    if(primary){primary.textContent='↓ Télécharger TL';primary.dataset.product='desktop';}
    if(secondary){secondary.textContent='↓ Télécharger TA';secondary.dataset.product='mobile';}
    if(hint) hint.textContent='Ordinateur détecté : Taikeron Lab est prioritaire.';
  }

  const toast=document.getElementById('toast');
  let timer;
  function showToast(text){
    if(!toast) return;
    toast.textContent=text;
    toast.classList.add('show');
    clearTimeout(timer);
    timer=setTimeout(()=>toast.classList.remove('show'),3600);
  }

  // Les versions normales utilisent exclusivement les trois dépôts publics Downloads.
  // TAD / TLD / TMBD ne sont jamais recherchés ici : ils restent sur le circuit DEV privé.
  const releaseConfig={
    desktop:{repo:'Taikeron-CyclingOS/Taikeron-Lab-Downloads',extensions:['.exe'],name:'Taikeron Lab'},
    mobile:{repo:'Taikeron-CyclingOS/Taikeron-App-Downloads',extensions:['.apk'],name:'Taikeron App'},
    tmb:{repo:'Taikeron-CyclingOS/Taikeron-Map-Builder-Downloads',extensions:['.exe'],name:'Taikeron Map Builder'}
  };
  const releases={desktop:null,mobile:null,tmb:null};

  async function loadRelease(kind){
    const config=releaseConfig[kind];
    if(!config) return null;
    try{
      const response=await fetch(`https://api.github.com/repos/${config.repo}/releases/latest`,{
        cache:'no-store',
        headers:{Accept:'application/vnd.github+json'}
      });
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const release=await response.json();
      if(release?.draft||release?.prerelease) return null;
      const assets=Array.isArray(release?.assets)?release.assets:[];
      const asset=assets.find(item=>{
        const name=String(item?.name||'').toLowerCase();
        return config.extensions.some(ext=>name.endsWith(ext));
      });
      if(!asset?.browser_download_url) return null;
      return{
        url:String(asset.browser_download_url),
        version:String(release.tag_name||release.name||'').replace(/^v/i,''),
        bytes:Number(asset.size||0),
        assetName:String(asset.name||'')
      };
    }catch(error){
      console.warn(`Release ${kind} indisponible`,error);
      return null;
    }
  }

  const developerInfo=document.querySelector('.developer-body > div');
  let tmbDownload=document.getElementById('tmbDownload');
  if(developerInfo&&!tmbDownload){
    tmbDownload=document.createElement('a');
    tmbDownload.id='tmbDownload';
    tmbDownload.className='developer-download';
    tmbDownload.href='#';
    tmbDownload.textContent='↓ Télécharger TMB';
    developerInfo.appendChild(tmbDownload);
  }

  function applyDownloadTargets(){
    document.querySelectorAll('.download-button').forEach(button=>{
      const kind=button.closest('.product-card')?.dataset.product||'';
      const release=releases[kind];
      button.dataset.downloadUrl=release?.url||'';
      if(release?.version) button.title=`Télécharger ${releaseConfig[kind].name} ${release.version}`;
    });

    for(const anchor of [primary,secondary]){
      if(!anchor) continue;
      const kind=anchor.dataset.product||'';
      const release=releases[kind];
      anchor.href=release?.url||`#${kind==='mobile'?'app':'lab'}`;
      if(release?.version) anchor.title=`Télécharger ${releaseConfig[kind].name} ${release.version}`;
    }

    if(tmbDownload){
      const release=releases.tmb;
      tmbDownload.href=release?.url||'#';
      if(release?.version){
        tmbDownload.textContent=`↓ Télécharger TMB ${release.version}`;
        tmbDownload.title=`Télécharger Taikeron Map Builder ${release.version}`;
      }
    }
  }

  Promise.all([loadRelease('desktop'),loadRelease('mobile'),loadRelease('tmb')]).then(([desktopRelease,mobileRelease,tmbRelease])=>{
    releases.desktop=desktopRelease;
    releases.mobile=mobileRelease;
    releases.tmb=tmbRelease;
    applyDownloadTargets();
  });

  document.querySelectorAll('.download-button').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();
    const url=button.dataset.downloadUrl;
    const kind=button.closest('.product-card')?.dataset.product||'';
    if(url){window.location.assign(url);return;}
    showToast(`${releaseConfig[kind]?.name||'Taikeron'} : aucune release publique n’est encore disponible.`);
  }));

  for(const anchor of [primary,secondary]) anchor?.addEventListener('click',event=>{
    const kind=anchor.dataset.product||'';
    const release=releases[kind];
    if(release?.url) return;
    event.preventDefault();
    document.querySelector(kind==='mobile'?'#app':'#lab')?.scrollIntoView({behavior:'smooth',block:'center'});
    showToast(`${releaseConfig[kind]?.name||'Taikeron'} : aucune release publique n’est encore disponible.`);
  });

  tmbDownload?.addEventListener('click',event=>{
    if(releases.tmb?.url) return;
    event.preventDefault();
    showToast('Taikeron Map Builder : aucune release publique n’est encore disponible.');
  });
})();