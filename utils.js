// Magnet to Stremio - Shared Utilities
// يُحمَّل في كل من content.js و popup.js

/**
 * استخراج infoHash من رابط Magnet
 */
function mts_extractHash(magnetUrl) {
  const m = magnetUrl.match(/btih:([a-fA-F0-9]{40}|[A-Z2-7]{32})/i);
  return m ? m[1].toLowerCase() : null;
}

/**
 * بناء رابط صفحة التفاصيل (الوضع الافتراضي)
 * https://web.strem.io/#/detail/other/bt:HASH
 */
function mts_buildDetailUrl(hash) {
  return `https://web.strem.io/#/detail/other/bt%3A${hash}`;
}

/**
 * بناء رابط المشغل المباشر
 * يطابق بالضبط رابط Stremio الداخلي:
 * https://web.strem.io/#/player/{blob}/{addon}/{addon}/other/bt:{hash}/
 *
 * الـ blob عبارة عن:
 *   JSON → zlib deflate (level=0) → base64 → encodeURIComponent
 */
function mts_buildPlayerUrl(hash) {
  const json = JSON.stringify({
    infoHash:    hash,
    fileIdx:     0,
    announce:    [],
    description: hash + '/0'
  });

  // zlib deflate level=0 (stored, no compression) - مطابق لـ Stremio تماماً
  const compressed = pako.deflate(json, { level: 0 });

  // Uint8Array → binary string → base64
  let binary = '';
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i]);
  }
  const blob    = encodeURIComponent(btoa(binary));
  const addon   = encodeURIComponent('http://127.0.0.1:11470/local-addon/manifest.json');
  const hashEnc = encodeURIComponent('bt:' + hash);

  return `https://web.strem.io/#/player/${blob}/${addon}/${addon}/other/${hashEnc}/`;
}

/**
 * بناء الرابط المناسب حسب الإعداد
 */
function mts_buildUrl(hash, directPlayer) {
  return directPlayer ? mts_buildPlayerUrl(hash) : mts_buildDetailUrl(hash);
}

/**
 * نصوص الواجهة بالإنجليزية والعربية
 */
const MTS_I18N = {
  en: {
    headerSub:       'v3.0 — Direct player + site control',
    settings:        'Settings',
    tabSites:        'Sites',
    tabSend:         'Send link',
    modeTitle:       'Direct player mode',
    modeDesc:        'Opens magnet links straight in the Stremio player instead of the details page',
    modeWarning:     '⚠️ <strong>Requires the Stremio desktop app!</strong><br>' +
                     'It works through the local server on port <strong>11470</strong>.<br>' +
                     'If Stremio is not running, playback will not start.',
    sitesLabel:      'Sites where the extension works automatically',
    sitePlaceholder: 'example.com or https://example.com/',
    emptySites:      'No sites yet — add one above',
    siteActive:      'Active',
    siteRemove:      'Remove',
    addCurrent:      '＋ Add current site: {host}',
    sendLabel:       'Paste a magnet link and open it in Stremio',
    openBtn:         '▶ Open in Stremio',
    language:        'Language',
    badgeTitle:      'Open in Stremio',
    toastDirectOn:   '▶ Direct player mode on',
    toastDirectOff:  '📄 Details page mode on',
    toastRemoved:    'Removed',
    toastInvalid:    'Invalid address',
    toastExists:     'Site already added',
    toastAdded:      '✓ Added',
    errEmpty:        'Please enter a magnet link',
    errPrefix:       'The link must start with magnet:',
    errNoHash:       'No hash found in the link',
    okPlayer:        '▶ Opened in the player!',
    okDetail:        '📄 Opened on the details page!',
  },
  ar: {
    headerSub:       'v3.0 — مشغل مباشر + التحكم في المواقع',
    settings:        'الإعدادات',
    tabSites:        'المواقع',
    tabSend:         'إرسال رابط',
    modeTitle:       'وضع المشغل المباشر',
    modeDesc:        'يفتح رابط Magnet مباشرةً في مشغل Stremio بدل صفحة التفاصيل',
    modeWarning:     '⚠️ <strong>يتطلب تطبيق Stremio Desktop!</strong><br>' +
                     'يعمل عبر السيرفر المحلي على المنفذ <strong>11470</strong>.<br>' +
                     'إذا لم يكن Stremio مفتوحاً فلن يعمل التشغيل.',
    sitesLabel:      'المواقع التي تعمل عليها الإضافة تلقائياً',
    sitePlaceholder: 'example.com أو https://example.com/',
    emptySites:      'لا توجد مواقع — أضف موقعاً من الأعلى',
    siteActive:      'مفعّل',
    siteRemove:      'حذف',
    addCurrent:      '＋ إضافة الموقع الحالي: {host}',
    sendLabel:       'الصق رابط Magnet وافتحه في Stremio',
    openBtn:         '▶ فتح في Stremio',
    language:        'اللغة',
    badgeTitle:      'فتح في Stremio',
    toastDirectOn:   '▶ وضع المشغل المباشر مفعّل',
    toastDirectOff:  '📄 وضع صفحة التفاصيل مفعّل',
    toastRemoved:    'تم الحذف',
    toastInvalid:    'رابط غير صحيح',
    toastExists:     'الموقع مضاف مسبقاً',
    toastAdded:      '✓ تمت الإضافة',
    errEmpty:        'الرجاء إدخال رابط Magnet',
    errPrefix:       'الرابط يجب أن يبدأ بـ magnet:',
    errNoHash:       'لم يتم العثور على hash في الرابط',
    okPlayer:        '▶ تم الفتح في المشغل مباشرة!',
    okDetail:        '📄 تم الفتح في صفحة التفاصيل!',
  },
};

/**
 * اللغة الافتراضية حسب لغة المتصفح (عربي أو إنجليزي)
 */
function mts_resolveLang(saved) {
  if (saved === 'ar' || saved === 'en') return saved;
  return (navigator.language || '').toLowerCase().startsWith('ar') ? 'ar' : 'en';
}

/**
 * تطبيع اسم الـ host من رابط أو نص
 */
function mts_normalizeHost(url) {
  try {
    return new URL(url.startsWith('http') ? url : 'https://' + url)
      .hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^www\./, '').split('/')[0].trim();
  }
}
