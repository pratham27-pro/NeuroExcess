# NeuroAccess

NeuroAccess is a browser extension (plus companion website) that reduces accessibility barriers for people browsing the web — blindness/low vision, color vision deficiency, dyslexia, cognitive/attention challenges, motor impairments, and temporary impairments (eye strain, injury, fatigue).

See [README.md](./README.md) for the full product spec: problem statement, disability/feature mapping, core features, and privacy principles.

## Repo layout

This is a multi-module repo, not a shared-tooling monorepo — each module has its own package manager and is self-contained:

| Module       | What                                                                          | Stack                                | Package manager |
| ------------ | ----------------------------------------------------------------------------- | ------------------------------------ | ---------------- |
| `extension/` | The browser extension (the core product)                                      | [Plasmo](https://www.plasmo.com/), TypeScript, Tailwind v3 | npm             |
| `website/`   | Marketing site (landing, pricing, about, features, support)                   | Vite + React (JavaScript), Tailwind v4, oxlint | npm             |
| `backend/`   | Backend proxy for AI calls (image labeling, OCR) — keeps API keys server-side | FastAPI (Python)                     | uv                |

## Setup

Each module already has its dependencies installed. To start from scratch:

```bash
# extension/
cd extension
npm create plasmo@latest .

# website/
cd website
npm create vite@latest . -- --template react
npm install
npm install tailwindcss @tailwindcss/vite

# backend/
cd backend
uv init --package .
uv add fastapi "uvicorn[standard]"
```

See [CLAUDE.md](./CLAUDE.md) for architecture notes and day-to-day commands.
