// Magnet to Stremio - Background v3
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['allowedSites', 'directPlayer'], (result) => {
    const defaults = {};
    if (!result.allowedSites)   defaults.allowedSites  = [];
    if (result.directPlayer === undefined) defaults.directPlayer = false; // مقفل بشكل افتراضي
    if (Object.keys(defaults).length) chrome.storage.sync.set(defaults);
  });
});
