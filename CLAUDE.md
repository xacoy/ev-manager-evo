# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

EV Manager Evo: a Spanish-language PWA for tracking a BYD Atto 3 EVO (charges, maintenance, revisions, notes, manual). There is no build step, package manager, linter or test suite. Serve statically and open in a browser:

```bash
python3 -m http.server 8888   # then http://localhost:8888 (service worker only registers over http/https)
```

## Architecture

- **`index.html` (~2300 lines) is the whole app**: CSS, markup, and one inline `<script>` of vanilla JS. Chart.js and pdf.js come from CDNs (`<head>`); no other dependencies.
- **State**: a single global `state` object persisted to `localStorage` under `evManagerEvo:v1` (theme under `evManagerEvo:theme`). `loadState()` deep-merges saved data over defaults, so new state fields need defaults in the `state` literal. Always persist through `saveState()` — it stamps `meta.updatedAt` and schedules a Google Drive push (`keepStamp`/`noSync` opts exist for sync-originated saves).
- **Rendering**: no framework. Each page has a `renderX()` function (`renderDashboard`, `renderCharges`, `renderMaintenance`, `renderRevisions`, `renderNotes`, `renderManual`, `renderStats`) that rebuilds DOM via template strings (use `escapeHtml`/`escapeAttr` for user data). All event wiring lives in `setupEventListeners()`.
- **Routing**: hash-based. `ROUTES` maps Spanish hash names (`#cargas`, `#taller`, …) to `page-*` section ids; `navigate()` switches the active page.
- **Language**: `state.lang` (`es`/`en`) selects between `REVISIONS_SCHEDULE.es|en` and `MANUAL_CONTENT.es|en`.
- **Google Drive sync** (bottom of the script): Google Identity Services token flow against the private `appDataFolder` (file `ev-manager-evo.json`); token cached in `localStorage`. Last-write-wins by `meta.updatedAt`.
- **`sw.js`**: network-first service worker; the cache name `ev-manager-v1` and `SHELL` list must be updated if shell files are added/renamed.

## Data duplication gotcha

`data/revisions-schedule.json` and `data/manual-index.json` are reference copies; the app does **not** fetch them. The live data is embedded in `index.html` as `REVISIONS_SCHEDULE` and `MANUAL_CONTENT`. Edit the embedded constants (and keep the JSON files in sync if you want them consistent). The manual PDF (`public/manuals/manual-es.pdf`) is referenced via `MANUAL_PDF_URL`.

## Domain defaults

Battery 74.8 kWh (`VEHICLE_BATTERY_KWH`); versions Design (RWD) / Excellence (AWD); revision interval 24 months / ~20–30k km; charge price presets: Casa 0,0114 €/kWh, Trabajo 0 €, other manual. UI text and comments are in Spanish.
