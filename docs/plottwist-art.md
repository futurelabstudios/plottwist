# PlotTwist by Futurelab Studios portal artwork

The landing page uses `public/art/plottwist-portal.webp`, generated with the built-in image-generation tool. It connects a sci-fi station and a fantasy castle through a monumental portal. Real HTML provides the headline and controls.

The source PNG remains in Codex's generated image library. The project uses a WebP conversion at quality 85 (about 294 KB), with no change to the composition. Hero, fantasy card and fantasy panels use different crops of this one image.

## Final generation prompt

Use case: stylized-concept. Asset type: cinematic wide website hero artwork for PlotTwist by Futurelab Studios, a platform for directing sci-fi and fantasy stories and learning creative skills. Create a polished, atmospheric, widescreen 16:9 landscape illustration with a monumental luminous circular portal in the center-right, inviting the viewer into extraordinary worlds. Inside and beyond the portal: a distant futuristic space station and a fantastical ancient castle above misty mountains, two realms connected by a luminous path. Tiny silhouetted traveler in foreground creates scale. Beautiful violet nebula sky, teal light, warm gold accents, rich ink-black shadows, painterly high-end cinematic concept art, tactile rock and ethereal light, dramatic scale and controlled detail. Composition: lower two-thirds contains the landscape and portal; upper third is mostly calm dark cosmic sky for real HTML headline overlay. Subtle depth, no oversaturated neon. The center portal should be clearly visible behind the hero at lower right with fantasy architecture and forest in the right side suitable for a card crop. No text, letters, logos, UI, borders, split panels or watermarks.

## Motion and layout

The hero combines pointer-responsive depth with thin orbit rings, floating labels and gently twinkling stars. Sections reveal as they enter the viewport; cards respond to hover. Motion uses CSS transforms and opacity, with reduced-motion overrides and a mobile layout. The artwork is preloaded in the document head.
