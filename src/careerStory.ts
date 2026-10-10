import { careerScenarios } from './careerScenarios'
/** Original existential science fiction; thematic influence, not a book adaptation. */
export type Dream = 'understand' | 'build' | 'steady'
export type Quality = 'craft' | 'courage' | 'purpose' | 'energy'
export type Scene = 'crossroads' | 'masters' | 'business' | 'job' | 'setback' | 'future'
export type Route = 'scholar' | 'founder' | 'professional'
export const qualities: { id: Quality; label: string }[] = [
  { id: 'craft', label: 'Skills' }, { id: 'courage', label: 'Courage' },
  { id: 'purpose', label: 'Purpose' }, { id: 'energy', label: 'Energy' },
]
export const dreams: { id: Dream; title: string; note: string; icon: string }[] = [
  { id: 'understand', title: 'Understand what comes next', note: 'Curiosity. Depth. A question worth following.', icon: 'book' },
  { id: 'build', title: 'Make something of my own', note: 'Independence. Useful work. A reason to begin.', icon: 'bolt' },
  { id: 'steady', title: 'Find solid ground', note: 'Structure. Stability. Room to become myself.', icon: 'star' },
]
export interface LifeChoice { title: string; note: string; effects: Partial<Record<Quality, number>>; result: string; dialogue: string; cost: string }
export interface LifeChapter { title: string; time: string; place: string; scene: Scene; caption: string; thought: string; speaker: string; dialogue: string; question: string; turningPoint?: string; lesson?: string; choices: LifeChoice[] }
export const PAGE_COUNT = 10
export interface LifeState { version: 2; name: string; dream: Dream; started: boolean; choices: number[]; revealed: boolean; notes: Record<number, string>; discoveries: Record<number, number[]> }
// Separate save slot: do not reinterpret or erase the earlier student-life story.
export const LIFE_KEY = 'plottwist.career-comic.v1'
export const emptyLife: LifeState = { version: 2, name: '', dream: 'build', started: false, choices: [], revealed: false, notes: {}, discoveries: {} }
export const routeFor = (choices: number[]): Route => (['scholar', 'founder', 'professional'] as const)[choices[0] ?? 0]

const opening: LifeChapter = {
  title: 'The world moved on.', time: 'YEAR 07 AFTER THE ARRIVAL', place: 'Your apartment, the quiet city', scene: 'crossroads',
  caption: 'Seven years since the broken ring appeared in the sky. The machines keep the city comfortable. Your room still feels empty.',
  thought: 'Everything outside has changed. Why am I still waiting to begin?',
  speaker: 'A thought you cannot silence', dialogue: 'The city can keep you alive. It cannot tell you what being alive is for.',
  question: 'Three doors are open. Which one do you walk toward?',
  choices: [
    { title: 'Pursue a master’s', note: 'Study the ring. Follow a question bigger than yourself.', effects: { craft: 2, courage: 1, purpose: 1, energy: -1 }, result: 'You apply to the observatory’s graduate programme. For the first time in months, your uncertainty has a question attached to it.', dialogue: 'I don’t understand what is happening. I want to learn how to ask.', cost: 'Study takes time and resources. Admission and discovery are not guaranteed; curiosity gives you a direction, not a promise.' },
    { title: 'Start your own business', note: 'Build something useful in a world that seems to have everything.', effects: { craft: 1, courage: 2, purpose: 1, energy: -2 }, result: 'You rent a small workshop and sketch a navigation device for people who still choose to walk the old city without its automated guides.', dialogue: 'Maybe useful doesn’t have to mean necessary to everyone.', cost: 'You take on financial uncertainty and responsibility. A meaningful idea still needs customers, testing and a sustainable pace.' },
    { title: 'Take a job', note: 'Find structure and contribute to the city’s human transit team.', effects: { craft: 1, purpose: 1, energy: 1 }, result: 'You accept a trainee role in public transit operations. Tomorrow has a starting time, a real task, and someone expecting you to show up.', dialogue: 'A small role is still a place to start.', cost: 'A job offers structure, not an instant identity. You exchange some freedom for steadier work and a chance to build competence.' },
  ],
}

