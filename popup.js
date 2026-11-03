// Magnet to Stremio - Popup v3

// ── Language ──
let lang = mts_resolveLang();
const t = (key) => MTS_I18N[lang][key];

function applyLanguage() {
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  // نصوص ثابتة من MTS_I18N فقط (ليست من إدخال المستخدم)
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  document.getElementById('sendStatus').textContent = '';
  updateCurrentSiteBtn();
  getSites(renderSites);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang;
    chrome.storage.sync.set({ lang });
    applyLanguage();
  });
});

// ── Toast ──
function showToast(msg, color = '#4caf50') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.background = color;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

// ── Storage helpers ──
function getSites(cb)       { chrome.storage.sync.get(['allowedSites'],  r => cb(r.allowedSites  || []));     }
function saveSites(s, cb)   { chrome.storage.sync.set({ allowedSites: s }, cb); }
function getSettings(cb)    { chrome.storage.sync.get(['directPlayer'],  r => cb(r.directPlayer  || false)); }
function saveSettings(o,cb) { chrome.storage.sync.set(o, cb); }

// ── Toggle UI ──
const toggle      = document.getElementById('directToggle');
const modeCard    = document.getElementById('modeCard');
const modeWarning = document.getElementById('modeWarning');

function applyToggleUI(on) {
  toggle.classList.toggle('on', on);
  toggle.setAttribute('aria-checked', on);
  modeCard.classList.toggle('enabled', on);
  modeWarning.classList.toggle('show', on);
}

// تحميل الحالة المحفوظة
getSettings(val => applyToggleUI(val));

toggle.addEventListener('click', () => {
  const nowOn = !toggle.classList.contains('on');
  applyToggleUI(nowOn);
  saveSettings({ directPlayer: nowOn }, () => {
    showToast(nowOn ? t('toastDirectOn') : t('toastDirectOff'),
              nowOn ? '#8A5FBF' : '#4caf50');
  });
});

// ── Tabs ──
const settingsBtn = document.getElementById('settingsBtn');

function showPanel(name) {
  document.querySelectorAll('.tab, .panel').forEach(el => el.classList.remove('active'));
  document.querySelector(`.tab[data-tab="${name}"]`)?.classList.add('active');
  document.getElementById('panel-' + name).classList.add('active');
  settingsBtn.classList.toggle('active', name === 'settings');
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => showPanel(tab.dataset.tab));
});

// زر الإعدادات يفتح لوحة الإعدادات أو يرجع لتبويب المواقع
settingsBtn.addEventListener('click', () => {
  showPanel(settingsBtn.classList.contains('active') ? 'sites' : 'settings');
});

// ── Sites List ──
function renderSites(sites) {
  const list = document.getElementById('sitesList');
  list.innerHTML = '';
  if (!sites.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-msg';
    empty.textContent = t('emptySites');
    list.appendChild(empty);
    return;
  }
  sites.forEach((site, i) => {
    const host = mts_normalizeHost(site);
    const item = document.createElement('div');
    item.className = 'site-item';
    // بناء العناصر بدون innerHTML لتجنب حقن HTML من اسم الموقع
    const name = document.createElement('span');
    name.className = 'site-host';
    name.textContent = host;
    const dot = document.createElement('div');
    dot.className = 'site-dot';
    dot.title = t('siteActive');
    const remove = document.createElement('button');
    remove.className = 'btn-remove';
    remove.dataset.i = i;
    remove.title = t('siteRemove');
    remove.textContent = '✕';
    item.append(name, dot, remove);
    list.appendChild(item);
  });
  list.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      getSites(s => {
        s.splice(+btn.dataset.i, 1);
        saveSites(s, () => renderSites(s));
        showToast(t('toastRemoved'), '#e57373');
      });
    });
  });
}

function addSite(value) {
  const host = mts_normalizeHost(value);
  if (!host || !host.includes('.')) { showToast(t('toastInvalid'), '#e57373'); return; }
  getSites(s => {
    if (s.map(mts_normalizeHost).includes(host)) { showToast(t('toastExists'), '#ff9800'); return; }
    s.push(host);
    saveSites(s, () => {
      renderSites(s);
      document.getElementById('siteInput').value = '';
      showToast(t('toastAdded'));
    });
  });
}

document.getElementById('addSiteBtn').addEventListener('click', () => {
  const v = document.getElementById('siteInput').value.trim();
  if (v) addSite(v);
});
document.getElementById('siteInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') { const v = document.getElementById('siteInput').value.trim(); if (v) addSite(v); }
});

// زر إضافة الموقع الحالي
let currentHost = null;
const addCurrentBtn = document.getElementById('addCurrentBtn');

function updateCurrentSiteBtn() {
  if (!currentHost) return;
  addCurrentBtn.textContent = t('addCurrent').replace('{host}', currentHost);
  addCurrentBtn.classList.remove('hidden');
}

addCurrentBtn.addEventListener('click', () => { if (currentHost) addSite(currentHost); });

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  try {
    const url = tabs[0]?.url;
    if (!url?.startsWith('http')) return;
    currentHost = new URL(url).hostname.replace(/^www\./, '');
    updateCurrentSiteBtn();
  } catch {}
});

// ── Send Panel ──
document.getElementById('openBtn').addEventListener('click', () => {
  const val    = document.getElementById('magnetInput').value.trim();
  const status = document.getElementById('sendStatus');

  if (!val)                       { status.textContent = t('errEmpty');  status.className = 'send-status err'; return; }
  if (!val.startsWith('magnet:')) { status.textContent = t('errPrefix'); status.className = 'send-status err'; return; }

  const hash = mts_extractHash(val);
  if (!hash) { status.textContent = t('errNoHash'); status.className = 'send-status err'; return; }

  getSettings(directPlayer => {
    const url = mts_buildUrl(hash, directPlayer);
    chrome.tabs.create({ url });
    status.textContent = directPlayer ? t('okPlayer') : t('okDetail');
    status.className = 'send-status ok';
  });
});

document.getElementById('magnetInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); document.getElementById('openBtn').click(); }
});

// ── Init ──
chrome.storage.sync.get(['lang'], r => {
  lang = mts_resolveLang(r.lang);
  applyLanguage();
});
