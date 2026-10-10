import { useEffect, useRef, useState, type PointerEvent } from "react";
import { NameSchema } from "../lib/story";
import {
  courses,
  fantasyChoices,
  fantasyPage,
  type FantasyChoice,
} from "./content";
import "./Platform.css";

type IconName = "arrow" | "spark" | "orbit" | "signal" | "play" | "check";
function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    spark: (
      <>
        <path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z" />
        <path d="m20 2 .7 2.3L23 5l-2.3.7L20 8l-.7-2.3L17 5l2.3-.7Z" />
      </>
    ),
    orbit: (
      <>
        <circle cx="12" cy="12" r="4" />
        <ellipse cx="12" cy="12" rx="11" ry="5" transform="rotate(-35 12 12)" />
      </>
    ),
    signal: (
      <>
        <path d="M4 19v-4m5 4V9m5 10V5m5 14V2" />
      </>
    ),
    play: <path d="m9 5 11 7-11 7Z" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
interface LearningSave {
  completed: string[];
  notes: Record<string, string>;
}
const LEARNING_KEY = "lumiclinik-learning-v1";
function loadLearning(): LearningSave {
  try {
    const value = JSON.parse(localStorage.getItem(LEARNING_KEY) || "null");
    if (
      value &&
      Array.isArray(value.completed) &&
      value.completed.every((x: unknown) => typeof x === "string") &&
      value.notes &&
      typeof value.notes === "object"
    )
      return {
        completed: value.completed,
        notes: Object.fromEntries(
          Object.entries(value.notes).filter(([, v]) => typeof v === "string"),
        ) as Record<string, string>,
      };
  } catch {
    /* The learning experience works without browser storage. */
  }
  return { completed: [], notes: {} };
}
interface Props {
  onStart: (name: string) => void;
  onResume: () => void;
  savedName?: string;
}
export default function Platform({ onStart, onResume, savedName }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [selection, setSelection] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [learning, setLearning] = useState(loadLearning);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [fantasyName, setFantasyName] = useState("");
  const [fantasyHistory, setFantasyHistory] = useState<FantasyChoice[]>([]);
  const [fantasyTurning, setFantasyTurning] = useState(false);
  const fantasyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const course = courses.find((c) => c.id === selection);
  const lesson = course?.lessons[lessonIndex];
  const lessonKey = course && lesson ? `${course.id}/${lesson.id}` : "";
  const fantasy = fantasyName ? fantasyPage(fantasyName, fantasyHistory) : null;
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.12 },
    );
    root.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (selection) dialog.current?.showModal();
    else dialog.current?.close();
  }, [selection]);
  useEffect(() => {
    try {
      localStorage.setItem(LEARNING_KEY, JSON.stringify(learning));
    } catch {
      /* Keep the current session usable when storage is disabled. */
    }
  }, [learning]);
  useEffect(() => () => clearTimeout(fantasyTimer.current), []);
  function open(id: string) {
    setSelection(id);
    setName(savedName || "");
    setError("");
    setLessonIndex(0);
    setAnswer(null);
    setChecked(false);
    setFantasyName("");
    setFantasyHistory([]);
  }
  function close() {
    setSelection(null);
    clearTimeout(fantasyTimer.current);
    setFantasyTurning(false);
  }
  function parallax(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--pointer-x",
      `${((event.clientX - r.left) / r.width - 0.5) * 16}px`,
    );
    event.currentTarget.style.setProperty(
      "--pointer-y",
      `${((event.clientY - r.top) / r.height - 0.5) * 10}px`,
    );
  }
  function beginStory() {
    const result = NameSchema.safeParse(name);
    if (!result.success) {
      setError("Enter a name between 1 and 40 characters.");
      return;
    }
    if (selection === "scifi") {
      close();
      onStart(result.data);
    } else setFantasyName(result.data);
  }
  function directFantasy(id: FantasyChoice) {
    if (fantasyTurning || fantasyHistory.length >= 2) return;
    setFantasyTurning(true);
    setFantasyHistory((h) => [...h, id]);
    fantasyTimer.current = setTimeout(() => setFantasyTurning(false), 650);
  }
  function moveLesson(index: number) {
    if (
      course &&
      index > 0 &&
      !learning.completed.includes(
        `${course.id}/${course.lessons[index - 1].id}`,
      )
    )
      return;
    setLessonIndex(index);
    setAnswer(null);
    setChecked(false);
    setError("");
  }
  function completeLesson() {
    if (!lesson || !course || answer !== lesson.correct) return;
    setLearning((old) => ({
      ...old,
      completed: [...new Set([...old.completed, lessonKey])],
    }));
    setChecked(true);
  }
  return (
    <div className="lumi-platform" ref={root}>
      <a className="lumi-skip" href="#play">
        Skip to experiences
      </a>
      <header className="lumi-nav">
        <a className="lumi-logo" href="#top" aria-label="Lumiclinik home">
          <span className="lumi-logomark">
            <Icon name="spark" />
          </span>
          lumiclinik<span className="lumi-logo-dot">.</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#play">Play</a>
          <a href="#work">Work</a>
          <a href="#how">The idea</a>
        </nav>
        <a className="lumi-nav-cta" href="#play">
          Find your next chapter <Icon name="arrow" />
        </a>
      </header>
      <main className="lumi-main">
        <section
          className="lumi-hero"
          id="top"
          ref={hero}
          onPointerMove={parallax}
          onPointerLeave={() => {
            hero.current?.style.setProperty("--pointer-x", "0px");
            hero.current?.style.setProperty("--pointer-y", "0px");
          }}
        >
          <div className="lumi-hero-scene" aria-hidden="true" />
          <div className="lumi-hero-vignette" aria-hidden="true" />
          <div className="lumi-orbit orbit-one" aria-hidden="true" />
          <div className="lumi-orbit orbit-two" aria-hidden="true" />
          <div className="lumi-stars" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <i
                key={i}
                style={{
                  left: `${(i * 37 + 13) % 100}%`,
                  top: `${(i * 23 + 11) % 90}%`,
                  animationDelay: `${i * 0.31}s`,
                }}
              />
            ))}
          </div>
          <div className="lumi-hero-copy">
            <div className="lumi-kicker">
              <span className="lumi-live-dot" />
              FOR THE CURIOUS. THE CREATORS. THE NEXT YOU.
            </div>
            <h1>
              Your next chapter
              <br />
              starts with{" "}
              <span>
                you
                <span className="lumi-title-star" aria-hidden="true">
                  ✦
                </span>
              </span>
            </h1>
            <p>
              Enter extraordinary worlds. Build real-world skills.
              <br className="lumi-desktop-break" /> One place to play, learn,
              and become a little more you.
            </p>
            <div className="lumi-hero-actions">
              <a className="lumi-button lumi-button-lime" href="#play">
                <Icon name="play" />
                Enter Play
                <Icon name="arrow" />
              </a>
              <a className="lumi-button lumi-button-glass" href="#work">
                Explore Work
                <Icon name="arrow" />
              </a>
            </div>
            <div className="lumi-hero-footnote">
              <span />A new way to follow your curiosity
            </div>
          </div>
          <div className="lumi-float-label lumi-float-left">
            <span className="lumi-label-icon">✦</span>
            <div>
              <small>IMAGINATION, UNLOCKED</small>
              <strong>You direct the story.</strong>
            </div>
          </div>
          <div className="lumi-float-label lumi-float-right">
            <span className="lumi-label-icon">↗</span>
            <div>
              <small>YOUR NEXT LEVEL</small>
              <strong>Learn by doing.</strong>
            </div>
          </div>
          <a href="#play" className="lumi-scroll">
            SCROLL TO DISCOVER <span>↓</span>
          </a>
        </section>
        <div className="lumi-ticker" aria-hidden="true">
          <div>
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i}>
                YOUR VOICE <b>✦</b> NEW WORLDS <b>✦</b> REAL SKILLS <b>✦</b>{" "}
                ENDLESS POSSIBILITIES <b>✦</b>
              </span>
            ))}
          </div>
        </div>
        <section id="play" className="lumi-section lumi-play">
          <div className="lumi-section-heading" data-reveal>
            <div>
              <p className="lumi-section-label">
                <span>01</span> PLAY / GO SOMEWHERE ELSE
              </p>
              <h2>
                Don’t just follow a story.
                <br />
                <em>Change it.</em>
              </h2>
            </div>
            <p>
              Step into a world that listens.
              <br />
              Choose your move. Watch the plot twist.
              <br />
              Become the reason the story changes.
            </p>
          </div>
          <div className="lumi-stories">
            <article className="lumi-story-card lumi-scifi" data-reveal>
              <div className="lumi-story-art" aria-hidden="true" />
              <div className="lumi-card-top">
                <span className="lumi-tag">SCI-FI</span>
                <span className="lumi-card-number">001</span>
              </div>
              <div className="lumi-story-content">
                <p className="lumi-story-meta">
                  10 PAGES <span>·</span> 4 ENDINGS <span>·</span> VOICE CHOICES
                </p>
                <h3>
                  The Borrowed
                  <br />
                  Stars
                </h3>
                <p>
                  Four hundred voices. One impossible rescue.
                  <br />
                  What kind of Captain will you become?
                </p>
                <button
                  className="lumi-story-button"
                  onClick={() => open("scifi")}
                >
                  {savedName ? "Start a new mission" : "Direct this story"}
                  <Icon name="arrow" />
                </button>
                {savedName && (
                  <button className="lumi-resume" onClick={onResume}>
                    Resume Captain {savedName}’s book ↗
                  </button>
                )}
              </div>
              <div className="lumi-card-orbit" aria-hidden="true" />
            </article>
            <article className="lumi-story-card lumi-fantasy" data-reveal>
              <div className="lumi-story-art" aria-hidden="true" />
              <div className="lumi-card-top">
                <span className="lumi-tag">FANTASY</span>
                <span className="lumi-card-number">002</span>
              </div>
              <div className="lumi-story-content">
                <p className="lumi-story-meta">
                  3 PAGES <span>·</span> 4 ENDINGS <span>·</span> YOUR CHOICES
                </p>
                <h3>
                  The Last
                  <br />
                  Ember
                </h3>
                <p>
                  A forgotten city. A dragon with a secret.
                  <br />A dawn only you can bring back.
                </p>
                <button
                  className="lumi-story-button"
                  onClick={() => open("fantasy")}
                >
                  Enter the unknown
                  <Icon name="arrow" />
                </button>
              </div>
              <div className="lumi-card-orbit" aria-hidden="true" />
            </article>
          </div>
          <div className="lumi-play-note" data-reveal>
            <Icon name="orbit" />
            <p>
              Your name in the story. Your decisions in every chapter.
              <br />
              <strong>No two journeys have to be the same.</strong>
            </p>
            <span>THE MAIN CHARACTER? YOU. ↗</span>
          </div>
        </section>
        <section id="work" className="lumi-section lumi-work">
          <div className="lumi-section-heading" data-reveal>
            <div>
              <p className="lumi-section-label">
                <span>02</span> WORK / GROW INTO WHAT’S NEXT
              </p>
              <h2>
                Big ambitions.
                <br />
                <em>Small, powerful steps.</em>
              </h2>
            </div>
            <p>
              Step into a real-world scenario.
              <br />
              Decide what happens next. Learn a skill
              <br />
              you can take into your next project.
            </p>
          </div>
          <div className="lumi-course-grid">
            {courses.map((c, i) => {
              const done = c.lessons.filter((l) =>
                learning.completed.includes(`${c.id}/${l.id}`),
              ).length;
              return (
                <article
                  key={c.id}
                  className={`lumi-course-card course-${c.color}`}
                  data-reveal
                >
                  <div className="lumi-course-visual">
                    <Icon name={c.symbol as IconName} />
                    <div className="lumi-course-ring ring-a" />
                    <div className="lumi-course-ring ring-b" />
                    <div className="lumi-course-ring ring-c" />
                    <span className="lumi-course-index">LAB / 0{i + 1}</span>
                    <span className="lumi-course-visual-label">
                      {c.category}
                    </span>
                  </div>
                  <div className="lumi-course-content">
                    <div className="lumi-course-meta">
                      <span>{c.duration}</span>
                      <span>3 story chapters</span>
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.description}</p>
                    <div className="lumi-course-bottom">
                      <button onClick={() => open(c.id)}>
                        {done === 3
                          ? "Revisit course"
                          : done
                            ? "Continue learning"
                            : "Start learning"}
                        <Icon name="arrow" />
                      </button>
                      <span>
                        {done ? `${done}/3 completed` : "Free to explore"}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="lumi-work-note" data-reveal>
            <span className="lumi-live-dot" />
            Story-led learning. Real decisions. Progress saved on this device.
          </p>
        </section>
        <section id="how" className="lumi-how lumi-section" data-reveal>
          <p className="lumi-section-label">
            <span>✦</span> ONE PLATFORM. TWO WAYS TO GROW.
          </p>
          <h2>
            Imagination is a skill.
            <br />
            Curiosity is a <em>superpower.</em>
          </h2>
          <p>
            Play gives your imagination somewhere to go.
            <br />
            Work gives your ambition something to build.
            <br />
            Bring your curiosity. We’ll bring the next chapter.
          </p>
          <a className="lumi-button lumi-button-lime" href="#play">
            Let’s see where you go
            <Icon name="arrow" />
          </a>
          <div className="lumi-how-orb" aria-hidden="true" />
        </section>
      </main>
      <footer className="lumi-footer">
        <div>
          <a className="lumi-logo" href="#top">
            <Icon name="spark" />
            lumiclinik.
          </a>
          <p>Stay curious. Keep becoming.</p>
        </div>
        <div>
          <a href="#play">Play</a>
          <a href="#work">Work</a>
          <a href="#how">The idea</a>
        </div>
        <span>MADE FOR YOUR NEXT CHAPTER</span>
        <div className="lumi-footer-word" aria-hidden="true">
          lumiclinik
        </div>
      </footer>
      <dialog
        className={`lumi-dialog ${fantasy ? "lumi-dialog-comic" : ""}`}
        ref={dialog}
        onCancel={close}
        aria-labelledby="lumi-dialog-title"
      >
        <button
          className="lumi-dialog-close"
          onClick={close}
          aria-label="Close experience"
        >
          ×
        </button>
        {course && lesson ? (
          <div className="lumi-course-player">
            <aside>
              <p className="lumi-section-label">WORK / {course.category}</p>
              <h2 id="lumi-dialog-title">{course.title}</h2>
              <p className="lumi-note">
                {course.duration} · {course.audience}
              </p>
              <nav aria-label="Course lessons">
                {course.lessons.map((l, i) => (
                  <button
                    key={l.id}
                    className={i === lessonIndex ? "active" : ""}
                    disabled={
                      i > 0 &&
                      !learning.completed.includes(
                        `${course.id}/${course.lessons[i - 1].id}`,
                      )
                    }
                    onClick={() => moveLesson(i)}
                    aria-current={i === lessonIndex ? "step" : undefined}
                  >
                    <span>
                      {learning.completed.includes(`${course.id}/${l.id}`) ? (
                        <Icon name="check" />
                      ) : (
                        `0${i + 1}`
                      )}
                    </span>
                    {l.title}
                  </button>
                ))}
              </nav>
              <p className="lumi-note">
                {
                  course.lessons.filter((l) =>
                    learning.completed.includes(`${course.id}/${l.id}`),
                  ).length
                }{" "}
                of 3 lessons completed
              </p>
            </aside>
            <div className="lumi-lesson">
              <p className="lumi-section-label">
                STORY CHAPTER 0{lessonIndex + 1}
              </p>
              <h3>{lesson.title}</h3>
              <div className="lumi-scenario">
                <span>YOU’RE IN THE STORY</span>
                <p>{lesson.scene}</p>
              </div>
              <fieldset className="lumi-checkpoint">
                <legend>{lesson.question}</legend>
                {lesson.answers.map((a, i) => (
                  <label key={a}>
                    <input
                      type="radio"
                      name={lessonKey}
                      checked={answer === i}
                      onChange={() => {
                        setAnswer(i);
                        setChecked(false);
                      }}
                    />
                    <span>{a}</span>
                  </label>
                ))}
              </fieldset>
              <button
                className="lumi-button lumi-button-lime"
                disabled={answer === null}
                onClick={() => {
                  setChecked(true);
                  if (answer === lesson.correct) completeLesson();
                }}
              >
                Make your move
                <Icon name="arrow" />
              </button>
              {checked && (
                <p
                  role="status"
                  className={`lumi-feedback ${answer === lesson.correct ? "correct" : ""}`}
                >
                  {lesson.consequences[answer!]}{" "}
                  {answer !== lesson.correct
                    ? "Choose again to move the story forward."
                    : ""}
                </p>
              )}
              {checked && (
                <details open className="lumi-debrief">
                  <summary>What this decision teaches you</summary>
                  {lesson.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                  <p>{lesson.explanation}</p>
                </details>
              )}
              <label className="lumi-exercise" htmlFor="practice">
                <span>TRY IT YOURSELF</span>
                <strong>{lesson.exercise}</strong>
                <textarea
                  id="practice"
                  rows={4}
                  maxLength={3000}
                  value={learning.notes[lessonKey] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLearning((old) => ({
                      ...old,
                      notes: { ...old.notes, [lessonKey]: value },
                    }));
                  }}
                  placeholder="Use a real example from your life or work…"
                />
              </label>
              {learning.completed.includes(lessonKey) && (
                <div className="lumi-lesson-next">
                  {lessonIndex < 2 ? (
                    <button
                      className="lumi-button lumi-button-glass"
                      onClick={() => moveLesson(lessonIndex + 1)}
                    >
                      Next chapter
                      <Icon name="arrow" />
                    </button>
                  ) : (
                    <p>
                      Your scenario is complete. Take one idea into your next
                      project.{" "}
                      <button className="lumi-inline-button" onClick={close}>
                        Back to Work ↗
                      </button>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : fantasy ? (
          <div
            className={`lumi-fantasy-reader ${fantasyTurning ? "is-turning" : ""}`}
          >
            <p className="lumi-section-label">
              PLAY / THE LAST EMBER · PAGE {fantasyHistory.length + 1} OF 3
            </p>
            <h2 id="lumi-dialog-title">{fantasy.title}</h2>
            <p className="lumi-note">A story shaped by {fantasyName}</p>
            <div className="lumi-fantasy-panels">
              {fantasy.panels.map(([caption, dialogue], i) => (
                <article key={`${fantasyHistory.length}-${i}`}>
                  <div
                    className={`lumi-fantasy-panel-art fantasy-angle-${i}`}
                    aria-hidden="true"
                  />
                  <span className="lumi-fantasy-caption">{caption}</span>
                  <p>{dialogue}</p>
                </article>
              ))}
            </div>
            {fantasyHistory.length < 2 ? (
              <div className="lumi-fantasy-decisions">
                <h3>Your move, {fantasyName}.</h3>
                <div>
                  {fantasyChoices.map((c) => (
                    <button
                      key={c.id}
                      disabled={fantasyTurning}
                      onClick={() => directFantasy(c.id)}
                    >
                      <strong>{c.label}</strong>
                      <small>{c.hint}</small>
                      <Icon name="arrow" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="lumi-fantasy-end">
                <p>THE END · A DIFFERENT CHOICE OPENS A DIFFERENT DAWN.</p>
                <button
                  className="lumi-button lumi-button-lime"
                  onClick={() => setFantasyHistory([])}
                >
                  Try another path
                  <Icon name="orbit" />
                </button>
              </div>
            )}
          </div>
        ) : (
          selection && (
            <div className="lumi-story-entry">
              <p className="lumi-section-label">
                PLAY / {selection === "scifi" ? "SCI-FI" : "FANTASY"}
              </p>
              <h2 id="lumi-dialog-title">
                {selection === "scifi"
                  ? "Your ship. Your command."
                  : "Your world. Your magic."}
              </h2>
              <p>
                The story begins with your name.
                <br />
                Every decision after that is yours.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  beginStory();
                }}
              >
                <label htmlFor="lumi-name">
                  What should we call you?
                  <input
                    id="lumi-name"
                    required
                    maxLength={40}
                    autoComplete="given-name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                {error && (
                  <p role="alert" className="lumi-feedback">
                    {error}
                  </p>
                )}
                {selection === "scifi" && savedName && (
                  <p className="lumi-note">
                    Starting replaces Captain {savedName}’s saved book on this
                    device.{" "}
                    <button
                      type="button"
                      className="lumi-inline-button"
                      onClick={() => {
                        close();
                        onResume();
                      }}
                    >
                      Resume it instead ↗
                    </button>
                  </p>
                )}
                <button className="lumi-button lumi-button-lime">
                  Begin your story
                  <Icon name="arrow" />
                </button>
              </form>
              <p className="lumi-note">
                {selection === "scifi"
                  ? "10 pages · Four approaches · Voice & typed orders"
                  : "3 pages · Four approaches · Click to direct the story"}
              </p>
            </div>
          )
        )}
      </dialog>
    </div>
  );
}
