# The Assistant You Build

A Work learning comic about a named student building a campus scholarship assistant. It is a guided conceptual simulation, not a deployed campus agent or a credential. It works without an API key.

## Narrative structure

Twelve pages, each with four panels: the student’s scene, an explanatory mechanism, a failure that changes the situation, and the next decision. Eleven turning points offer four distinct choices each. Every choice gives a consequence and a repair; the selected consequence travels into the next page’s first panel. The final review recalls the first and launch decisions and allows inspection of all eleven outcomes. All paths encounter the full curriculum, so taking a shortcut reveals a failure and its repair rather than locking a student out of a topic.

The name appears in scene text, decision prompts, continuity, the final review, and downloaded notes. Independent local storage preserves choices and exercise notes. Rewriting a decision truncates the dependent future and future notes; restarting requires confirmation. The existing career comic, Play stories, and short courses retain their own progress.

## Curriculum

1. RAG: fresh evidence at answer time, model memory, uncertainty.
2. Ingestion: extraction quality, meaningful chunks, overlap, headings, source/version/access metadata.
3. Embeddings: semantic candidates, exact terms, hybrid search, similarity versus support.
4. Retrieval: version/access filters, candidate recall, relevance, reranking, top-k tradeoffs.
5. Grounding: claim-level support, citations, clarification, useful partial answers, abstention.
6. Context engineering: finite budgets, relevant state, source-aware summaries, memory freshness and retention.
7. Loop engineering: propose/validate/execute/observe, state, budgets, termination and no-progress paths.
8. Tool contracts: server-side validation and authorization, reads versus writes, confirmation, idempotency and uncertain outcomes.
9. Prompt injection: untrusted retrieved data, least privilege, backend permission boundaries, sensitive-action review, adversarial tests.
10. Evaluations: representative and adversarial cases, component and end-to-end checks, judge calibration, traces and redaction.
11. Hardening: timeouts, bounded backoff and jitter, concurrency, rate limits, freshness-aware isolated caches, pilots, fallback and rollback.
12. Improvement: diagnose failures, create regression tests, repair components, evaluate and monitor; distinguish the engineering improvement loop from the runtime agent loop.

Each page includes an applied exercise and an editable field note. Downloads contain the course notes, selected choices and outcomes, personal exercises, and further-reading links. Notes are local to the device, not sent to an API.

## Visual language

Classic manga scenes use an original cast, ink cross-hatching, expressive faces, cream paper and restrained accents. Sixteen narrative illustrations support the twelve chapters. See [art direction and generation prompts](ai-manga-art-direction.md). Live SVG concept diagrams use three blues (#58d3f4, #568ef4, #263e76) and one warm brown (#c8a078). Geometric flow diagrams, vector-space sketches, labeled boundaries, and failure comparisons explain mechanisms rather than decorate them. These are original explanatory drawings, with no copied creator assets or characters. Vector-space dimensions and metric bars are explicitly illustrative; they are not real telemetry. Each SVG maintains an 8:5 aspect ratio. The platform’s existing violet shell, lime actions, brand, and folding animation are preserved. Motion respects the system’s reduced-motion setting and has an explicit toggle.

## Primary technical reading

- [OpenAI: Retrieval](https://developers.openai.com/api/docs/guides/retrieval) — vector stores, chunking, semantic and hybrid search, filters and ranking.
- [OpenAI: A practical guide to building AI agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/) — tools, bounded loops, guardrails and human intervention.
- [OpenAI: Evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals) — evaluation and tracing.
- [OpenAI Agents SDK: Guardrails](https://openai.github.io/openai-agents-python/guardrails/) — input, output and tool-related checks and their limitations.

Reviewed on 10 October 2026. The curriculum uses general mechanisms rather than prescribing model versions, prices, or universal chunk sizes. Implementation and tradeoffs must be tested for the actual corpus, permissions, task, and deployment.

## Implementation

- `src/engineeringStory.ts`: authored chapters, consequences, continuity, bounded save restoration, future truncation.
- `src/EngineeringComic.tsx`: reader, exercises, saved progress, final review and export.
- `src/components/EngineeringArt.tsx`: original geometric explanations.
- `src/components/EngineeringMangaArt.tsx`: proportional manga scene atlas framing.
- `src/EngineeringEntrance.tsx`: Work catalog entry.
- `?mode=engineering`: direct reader route on both hosting targets.

The reader is loaded on demand, independently of the landing page’s course entrance. Branch continuity, safe restoration, and future truncation are covered by unit tests.
