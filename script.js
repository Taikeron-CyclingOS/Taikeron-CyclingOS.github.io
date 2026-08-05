(() => {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.matchMedia('(max-width: 760px)').matches;

  const labCard = document.getElementById('labCard');
  const appCard = document.getElementById('appCard');
  const productGrid = document.getElementById('productGrid');
  const primary = document.getElementById('primaryDownload');
  const secondary = document.getElementById('secondaryDownload');
  const hint = document.getElementById('deviceHint');

  if (isMobile) {
    appCard?.classList.add('is-priority');
    if (productGrid && appCard) productGrid.prepend(appCard);
    if (primary) {
      primary.textContent = 'Découvrir Taikeron App';
      primary.href = '#appCard';
    }
    if (secondary) {
      secondary.textContent = 'Découvrir Taikeron Lab';
      secondary.href = '#labCard';
    }
    if (hint) hint.textContent = 'Appareil mobile détecté : Taikeron App est mise en avant.';
  } else {
    labCard?.classList.add('is-priority');
    if (primary) {
      primary.textContent = 'Découvrir Taikeron Lab';
      primary.href = '#labCard';
    }
    if (secondary) {
      secondary.textContent = 'Découvrir Taikeron App';
      secondary.href = '#appCard';
    }
    if (hint) hint.textContent = 'Ordinateur détecté : Taikeron Lab est mis en avant.';
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
