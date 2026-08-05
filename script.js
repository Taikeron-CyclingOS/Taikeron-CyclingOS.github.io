(() => {
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.matchMedia('(max-width: 760px)').matches;

  const lab = document.getElementById('lab');
  const app = document.getElementById('app');
  const stack = document.getElementById('productStack');
  const primary = document.getElementById('primaryDownload');
  const secondary = document.getElementById('secondaryDownload');
  const hint = document.getElementById('deviceHint');

  if (isMobile) {
    app?.classList.add('is-priority');
    if (stack && app) stack.prepend(app);
    if (primary) {
      primary.textContent = 'Découvrir Taikeron App';
      primary.href = '#app';
    }
    if (secondary) {
      secondary.textContent = 'Découvrir Taikeron Lab';
      secondary.href = '#lab';
    }
    if (hint) hint.textContent = 'Mobile détecté · Taikeron App mise en avant';
  } else {
    lab?.classList.add('is-priority');
    if (primary) {
      primary.textContent = 'Découvrir Taikeron Lab';
      primary.href = '#lab';
    }
    if (secondary) {
      secondary.textContent = 'Découvrir Taikeron App';
      secondary.href = '#app';
    }
    if (hint) hint.textContent = 'Ordinateur détecté · Taikeron Lab mis en avant';
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
