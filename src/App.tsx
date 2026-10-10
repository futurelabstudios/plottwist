import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  advance,
  createBook,
  fixture,
  choicesFor,
  worldFor,
  labels,
  icons,
  interpretOffline,
  validBook,
  PageSchema,
  type Book,
  type Branch,
  type Page,
} from "./lib/story";
import {
  ConfigSchema,
  InterpretationSchema,
  type ServiceConfig,
} from "./lib/contracts";
import { VoiceSession, type VoiceMode, type VoicePhase } from "./lib/voice";
import { readArt, saveArt } from "./lib/art-cache";
import "./App.css";
import Platform from "./platform/Platform";
import Brand from "./components/Brand";

const SAVE_KEY = "plottwist-book-v2";
function loadBook(): Book | null {
  try {
    return validBook(JSON.parse(localStorage.getItem(SAVE_KEY) || "null"));
  } catch {
    return null;
  }
}
const defaultConfig: ServiceConfig = {
  live: false,
  realtime: false,
  images: false,
  reason: "Offline edition",
};
function artStyle(art: number, custom?: string, index = 0): CSSProperties {
  const cols = custom ? 2 : 4,
    rows = custom ? 2 : art < 8 ? 2 : 4,
    tile = custom ? index : art < 8 ? art : art - 8;
  return {
    backgroundImage: `url("${custom || (art < 8 ? "/art/borrowed-stars-atlas.png" : "/art/borrowed-stars-chapters.png")}")`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${((tile % cols) * 100) / (cols - 1)}% ${(Math.floor(tile / cols) * 100) / (rows - 1)}%`,
  };
}
function ComicPage({ page, art }: { page: Page; art?: string }) {
  return (
    <div className="paper">
      <div className="paper-heading">
        <span>THE BORROWED STARS</span>
        <span>{String(page.number).padStart(2, "0")} / 10</span>
      </div>
      <h2>{page.title}</h2>
      <div className="panels">
        {page.panels.map((panel, i) => (
          <article className={`panel panel-${i}`} key={i}>
            <div
              className="illustration"
              style={artStyle(panel.art, art, i)}
              role="img"
              aria-label={panel.caption}
            />
            <span className="panel-number">{i + 1}</span>
            <p className="bubble">{panel.dialogue}</p>
            <p className="caption">{panel.caption}</p>
          </article>
        ))}
      </div>
      <div className="paper-bottom">
        <span>✧ A STORY SHAPED BY YOU</span>
        <span>{page.number}</span>
      </div>
    </div>
  );
}
export default function App() {
  const [book, setBook] = useState<Book | null>(loadBook);
  const [screen, setScreen] = useState<"platform" | "comic">("platform");
  const [view, setView] = useState(() =>
    Math.max(0, (loadBook()?.pages.length ?? 1) - 1),
  );
  const [config, setConfig] = useState(defaultConfig);
  const [live, setLive] = useState(false);
  const [text, setText] = useState("");
  const [pending, setPending] = useState<{
    branch: Branch;
    order: string;
    confirmation: string;
  } | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState("");
  const [fallback, setFallback] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>("recorded");
  const [voicePhase, setVoicePhase] = useState<VoicePhase>("idle");
  const [oldPage, setOldPage] = useState<{
    page: Page;
    art?: string;
    backwards: boolean;
  } | null>(null);
  const [artCache, setArtCache] = useState<{ key: string; value?: string }>({
    key: "",
  });
  const [resetting, setResetting] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const inFlight = useRef(false);
  const requestId = useRef(0);
  const turnTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const voice = useRef<VoiceSession | null>(null);
  const page = book?.pages[view];
  const world = book ? worldFor(book.history) : null;
  const latest = !!book && view === book.pages.length - 1;
  const completed = book?.pages.length === 10;
  const choices = page ? choicesFor(page.number) : [];
  const artKey =
    book && page
      ? JSON.stringify([book.name, book.history.slice(0, view), page])
      : "";

  const customArt = artCache.key === artKey ? artCache.value : undefined;
  const hasBook = !!book;
  useEffect(() => {
    if (resetting) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [resetting]);

  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/config", { signal: abort.signal })
      .then((r) => r.json())
      .then((value) => {
        const c = ConfigSchema.parse(value);
        setConfig(c);
        setLive(c.live);
      })
      .catch(() => {});
    return () => abort.abort();
  }, []);
  useEffect(() => {
    try {
      if (book) localStorage.setItem(SAVE_KEY, JSON.stringify(book));
      else localStorage.removeItem(SAVE_KEY);
    } catch {
      queueMicrotask(() =>
        setStorageError(
          "Browser storage is unavailable. Keep this tab open or download your book to preserve it.",
        ),
      );
    }
  }, [book]);
  useEffect(() => {
    let active = true;
    if (artKey)
      void readArt(artKey).then((value) => {
        if (active) setArtCache({ key: artKey, value });
      });
    return () => {
      active = false;
    };
  }, [artKey]);
  useEffect(() => {
    voice.current = new VoiceSession({
      phase: setVoicePhase,
      transcript: (value) => {
        setText(value);
        setPending(null);
        setFallback(false);
      },
      error: setError,
    });
    return () => {
      voice.current?.cancel();
      controller.current?.abort();
      clearTimeout(turnTimer.current);
    };
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    titleRef.current?.focus({ preventScroll: true });
  }, [view, hasBook]);

  function clearDecision() {
    requestId.current++;
    voice.current?.cancel();
    controller.current?.abort();
    inFlight.current = false;
    setBusy("");
    setError("");
    setText("");
    setPending(null);
    setFallback(false);
  }
  function turn(next: number, nextBook = book) {
    if (!nextBook || next < 0 || next >= nextBook.pages.length || oldPage)
      return;
    clearDecision();
    if (page) setOldPage({ page, art: customArt, backwards: next < view });
    setView(next);
    setBook(nextBook);
    clearTimeout(turnTimer.current);
    turnTimer.current = setTimeout(() => setOldPage(null), 720);
  }
  function choose(branch: Branch) {
    if (busy || voicePhase !== "idle") return;
    setError("");
    setFallback(false);
    const label = choices.find((c) => c.id === branch)!.label;
    setPending({ branch, order: label, confirmation: label });
    setText(label);
  }
  async function request(path: string, body: unknown) {
    const abort = new AbortController();
    controller.current = abort;
    const response = await fetch(`/api/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.any([abort.signal, AbortSignal.timeout(55_000)]),
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(data.error || "The request failed. Please try again.");
    return data;
  }
  async function interpret() {
    if (
      !book ||
      !page ||
      !text.trim() ||
      inFlight.current ||
      voicePhase !== "idle"
    )
      return;
    setError("");
    setPending(null);
    setFallback(false);
    if (!live) {
      const branch = interpretOffline(text, page.number);
      if (!branch)
        return setError(
          "Please choose one of the four approaches, or describe one clear action such as “scan the station”.",
        );
      return setPending({
        branch,
        order: text,
        confirmation: choices.find((c) => c.id === branch)!.label,
      });
    }
    const op = ++requestId.current;
    inFlight.current = true;
    setBusy("Understanding your order…");
    try {
      const data = InterpretationSchema.parse(
        await request("interpret-decision", {
          name: book.name,
          history: book.history,
          order: text,
        }),
      );
      if (op !== requestId.current || controller.current?.signal.aborted)
        return;
      if (data.branch)
        setPending({
          branch: data.branch,
          order: text,
          confirmation: data.confirmation,
        });
      else setError(data.clarification || "Please clarify your order.");
    } catch (e) {
      if (op === requestId.current && !controller.current?.signal.aborted)
        setError(
          e instanceof Error ? e.message : "Could not interpret that order.",
        );
    } finally {
      if (op === requestId.current && !controller.current?.signal.aborted) {
        inFlight.current = false;
        setBusy("");
      }
    }
  }
  async function confirm(useFixture = false) {
    if (
      !book ||
      !pending ||
      !latest ||
      completed ||
      inFlight.current ||
      oldPage
    )
      return;
    const nextHistory = [...book.history, pending.branch];
    if (!live || useFixture) {
      turn(
        view + 1,
        advance(
          book,
          pending.branch,
          pending.order,
          fixture(book.name, nextHistory),
        ),
      );
      return;
    }
    const op = ++requestId.current;
    inFlight.current = true;
    setBusy("Writing the next four panels…");
    setError("");
    setFallback(false);
    try {
      const result = await request("generate-story", {
        name: book.name,
        history: book.history,
        branch: pending.branch,
        order: pending.order,
        previousPages: book.pages,
      });
      if (op !== requestId.current || controller.current?.signal.aborted)
        return;
      const generated = PageSchema.parse(result.page);
      if (
        !generated.panels.some((p) =>
          (p.caption + p.dialogue).includes(book.name),
        )
      )
        throw new Error("The response lost your Captain’s name.");
      turn(view + 1, advance(book, pending.branch, pending.order, generated));
    } catch (e) {
      if (op === requestId.current && !controller.current?.signal.aborted) {
        setError(
          e instanceof Error ? e.message : "The page could not be generated.",
        );
        setFallback(true);
      }
    } finally {
      if (op === requestId.current && !controller.current?.signal.aborted) {
        inFlight.current = false;
        setBusy("");
      }
    }
  }
  async function illustrate() {
    if (!book || !page || inFlight.current) return;
    const op = ++requestId.current;
    inFlight.current = true;
    setBusy("Painting four new illustrations…");
    setError("");
    try {
      const result = await request("generate-art", {
        name: book.name,
        history: book.history.slice(0, view),
        page,
      });
      if (op !== requestId.current || controller.current?.signal.aborted)
        return;
      if (
        typeof result.dataUrl !== "string" ||
        !result.dataUrl.startsWith("data:image/webp;base64,")
      )
        throw new Error("The illustration response was invalid.");
      setArtCache({ key: artKey, value: result.dataUrl });
      await saveArt(artKey, result.dataUrl).catch(() =>
        setStorageError(
          "New art is visible, but this browser could not save it for later.",
        ),
      );
    } catch (e) {
      if (op === requestId.current && !controller.current?.signal.aborted)
        setError(e instanceof Error ? e.message : "Image generation failed.");
    } finally {
      if (op === requestId.current && !controller.current?.signal.aborted) {
        inFlight.current = false;
        setBusy("");
      }
    }
  }
  function exportBook() {
    const blob = new Blob([JSON.stringify(book, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "the-borrowed-stars.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (screen === "platform" || !book)
    return (
      <Platform
        savedName={book?.name}
        onResume={() => {
          clearDecision();
          setView(Math.max(0, (book?.pages.length ?? 1) - 1));
          setScreen("comic");
          window.scrollTo({ top: 0 });
        }}
        onStart={(captain) => {
          clearDecision();
          setOldPage(null);
          clearTimeout(turnTimer.current);
          setBook(createBook(captain));
          setView(0);
          setScreen("comic");
        }}
      />
    );
  return (
    <main className="comic-main">
      <header className="comic-navbar">
        <a
          href="/"
          className="brand"
          onClick={(event) => {
            event.preventDefault();
            clearDecision();
            setScreen("platform");
          }}
        >
          <Brand />
        </a>
        <div className="mode">
          <span className="badge">
            <span />
            {live ? "OpenAI edition" : "Offline edition"}
          </span>
          {config.live && (
            <label>
              <input
                type="checkbox"
                checked={live}
                disabled={!!busy || voicePhase !== "idle"}
                onChange={(e) => {
                  clearDecision();
                  setLive(e.target.checked);
                }}
              />
              Live story
            </label>
          )}
        </div>
      </header>
      <section className="episode">
        <div className="captain-bar">
          <div
            className="avatar illustration"
            style={artStyle(3)}
            aria-hidden="true"
          />
          <div className="captain-info">
            <div>
              <strong>Captain {book.name}</strong>
              <span>PAGE {view + 1} / 10</span>
            </div>
            <div className="progress" aria-label={`Page ${view + 1} of 10`}>
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i} className={i <= view ? "active" : ""} />
              ))}
            </div>
          </div>
          <button
            className="reset"
            disabled={!!busy || voicePhase !== "idle"}
            onClick={() => setResetting(true)}
          >
            New book
          </button>
        </div>
        <h1 className="book-title" ref={titleRef} tabIndex={-1}>
          The Borrowed Stars
        </h1>
        <div className="book-tools">
          <button
            className="text-button"
            disabled={!!busy}
            onClick={exportBook}
          >
            Save story ↓
          </button>
          <button
            className="text-button"
            disabled={!!busy}
            onClick={() => window.print()}
          >
            Print comic
          </button>
          {config.images && (
            <button
              className="text-button"
              disabled={!!busy || voicePhase !== "idle"}
              onClick={() => void illustrate()}
            >
              Illustrate this page with AI
            </button>
          )}
          <span>
            {page?.source === "openai" ? "AI-written page" : "Authored page"}
            {customArt ? " · AI illustrations" : ""}
          </span>
        </div>
        <div
          className={`book-stage ${view === 0 ? "book-opening" : ""}`}
          aria-busy={!!oldPage}
        >
          {page && <ComicPage page={page} art={customArt} />}
          {oldPage && (
            <div
              className={`turn-sheet ${oldPage.backwards ? "backwards" : ""}`}
              aria-hidden="true"
            >
              <ComicPage page={oldPage.page} art={oldPage.art} />
            </div>
          )}
        </div>
        <nav className="page-navigation" aria-label="Comic pages">
          <button
            className="secondary"
            disabled={
              view === 0 || !!oldPage || !!busy || voicePhase !== "idle"
            }
            onClick={() => turn(view - 1)}
          >
            ← Previous page
          </button>
          <span>{view + 1} of 10</span>
          <button
            className="secondary"
            disabled={latest || !!oldPage || !!busy || voicePhase !== "idle"}
            onClick={() => turn(view + 1)}
          >
            Next page →
          </button>
        </nav>
        {!latest && (
          <p className="reading-history">
            You’re rereading your book.{" "}
            <button
              className="text-button"
              disabled={!!oldPage}
              onClick={() => turn(book.pages.length - 1)}
            >
              Return to your latest page →
            </button>
          </p>
        )}
        {latest && !completed && (
          <section className="decision" aria-labelledby="decision-title">
            <p className="eyebrow">THE NEXT PAGE BEGINS WITH YOU</p>
            <h2 id="decision-title">Your orders, Captain {book.name}?</h2>
            <div className="choices">
              {choices.map((c) => (
                <button
                  disabled={!!busy || !!oldPage || voicePhase !== "idle"}
                  className={`choice ${pending?.branch === c.id ? "selected" : ""}`}
                  key={c.id}
                  onClick={() => choose(c.id)}
                >
                  <span aria-hidden="true">{icons[c.id]}</span>
                  <strong>{c.label}</strong>
                  <small>{c.hint}</small>
                </button>
              ))}
            </div>
            <div className="order-editor">
              <label htmlFor="order">Or give your own order</label>
              <textarea
                id="order"
                maxLength={600}
                rows={2}
                value={text}
                disabled={!!busy || voicePhase !== "idle"}
                placeholder="Scan the station. Find a way to let everyone leave safely."
                onChange={(e) => {
                  setText(e.target.value);
                  setPending(null);
                  setFallback(false);
                  setError("");
                }}
              />
              <div className="voice-controls">
                <button
                  aria-pressed={voicePhase === "recording"}
                  className={`voice-button ${voicePhase === "recording" ? "recording" : ""}`}
                  disabled={
                    !config.live ||
                    !!busy ||
                    !!oldPage ||
                    voicePhase === "connecting" ||
                    voicePhase === "transcribing"
                  }
                  onClick={() => {
                    setError("");
                    if (voicePhase === "recording") voice.current?.stop();
                    else {
                      setText("");
                      setPending(null);
                      void voice.current?.start(voiceMode);
                    }
                  }}
                >
                  <svg className="control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8" /></svg>
                  {voicePhase === "recording"
                    ? "■ Stop recording"
                    : voicePhase === "connecting"
                      ? "Connecting microphone…"
                      : voicePhase === "transcribing"
                        ? "Transcribing…"
                        : "Speak your order"}
                </button>
                {voicePhase !== "idle" && (
                  <button
                    className="text-button"
                    onClick={() => voice.current?.cancel()}
                  >
                    Cancel voice
                  </button>
                )}
                <label className="voice-select">
                  Voice mode
                  <select
                    value={voiceMode}
                    disabled={voicePhase !== "idle" || !!busy || !config.live}
                    onChange={(e) => setVoiceMode(e.target.value as VoiceMode)}
                  >
                    <option value="recorded">Record & transcribe</option>
                    <option value="realtime" disabled={!config.realtime}>
                      Realtime transcript
                    </option>
                  </select>
                </label>
                <button
                  disabled={
                    !text.trim() || !!busy || voicePhase !== "idle" || !!oldPage
                  }
                  onClick={() => void interpret()}
                >
                  Review order →
                </button>
              </div>
              <p className="note">
                {config.live
                  ? "Voice sends microphone audio to OpenAI, up to 15 seconds. Edit the transcript before reviewing."
                  : "Voice requires OpenAI configuration. Typed orders and all four choices work offline."}
              </p>
            </div>
            {pending && (
              <div className="confirmation" role="status">
                <span className="eyebrow">CONFIRM YOUR DECISION</span>
                <p>“{pending.order}”</p>
                <strong>{pending.confirmation}</strong>
                <p className="note">
                  Approach: {labels[pending.branch]}. This decision will shape
                  page {view + 2}.
                </p>
                <button
                  disabled={!!busy || !!oldPage}
                  onClick={() => void confirm()}
                >
                  Confirm & turn the page →
                </button>
                <button
                  className="secondary"
                  disabled={!!busy}
                  onClick={() => {
                    setPending(null);
                    setFallback(false);
                  }}
                >
                  Edit order
                </button>
              </div>
            )}
          </section>
        )}
        {completed && latest && (
          <section className="ending">
            <p className="eyebrow">THE END · AND A NEW BEGINNING</p>
            <h2>Your legacy: {labels[world!.route]}</h2>
            <p>
              Nine orders. Four hundred free lives. This is the book Captain{" "}
              {book.name} helped write.
            </p>
            <div className="journey">
              {book.history.map((b, i) => (
                <button
                  className="journey-step"
                  key={i}
                  disabled={!!oldPage}
                  onClick={() => turn(i)}
                >
                  <span>{i + 1}</span>
                  {icons[b]} {labels[b]}
                </button>
              ))}
            </div>
            <button onClick={() => setResetting(true)}>
              Open a different future ↻
            </button>
          </section>
        )}
        <div className="consequences">
          <span>
            Crew trust <strong>{world!.trust}</strong>
          </span>
          <span>
            Ship energy <strong>{world!.energy}%</strong>
          </span>
          <span>
            Station bond{" "}
            <strong>
              {world!.bond > 0 ? "+" : ""}
              {world!.bond}
            </strong>
          </span>
        </div>
        {busy && (
          <div className="busy" role="status">
            <span className="spinner" />
            {busy}
            <button
              className="text-button"
              onClick={() => {
                requestId.current++;
                controller.current?.abort();
                inFlight.current = false;
                setBusy("");
              }}
            >
              Cancel
            </button>
          </div>
        )}
        {error && (
          <div className="error" role="alert">
            {error}
            {fallback && (
              <button
                className="secondary"
                disabled={!!busy}
                onClick={() => void confirm(true)}
              >
                Continue with matching authored page →
              </button>
            )}
          </div>
        )}
      </section>

      {storageError && (
        <p className="error" role="status">
          {storageError}
        </p>
      )}
      <dialog
        ref={dialogRef}
        onCancel={() => setResetting(false)}
        aria-labelledby="new-book-title"
        className="modal"
      >
        <h2 id="new-book-title">Begin a new book?</h2>
        <p>
          Your current story will be replaced on this device. You can save it
          first.
        </p>
        <button onClick={exportBook}>Save current story</button>
        <button className="secondary" onClick={() => setResetting(false)}>
          Keep reading
        </button>
        <button
          onClick={() => {
            clearDecision();
            setOldPage(null);
            clearTimeout(turnTimer.current);
            setBook(null);
            setView(0);
            setResetting(false);
          }}
        >
          Start new book
        </button>
      </dialog>
      <footer>
        <span>THE BORROWED STARS · PLOTTWIST BY FUTURELAB STUDIOS</span>
        <span>10 pages · 4 paths · Your story</span>
      </footer>
      {book && (
        <div className="print-book">
          <h1>The Borrowed Stars</h1>
          <p>A story by Captain {book.name}</p>
          {book.pages.map((p) => (
            <ComicPage key={p.number} page={p} />
          ))}
        </div>
      )}
    </main>
  );
}
