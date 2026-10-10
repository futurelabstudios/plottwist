# The life you make — illustrated cast

Generated with the built-in image-generation tool, using
`public/art/borrowed-stars-atlas.png` only as a visual-quality reference.
Project asset: `public/art/life-cinematic-atlas-v1.png` (1774 × 887).
The original Play artwork is unchanged. The previous vector cast remains
available as `SvgLifeArt` in `src/LifeArt.tsx`.

## Production prompt

Use case: illustration-story. Create a production illustration sprite atlas for
a coming-of-age interactive comic, “The life you make”. The supplied image is
STYLE REFERENCE ONLY: match its beautiful detailed graphic-novel character
rendering, cinematic lighting, expressive eyes, sophisticated ink linework,
painterly depth, textured fabric and dimensional skin. Do NOT reuse its sci-fi
characters or settings.

NEW subject: a consistent Indian college student, age 20, warm medium-brown
skin, tousled curly black hair, clean-shaven, expressive brown eyes, teal
overshirt over cream tee, coral backpack; friend Mira, age 20, Indian, warm brown
skin, shoulder-length dark hair and round glasses, lilac cardigan. A mentor Dev,
age 30, slightly bearded, navy shirt. Human anatomically convincing characters,
not simple geometric figures, not chibi, not flat SVG, not shiny plastic 3D.

Format: ONE seamless 4-column by 2-row atlas of EIGHT EXACTLY EQUAL SQUARE
illustrations, no gutters, no dividers, no frames. Aim 2048x1024 or higher 2:1
overall ratio. Each cell is a separate independent scene, keeps faces away from
outer edges and has a complete composition. Read tiles left-to-right top row
then bottom row:

1. CAMPUS: student with backpack and Mira in foreground by an Indian college
   courtyard noticeboard under golden afternoon trees; thoughtful anticipation.
2. BEDROOM: student at laptop in a modest room at night, warm desk lamp against
   blue city window, tired and reflective; bust and hands visible, no readable
   screen text.
3. STUDIO: student, Mira and mentor around a laptop at a weekend buildathon,
   atmospheric practical lighting, hopeful teamwork.
4. RAIN: student and Mira sharing a coral umbrella outside a modern office,
   visible faces, wet pavement blue reflections, tender disappointment and support.
5. ROOFTOP: student holding graduation cap with Mira on rooftop at sunset,
   bittersweet new beginning, dimensional golden rim light.
6. FUTURE: same student and Mira in a sunlit creative studio, relaxed hopeful
   confidence, plants and sketchbook.
7. THINKING PORTRAIT: close waist-up same student, expressive thoughtful face,
   hand near chin, twilight teal and amber college bokeh, face centered
   horizontally, head occupies middle and lower half leaving some room at top
   for external speech bubble.
8. RESOLUTE PORTRAIT: same student waist-up, gentle confident smile, one hand
   holding notebook against chest, warm amber rimlight and deep teal softly
   blurred background, face centrally composed with room above.

Important: keep SAME facial identity, hair, clothing throughout all eight cells;
strong emotional acting and rich tangible environments. Premium hand-painted
animated-film-meets-graphic-novel finish, comparable quality and detail to the
reference. No words, letters, speech bubbles, captions, UI, labels, logos or
watermarks anywhere. Not a website mockup.

## Integration

`IllustratedLifeArt` crops the atlas inside an SVG viewport, preserving the
existing `LifeArt` interface and scene layouts. A two-pixel inset avoids seams.
Close panels use the two expression portraits. Covers and establishing shots
use the six scene tiles. HTML narration, choices, save schema and story logic
are unchanged. Motion is an eight-second camera drift and short atmosphere
effects, **not** skeletal or frame-by-frame character animation. The existing
Animation off control and system reduced-motion setting disable it.
