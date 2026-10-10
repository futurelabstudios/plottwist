import type { Config } from "@netlify/functions";
import { ENV_KEYS, handleApi } from "../../server/api";
export default (request: Request) =>
  handleApi(
    request,
    Object.fromEntries(ENV_KEYS.map((key) => [key, Netlify.env.get(key)])),
  );
export const config: Config = {
  path: "/api/*",
  rateLimit: {
    action: "rate_limit",
    aggregateBy: ["ip", "domain"],
    windowLimit: 20,
    windowSize: 60,
  },
};
