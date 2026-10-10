# PlotTwist visual storyboard

The user-supplied landing, “Please Don’t Save Us”, and scan continuation images establish the look of the actual tool. This episode serves as its visual example.

## Visual language

- Near-black navy starfields; electric turquoise controls, holograms and progress; warm ivory titles, speech bubbles and panel outlines; gold lighting and warnings.
- Cinematic graphic novel illustrations with clear expressions, consistent characters and detailed spacecraft.
- Imani: Black woman, short curls, teal flight uniform. Senn: blue-gray amphibian, amber eyes, navy/gold uniform. Captain: wavy dark hair, brown skin, short beard, navy/gold uniform. Child: long dark hair, lavender clothing, luminous stardust.
- Four square panels per page, 2×2 on desktop and ordered vertically on mobile.
- Dialogue, captions, names, page progress and choices remain real HTML. Never use a complete UI screenshot as the interface.

## Asset system

`public/art/borrowed-stars-atlas.png` is a clean, pre-rendered 4×2 illustration atlas generated with the built-in imagegen tool using all three references. It is loaded once and addressed by the `tile-0` through `tile-7` CSS classes. No runtime image generation or API key is needed.

Top row: station/Wayfarer; Imani/Senn studying station; child behind glass; Captain/station core.
Bottom row: gentle scan; returning light strands; lifeform detection; child on bridge.

The first and scan pages use dedicated matching art. Negotiation and rescue currently reuse this illustration library as storyboard compositions; branch-specific locations and action art should be added before final production. The UI accurately labels this as a two-page offline example. Voice and follow-up choices are future functionality.

## Generation prompt

Use case: illustration-story. Create a production illustration sprite sheet for an interactive comic website. Input images are visual style and character references ONLY. Output EXACTLY 8 equally sized illustrations in a precise 4-column by 2-row grid, no gutters. Each tile is square, independent, full bleed. No text, speech bubbles, captions, interface, borders, lettering or logos. Match the references’ rich cinematic graphic novel rendering, dark navy space, luminous cyan holograms, gold trim and realistic expressive characters. Preserve the character appearances listed above. Top row: flower-shaped station above planet with crescent Wayfarer; Imani and Senn studying station hologram; child behind curved glass with remembered people; Captain with station core. Bottom row: Imani and Captain scanning; light strands returning toward Wayfarer; Senn and Captain with orange lifeform hologram; child on bridge with shadow figures in golden stardust. Fill reference text regions with natural art.

## Continue this style

Generate illustration-only assets with consistent character references. Register approved assets and attach appropriate art to each story beat. Use captions and bubbles for narrative and accessible text. Keep controls honest about implemented capabilities; add voice interaction when its recording and transcription flow is available.
