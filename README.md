# PlotTwist

An interactive sci-fi comic where the Captain's commands shape the story of the exploration ship Wayfarer.

## Getting started

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:5173. No API key is needed.

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run preview
```

## Scaffold scope

- React, Vite, strict TypeScript, and Tailwind's Vite plugin.
- Landing screen, Captain name entry, fixed four-panel opening, and three branching four-panel continuations.
- Explicit decision confirmation, deterministic state effects, duplicate-order protection, reset and replay.
- Responsive HTML speech bubbles and captions, with reference-inspired illustrated panel art.
- Reducer/fixture tests and GitHub Actions checks.
- Netlify build configuration and a reserved server-only functions directory.

This is a basic scaffold, not the completed build described in the supplied planning document. Progress currently lives in memory and resets on refresh. No microphone, OpenAI calls, live endpoints, or deployment are implemented. The supplied landing, opening-page and scan-page references guide the visual style. See `docs/visual-direction.md` for the reusable illustration system.

## Structure

```text
src/App.tsx             Landing, comic panels and decision UI
src/story.ts            Typed fixtures, branch IDs and reducer
src/story.test.ts       Panel and transition invariants
src/App.css             Responsive comic layout
src/index.css           Tailwind entry and global styles
public/art/             Future illustration-only assets
netlify/functions/      Future server endpoints
.github/workflows/      Automated checks
```

## Next checkpoints

1. Complete page 2 decisions and page 3 resolution; add established facts, typed orders and validated localStorage.
2. Add server-only story generation and decision interpretation, schema validation and fixture fallback.
3. Add push-to-talk transcription and editable confirmation.
4. Extend the illustration library to match every branch, test complete desktop/mobile flows and prepare deployment.

`netlify.toml` reserves port 8888 for Netlify Dev and 5173 for Vite. Once Netlify CLI is installed, use `netlify dev` to exercise future functions alongside the frontend. No Netlify site has been linked or deployed.

Keep secrets in ignored `.env` files or server-scoped hosting environment variables. Never prefix API keys with `VITE_`. `.env.example` documents future configuration without requiring credentials today.
