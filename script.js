(() => {
  const style = document.createElement('style');
  style.textContent = `
    .app-icon{object-fit:contain!important;object-position:50% 50%!important;justify-self:center!important;align-self:center!important;padding:5px!important;background:#0a0c0e!important}
    .cover>img,.cover-transfer img{object-fit:contain!important;object-position:50% 50%!important}
    .developer-download{display:inline-flex;align-items:center;justify-content:center;min-height:38px;margin-top:12px;padding:0 14px;border:1px solid rgba(212,168,76,.35);border-radius:8px;color:#e5c77d;background:#0b0d0f;text-decoration:none;font-size:.72rem;font-weight:800;letter-spacing:.04em}
    .developer-download:hover{border-color:#d4a84c;color:#f3d993}
  `;
  document.head.appendChild(style);

  const imageCache = new Map();
  const imageVersion = '20260807-download-fix-2';
  async function loadBase64Image(img,file){
    if(!img||!file) return;
    try{
      if(!imageCache.has(file)){
        const sep=file.includes('?')?'&':'?';
        const response=await fetch(`${file}${sep}v=${imageVersion}`,{cache:'no-store'});
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        const text=await response.text();
        imageCache.set(file,`data:image/webp;base64,${text.trim()}`);
      }
      img.src=imageCache.get(file);
    }catch(error){console.warn('Image Taikeron indisponible',file,error);}
  }
  Promise.all([...document.querySelectorAll('img[data-b64-file]:not(.hero-img)')].map(img=>loadBase64Image(img,img.dataset.b64File)));

  const year=document.getElementById('year');
  if(year) year.textContent=new Date().getFullYear();

  const cards=[...document.querySelectorAll('.product-card')];
  const productGrid=document.querySelector('.products-grid');
  const primary=document.getElementById('primaryDownload');
  const secondary=document.getElementById('secondaryDownload');
  const ua=navigator.userAgent||'';
  const isMobile=/Android|iPhone|iPad|iPod|Mobile/i.test(ua) || window.matchMedia?.('(pointer: coarse)').matches || window.matchMedia?.('(max-width: 820px)').matches;
  const mobile=cards.find(c=>c.dataset.product==='mobile');
  const desktop=cards.find(c=>c.dataset.product==='desktop');
  cards.forEach(c=>c.classList.remove('priority'));
  if(isMobile){
    if(mobile&&productGrid) productGrid.prepend(mobile);
    mobile?.classList.add('priority');
    if(primary){primary.textContent='↓ Télécharger TA';primary.dataset.product='mobile';}
    if(secondary){secondary.textContent='↓ Télécharger TL';secondary.dataset.product='desktop';}
    const hint=document.getElementById('deviceHint'); if(hint) hint.textContent='Mobile détecté : Taikeron App est prioritaire.';
  }else{
    if(desktop&&productGrid) productGrid.prepend(desktop);
    desktop?.classList.add('priority');
    if(primary){primary.textContent='↓ Télécharger TL';primary.dataset.product='desktop';}
    if(secondary){secondary.textContent='↓ Télécharger TA';secondary.dataset.product='mobile';}
    const hint=document.getElementById('deviceHint'); if(hint) hint.textContent='Ordinateur détecté : Taikeron Lab est prioritaire.';
  }

  // Circuit PUBLIC uniquement. Les builds DEV TAD/TLD/TMBD ne sont jamais utilisés ici.
  const releaseConfig={
    desktop:{repo:'Taikeron-CyclingOS/Taikeron-Lab-Downloads',extensions:['.exe'],name:'Taikeron Lab'},
    mobile:{repo:'Taikeron-CyclingOS/Taikeron-App-Downloads',extensions:['.apk'],name:'Taikeron App'},
    tmb:{repo:'Taikeron-CyclingOS/Taikeron-Map-Builder-Downloads',extensions:['.exe'],name:'Taikeron Map Builder'}
  };
  const releases={desktop:null,mobile:null,tmb:null};

  function releasePage(kind){
    return `https://github.com/${releaseConfig[kind].repo}/releases/latest`;
  }

  // Le fallback est installé immédiatement : un bouton ne doit jamais afficher
  // « aucune release » alors que GitHub possède une publication.
  function fallbackTarget(kind){return {url:releasePage(kind),version:'',direct:false};}
  releases.desktop=fallbackTarget('desktop');
  releases.mobile=fallbackTarget('mobile');
  releases.tmb=fallbackTarget('tmb');

  async function findDirectAsset(kind){
    const config=releaseConfig[kind];
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),5000);
    try{
      const response=await fetch(`https://api.github.com/repos/${config.repo}/releases/latest`,{
        cache:'no-store',signal:controller.signal,headers:{Accept:'application/vnd.github+json'}
      });
      if(!response.ok) return fallbackTarget(kind);
      const release=await response.json();
      if(release?.draft||release?.prerelease) return fallbackTarget(kind);
      const assets=Array.isArray(release.assets)?release.assets:[];
      const asset=assets.find(item=>{
        const name=String(item?.name||'').toLowerCase();
        return config.extensions.some(ext=>name.endsWith(ext));
      });
      if(!asset?.browser_download_url) return fallbackTarget(kind);
      return {
        url:String(asset.browser_download_url),
        version:String(release.tag_name||release.name||'').replace(/^v/i,''),
        direct:true
      };
    }catch(error){
      console.warn(`API GitHub indisponible pour ${kind}; fallback Release utilisé.`,error);
      return fallbackTarget(kind);
    }finally{clearTimeout(timeout);}
  }

  const developerInfo=document.querySelector('.developer-body > div');
  let tmbDownload=document.getElementById('tmbDownload');
  if(developerInfo&&!tmbDownload){
    tmbDownload=document.createElement('a');
    tmbDownload.id='tmbDownload';
    tmbDownload.className='developer-download';
    tmbDownload.textContent='↓ Télécharger TMB';
    developerInfo.appendChild(tmbDownload);
  }

  function applyTargets(){
    document.querySelectorAll('.download-button').forEach(button=>{
      const kind=button.closest('.product-card')?.dataset.product||'';
      const release=releases[kind];
      if(!release) return;
      button.dataset.downloadUrl=release.url;
      button.title=release.direct&&release.version?`Télécharger ${releaseConfig[kind].name} ${release.version}`:`Ouvrir la dernière release ${releaseConfig[kind].name}`;
    });
    for(const anchor of [primary,secondary]){
      if(!anchor) continue;
      const kind=anchor.dataset.product||'';
      const release=releases[kind];
      if(!release) continue;
      anchor.href=release.url;
      anchor.title=release.direct&&release.version?`Télécharger ${releaseConfig[kind].name} ${release.version}`:`Ouvrir la dernière release ${releaseConfig[kind].name}`;
    }
    if(tmbDownload){
      const release=releases.tmb;
      tmbDownload.href=release.url;
      tmbDownload.textContent=release.direct&&release.version?`↓ Télécharger TMB ${release.version}`:'↓ Télécharger TMB';
      tmbDownload.title=release.direct&&release.version?`Télécharger Taikeron Map Builder ${release.version}`:'Ouvrir la dernière release Taikeron Map Builder';
    }
  }

  applyTargets();

  // Boutons des cartes : toujours naviguer vers une cible valide.
  document.querySelectorAll('.download-button').forEach(button=>button.addEventListener('click',event=>{
    event.preventDefault();
    const kind=button.closest('.product-card')?.dataset.product||'';
    const target=button.dataset.downloadUrl||releasePage(kind);
    window.location.href=target;
  }));

  Promise.all([findDirectAsset('desktop'),findDirectAsset('mobile'),findDirectAsset('tmb')]).then(([tl,ta,tmb])=>{
    releases.desktop=tl;
    releases.mobile=ta;
    releases.tmb=tmb;
    applyTargets();
  });
})();
