# API function

`api.mts` exposes `/api/*` through the shared server handler in `server/api.ts`. It reads server-scoped environment variables with `Netlify.env.get` and applies Netlify's IP/domain rate limit. See the root README for endpoints, local development and deployment.

No API keys belong in frontend code or `VITE_` variables. `.env` is local-only and ignored by Git; production secrets must be configured in Netlify Functions.