const routeScenes: Record<Route, Scene> = { scholar: 'masters', founder: 'business', professional: 'job' }
const routeNames: Record<Route, string> = { scholar: 'the observatory', founder: 'your workshop', professional: 'the transit control room' }

/** The first choice changes the setting, problem and consequence of later chapters. */
export function chaptersFor(choices: number[]): LifeChapter[] {
  const route = routeFor(choices)
  const scene = routeScenes[route]
  const firstTask = {
    scholar: { caption: 'Your admission arrives. So do the reading list, the fees and a sky full of questions nobody can answer.', thought: 'Am I following curiosity, or hiding from the rest of my life?', task: 'Learn one instrument and make your first observation.', result: 'You spend the evening learning the instrument. Your first measurement is uncertain, but you can explain why.', small: 'You agree on a manageable study schedule before accepting extra research hours.' },
    founder: { caption: 'The workshop key is in your hand. No orders, no team, no proof that anyone wants the device.', thought: 'Was this courage, or just a more expensive way to feel lost?', task: 'Build one rough device and test it with a potential customer.', result: 'The rough device fails on a staircase. That one test tells you more than a week of imagining a perfect launch.', small: 'You narrow the first prototype and keep a financial buffer rather than spending it on a polished launch.' },
    professional: { caption: 'Your badge opens a door. Behind it are unfamiliar systems and a shift that begins whether you feel ready or not.', thought: 'If the machines do so much, where exactly do I belong?', task: 'Learn one route and handle a supervised service disruption.', result: 'A route goes offline. With a supervisor checking your work, you help reroute the last passengers home.', small: 'You ask for a clear training plan instead of promising to master every system in a week.' },
  }[route]
  const setback = {
    scholar: { caption: 'The reading you thought was a discovery is an instrument error. Your proposal is sent back.', thought: 'What if I left my old life just to find another place to fail?', feedback: 'You document the error and rebuild the method. The next measurement will be smaller, slower and more trustworthy.' },
    founder: { caption: 'Your first potential customer walks away. The city’s free guides are easier. The workshop rent is still due.', thought: 'What if nobody needs the thing that finally made me feel needed?', feedback: 'You ask why they declined. The answer changes the device from a general guide into a tool for an overlooked accessibility need.' },
    professional: { caption: 'You miss a warning during a supervised shift. The system catches it. Your confidence does not recover as quickly.', thought: 'Did I choose stability because I was afraid to try something bigger?', feedback: 'You review the incident with your supervisor and practise the response. Responsibility starts to mean checking, not pretending.' },
  }[route]
  const chapters: LifeChapter[] = [opening, {
    title: 'A door is not a destination.', time: 'TWO WEEKS LATER', place: `Your first evening at ${routeNames[route]}`, scene,
    caption: firstTask.caption, thought: firstTask.thought, speaker: 'The city, beyond the window', dialogue: 'Above the towers, the ring remains silent. You still have to decide what to do with this evening.',
    question: 'The first step is less glamorous than the dream. How do you begin?',
    choices: [
      { title: 'Do the difficult first task', note: firstTask.task, effects: { craft: 2, courage: 1, energy: -2 }, result: firstTask.result, dialogue: 'I can be a beginner without being a mistake.', cost: 'Focused practice grows your skills. An exhausting first week is not a sustainable plan by itself.' },
      { title: 'Ask for practical guidance', note: 'Find a supervisor, adviser or experienced builder. Ask one specific question.', effects: { purpose: 2, craft: 1, energy: -1 }, result: 'You send a short message explaining exactly where you are stuck. The reply does not solve your life. It gives you a workable next step.', dialogue: 'Being alone doesn’t mean I have to invent every answer.', cost: 'You have to admit what you do not know. Other people can offer practical support without deciding your future for you.' },
      { title: 'Make the commitment smaller', note: 'Set a limit on time, scope and what you can afford to risk.', effects: { energy: 1, craft: 1, courage: -1 }, result: firstTask.small, dialogue: 'A beginning I can sustain is still a beginning.', cost: 'Progress is slower and less impressive from the outside. You preserve room to keep going.' },
    ],
  }, {
    title: 'Nobody is watching.', time: 'MONTH THREE', place: routeNames[route], scene,
    caption: 'The first excitement has worn off. Most days are ordinary work. At night, you still come home alone.',
    thought: 'If nobody sees what I am doing, does it still count?', speaker: 'Your own unanswered question', dialogue: 'The ring changed the sky. It did not make meaning automatic.',
    question: 'How do you keep going when the work feels invisible?',
    choices: [
      { title: 'Let someone see a small piece', note: 'Share a draft, a prototype or a lesson from your shift.', effects: { courage: 2, purpose: 1, energy: -1 }, result: 'You share unfinished work instead of an announcement about who you hope to become. One useful response makes the next draft clearer.', dialogue: 'I don’t need applause. I need contact with the world.', cost: 'Visibility brings discomfort and the possibility of no response. It can also turn private effort into useful work.' },
      { title: 'Keep a record of the quiet work', note: 'Track what you learned, without waiting for recognition.', effects: { craft: 2, energy: -1 }, result: 'You open the notebook from your first day. A problem that once stopped you now has a method beside it.', dialogue: 'There is evidence that I am changing, even here.', cost: 'You deepen your practice. You still need to notice when independence becomes isolation.' },
      { title: 'Stop for an evening', note: 'Walk the old city. Eat properly. Return with some energy.', effects: { energy: 2, craft: -1 }, result: 'You leave the work where it is. Under the impossible sky, the city is still made of small, ordinary things you can notice.', dialogue: 'I am not only the future I am trying to earn.', cost: 'A task waits until tomorrow. Rest does not solve loneliness, but it protects the person doing the work.' },
    ],
  }, {
    title: 'The door does not open.', time: 'MONTH SIX', place: 'The elevated walkway, after the rain', scene: 'setback',
    caption: setback.caption, thought: setback.thought, speaker: 'A voice of your own', dialogue: 'A setback can tell you something about a plan. It cannot tell you everything about a person.',
    question: 'What do you do with the disappointment?',
    choices: [
      { title: 'Find the specific thing that failed', note: 'Review the evidence before turning it into a verdict on yourself.', effects: { craft: 1, courage: 2, energy: -1 }, result: setback.feedback, dialogue: 'This hurt. It is also more specific than “I am not enough”.', cost: 'Honest review asks for emotional energy. It gives you something concrete to change.' },
      { title: 'Say that you are struggling', note: 'Ask an adviser, colleague or support service for help.', effects: { purpose: 2, energy: 1 }, result: 'You describe the setback without making it sound smaller than it is. A practical conversation helps you separate the next task from the fear around it.', dialogue: 'I can need support and still choose my own direction.', cost: 'You surrender the appearance of having everything under control. Help is a resource, not a replacement for agency.' },
      { title: 'Revise the plan, not your worth', note: 'Reduce the scope, adjust the schedule or take a deliberate pause.', effects: { energy: 2, courage: 1, craft: -1 }, result: 'You remove the deadline you chose to impress an imaginary audience. The smaller plan is less dramatic, and possible to begin tomorrow.', dialogue: 'Changing the plan is not disappearing from my life.', cost: 'Some ambitions take longer. You preserve your ability to return rather than turning exhaustion into proof of commitment.' },
    ],
  }, {
    title: 'A life, not an answer.', time: 'ONE YEAR LATER', place: 'The rooftop before sunrise', scene: 'future',
    caption: 'The ring has moved for the first time. Nobody knows what comes next. Neither do you. But you are no longer waiting for permission to live.',
    thought: 'I thought the right path would make me certain. It has only made me more awake.', speaker: 'The morning, without a promise', dialogue: 'You do not have to understand the whole future to choose how to meet it.',
    question: 'What do you carry into the next unknown?',
    choices: [
      { title: 'Take on the bigger challenge', note: 'Deepen your research, grow the business or apply for more responsibility.', effects: { craft: 2, courage: 1, energy: -2 }, result: 'You commit to a harder next step. This time you write down the cost as carefully as the ambition.', dialogue: 'I still want more. I want to be honest about what more asks of me.', cost: 'Growth carries uncertainty and demands on your energy. A bigger goal is not automatically a better life.' },
      { title: 'Build a rhythm you can live with', note: 'Keep the direction. Protect the life around it.', effects: { purpose: 1, energy: 2 }, result: 'You keep working toward the future without giving it every hour you have. The city is quiet. Your life is beginning to have a rhythm.', dialogue: 'I do not have to vanish into the thing I am building.', cost: 'Some milestones move more slowly. You make room for health, ordinary days and a future that can change.' },
      { title: 'Make the work useful beyond yourself', note: 'Share a method, mentor a newcomer or solve an overlooked problem.', effects: { purpose: 2, craft: 1, energy: -1 }, result: 'You put one useful piece of work into someone else’s hands. It is not a cure for being alone. It is a way of participating.', dialogue: 'My life does not need to be enormous to reach beyond this room.', cost: 'Contribution takes time that could go toward personal advancement. It gives your effort a purpose beyond proving yourself.' },
    ],
  }, {
    title: 'The invitation.', time: 'YEAR TWO / A MESSAGE AT MIDNIGHT', place: routeNames[route], scene,
    caption: {
      scholar: 'A research group invites you to join an expedition. The grant is small. The question is enormous.',
      founder: 'Your first large order arrives. Delivering it would mean hiring help and promising a date you have never met before.',
      professional: 'Your supervisor offers you a lead shift. You would be responsible for the people who once trained you.',
    }[route],
    thought: 'I wanted a door to open. Why does the open door frighten me?', speaker: 'The message on your desk',
    dialogue: 'We saw your work. We would like to know what you could do next.',
    question: 'Opportunity has arrived. What do you agree to?',
    choices: [
      { title: 'Say yes to the whole challenge', note: 'Take the leap, including the parts you have not learned yet.', effects: { courage: 2, craft: 1, energy: -2 }, result: 'You accept, then write an honest list of what you still do not know. Tomorrow is exciting. It is also considerably heavier.', dialogue: 'I can be brave without pretending this will be easy.', cost: 'The opportunity stretches your abilities and consumes your buffer. Confidence does not replace a plan for the extra work.' },
      { title: 'Negotiate a smaller first step', note: 'Agree on a pilot, clear support and a review date.', effects: { craft: 1, purpose: 1, energy: 1 }, result: 'You propose a first milestone instead of a sweeping promise. The reply is shorter than you feared: “That sounds workable.”', dialogue: 'A good yes can have conditions.', cost: 'You may move more slowly or lose an impatient opportunity. You make the commitment more believable to everyone involved.' },
      { title: 'Invite someone to share it', note: 'Find a collaborator whose strengths complement yours.', effects: { purpose: 2, courage: 1, energy: -1 }, result: 'You call someone whose work you respect. Together, you turn one intimidating invitation into two clear responsibilities.', dialogue: 'Sharing the work does not make it less mine.', cost: 'You give up sole ownership and spend time coordinating. You gain another perspective and someone who can challenge your blind spots.' },
    ],
  }, {
    title: 'The inconvenient truth.', time: 'EIGHTEEN MONTHS IN', place: routeNames[route], scene,
    caption: {
      scholar: 'The expedition data looks remarkable—until you notice a missing calibration record. The presentation is tomorrow.',
      founder: 'A test customer reports a serious flaw. Your investor update still calls the prototype ready.',
      professional: 'The service dashboard says everything is on time. A driver’s handwritten report tells a different story.',
    }[route],
    thought: 'What if telling the truth costs me the thing I worked for?', speaker: 'A detail in the margin',
    dialogue: 'A number can look perfect while the thing it describes is not.',
    question: 'What do you do with evidence that changes the story?',
    choices: [
      { title: 'Put the uncertainty on the record', note: 'Tell the people affected what you know and what you do not.', effects: { purpose: 2, courage: 2, energy: -1 }, result: 'You replace the confident sentence with a precise one. The room is uncomfortable. At least everyone is now making decisions from the same facts.', dialogue: 'I would rather lose a claim than ask someone to trust a false one.', cost: 'Being transparent can delay recognition or delivery. It gives others the information they need to make their own decisions.' },
      { title: 'Check it with a second pair of eyes', note: 'Ask for an independent review before making the next claim.', effects: { craft: 2, purpose: 1, energy: -1 }, result: 'A colleague finds a second issue—and a way to test both. You postpone the claim while you verify the work.', dialogue: 'Being careful is something we can do together.', cost: 'Verification takes time and may reveal more work. It reduces the chance of turning an uncertainty into someone else’s problem.' },
      { title: 'Keep the deadline; disclose the limits', note: 'Present the work as provisional, with an explicit warning.', effects: { courage: 1, craft: 1, energy: -2 }, result: 'You meet the deadline, but put the limitation at the beginning instead of the footnote. Some people appreciate it. Others want a certainty you cannot offer.', dialogue: 'This is what I can stand behind today. Not more.', cost: 'A warning can still be overlooked. You remain responsible for preventing the provisional work from being treated as final.' },
    ],
  }, {
    title: 'Someone knocks.', time: 'MONTH TWENTY / AN ORDINARY AFTERNOON', place: routeNames[route], scene,
    caption: {
      scholar: 'A new student waits outside your office, holding a notebook that looks painfully like yours on the first day.',
      founder: 'Your newest collaborator is stuck on their first repair. They have been quietly trying for hours.',
      professional: 'A trainee freezes during a simulation. The rest of the room keeps moving.',
    }[route],
    thought: 'I barely feel ready myself. What could I possibly give someone else?', speaker: 'The person at the door',
    dialogue: 'How did you know you belonged here?',
    question: 'What do you offer someone who is just beginning?',
    choices: [
      { title: 'Sit beside them for one task', note: 'Make space for a specific, practical conversation.', effects: { purpose: 2, craft: 1, energy: -1 }, result: 'You do not deliver a speech about confidence. You show them one thing you learned the hard way. They ask a question you have stopped asking.', dialogue: 'I didn’t know. I learned one thing, and then another.', cost: 'Your own task waits. Teaching also exposes gaps in your understanding and turns experience into something another person can use.' },
      { title: 'Leave a guide for the next person', note: 'Write down the unwritten rules and common mistakes.', effects: { craft: 2, purpose: 1, energy: -1 }, result: 'You turn a page of private notes into a small guide. A week later, someone has added a correction. The work no longer ends with you.', dialogue: 'You shouldn’t have to repeat every mistake I made.', cost: 'A guide needs care and revision; it cannot replace every conversation. It makes help available beyond the hours you can personally give.' },
      { title: 'Offer help within a boundary', note: 'Name a time you can give, and another place they can turn.', effects: { energy: 2, purpose: 1 }, result: 'You offer half an hour tomorrow and introduce them to someone available today. The help is real. So is the limit.', dialogue: 'I want to help you, and I want to keep that promise.', cost: 'You cannot be everyone’s first answer. A clear boundary is kinder than support that disappears when you run out of energy.' },
    ],
  }, {
    title: 'The sky goes quiet.', time: 'YEAR THREE / THE CITY STOPS', place: 'The old city, below the silent ring', scene: 'setback',
    caption: {
      scholar: 'The ring stops transmitting. Instruments go blank. Your research suddenly has no signal to follow.',
      founder: 'The city’s navigation network goes dark. People arrive at your workshop asking for a way home.',
      professional: 'Automation drops offline across the transit grid. The procedures you practised are no longer a simulation.',
    }[route],
    thought: 'I built a plan around a world that just changed again.', speaker: 'The silence, this time',
    dialogue: 'The future does not owe you the conditions you expected.',
    question: 'When the system fails, what do you trust?',
    choices: [
      { title: 'Use the skill you have practised', note: 'Start with one problem you can actually solve.', effects: { craft: 2, courage: 1, energy: -2 }, result: {
        scholar: 'You switch to an independent instrument and record the silence itself. An absence can be evidence when you know how it was measured.',
        founder: 'You adapt the offline device for a small group of stranded residents. It is not the launch you imagined. It is useful here, now.',
        professional: 'You follow the manual contingency plan with your team. One route opens. Then another. People start moving safely again.',
      }[route], dialogue: 'I cannot fix the whole city. I can begin here.', cost: 'Action under pressure draws on your remaining energy. Knowing your limits matters as much as knowing your tools.' },
      { title: 'Coordinate before acting alone', note: 'Find out who needs what, and who can safely help.', effects: { purpose: 2, courage: 1, energy: -1 }, result: 'You make a shared list: known facts, available people, immediate needs. The first useful thing you build is a picture of the situation.', dialogue: 'We do not have to make the same mistake separately.', cost: 'Coordination can feel slower than acting. It prevents duplicated effort and keeps urgent confidence from overrunning the facts.' },
      { title: 'Protect people and reduce the scope', note: 'Stabilise one small area. Ask for relief before taking on more.', effects: { energy: 2, purpose: 1, craft: -1 }, result: 'You help secure a safe waiting area, then hand over to a relief team. There is more work. You will be able to return to it.', dialogue: 'Urgency is not permission to become careless with people.', cost: 'You leave some problems unresolved for now. You preserve the capacity to help safely rather than making exhaustion part of the emergency.' },
    ],
  }, {
    title: 'What will you keep?', time: 'THE NEXT MORNING', place: 'The rooftop, with the whole city waking', scene: 'future',
    caption: 'The lights return one district at a time. The ring remains silent. You open the notebook from the day you decided to begin.',
    thought: 'The life I wanted and the life I have made are not quite the same.', speaker: 'A note to the next version of you',
    dialogue: 'You are not the first door you chose. You are what you kept choosing after it.',
    question: 'Before the next chapter begins, what do you choose to protect?',
    choices: [
      { title: 'A question that is still yours', note: 'Keep learning without making every answer a test of your worth.', effects: { craft: 1, courage: 2, energy: -1 }, result: 'You write a question instead of a five-year declaration. It is specific enough to begin and open enough for you to change.', dialogue: 'I can live a meaningful life without resolving every unknown.', cost: 'Curiosity leaves some things unsettled. You choose to keep learning instead of performing certainty.' },
      { title: 'A life with room around the work', note: 'Make a promise about your time, health and ordinary days.', effects: { energy: 2, purpose: 1 }, result: 'You close the notebook for breakfast. Later, you will return to the work. That ordinary “later” is part of the future you choose.', dialogue: 'The person doing the work is worth protecting, too.', cost: 'Some ambitions grow more slowly. You make space for a life you can inhabit while you build what comes next.' },
      { title: 'Something worth passing forward', note: 'Let one useful thing outlive your need to prove yourself.', effects: { purpose: 2, courage: 1, energy: -1 }, result: 'You leave a method, a device or a clear set of instructions where someone else can use it. Your story reaches past the edge of the page.', dialogue: 'I want what I learned to become someone else’s beginning.', cost: 'Contribution asks for time and care. You choose an impact that is not measured only by how far you personally advance.' },
    ],
  }]
  const times = ['GRADUATION WEEK', 'TWO WEEKS LATER', 'MONTH THREE', 'MONTH SIX', 'MONTH TWELVE', 'MONTH FOURTEEN', 'MONTH EIGHTEEN', 'MONTH TWENTY', 'MONTH TWENTY-TWO', 'TWO YEARS LATER']
  return chapters.map((chapter, index) => {
    const [context, turningPoint, lesson] = careerScenarios[route][index]
    const prior = index > 0 ? chapters[index - 1].choices[choices[index - 1]] : undefined
    return { ...chapter, time: times[index], caption: `${chapter.caption} ${context}`, turningPoint: `${turningPoint}${prior ? ` You arrive here after choosing to ${prior.title.toLowerCase()}.` : ''}`, lesson }
  })
}

