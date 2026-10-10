import { afterEach, describe, expect, it, vi } from "vitest";
import { handleApi, capabilities } from "./api";
import { fixture } from "../src/lib/story";
const mocks = vi.hoisted(() => ({
  decisions: vi.fn(),
  responses: vi.fn(),
  transcribe: vi.fn(),
  images: vi.fn(),
}));
vi.mock("openai", () => ({
  default: class {
    decisions = { create: mocks.decisions };
    responses = { parse: mocks.responses };
    audio = { transcriptions: { create: mocks.transcribe } };
    images = { generate: mocks.images };
  },
}));
const env = {
  OPENAI_API_KEY: "test-placeholder",
  OPENAI_ENABLE_LIVE: "true",
  CONTEXT: "dev",
  OPENAI_ENABLE_IMAGES: "true",
  OPENAI_ENABLE_REALTIME: "true",
};
const request = (path: string, body: unknown) =>
  new Request(`http://localhost/api/${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});
describe("server boundary", () => {
  it("disables live features without a key and on hosted deployments without explicit enablement", () => {
    expect(capabilities({ ...env, OPENAI_API_KEY: "" }).live).toBe(false);
    expect(capabilities({ ...env, CONTEXT: "production" }).live).toBe(false);
    expect(
      capabilities({
        ...env,
        CONTEXT: "production",
        OPENAI_ALLOW_PUBLIC_LIVE: "true",
      }).live,
    ).toBe(true);
  });
  it("never leaks secrets in config", async () => {
    const r = await handleApi(new Request("http://localhost/api/config"), env);
    expect(await r.text()).not.toContain(env.OPENAI_API_KEY);
  });
  it("rejects invalid, oversized, cross-origin and unconfigured requests", async () => {
    expect((await handleApi(request("generate-story", {}), env)).status).toBe(
      400,
    );
    expect(
      (
        await handleApi(
          request("interpret-decision", {
            name: "Ada",
            history: [],
            order: "x".repeat(75000),
          }),
          env,
        )
      ).status,
    ).toBe(413);
    expect(
      (
        await handleApi(
          new Request("http://localhost/api/transcribe", {
            method: "POST",
            headers: { origin: "https://evil.example" },
          }),
          env,
        )
      ).status,
    ).toBe(403);
    expect(
      (await handleApi(request("interpret-decision", {}), {})).status,
    ).toBe(503);
  });
  it("uses Decisions and clarifies low-confidence results", async () => {
    mocks.decisions.mockResolvedValue({
      answers: [
        { name: "route", type: "choice", choice: "rescue", confidence: 0.4 },
      ],
    });
    const result = await handleApi(
      request("interpret-decision", {
        name: "Ada",
        history: [],
        order: "maybe go in",
      }),
      env,
    );
    expect((await result.json()).branch).toBeNull();
  });
  it("returns only approved branch IDs", async () => {
    mocks.decisions.mockResolvedValue({
      answers: [
        { name: "route", type: "choice", choice: "discovery", confidence: 0.9 },
      ],
    });
    const result = await handleApi(
      request("interpret-decision", {
        name: "Ada",
        history: [],
        order: "scan",
      }),
      env,
    );
    expect((await result.json()).branch).toBe("discovery");
  });
  it("validates generated panels and keeps deterministic art mapping", async () => {
    const page = fixture("Ada", ["discovery"]);
    mocks.responses.mockResolvedValue({
      status: "completed",
      output_parsed: {
        title: page.title,
        panels: page.panels.map(({ caption, dialogue }) => ({
          caption,
          dialogue,
        })),
      },
    });
    const response = await handleApi(
      request("generate-story", {
        name: "Ada",
        history: [],
        branch: "discovery",
        order: "Scan",
        previousPages: [fixture("Ada", [])],
      }),
      env,
    );
    const data = await response.json();
    expect(data.page.source).toBe("openai");
    expect(data.page.panels.map((p: { art: number }) => p.art)).toEqual(
      page.panels.map((p) => p.art),
    );
  });
  it("rejects incomplete, refused and incorrectly sized generated pages", async () => {
    const input = {
      name: "Ada",
      history: [],
      branch: "discovery",
      order: "Scan",
      previousPages: [fixture("Ada", [])],
    };
    for (const result of [
      { status: "incomplete", output_parsed: null },
      { status: "completed", output_parsed: null },
      { status: "completed", output_parsed: { title: "Bad", panels: [] } },
    ]) {
      mocks.responses.mockResolvedValue(result);
      expect((await handleApi(request("generate-story", input), env)).ok).toBe(
        false,
      );
    }
  });
  it("accepts binary audio and rejects silence", async () => {
    mocks.transcribe.mockResolvedValue({ text: "" });
    const form = new FormData();
    form.set("file", new File(["audio"], "order.webm", { type: "audio/webm" }));
    const response = await handleApi(
      new Request("http://localhost/api/transcribe", {
        method: "POST",
        body: form,
      }),
      env,
    );
    expect(response.status).toBe(422);
    expect(mocks.transcribe.mock.calls[0][0].file).toBeInstanceOf(File);
  });
  it("proxies a transcription-only Realtime offer and never returns the API key", async () => {
    const upstream = vi.fn().mockResolvedValue(new Response("v=0\r\nanswer"));
    vi.stubGlobal("fetch", upstream);
    const response = await handleApi(
      new Request("http://localhost/api/realtime-session", {
        method: "POST",
        headers: { "content-type": "application/sdp" },
        body: "v=0\r\noffer",
      }),
      env,
    );
    expect(await response.text()).toBe("v=0\r\nanswer");
    const body = upstream.mock.calls[0][1].body as FormData;
    expect(JSON.parse(body.get("session") as string).type).toBe(
      "transcription",
    );
  });
  it("returns image bytes from the optional image endpoint", async () => {
    mocks.images.mockResolvedValue({ data: [{ b64_json: "dGVzdA==" }] });
    const response = await handleApi(
      request("generate-art", {
        name: "Ada",
        history: [],
        page: fixture("Ada", []),
      }),
      env,
    );
    expect((await response.json()).dataUrl).toBe(
      "data:image/webp;base64,dGVzdA==",
    );
  });
  it("returns a recoverable timeout error without upstream details", async () => {
    mocks.decisions.mockRejectedValue(
      new DOMException("secret detail", "TimeoutError"),
    );
    const response = await handleApi(
      request("interpret-decision", {
        name: "Ada",
        history: [],
        order: "scan",
      }),
      env,
    );
    expect(response.status).toBe(504);
    expect(await response.text()).not.toContain("secret detail");
  });
});
