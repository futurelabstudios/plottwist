# PlotTwist visual storyboard

The user-supplied landing, “Please Don’t Save Us”, and scan continuation images establish the look of the actual tool. This episode serves as its visual example.

## Visual language

- Near-black navy starfields; electric turquoise controls, holograms and progress; warm ivory titles, speech bubbles and panel outlines; gold lighting and warnings.
- Cinematic graphic novel illustrations with clear expressions, consistent characters and detailed spacecraft.
- Imani: Black woman, short curls, teal flight uniform. Senn: blue-gray amphibian, amber eyes, navy/gold uniform. Captain: wavy dark hair, brown skin, short beard, navy/gold uniform. Child: long dark hair, lavender clothing, luminous stardust.
- Four square panels per page, 2×2 on desktop and ordered vertically on mobile.
- Dialogue, captions, names, page progress and choices remain real HTML. Never use a complete UI screenshot as the interface.

## Asset system

`public/art/borrowed-stars-atlas.png` is a clean, pre-rendered 4×2 illustration atlas generated with the built-in imagegen tool using all three references. Its eight scenes are indexed 0–7 by the comic renderer. The authored illustrations need no API key.

Top row: station/Wayfarer; Imani/Senn studying station; child behind glass; Captain/station core.
Bottom row: gentle scan; returning light strands; lifeform detection; child on bridge.

The ten-page story also uses `public/art/borrowed-stars-chapters.png`, a 4×4 atlas containing scenes 8–23. In reading order: the seed, a hidden map, station in a storm, station corridor, memory archive, living core, failing archive, reactor, protective shield, seed bridge, evacuation bridge, family reunion, the Collector, memory beacon, sunrise, and the next adventure.

All 24 scenes are illustration-only. The app overlays editable, accessible HTML dialogue and captions, including the Captain’s name. Each page remains exactly four panels. Some scenes are reused across branches with different framing and narrative. The optional Images API action creates a fresh 2×2 atlas from the current page's four panel descriptions and stores it in the browser.

The cover opens into an ivory paper comic, with dark gutters and a perspective page-fold overlay. Reduced-motion preferences disable the animation; printing lays out the visited pages with four panels each.

## Generation prompt

Use case: illustration-story. Create a production illustration sprite sheet for an interactive comic website. Input images are visual style and character references ONLY. Output EXACTLY 8 equally sized illustrations in a precise 4-column by 2-row grid, no gutters. Each tile is square, independent, full bleed. No text, speech bubbles, captions, interface, borders, lettering or logos. Match the references’ rich cinematic graphic novel rendering, dark navy space, luminous cyan holograms, gold trim and realistic expressive characters. Preserve the character appearances listed above. Top row: flower-shaped station above planet with crescent Wayfarer; Imani and Senn studying station hologram; child behind curved glass with remembered people; Captain with station core. Bottom row: Imani and Captain scanning; light strands returning toward Wayfarer; Senn and Captain with orange lifeform hologram; child on bridge with shadow figures in golden stardust. Fill reference text regions with natural art.

## Continue this style

Generate illustration-only assets with consistent character references. Register approved assets and attach appropriate art to each story beat. Use captions and bubbles for narrative and accessible text. Keep the cast, station geometry, cyan holograms and warm gold light consistent. Generated images contain no lettering; narrative text stays in HTML.