export type LifeAction = { type: 'start'; name: string; dream: Dream } | { type: 'choose'; choice: number } | { type: 'next' } | { type: 'rewind'; chapter: number } | { type: 'restart' } | { type: 'note'; page: number; text: string } | { type: 'discover'; page: number; panel: number }
export function lifeReducer(state: LifeState, action: LifeAction): LifeState {
  if (action.type === 'restart') return { ...emptyLife, name: state.name, dream: state.dream }
  if (action.type === 'start') return action.name.trim() && dreams.some(d => d.id === action.dream) ? { ...emptyLife, name: action.name.trim().slice(0, 30), dream: action.dream, started: true } : state
  if (!state.started) return state
  const chapters = chaptersFor(state.choices)
  const current = state.choices.length - (state.revealed ? 1 : 0)
  if (action.type === 'note' && action.page === current && current < PAGE_COUNT) return { ...state, notes: { ...state.notes, [current]: action.text.slice(0, 1200) } }
  if (action.type === 'discover' && action.page === current && current < PAGE_COUNT && Number.isInteger(action.panel) && action.panel >= 0 && action.panel < 3) return { ...state, discoveries: { ...state.discoveries, [current]: [...new Set([...(state.discoveries[current] ?? []), action.panel])] } }
  if (action.type === 'choose' && !state.revealed && Number.isInteger(action.choice) && chapters[state.choices.length]?.choices[action.choice]) return { ...state, choices: [...state.choices, action.choice], revealed: true }
  if (action.type === 'next' && state.revealed) return { ...state, revealed: false }
  if (action.type === 'rewind' && Number.isInteger(action.chapter) && action.chapter >= 0 && action.chapter < state.choices.length) return { ...state, choices: state.choices.slice(0, action.chapter), revealed: false, notes: Object.fromEntries(Object.entries(state.notes).filter(([p]) => Number(p) < action.chapter)), discoveries: Object.fromEntries(Object.entries(state.discoveries).filter(([p]) => Number(p) < action.chapter)) }
  return state
}
export function restoreLife(raw: string | null): LifeState {
  try {
    const s = JSON.parse(raw ?? 'null') as (Omit<LifeState, 'version'> & {version: number}) | null
    if (!s || ![1, 2].includes(s.version) || typeof s.name !== 'string' || s.name.length > 30 || typeof s.started !== 'boolean' || typeof s.revealed !== 'boolean' || !dreams.some(d => d.id === s.dream) || !Array.isArray(s.choices) || s.choices.length > (s.version === 1 ? 5 : PAGE_COUNT) || s.choices.some(c => !Number.isInteger(c) || c < 0 || c > 2) || (s.started && !s.name.trim()) || (!s.started && (s.choices.length > 0 || s.revealed)) || (s.revealed && s.choices.length === 0)) return emptyLife
    const reached = Math.min(s.choices.length - (s.revealed ? 1 : 0), PAGE_COUNT - 1)
    const validPage = (key: string) => /^(0|[1-9])$/.test(key) && Number(key) <= reached
    const notes = Object.fromEntries(Object.entries(s.notes && typeof s.notes === 'object' && !Array.isArray(s.notes) ? s.notes : {}).filter(([p, value]) => s.started && validPage(p) && typeof value === 'string').map(([p, value]) => [p, value.slice(0, 1200)]))
    const discoveries = Object.fromEntries(Object.entries(s.discoveries && typeof s.discoveries === 'object' && !Array.isArray(s.discoveries) ? s.discoveries : {}).filter(([p, value]) => s.started && validPage(p) && Array.isArray(value)).map(([p, value]) => [p, [...new Set(value.filter((v: unknown) => Number.isInteger(v) && Number(v) >= 0 && Number(v) < 3))] as number[]]))
    return { version: 2, name: s.name, dream: s.dream, started: s.started, choices: s.choices, revealed: s.revealed, notes, discoveries }
  } catch { return emptyLife }
}
export function qualitiesFor(choices: number[]): Record<Quality, number> {
  const result = { craft: 3, courage: 3, purpose: 3, energy: 5 }
  const chapters = chaptersFor(choices)
  choices.forEach((choice, i) => {
    const effects = chapters[i]?.choices[choice]?.effects
    if (effects) for (const { id } of qualities) result[id] = Math.max(0, Math.min(12, result[id] + (effects[id] ?? 0)))
  })
  return result
}
export function endingFor(state: LifeState) {
  const route = routeFor(state.choices)
  const scores = qualitiesFor(state.choices)
  const wish = dreams.find(d => d.id === state.dream) ?? dreams[1]
  const reflection = `You began hoping to ${wish.title.toLowerCase()}. Your choices gave that wish a shape, not a final definition. The next decision is still yours.`
  if (scores.energy <= 1) return { id: 'pause', title: 'You are not a machine.', subtitle: 'The next chapter: recover, then choose.', body: 'You moved toward something that mattered, but asked more of yourself than you could sustain. The ring is still in the sky. The work can wait while you recover, seek support and decide what pace would let you return.', reflection }
  const endings = {
    scholar: { id: 'scholar', title: 'A question worth living with.', subtitle: 'The next chapter: the researcher.', body: 'The master’s did not explain the sky or make you less human. It gave you a method, a field of work and questions you chose for yourself. On the roof, you are still alone. Alone no longer means your days have no direction.' },
    founder: { id: 'founder', title: 'Something of your own.', subtitle: 'The next chapter: the builder.', body: 'The business is small, imperfect and uncertain. It is also real: an overlooked need, a tested device, work you can point to. You have not defeated loneliness with success. You have begun to take part in the world on your own terms.' },
    professional: { id: 'professional', title: 'A place to begin again.', subtitle: 'The next chapter: the professional.', body: 'The job did not become your whole identity. It gave your days structure and your care a practical use. When the transit lights come on, you know one part of the city is better because you showed up. There is room to discover what comes after that.' },
  }
  const texture = scores.purpose >= 10 ? 'Your choices repeatedly made room for other people. The work has become a way to participate, not only a way to prove yourself.' : scores.craft >= 10 ? 'Patient practice has given you something solid to stand on. Skills are not a whole identity, but they let you respond when the world changes.' : scores.courage >= 9 ? 'You kept choosing uncertainty over waiting for permission. There is still no guarantee, but the unknown no longer gets every vote.' : 'Your path was not one dramatic transformation. It was a series of smaller decisions you can keep revising.'
  const pace = scores.energy <= 4 ? 'Your remaining energy is low. The next ambition needs a realistic pace and support, not another promise to push through.' : 'You have kept some energy for the life around the work. That capacity is part of what you built.'
  return { ...endings[route], body: `${endings[route].body} ${texture} ${pace}`, reflection }
}
