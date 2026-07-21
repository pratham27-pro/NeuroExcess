# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NeuroAccess is a browser extension that reduces web accessibility barriers (blindness/low vision, color vision deficiency, dyslexia, cognitive/attention challenges, motor impairments, temporary impairments). Full product spec, disability/feature mapping, and privacy principles are in [README.md](./README.md) — read it before implementing any user-facing feature, since feature scope is driven directly by that mapping.

## Repo structure

This is a **multi-module repo, not a shared-tooling monorepo**. Each module below is self-contained with its own package manager/lockfile — there is no root-level workspace config tying them together, so don't add one (e.g. don't hoist a root `package.json` workspaces field) unless explicitly asked.

Do not run `/graphify` in this repo — it's a small project and the generated `graphify-out/` output isn't wanted here (it's gitignored as a backstop, but don't regenerate it in the first place).

- `extension/` — the browser extension itself (the core product). Plasmo, TypeScript, Tailwind v3, npm. Manual test fixtures live in `extension/test-pages/` — one static HTML file per feature, deliberately containing the issues that feature should detect/fix (e.g. `global-mode-audit.html` has one of each issue category the Global Mode audit checks for). Load the built extension unpacked and open these fixtures to verify a feature by hand; add a new fixture here when building a new feature.
- `website/` — marketing site: landing page, pricing, about, features, support. Vite + React (JavaScript, not TypeScript), Tailwind v4 (CSS-first config via `@tailwindcss/vite`, no `tailwind.config.js`), oxlint, npm.
- `backend/` — thin backend proxy for AI calls (image labeling, OCR) plus auth. FastAPI (Python), uv. The app lives in `src/main.py` (`app = FastAPI()`), routes mounted via `src/api/router.py`: `/image/caption` (HuggingFace BLIP captioning with a local Pillow-based heuristic fallback), `/ocr/extract` (EasyOCR), and `/auth/register`, `/auth/login`, `/auth/me` (JWT auth backed by MongoDB via pymongo). Requires `HF_API_KEY` and `MONGODB_URI` env vars (see `src/core/config.py`) — no `.env.example` exists yet, so get real values from whoever set up the Mongo instance/HF key before running locally.

## Commands

### extension/ (Plasmo, npm)
```
npm run dev        # dev server with hot reload, load unpacked from build/chrome-mv3-dev
npm run build       # production build
npm run package      # zip the extension for store submission
```

### website/ (Vite + React, npm)
```
npm run dev          # dev server
npm run build         # production build
npm run lint          # oxlint
npm run preview       # preview production build
```

### backend/ (FastAPI, uv)
```
uv run uvicorn src.main:app --reload    # dev server (docs at /docs, redoc at /redoc)
```
No test suite exists yet.

## Architecture principle: AI calls go through backend/, not directly from the extension

Per the privacy principles in README.md (local-first by default, no hidden tracking, secure handling of API keys), cloud AI calls (image labeling, OCR fallback) should be proxied through `backend/` rather than called directly from `extension/`. This keeps third-party API keys out of the shipped extension bundle and gives a single point to enforce rate-limiting and privacy boundaries. Prefer on-device/browser-native approaches where they're good enough:

- Voice commands and TTS: browser-native Web Speech API (`SpeechRecognition` / `SpeechSynthesis`), not a cloud service — it's free, zero-latency, and works offline. `SpeechSynthesisUtterance` boundary events drive word-level highlighting during TTS playback.
- OCR: Tesseract.js client-side, no server round-trip.
- Image labeling / alt-text generation: no on-device model is good enough yet, so this goes through `backend/`.
