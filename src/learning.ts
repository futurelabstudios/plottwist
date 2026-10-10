export type Goal = 'fullstack' | 'frontend'
export type Experience = 'new' | 'some'
export interface Profile { name: string; goal: Goal; experience: Experience }
export interface Mission {
  id: string; title: string; subtitle: string; icon: string; skill: string; minutes: number
  story: { speaker: string; text: string }[]
  concept: string; explanation: string; code: string; question: string
  answers: string[]; correct: number; feedback: string[]; hint: string; takeaway: string
}
export const missions: Mission[] = [
  {
    id: 'web', title: 'The empty canvas', subtitle: 'HTML & CSS', icon: 'code', skill: 'Web foundations', minutes: 5,
    story: [
      { speaker: 'You', text: 'First day at the studio. My first ticket: make our community site accessible.' },
      { speaker: 'Dev, your mentor', text: 'The design is beautiful. But can everyone use it?' },
      { speaker: 'You', text: 'The “Join us” action is a div. It only responds to a mouse.' },
      { speaker: 'Dev', text: 'Before you add color, give the page the right structure.' },
    ],
    concept: 'Structure first. Style second.',
    explanation: 'HTML describes what an element is. CSS controls how it looks. A native button supports keyboard focus and activation without rebuilding those behaviors yourself. Use it for actions; use a link for navigation.',
    code: '<button class="join-button">Join us</button>\n\n.join-button {\n  padding: 12px 24px;\n  background: #c6ed6c;\n}',
    question: 'Which element should trigger the “Join us” action?',
    answers: ['A div with a click handler', 'A native button element', 'A paragraph with bold text'], correct: 1,
    feedback: ['A div has no built-in keyboard behavior. Use the element designed for an action.', 'Exactly. A button gives this action meaning and built-in keyboard support.', 'Bold text adds visual emphasis, but does not make an accessible control.'],
    hint: 'Think about someone pressing Tab, then Enter, without using a mouse.',
    takeaway: 'Use semantic HTML before adding CSS or custom interactions.',
  },
  {
    id: 'javascript', title: 'Something needs to change', subtitle: 'JavaScript', icon: 'bolt', skill: 'Logic & events', minutes: 6,
    story: [
      { speaker: 'You', text: 'The page looks ready. The event counter still says zero.' },
      { speaker: 'Dev', text: 'A visitor clicks Join. What should happen next?' },
      { speaker: 'You', text: 'Update a value, then show the new value on screen.' },
      { speaker: 'Dev', text: 'Good. A page starts feeling alive when events change its data.' },
    ],
    concept: 'Events connect input to behavior.',
    explanation: 'JavaScript can react to clicks and update data. In this small example, let allows the count to change, the handler runs after each click, and textContent updates the visible label. A browser-only count is temporary and is not shared between visitors.',
    code: 'let count = 0;\n\nbutton.addEventListener("click", () => {\n  count += 1;\n  label.textContent = String(count);\n});',
    question: 'Starting from zero, what does the label show after two clicks?',
    answers: ['0 — the handler never changes count', '1 — count resets after each click', '2 — each click adds one'], correct: 2,
    feedback: ['The handler runs on every click and changes count with += 1.', 'The variable is outside the handler, so it keeps its value between clicks.', 'Yes. The same variable moves from 0 to 1 to 2 as the handler runs.'],
    hint: 'Trace count one click at a time. Where is the variable declared?',
    takeaway: 'Event handlers connect user actions to changes in application data.',
  },
  {
    id: 'react', title: 'The interface remembers', subtitle: 'React & state', icon: 'grid', skill: 'Components & state', minutes: 7,
    story: [
      { speaker: 'You', text: 'Three event cards need their own Join button. Copy and paste?' },
      { speaker: 'Dev', text: 'Make one reusable component. Let each card own its state.' },
      { speaker: 'You', text: 'I changed a normal variable, but the label stayed the same.' },
      { speaker: 'Dev', text: 'React needs a state update to know the view should change.' },
    ],
    concept: 'State drives what React renders.',
    explanation: 'A component is a reusable piece of UI. useState stores data across renders, and its setter requests a new render. When the next value depends on the previous one, use the functional updater form.',
    code: 'const [joined, setJoined] = useState(0);\n\n<button onClick={() => setJoined(n => n + 1)}>\n  Joined: {joined}\n</button>',
    question: 'How should this React component increment its counter?',
    answers: ['Assign joined = joined + 1', 'Call setJoined(n => n + 1)', 'Change the HTML file by hand'], correct: 1,
    feedback: ['Direct assignment does not request a React render. This const variable cannot be reassigned either.', 'Correct. The setter requests a render and the updater uses the latest state.', 'A static file cannot track each interaction in the running component.'],
    hint: 'Which option tells React that state changed?',
    takeaway: 'Reusable components own state; state setters request UI updates.',
  },
  {
    id: 'api', title: 'Beyond the browser', subtitle: 'Backend & APIs', icon: 'server', skill: 'HTTP & validation', minutes: 7,
    story: [
      { speaker: 'You', text: 'Joining works on my laptop. Nobody else sees my signup.' },
      { speaker: 'Dev', text: 'The browser needs to send that action to our server.' },
      { speaker: 'You', text: 'I could validate the form on the page and trust it?' },
      { speaker: 'Dev', text: 'Anyone can call the API directly. The server needs to check too.' },
    ],
    concept: 'Your API is a boundary.',
    explanation: 'A POST request commonly asks a server to create a resource. Validate the input on the server because browser checks can be bypassed. Authentication identifies the caller; authorization checks whether that caller may perform the action. Private credentials belong on the server.',
    code: 'POST /api/events/42/signups\nContent-Type: application/json\n\n{ "name": "Alex" }\n\n// Server: authorize → validate → save\n// Respond: 201 Created',
    question: 'Where must signup input be validated?',
    answers: ['Only in the browser form', 'On the server, even with browser checks', 'Only after saving to the database'], correct: 1,
    feedback: ['Browser checks help users but can be bypassed by direct API requests.', 'Right. Client checks help usability; server validation protects the data boundary.', 'Reject invalid input before writing it. Database constraints can add another layer.'],
    hint: 'Imagine a request made without opening your website.',
    takeaway: 'Validate and authorize requests at the server boundary.',
  },
  {
    id: 'data', title: 'Make it stay', subtitle: 'Databases', icon: 'database', skill: 'Persistence & constraints', minutes: 6,
    story: [
      { speaker: 'You', text: 'Our server restarted. The signup list disappeared.' },
      { speaker: 'Dev', text: 'An in-memory array was useful for a demo. Now we need persistence.' },
      { speaker: 'You', text: 'And one visitor clicked Join twice. We have duplicate signups.' },
      { speaker: 'Dev', text: 'Give the database a rule that holds even when requests race.' },
    ],
    concept: 'Store the data. Protect the rules.',
    explanation: 'A database stores data beyond a server process. A unique constraint on the pair (event_id, user_id) prevents the same user from joining the same event twice, including concurrent requests. The API should handle a conflict with a useful response.',
    code: 'CREATE TABLE signups (\n  event_id INTEGER NOT NULL,\n  user_id INTEGER NOT NULL,\n  UNIQUE (event_id, user_id)\n);',
    question: 'What reliably prevents duplicate signups when requests race?',
    answers: ['Disable the browser button', 'Check an in-memory array first', 'Enforce a unique database constraint'], correct: 2,
    feedback: ['Disabling a button helps UX, but another tab or API client can still submit.', 'Two concurrent requests can both pass a check before either writes.', 'Exactly. The database enforces the invariant across concurrent writes.'],
    hint: 'The rule must hold across tabs, clients, and simultaneous server requests.',
    takeaway: 'Database constraints protect invariants that UI checks cannot guarantee.',
  },
  {
    id: 'launch', title: 'Hello, real world', subtitle: 'Testing & deployment', icon: 'globe', skill: 'Shipping & verification', minutes: 6,
    story: [
      { speaker: 'You', text: 'The app works on my machine. Time to share the link.' },
      { speaker: 'Dev', text: 'What if the API is down, or a visitor submits the form twice?' },
      { speaker: 'You', text: 'We need tests, clear error states, and safe server configuration.' },
      { speaker: 'Dev', text: 'Ship it. Then verify the real URL, including the unhappy paths.' },
    ],
    concept: 'A successful build is the beginning.',
    explanation: 'Test the core user flow and failure states before shipping. Keep secrets in server environment variables, serve the app over HTTPS, and verify the deployed frontend, API, and database together. Monitoring helps you find failures after release.',
    code: 'Build → Test → Deploy → Verify\n\n✓ New signup succeeds\n✓ Duplicate is handled\n✓ API failure shows an error\n✓ Private keys stay server-side',
    question: 'The build passed. What is the best next release check?',
    answers: ['Verify signup and error flows on the deployed URL', 'Assume local success guarantees production success', 'Put the database password in frontend code'], correct: 0,
    feedback: ['Yes. Real environment variables, networking, and storage need a deployed flow check.', 'Production configuration and services can differ from your machine.', 'Frontend code is delivered to visitors. Private credentials must stay server-side.'],
    hint: 'Test what an actual visitor will experience on the real deployment.',
    takeaway: 'Verify the whole deployed flow, including expected failures.',
  },
]
export const STORAGE_KEY = 'plottwist.learning.v1'
export interface LearningState { version: 1; profile: Profile | null; completed: string[]; attempts: Record<string, number> }
export const emptyLearning: LearningState = { version: 1, profile: null, completed: [], attempts: {} }
export function pathFor(goal: Goal) { return goal === 'frontend' ? missions.slice(0, 3) : missions }
export function validProfile(value: unknown): value is Profile {
  if (!value || typeof value !== 'object') return false
  const p = value as Profile
  return typeof p.name === 'string' && p.name.trim().length > 0 && p.name.length <= 30 && ['fullstack', 'frontend'].includes(p.goal) && ['new', 'some'].includes(p.experience)
}
export function restoreLearning(raw: string | null): LearningState {
  try {
    const state: unknown = JSON.parse(raw ?? 'null')
    if (!state || typeof state !== 'object') return emptyLearning
    const s = state as LearningState
    if (s.version !== 1 || !validProfile(s.profile) || !Array.isArray(s.completed) || !s.attempts || typeof s.attempts !== 'object' || Array.isArray(s.attempts)) return emptyLearning
    const path = pathFor(s.profile.goal)
    if (s.completed.length > path.length || s.completed.some((id, i) => id !== path[i].id)) return emptyLearning
    const attempts: Record<string, number> = {}
    for (const mission of path) {
      const count = s.attempts[mission.id]
      if (count !== undefined && (!Number.isSafeInteger(count) || count < 0)) return emptyLearning
      if (count !== undefined) attempts[mission.id] = count
    }
    return { version: 1, profile: s.profile, completed: s.completed, attempts }
  } catch { return emptyLearning }
}
type LearningAction = { type: 'start'; profile: Profile } | { type: 'answer'; missionId: string; answer: number } | { type: 'reset' }
export function learningReducer(state: LearningState, action: LearningAction): LearningState {
  if (action.type === 'reset') return emptyLearning
  if (action.type === 'start') return validProfile(action.profile) ? { ...emptyLearning, profile: { ...action.profile, name: action.profile.name.trim() } } : state
  if (!state.profile) return state
  const next = pathFor(state.profile.goal)[state.completed.length]
  if (!next || next.id !== action.missionId || !Number.isInteger(action.answer) || action.answer < 0 || action.answer >= next.answers.length) return state
  return {
    ...state,
    attempts: { ...state.attempts, [next.id]: (state.attempts[next.id] ?? 0) + 1 },
    completed: action.answer === next.correct ? [...state.completed, next.id] : state.completed,
  }
}
