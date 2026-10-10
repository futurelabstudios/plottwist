# PlotTwist: Play + Learn

The app now has two entry points: Play runs the original Borrowed Stars comic; Learn teaches a community signup app through six illustrated decision missions.

## Current local prototype

- React/Vite frontend. No new backend service or credentials are required.
- Name, goal, and starting experience shape the learning path and guidance.
- Frontend goal covers HTML/CSS, JavaScript, React. Full-stack adds APIs, database constraints, and deployment.
- One correct answer unlocks the next mission and earns 100 XP. Wrong answers remain retryable, with a hint after two attempts.
- Field notes collect the key concept from every completed mission.
- Versioned and validated browser storage saves progress. These are concept challenges; no learner code executes and no credentials or server-side assessment exist.
- Existing Play state and fixtures remain separate from learning progression.

## Code ownership

- `App.tsx`: mode selection and browser history.
- `SpaceStory.tsx` + `story.ts`: original Play UI and deterministic fiction.
- `LearnMode.tsx`: onboarding, skill map, mission, feedback, notebook.
- `learning.ts`: course content, progression rules, storage validation.
- `components.tsx`: shared branding, icons, code-native illustrations.
- `Learn.css` + `tokens.css`: learning visual system and reduced-motion support.

## Next backend structure

Use a server API between the browser and Neo4j. Keep Neo4j credentials on the server. Neo4j is proposed here and is not connected in this prototype.

```text
Learner ──ENROLLED_IN──> LearningPath ──INCLUDES──> Mission
Mission ──TEACHES──> Skill ──REQUIRES──> Skill
Mission ──HAS_CHALLENGE──> Challenge ──HAS_OPTION──> Option
Learner ──MADE──> Attempt ──FOR──> Challenge
Learner ──COMPLETED──> Mission
Learner ──PRACTICED──> Skill
```

Give every node a stable ID. Store course ordering on INCLUDES relationships, and version the course so revisions do not corrupt existing progress. Store attempt IDs, timestamps, feedback, and assessment version. Treat practiced concepts as evidence of exposure rather than proof of professional competency.

Server endpoints:

- `POST /learning/enroll`: create a learner enrollment with goal, experience, course version.
- `GET /learning/path`: return eligible missions and progress.
- `POST /learning/attempts`: validate eligibility, assess the answer, atomically record the attempt and any newly earned completion. Deduplicate using a request ID.
- `GET /learning/notes`: return concepts from completed missions.

Server computes XP and completion. Next-mission selection should satisfy skill prerequisites and use recent mistakes to suggest revision. Start with transparent rules before adding AI personalization. Add real coding exercises in a separate sandbox runner with time, network, and resource limits; the browser app should never run arbitrary submitted code on its server process.

## Next useful milestones

1. Author deeper missions with practical HTML/CSS and React exercises.
2. Add account-based progress sync and server-validated assessments.
3. Connect the Neo4j skill/prerequisite graph.
4. Add optional narration and a coding sandbox.
