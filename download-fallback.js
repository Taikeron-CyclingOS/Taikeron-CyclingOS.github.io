(() => {
  'use strict';

  const latestPages = {
    mobile: 'https://github.com/Taikeron-CyclingOS/Taikeron-App-Downloads/releases/latest',
    desktop: 'https://github.com/Taikeron-CyclingOS/Taikeron-Lab-Downloads/releases/latest',
    tmb: 'https://github.com/Taikeron-CyclingOS/Taikeron-Map-Builder-Downloads/releases/latest'
  };

  function isDirectGithubDownload(value){
    return /^https:\/\/github\.com\/Taikeron-CyclingOS\/.+\/releases\/download\//i.test(String(value || ''));
  }

  document.addEventListener('click', event => {
    const button = event.target.closest?.('.download-button');
    if(button){
      const kind = button.closest('.product-card')?.dataset.product || '';
      if(!button.dataset.downloadUrl && latestPages[kind]){
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(latestPages[kind]);
      }
      return;
    }

    const hero = event.target.closest?.('#primaryDownload,#secondaryDownload');
    if(hero){
      const kind = hero.dataset.product || '';
      if(!isDirectGithubDownload(hero.href) && latestPages[kind]){
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.assign(latestPages[kind]);
      }
      return;
    }

    const tmb = event.target.closest?.('#tmbDownload');
    if(tmb && !isDirectGithubDownload(tmb.href)){
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign(latestPages.tmb);
    }
  }, true);
})();
