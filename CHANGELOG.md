# Changelog

## v3.1.0

### Changes

- Direct player mode: the popup now checks whether the Stremio desktop app is running (local server on port 11470). The warning shows only when Stremio does not reply, instead of all the time.
- Clearer warning text in English and Arabic.

## v3.0.0

First public release.

### Features

- A **▶ Stremio** button next to every magnet link on the sites you add.
- Paste a magnet link in the popup and open it in Stremio Web.
- Two modes: Stremio's details page (default) or the direct player (needs the Stremio desktop app).
- Site list: the extension stays inactive on any site you have not added.
- English and Arabic interface, switchable from the ⚙️ settings button. The default follows your browser language.
- Light and dark theme, following your system setting.

### Privacy and security

- No data collection, no analytics, no server of its own.
- Only the `storage` permission plus access to websites to find magnet links.
- Site names in the popup are rendered as plain text.
