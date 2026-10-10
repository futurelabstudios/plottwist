# PlotTwist — The Borrowed Stars

An illustrated, ten-page interactive comic. Each page has four panels; nine confirmed decisions shape the rescue of 400 people living as memories inside a space station. The Captain’s name appears throughout the dialogue.

## Run locally

Requires Node.js 24 and npm.

```sh
npm ci
cp .env.example .env # only for a fresh checkout; preserve any existing .env
# Put your OpenAI API key in .env
npm run dev:full
```

Open **http://localhost:8888** for the frontend and backend together. Restart the development server after changing `.env`. `npm run dev` serves the frontend alone at port 5173 with the complete offline story.

The local `.env` is ignored by Git. Never put the API key in a `VITE_` variable. The authored edition works without a key; voice and live generation require one.

## Play

- Enter your name and open the book.
- Choose diplomacy, rescue, discovery or protection; each page offers context-specific actions. Or type/speak an original order and review its interpretation.
- Confirm to create the next four panels. Page turns animate like folding paper, with reduced-motion support.
- Earlier decisions change trust, energy, the station’s bond, later dialogue and the ending. There are four authored endings; mixed paths resolve by the most-used approach, with the latest decision breaking ties.
- Switch between the authored edition and OpenAI-assisted storytelling. AI adapts the dialogue to your order while preserving the story’s main events and four-panel structure.
- Record up to 15 seconds of voice, or use Realtime transcription. Edit the transcript before confirming.
- Optionally generate a new four-panel illustration atlas for a page. Progress saves in localStorage; generated illustrations save in IndexedDB on that browser.
- Revisit pages, download the story as JSON, print the visited pages, or start a different journey. JSON export contains story text, not generated image data.

## OpenAI backend

The shared handler in `server/api.ts` runs locally and in Netlify Functions. API keys never reach the browser.

| Endpoint | Purpose |
| --- | --- |
| `GET /api/config` | Available features; no secrets |
| `POST /api/interpret-decision` | Decisions API maps an order to one of four approaches, or asks for clarification |
| `POST /api/generate-story` | Responses API returns schema-validated, personalized panels |
| `POST /api/transcribe` | File audio transcription |
| `POST /api/realtime-session` | Server-mediated WebRTC SDP exchange for Realtime transcription |
| `POST /api/generate-art` | Images API creates an optional illustration atlas |

`.env.example` lists the model and feature switches. `OPENAI_ENABLE_LIVE=true` and a key enable local live features. Hosted live access also requires `OPENAI_ALLOW_PUBLIC_LIVE=true`. Netlify has server-side request limits of 20 requests per minute per IP/domain. Requests have payload limits, timeouts and same-origin checks. Public use consumes the hosting account’s OpenAI quota; this initial release has no accounts or per-user credit ledger.

## Hosting

- Netlify: https://plottwist-borrowed-stars.netlify.app
- ChatGPT Sites: https://plottwist-borrowed-stars.futurelabstudios.chatgpt.site (owner-private)
- Source: https://github.com/futurelabstudios/plottwist

Netlify serves the built React app and API. To publish after linking/authenticating the Netlify CLI:

```sh
npm run build
npx netlify deploy --prod --no-build --dir dist --functions netlify/functions
```

Set the `OPENAI_` variables in Netlify’s production Functions environment. The included `scripts/configure-netlify.mjs` uses the authenticated CLI account and the linked `.netlify/state.json` to transfer `.env` values without printing them; it enables hosted live access. The local `.env` remains ignored.

ChatGPT Sites uses a separate local Vinext checkout under ignored `hosting/chatgpt`. Its worker proxies `/api/*` to the Netlify backend, so there is only one server-side OpenAI key. `node scripts/sync-sites.mjs` updates shared source and assets in that initialized checkout. Publish that checkout with the Sites plugin’s source/build/archive workflow. Both deployments are manually published; GitHub Actions validates source on pushes.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
node scripts/smoke-local.mjs # uses the local live API when configured
```

Tests cover all four full routes, all nine decision points, save validation, request boundaries, schema failures, decision confidence, transcription/Realtime/image endpoints and microphone cleanup. Live smoke checks have exercised Decisions, Responses, file transcription and image generation. Realtime signaling is implemented and covered by mocked tests; a real browser microphone/WebRTC session still needs device validation.

## Project map

- `src/App.tsx`, `src/App.css`: comic, page fold, choices and accessibility.
- `src/lib/story.ts`: authored ten-page story, four branches and saved book schema.
- `src/lib/voice.ts`: recording and Realtime lifecycle.
- `src/lib/art-cache.ts`: optional generated illustration persistence.
- `server/api.ts`: validated, server-only OpenAI integration.
- `netlify/functions/api.mts`: Netlify adapter and rate limit.
- `public/art/`: 24 reference-inspired illustration scenes.
- `docs/visual-direction.md`: art direction and asset layout.
