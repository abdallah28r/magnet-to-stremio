<p align="center">
  <img src="icons/icon128.png" width="96" alt="Magnet to Stremio icon">
</p>

<h1 align="center">Magnet to Stremio</h1>

<p align="center">
  A small browser extension that opens <code>magnet:</code> links in <a href="https://web.strem.io">Stremio Web</a> with one click.
</p>

---

## What it does

- **One-click open:** on the websites you choose, every magnet link gets a small **▶ Stremio** button. Click it and the link opens in Stremio Web.
- **Paste a link:** paste any magnet link in the extension popup and open it in Stremio.
- **Two modes:**
  - **Details page** (default): opens Stremio's page for the torrent.
  - **Direct player** (optional): starts playback straight away. This mode needs the Stremio desktop app running on your computer.
- **You choose the websites:** the extension does nothing on a site until you add it to your list.
- **English and Arabic:** switch the language from the ⚙️ settings button in the popup.

## Installation

The extension is not in the Chrome Web Store yet, so you install it manually. It takes about one minute.

### Chrome, Edge, Brave, Opera (Chromium browsers)

1. **Download the code.** On this page, click the green **Code** button, then **Download ZIP**.
2. **Unzip** the file to a folder you will keep (do not delete it later, the browser loads the extension from there).
3. Open your browser's extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
   - Brave: `brave://extensions`
4. Turn on **Developer mode** (a switch, usually at the top right).
5. Click **Load unpacked** and select the unzipped folder (the one that contains `manifest.json`).
6. Done. Pin the extension from the puzzle-piece menu so the icon stays visible.

### Updating

Download the new ZIP, replace the old folder's files, then click the **reload** ↻ button on the extension's card in the extensions page.

## How to use

1. Click the extension icon.
2. In the **Sites** tab, type a website address (for example `example.com`) and press **＋**, or click **Add current site**.
3. Visit that website. Magnet links now show a **▶ Stremio** button.
4. Optional: switch on **Direct player mode** in the popup. Keep the Stremio desktop app open for this mode.

To open a single link without adding a site, use the **Send link** tab and paste the magnet link.

To change the language, click the ⚙️ button at the top of the popup and choose **English** or **العربية**.

## Requirements

- A Chromium-based browser (Chrome, Edge, Brave, Opera, Vivaldi).
- For **Direct player** mode: the [Stremio desktop app](https://www.stremio.com/downloads) running on the same computer. It serves streams locally on port `11470`.

## Privacy

- The extension collects **no data** and has **no analytics**.
- It has no server of its own and sends nothing to the developer. Your settings (site list, mode, language) are saved in your browser's sync storage.
- When you click a link, it opens a `web.strem.io` address in a new tab. What happens next is handled by Stremio.

## Permissions explained

| Permission | Why it is needed |
| --- | --- |
| `storage` | Save your site list, mode and language settings. |
| Access to websites (`<all_urls>`) | Find magnet links on the sites you add, and show the current site's address in the popup. The extension stays inactive on every site that is not in your list. |

## Legal notice

- This is an **unofficial** project. It is **not affiliated with, endorsed by, or sponsored by Stremio** or Smart Code OOD. "Stremio" is a trademark of its owner and is used here only to describe what the extension works with.
- This extension does not host, index, search for, or provide any content or torrents. It only changes how a link you already have is opened.
- BitTorrent is a legal technology, but downloading or streaming copyrighted material without permission is illegal in many countries. **You are responsible for making sure you only use content you have the right to access** and for following the laws where you live.

## Third-party code

This project includes [pako](https://github.com/nodeca/pako) 2.1.0 (MIT and Zlib licenses), used to build the direct-player link. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## License

[MIT](LICENSE)
