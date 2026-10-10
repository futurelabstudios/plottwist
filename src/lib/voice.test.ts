import { afterEach, expect, it, vi } from "vitest";
import { VoiceSession } from "./voice";
afterEach(() => vi.unstubAllGlobals());
it("releases a microphone that arrives after the user cancels permission setup", async () => {
  let resolve!: (s: MediaStream) => void;
  const permission = new Promise<MediaStream>((r) => (resolve = r));
  const stop = vi.fn();
  vi.stubGlobal("navigator", {
    mediaDevices: { getUserMedia: () => permission },
  });
  vi.stubGlobal("MediaRecorder", class {});
  const callbacks = { phase: vi.fn(), transcript: vi.fn(), error: vi.fn() };
  const voice = new VoiceSession(callbacks);
  const pending = voice.start("recorded");
  voice.cancel();
  resolve({ getTracks: () => [{ stop }] } as unknown as MediaStream);
  await pending;
  expect(stop).toHaveBeenCalledOnce();
  expect(callbacks.transcript).not.toHaveBeenCalled();
});
it("makes microphone denial recoverable", async () => {
  vi.stubGlobal("navigator", {
    mediaDevices: {
      getUserMedia: () =>
        Promise.reject(new DOMException("denied", "NotAllowedError")),
    },
  });
  vi.stubGlobal("MediaRecorder", class {});
  const callbacks = { phase: vi.fn(), transcript: vi.fn(), error: vi.fn() };
  await new VoiceSession(callbacks).start("recorded");
  expect(callbacks.error).toHaveBeenCalledWith(
    expect.stringContaining("denied"),
  );
  expect(callbacks.phase).toHaveBeenLastCalledWith("idle");
});
