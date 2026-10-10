export type VoicePhase = "idle" | "connecting" | "recording" | "transcribing";
export type VoiceMode = "recorded" | "realtime";
interface Callbacks {
  phase: (phase: VoicePhase) => void;
  transcript: (text: string) => void;
  error: (message: string) => void;
}
export class VoiceSession {
  private stream?: MediaStream;
  private recorder?: MediaRecorder;
  private peer?: RTCPeerConnection;
  private channel?: RTCDataChannel;
  private abort?: AbortController;
  private timer?: ReturnType<typeof setTimeout>;
  private generation = 0;
  private phase: VoicePhase = "idle";
  private mode: VoiceMode = "recorded";
  private chunks: Blob[] = [];
  private bytes = 0;
  private currentText = "";
  private callbacks: Callbacks;
  constructor(callbacks: Callbacks) {
    this.callbacks = callbacks;
  }
  private setPhase(phase: VoicePhase) {
    this.phase = phase;
    this.callbacks.phase(phase);
  }
  cancel() {
    this.generation++;
    clearTimeout(this.timer);
    this.abort?.abort();
    if (this.recorder?.state === "recording") this.recorder.stop();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.channel?.close();
    this.peer?.close();
    this.stream = undefined;
    this.recorder = undefined;
    this.peer = undefined;
    this.channel = undefined;
    this.chunks = [];
    this.bytes = 0;
    this.setPhase("idle");
  }
  private fail(message: string) {
    this.cancel();
    this.callbacks.error(message);
  }
  async start(mode: VoiceMode) {
    if (this.phase !== "idle") return;
    if (!navigator.mediaDevices?.getUserMedia)
      return this.callbacks.error(
        "Voice needs microphone support on HTTPS or localhost. You can type your order instead.",
      );
    if (mode === "recorded" && typeof MediaRecorder === "undefined")
      return this.callbacks.error(
        "This browser cannot record audio. Type your order or try Realtime voice.",
      );
    if (mode === "realtime" && typeof RTCPeerConnection === "undefined")
      return this.callbacks.error(
        "This browser does not support Realtime voice. Try recorded voice.",
      );
    const token = ++this.generation;
    this.mode = mode;
    this.currentText = "";
    this.setPhase("connecting");
    this.abort = new AbortController();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (token !== this.generation) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      this.stream = stream;
      if (mode === "recorded") this.startRecorder(token);
      else await this.startRealtime(token);
    } catch (e) {
      if (token !== this.generation) return;
      this.fail(
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Microphone permission was denied. Allow it in your browser or type your order."
          : e instanceof Error
            ? e.message
            : "Voice could not start. Try typing instead.",
      );
    }
  }
  private startRecorder(token: number) {
    const mimeType = [
      "audio/webm;codecs=opus",
      "audio/mp4",
      "audio/webm",
      "audio/ogg;codecs=opus",
    ].find((type) => MediaRecorder.isTypeSupported(type));
    if (!mimeType)
      throw new Error(
        "No supported recording format. Try Realtime voice or type your order.",
      );
    this.chunks = [];
    this.bytes = 0;
    const recorder = new MediaRecorder(this.stream!, { mimeType });
    this.recorder = recorder;
    recorder.ondataavailable = (event) => {
      if (token !== this.generation) return;
      this.bytes += event.data.size;
      if (this.bytes > 4 * 1024 * 1024)
        return this.fail("Recording is too large. Please use a shorter order.");
      this.chunks.push(event.data);
    };
    recorder.onerror = () => {
      if (token === this.generation)
        this.fail("Recording failed. Try again or type your order.");
    };
    recorder.onstop = () => {
      if (token === this.generation) void this.uploadRecording(mimeType, token);
    };
    recorder.start(250);
    this.setPhase("recording");
    this.timer = setTimeout(() => this.stop(), 15_000);
  }
  private async uploadRecording(mimeType: string, token: number) {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.setPhase("transcribing");
    const file = new File(
      this.chunks,
      `order.${mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm"}`,
      { type: mimeType },
    );
    this.chunks = [];
    if (file.size < 100) return this.fail("No audio was recorded. Try again.");
    const form = new FormData();
    form.set("file", file);
    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
        signal: AbortSignal.any([
          this.abort!.signal,
          AbortSignal.timeout(55_000),
        ]),
      });
      const data = await response.json();
      if (token !== this.generation) return;
      if (!response.ok || typeof data.text !== "string")
        throw new Error(data.error || "Transcription failed.");
      this.callbacks.transcript(data.text.slice(0, 600));
      this.cancel();
    } catch (e) {
      if (token === this.generation)
        this.fail(
          e instanceof Error ? e.message : "Transcription failed. Try typing.",
        );
    }
  }
  private async startRealtime(token: number) {
    const peer = new RTCPeerConnection();
    this.peer = peer;
    // Do not transmit speech until the data channel is ready.
    this.stream!.getAudioTracks().forEach((track) => {
      track.enabled = false;
      peer.addTrack(track, this.stream!);
    });
    const channel = peer.createDataChannel("oai-events");
    this.channel = channel;
    this.timer = setTimeout(() => {
      if (token === this.generation)
        this.fail("Realtime connection timed out. Try recorded voice.");
    }, 20_000);
    channel.onopen = () => {
      if (token !== this.generation) return;
      clearTimeout(this.timer);
      this.stream!.getAudioTracks().forEach((t) => {
        t.enabled = true;
      });
      this.setPhase("recording");
      this.timer = setTimeout(() => this.stop(), 15_000);
    };
    channel.onmessage = (message) => {
      if (token !== this.generation) return;
      try {
        const event = JSON.parse(message.data);
        if (
          event.type === "conversation.item.input_audio_transcription.delta" &&
          typeof event.delta === "string"
        ) {
          this.currentText = (this.currentText + event.delta).slice(0, 600);
          this.callbacks.transcript(this.currentText);
        } else if (
          event.type === "conversation.item.input_audio_transcription.completed"
        ) {
          if (typeof event.transcript !== "string" || !event.transcript.trim())
            return this.fail("No speech detected. Please try again.");
          this.callbacks.transcript(event.transcript.slice(0, 600));
          this.cancel();
        } else if (
          event.type === "error" ||
          event.type === "conversation.item.input_audio_transcription.failed"
        )
          this.fail(
            "Realtime transcription failed. Try recorded voice or type your order.",
          );
      } catch {
        this.fail("Invalid voice response. Try recorded voice.");
      }
    };
    peer.onconnectionstatechange = () => {
      if (
        token === this.generation &&
        ["failed", "disconnected"].includes(peer.connectionState)
      )
        this.fail(
          "Voice connection was lost. You can keep editing your transcript.",
        );
    };
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const response = await fetch("/api/realtime-session", {
      method: "POST",
      headers: { "Content-Type": "application/sdp" },
      body: offer.sdp,
      signal: AbortSignal.any([
        this.abort!.signal,
        AbortSignal.timeout(20_000),
      ]),
    });
    if (token !== this.generation) return;
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Realtime connection failed.");
    }
    await peer.setRemoteDescription({
      type: "answer",
      sdp: await response.text(),
    });
  }
  stop() {
    if (this.phase !== "recording") return;
    clearTimeout(this.timer);
    this.setPhase("transcribing");
    if (this.mode === "recorded") {
      this.recorder?.stop();
      this.stream?.getTracks().forEach((t) => t.stop());
    } else {
      this.stream?.getTracks().forEach((t) => t.stop());
      if (this.channel?.readyState === "open") {
        this.channel.send(
          JSON.stringify({ type: "input_audio_buffer.commit" }),
        );
        this.timer = setTimeout(
          () =>
            this.fail(
              "No final transcript arrived. Edit the text above or try recorded voice.",
            ),
          12_000,
        );
      } else this.fail("Voice connection closed. Try again.");
    }
  }
}
