// Magnet to Stremio - Content Script v3
// يعتمد على utils.js و pako.min.js (محملين قبله في manifest)

function handleMagnetClick(e) {
  const link = e.currentTarget;
  const href = link.href || link.getAttribute('href') || '';
  if (!href.startsWith('magnet:')) return;

  e.preventDefault();
  e.stopPropagation();

  const hash = mts_extractHash(href);
  if (!hash) return;

  // اقرأ إعداد الوضع المباشر من storage
  chrome.storage.sync.get(['directPlayer'], (result) => {
    const url = mts_buildUrl(hash, result.directPlayer === true);
    window.open(url, '_blank');
  });
}

let badgeTitle = MTS_I18N.en.badgeTitle;

function attachListeners() {
  document.querySelectorAll('a[href^="magnet:"]').forEach(link => {
    if (link.dataset.stremioAttached) return;
    link.dataset.stremioAttached = 'true';
    link.addEventListener('click', handleMagnetClick, true);

    // شارة ▶ Stremio بجانب الرابط
    const badge = document.createElement('span');
    badge.className = 'mts-badge';
    badge.textContent = ' ▶ Stremio';
    badge.style.cssText = [
      'background:#8A5FBF',
      'color:#fff',
      'font-size:11px',
      'padding:2px 7px',
      'border-radius:4px',
      'margin-left:5px',
      'font-family:sans-serif',
      'cursor:pointer',
      'vertical-align:middle',
      'user-select:none',
    ].join(';');
    badge.title = badgeTitle;

    badge.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = mts_extractHash(link.href);
      if (!hash) return;
      chrome.storage.sync.get(['directPlayer'], (result) => {
        window.open(mts_buildUrl(hash, result.directPlayer === true), '_blank');
      });
    });

    link.insertAdjacentElement('afterend', badge);
  });
}

// تحقق أن الموقع الحالي في القائمة المسموح بها
chrome.storage.sync.get(['allowedSites', 'lang'], (result) => {
  const sites = result.allowedSites || [];
  badgeTitle = MTS_I18N[mts_resolveLang(result.lang)].badgeTitle;
  const currentHost = location.hostname.replace(/^www\./, '');
  const allowed = sites.some(s => {
    const h = mts_normalizeHost(s);
    return currentHost === h || currentHost.endsWith('.' + h);
  });
  if (!allowed) return;

  attachListeners();
  new MutationObserver(() => attachListeners())
    .observe(document.body, { childList: true, subtree: true });
});
