# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NeuroAccess is a browser extension that reduces web accessibility barriers (blindness/low vision, color vision deficiency, dyslexia, cognitive/attention challenges, motor impairments, temporary impairments). Full product spec, disability/feature mapping, and privacy principles are in [README.md](./README.md) — read it before implementing any user-facing feature, since feature scope is driven directly by that mapping.

## Repo structure

This is a **multi-module repo, not a shared-tooling monorepo**. Each module below is self-contained with its own package manager/lockfile — there is no root-level workspace config tying them together, so don't add one (e.g. don't hoist a root `package.json` workspaces field) unless explicitly asked.

Do not run `/graphify` in this repo — it's a small project and the generated `graphify-out/` output isn't wanted here (it's gitignored as a backstop, but don't regenerate it in the first place).

- `extension/` — the browser extension itself (the core product). Plasmo, TypeScript, Tailwind v3, npm.
- `website/` — marketing site: landing page, pricing, about, features, support. Vite + React (JavaScript, not TypeScript), Tailwind v4 (CSS-first config via `@tailwindcss/vite`, no `tailwind.config.js`), oxlint, npm.
- `backend/` — thin backend proxy for AI calls (image labeling, OCR). FastAPI (Python), uv. Currently only the uv package skeleton (`src/backend/__init__.py` with a placeholder `main()`) — no FastAPI app has been written yet.

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
uv run backend                          # runs the current placeholder entrypoint (src/backend/__init__.py:main)
uv run uvicorn backend.main:app --reload   # once an app/main.py with `app = FastAPI()` exists
uv run pytest                           # run tests
uv run pytest path/to/test_file.py::test_name   # run a single test
```

## Architecture principle: AI calls go through backend/, not directly from the extension

Per the privacy principles in README.md (local-first by default, no hidden tracking, secure handling of API keys), cloud AI calls (image labeling, OCR fallback) should be proxied through `backend/` rather than called directly from `extension/`. This keeps third-party API keys out of the shipped extension bundle and gives a single point to enforce rate-limiting and privacy boundaries. Prefer on-device/browser-native approaches where they're good enough:

- Voice commands and TTS: browser-native Web Speech API (`SpeechRecognition` / `SpeechSynthesis`), not a cloud service — it's free, zero-latency, and works offline. `SpeechSynthesisUtterance` boundary events drive word-level highlighting during TTS playback.
- OCR: Tesseract.js client-side, no server round-trip.
- Image labeling / alt-text generation: no on-device model is good enough yet, so this goes through `backend/`.
