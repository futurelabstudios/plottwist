import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import "./UtopiaScene.css";

type Point = { x: number; y: number; alpha: number; size: number; field?: number; accent?: boolean };

const subscribeMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A procedural particle world: no video downloads or image-generation calls. */
export default function UtopiaScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useSyncExternalStore(subscribeMotion, reducedMotion, () => true);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const paused = userPaused ?? prefersReducedMotion;
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    let seed = 71;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const points: Point[] = [];
    // Rolling, luminous terrain with a clear horizon and a winding path.
    for (let i = 0; i < 9200; i++) {
      const x = random();
      const depth = random();
      points.push({ x, y: depth, field: 1, alpha: .12 + depth * .46, size: .45 + depth * .75 });
    }
    for (let i = 0; i < 360; i++) points.push({ x: random(), y: random() * .65, alpha: .08 + random() * .28, size: .5 + random() * .5 });
    const ellipse = (cx: number, cy: number, rx: number, ry: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = random() * Math.PI * 2, r = Math.sqrt(random());
        points.push({ x: cx + Math.cos(a) * rx * r, y: cy + Math.sin(a) * ry * r, alpha: .4 + random() * .5, size: .5 + random() * .5 });
      }
    };
    const line = (x1: number, y1: number, x2: number, y2: number, thickness: number, count: number, accent = false) => {
      for (let i = 0; i < count; i++) {
        const p = random();
        points.push({ x: x1 + (x2 - x1) * p + (random() - .5) * thickness, y: y1 + (y2 - y1) * p + (random() - .5) * thickness, alpha: .32 + random() * .65, size: .65 + random() * .45, accent });
      }
    };
    // Two people reaching across a shared path, echoing the supplied reference.
    for (const [x, direction] of [[.44, 1], [.54, -1]]) {
      ellipse(x, .35, .007, .024, 160);
      ellipse(x, .415, .012, .046, 380);
      line(x - .005, .446, x - .008, .55, .009, 230);
      line(x + .005, .446, x + .01, .55, .009, 230);
      line(x + direction * .005, .386, .49, .397, .006, 250);
      line(x - direction * .01, .387, x - direction * .021, .449, .006, 190);
    }
    // A utopian skyline of quiet towers and floating garden domes.
    for (let b = 0; b < 26; b++) {
      const x = .67 + b * .011, height = .025 + random() * .17;
      const base = .45 + Math.sin(b * .42) * .018;
      for (let i = 0; i < 65; i++) points.push({ x: x + random() * .006, y: base - random() * height, alpha: .15 + random() * .45, size: .6, accent: i % 11 === 0 });
    }
    for (let i = 0; i < 900; i++) {
      const a = random() * Math.PI, r = .91 + random() * .09;
      points.push({ x: .24 + Math.cos(a) * .082 * r, y: .425 - Math.sin(a) * .115 * r, alpha: .2 + random() * .35, size: .7 });
    }
    for (let i = 0; i < 1600; i++) {
      const x = random();
      points.push({ x, y: .515 + x * .14 + Math.sin(x * 5) * .025 + (random() - .5) * .012, alpha: .28 + random() * .62, size: .6 + random() * .6, field: 2, accent: i % 17 === 0 });
    }
    let width = 0, height = 0, frame = 0, previous = 0, time = 0, visible = false;
    const desktop = window.matchMedia("(min-width: 901px)");
    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const p of points) {
        let x = p.x, y = p.y;
        if (p.field === 1) {
          const d = p.y;
          y = .46 + d * .47 + Math.sin(x * 12 + d * 5 + time * .22) * (.018 + d * .065)
            + Math.cos(x * 19 - d * 8 + time * .15) * .024;
          x += Math.sin(d * 6 + time * .16) * .005;
        } else if (p.field === 2) y += Math.sin(x * 8 + time * .3) * .003;
        context.fillStyle = p.accent ? `rgba(216,251,141,${p.alpha})` : `rgba(226,222,242,${p.alpha})`;
        context.fillRect(x * width, y * height, p.size, p.size);
      }
    };
    const animate = (timestamp: number) => {
      if (!visible || !desktop.matches || paused) { frame = 0; return; }
      if (timestamp - previous >= 33) { previous = timestamp; time += .033; draw(); }
      frame = requestAnimationFrame(animate);
    };
    const restart = () => { if (!frame && visible && desktop.matches && !paused) frame = requestAnimationFrame(animate); };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width; height = entry.contentRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      element.width = Math.round(width * dpr); element.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0); draw(); restart();
    });
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; restart(); }, { rootMargin: "100px" });
    observer.observe(element);
    desktop.addEventListener("change", restart);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); desktop.removeEventListener("change", restart); };
  }, [paused]);
  return (
    <div className="plot-utopia">
      <canvas ref={canvas} aria-hidden="true" />
      <div className="plot-utopia-caption">
        <span><i /> A WORLD OF POSSIBILITIES</span>
        <button className="plot-scene-toggle" onClick={() => setUserPaused(!paused)} aria-pressed={paused}>
          <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span>{paused ? "Play scene" : "Pause scene"}
        </button>
      </div>
    </div>
  );
}
