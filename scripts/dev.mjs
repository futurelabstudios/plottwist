import { readFileSync, existsSync } from "node:fs";
import { parseEnv } from "node:util";
import { createServer as httpServer } from "node:http";
import { Readable } from "node:stream";
import { createServer as viteServer } from "vite";
import { handleApi } from "../server/api.ts";
const local = existsSync(".env") ? parseEnv(readFileSync(".env", "utf8")) : {};
const environment = { ...process.env, ...local, CONTEXT: "dev" };
const vite = await viteServer({
  server: { middlewareMode: true },
  appType: "spa",
});
const server = httpServer(async (req, res) => {
  if (req.url?.startsWith("/api/")) {
    const abort = new AbortController();
    res.on("close", () => {
      if (!res.writableEnded) abort.abort();
    });
    try {
      const request = new Request(`http://${req.headers.host}${req.url}`, {
        method: req.method,
        headers: req.headers,
        body: ["GET", "HEAD"].includes(req.method)
          ? undefined
          : Readable.toWeb(req),
        duplex: "half",
        signal: abort.signal,
      });
      const response = await handleApi(request, environment);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Local API request failed." }));
    }
  } else vite.middlewares(req, res);
});
server.listen(8888, "127.0.0.1", () =>
  console.log("PlotTwist frontend + backend: http://localhost:8888"),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, async () => {
    await vite.close();
    server.close();
    process.exit(0);
  });
