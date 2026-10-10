import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { NetlifyAPI } from "@netlify/api";
import { getAPIToken } from "@netlify/dev-utils";
const { siteId } = JSON.parse(readFileSync(".netlify/state.json", "utf8"));
if (!siteId) throw new Error("Link this folder to a Netlify site first.");
const api = new NetlifyAPI(await getAPIToken());
const site = await api.getSite({ siteId });
const local = parseEnv(readFileSync(".env", "utf8"));
const values = Object.fromEntries(
  Object.entries(local).filter(([key]) => key.startsWith("OPENAI_")),
);
if (!values.OPENAI_API_KEY)
  throw new Error("Add OPENAI_API_KEY to .env first.");
values.OPENAI_ALLOW_PUBLIC_LIVE = "true";
try {
  const existing = await api.getEnvVars({
    accountId: site.account_slug,
    siteId,
  });
  for (const [key, value] of Object.entries(values)) {
    const body = {
      key,
      scopes: ["functions"],
      is_secret: key === "OPENAI_API_KEY",
      values: [{ value, context: "production" }],
    };
    if (existing.some((v) => v.key === key))
      await api.updateEnvVar({
        accountId: site.account_slug,
        siteId,
        key,
        body,
      });
    else
      await api.createEnvVars({
        accountId: site.account_slug,
        siteId,
        body: [body],
      });
  }
  console.log(
    `Configured ${Object.keys(values).length} server-only variables for ${site.name}. No values printed.`,
  );
} catch (error) {
  console.error(
    "Netlify environment setup failed with HTTP status",
    error.status ?? "unknown",
  );
  process.exitCode = 1;
}
