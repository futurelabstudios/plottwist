# PlotTwist — one playful world

## Latest integration: cinematic tone

Following the upstream platform update and the requested cinematic direction,
the landing page and current Work reader share a dark, ink-violet shell, cream
type, lime decisions, and the existing Space Grotesk / DM Sans pairing.
`tokens.css` defines `--color-cinema-*`; `src/Cinematic.css` scopes integration
styles without replacing the upstream platform or comic reader stylesheets.
The original warm-paper system below remains available to the earlier prototypes.
`App.tsx` retains the upstream ten-page Play reader and APIs; `Platform.tsx`
offers both the new Work entrance and the existing learning scenarios.
`WorkComic.tsx` now consumes `careerStory.ts`, with three career routes and
four ending themes, with ten complete illustrated decision pages. `WorkExtras.tsx`
adds optional panel discoveries, a preview-and-commit decision flow, private field
notes and a downloadable final notebook. All use the established cinematic tokens.
Career save version 2 upgrades the original five-page saves in place. The first
five pages retain their ordering and choice meanings. Rewriting clears only the
rewritten and later choices, notes and discoveries, after an explicit warning.
The separate original `lifeStory.ts` save slot is retained.
The illustrated cast is supplied by `IllustratedLifeArt.tsx`; narrative text
remains semantic HTML. Browser history and direct mode links connect readers.

Play and Work are two adventures in the same product. Both use the loop: read a
short story, make a decision, discover what changes. Work is an original existential
sci-fi comic about a solitary adult man's career and identity: master's, business
or job. Ten decisions accumulate into a personal ending and can be rewritten.

## Shared visual system

- Genre: playful; warm paper, dark ink, lime controls, lilac and sky scene colors.
- Palette: `tokens.css` is the source of truth for all colors.
- Display: Space Grotesk, upright, weights 500–700. Body: DM Sans, 400–700.
- Home: paired adventure cards. Play: illustrated space adventure. Work: a
  cinematic solo career comic in a changed, automated city. No romantic framing.
- All modes share the PlotTwist wordmark, top mode navigation, action styling,
  comic borders, footer language, focus rings and spacing scale.
- Primary actions: lime, ink text, outlined with a small solid offset shadow.
- Mode switching preserves the current in-session chapter and quest view.
- Motion: small button presses and short entrances; respect reduced motion.
- Tone: curious, direct and welcoming. Use decisions and discovery in both modes.

## Component ownership

`App.tsx` owns mode navigation, the shared header and the upstream Play reader.
`Platform.tsx` owns the current home; `SpaceStory.tsx` is a retained prototype.
`WorkComic.tsx` owns the solitary career story;
`careerStory.ts` owns its branching rules and `LifeArt.tsx` exports the cinematic
cast in `IllustratedLifeArt.tsx`. Earlier `lifeStory.ts` and SVG figures are retained
but no longer drive Work.
The earlier learning prototype is retained in `LearnMode.tsx`.
`World.css` connects their visual treatment while retaining their individual
styles and behavior. Legacy `?mode=learn` links open Work.

## Responsive behavior

Adventure cards and comic panels stack on narrow screens. Work's chapter trail
becomes a row of numbered nodes. Both modes retain the same Play/Work controls.
Long answer choices may wrap for readability. Avoid horizontal page overflow.

## Life comic

One consistent adult male protagonist appears in detailed generated artwork:
apartment, observatory, workshop, transit room, rainy walkway and rooftop.
The first career decision changes later settings and narrative consequences.
Text stays HTML. Panel entrances and restrained camera/atmosphere motion play
on scene changes; these are illustrated scenes, not frame-by-frame animation.
Animation can be turned off; system reduced-motion preferences also apply.
The story has no correct-answer grading. Decisions exchange skills, courage,
purpose and energy, with explicit narrative consequences. Endings reflect
the accumulated path and the character's original wish. Rewriting a chapter
replaces that decision and subsequent decisions. Real lives are not predicted.

## Cinematic token exports

The complete CSS source is `tokens.css`. These integration aliases expose the
three core cinematic roles to other consumers without duplicating the legacy palette.

CSS:
```css
:root {
  --color-cinema-bg: oklch(14% .012 290);
  --color-cinema-surface: oklch(19% .015 290);
  --color-cinema-ink: oklch(96% .008 95);
}
```

Tailwind v4:
```css
@theme inline {
  --color-cinema-background: var(--color-cinema-bg);
  --color-cinema-panel: var(--color-cinema-surface);
  --color-cinema-foreground: var(--color-cinema-ink);
}
```

DTCG JSON:
```json
{
  "cinema": {
    "$type": "color",
    "background": { "$value": { "colorSpace": "oklch", "components": [0.14, 0.012, 290], "alpha": 1 } },
    "surface": { "$value": { "colorSpace": "oklch", "components": [0.19, 0.015, 290], "alpha": 1 } },
    "foreground": { "$value": { "colorSpace": "oklch", "components": [0.96, 0.008, 95], "alpha": 1 } }
  }
}
```

shadcn-compatible semantic aliases (scoped to the cinematic shell):
```css
.cinematic-shell {
  --background: var(--color-cinema-bg);
  --foreground: var(--color-cinema-ink);
  --card: var(--color-cinema-surface);
  --card-foreground: var(--color-cinema-ink);
}
```
