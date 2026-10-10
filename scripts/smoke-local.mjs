import { fixture } from "../src/lib/story.ts";
const base = process.argv[2] || "http://localhost:8888";
const config = await fetch(`${base}/api/config`).then((r) => r.json());
console.log("Capabilities:", config);
if (!config.live) process.exit(0);
const decision = await fetch(`${base}/api/interpret-decision`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Asha",
    history: [],
    order: "Scan the station to separate everyone safely.",
  }),
});
const d = await decision.json();
console.log("Decision:", decision.status, d);
const story = await fetch(`${base}/api/generate-story`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Asha",
    history: [],
    branch: "discovery",
    order: "Scan the station to separate everyone safely.",
    previousPages: [fixture("Asha", [])],
  }),
});
const s = await story.json();
console.log("Story:", story.status, {
  title: s.page?.title,
  panels: s.page?.panels?.length,
  personalized: s.page?.panels?.some((p) =>
    (p.caption + p.dialogue).includes("Asha"),
  ),
  error: s.error,
});
if (!decision.ok || !story.ok) process.exitCode = 1;
