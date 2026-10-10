# Work contribution boundary

Shabir owns the shared platform UI, Play reader, branding, navigation styling,
and animated footer. Sanket's contribution is the ten-page Work life comic.

- `WorkScreen.tsx` wraps the Work reader using the existing shared Brand.
- `WorkEntrance.tsx` is inserted inside the existing homepage Work section.
- `App.tsx` changes only to open and close Work and support `?mode=work`.
- `Platform.tsx` changes only to accept the Work callback and render its entrance.
- `Cinematic.css` and `tokens.css` are scoped to Work, never the document,
  platform hero, Play cards, shared brand, or footer.
- Original platform courses remain available and unchanged.

Shared stylesheets, bootstrap, metadata, and README match upstream `main`.
Unused earlier Play/learning prototypes were removed from this branch; they
remain recoverable in commit `883ef13` and the pre-pull safety stash.

Before pushing, merge current `origin/main`, run tests/build/lint, and verify
`git merge-base --is-ancestor origin/main HEAD`. This removes current conflicts;
later concurrent edits to the two integration files can still require a merge.
