(() => {
  const mobileByUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const mobileByWidth = window.matchMedia('(max-width: 820px)').matches;
  const isMobile = mobileByUA || mobileByWidth;

  const grid = document.getElementById('productGrid');
  const lab = document.getElementById('labCard');
  const app = document.getElementById('appCard');
  const primary = document.getElementById('heroPrimary');
  const secondary = document.getElementById('heroSecondary');
  const priorityText = document.getElementById('devicePriority');

  if (isMobile) {
    if (grid && app) grid.prepend(app);
    app?.classList.add('priority');
    lab?.classList.remove('priority');
    if (primary) {
      primary.textContent = 'Télécharger TA';
      primary.href = '#appCard';
    }
    if (secondary) {
      secondary.textContent = 'Télécharger TL';
      secondary.href = '#labCard';
    }
    if (priorityText) priorityText.textContent = 'Mobile détecté : Taikeron App est prioritaire.';
  } else {
    if (grid && lab) grid.prepend(lab);
    lab?.classList.add('priority');
    app?.classList.remove('priority');
    if (primary) {
      primary.textContent = 'Télécharger TL';
      primary.href = '#labCard';
    }
    if (secondary) {
      secondary.textContent = 'Télécharger TA';
      secondary.href = '#appCard';
    }
    if (priorityText) priorityText.textContent = 'Ordinateur détecté : Taikeron Lab est prioritaire.';
  }

  const toast = document.getElementById('releaseToast');
  const showReleaseMessage = (event) => {
    event.preventDefault();
    toast?.classList.add('show');
    window.clearTimeout(window.__taikeronToastTimer);
    window.__taikeronToastTimer = window.setTimeout(() => toast?.classList.remove('show'), 3200);
  };

  document.querySelectorAll('.download-btn').forEach((button) => {
    button.addEventListener('click', showReleaseMessage);
  });

  [primary, secondary].forEach((link) => {
    link?.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
