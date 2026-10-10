export type Dream = 'build' | 'people' | 'balance'
export type Quality = 'craft' | 'courage' | 'connection' | 'energy'
export type Scene = 'campus' | 'bedroom' | 'studio' | 'rain' | 'rooftop' | 'future'
export const qualities: { id: Quality; label: string }[] = [
  { id: 'craft', label: 'Skills' }, { id: 'courage', label: 'Courage' },
  { id: 'connection', label: 'Connections' }, { id: 'energy', label: 'Energy' },
]
export const dreams: { id: Dream; title: string; note: string; icon: string }[] = [
  { id: 'build', title: 'Make something my own', note: 'Ideas, independence, a little adventure.', icon: 'bolt' },
  { id: 'people', title: 'Make a difference', note: 'People, community, something that matters.', icon: 'user' },
  { id: 'balance', title: 'Build a life that fits', note: 'Meaningful work. Room to breathe.', icon: 'star' },
]
export interface LifeChoice { title: string; note: string; effects: Partial<Record<Quality, number>>; result: string; dialogue: string; cost: string }
export interface LifeChapter { title: string; time: string; place: string; scene: Scene; caption: string; thought: string; speaker: string; dialogue: string; question: string; choices: LifeChoice[] }
export const chapters: LifeChapter[] = [
  {
    title: 'A small yes.', time: 'FIRST YEAR · AUGUST', place: 'The campus noticeboard', scene: 'campus',
    caption: 'One ordinary Tuesday. Three invitations. None of them on the syllabus.',
    thought: 'Everyone seems to have a plan. I just have a lot of tabs open.',
    speaker: 'Mira, your friend', dialogue: 'You don’t have to choose your whole life. Just what you do this afternoon.',
    question: 'Something catches your eye. What do you follow?',
    choices: [
      { title: 'Try the makers’ club', note: 'Turn that half-formed idea into something real.', effects: {craft:2,courage:1,energy:-1}, result: 'You stay until the lights switch off. Your first prototype is crooked, but it exists.', dialogue: 'It’s a mess. It’s also mine.', cost: 'You trade a free evening for practice. Making things starts to feel possible.' },
      { title: 'Help at the community library', note: 'Start with people, then figure out what they need.', effects: {connection:2,courage:1,energy:-1}, result: 'You meet a librarian who has been tracking every borrowed book in a battered notebook.', dialogue: 'Maybe the most useful idea starts with listening.', cost: 'Your own project waits. A real person’s problem gives you a new direction.' },
      { title: 'Keep the afternoon for yourself', note: 'Sketch, read, and give your curiosity some space.', effects: {energy:2,craft:1}, result: 'Without an audience or a deadline, you fill a page with ideas you had not said out loud.', dialogue: 'I didn’t fall behind. I finally heard myself think.', cost: 'You miss a chance to meet people today. You gain space to discover what interests you.' },
    ],
  },
  {
    title: 'Everything, all at once.', time: 'SECOND YEAR · NOVEMBER', place: 'Your room, 11:47 pm', scene: 'bedroom',
    caption: 'An exam. A project deadline. A message from home. All on the same tiny screen.',
    thought: 'If I stop now, will everyone else get ahead?', speaker: 'Mira', dialogue: 'You have one evening. You’re allowed to decide what gets it.',
    question: 'You cannot do everything tonight. What gets your time?',
    choices: [
      { title: 'Push through and finish the project', note: 'A working demo could open a door.', effects: {craft:2,courage:1,energy:-2}, result: 'At 2 am, the demo finally works. The next morning, you are too tired to enjoy showing it.', dialogue: 'I did it. Now I really need to sleep.', cost: 'Your skills grow, but your energy takes the hit. This pace needs a recovery plan.' },
      { title: 'Ask a friend to work through it', note: 'Share the problem instead of carrying it alone.', effects: {connection:2,craft:1,energy:-1}, result: 'One call becomes a shared screen. Your friend spots the mistake you have stared at for an hour.', dialogue: 'Oh. Asking is a skill too.', cost: 'You give up some control over the process. You learn faster together.' },
      { title: 'Set a boundary and get some rest', note: 'Send an honest update. Start again tomorrow.', effects: {energy:2,courage:1,craft:-1}, result: 'You send the uncomfortable message, close the laptop, and wake up with a clearer head.', dialogue: 'Tomorrow still exists. So do I.', cost: 'The demo is smaller than planned. You protect the energy to keep going.' },
    ],
  },
  {
    title: 'Your people. Your project.', time: 'THIRD YEAR · FEBRUARY', place: 'A weekend buildathon', scene: 'studio',
    caption: 'Your team has an idea. The clock has other ideas.', thought: 'I want to prove I belong here. But what does that actually look like?',
    speaker: 'Dev, a mentor', dialogue: 'A team needs more than the person who writes the most code.', question: 'The project is stuck. Which role do you step into?',
    choices: [
      { title: 'Build the difficult part', note: 'Go deep and make the core idea work.', effects: {craft:2,energy:-1}, result: 'You turn a stubborn bug into a working feature. It is quiet work that everyone builds on.', dialogue: 'Nobody saw the ten failed attempts. They can use the eleventh.', cost: 'You gain technical depth, but spend less time shaping the bigger picture.' },
      { title: 'Bring the team together', note: 'Listen, divide the work, and make space for everyone.', effects: {connection:2,courage:1,energy:-1}, result: 'You notice the quietest teammate has the clearest idea. The whole project changes when they speak.', dialogue: 'Leadership can sound like: what do you think?', cost: 'Your personal feature stays unfinished. The team finds a direction.' },
      { title: 'Talk to the people who would use it', note: 'Test the idea before the team builds more.', effects: {courage:2,connection:1,craft:-1}, result: 'Three conversations reveal that your beautiful solution solves the wrong problem. You change course.', dialogue: 'That was uncomfortable. And exactly what we needed.', cost: 'You scrap some polished work. You find a problem worth solving.' },
    ],
  },
  {
    title: 'The part nobody posts.', time: 'FINAL YEAR · SEPTEMBER', place: 'Outside the interview room', scene: 'rain',
    caption: '“We’ve decided to go in a different direction.” One email can make a whole future feel smaller.',
    thought: 'Was all of this for nothing?', speaker: 'Dev', dialogue: 'This is information, not your identity. What do you want to do with it?', question: 'The opportunity falls through. What happens tomorrow?',
    choices: [
      { title: 'Ask for feedback and try again', note: 'Turn the disappointment into a next draft.', effects: {craft:1,courage:2,energy:-1}, result: 'The feedback stings. It is also specific. You finally know what to practise next.', dialogue: 'A rejection isn’t a full stop. I can write another sentence.', cost: 'Trying again asks for emotional energy. You gain a clearer next step.' },
      { title: 'Call someone who knows you', note: 'Let a friend see the unpolished version.', effects: {connection:2,energy:1}, result: 'Mira reminds you of the first crooked prototype. You remember how far you have already come.', dialogue: 'I needed a friend, not another productivity plan.', cost: 'You postpone the job search for a day. You stop facing it alone.' },
      { title: 'Reconsider the path', note: 'Check whether this was even your version of success.', effects: {energy:2,courage:1,craft:-1}, result: 'You open an old notebook. The life you wanted looks different from the one you have been chasing.', dialogue: 'Maybe changing direction is a decision, too.', cost: 'You let go of a familiar plan. The uncertainty makes room for a more personal one.' },
    ],
  },
  {
    title: 'The door you open.', time: 'GRADUATION · JUNE', place: 'The rooftop, after the ceremony', scene: 'rooftop',
    caption: 'There is no glowing arrow above the right door. Just possibilities, people, and what you have learned.',
    thought: 'I’m not the person who stood at that noticeboard anymore.', speaker: 'Mira', dialogue: 'Whatever you choose, it won’t be the last choice you ever make.',
    question: 'Your next chapter is waiting. How do you begin?',
    choices: [
      { title: 'Launch your own small project', note: 'Test your idea with real users and a modest runway.', effects: {courage:2,craft:1,energy:-2}, result: 'Your first customer is not a headline. They are one person saying: this helped me.', dialogue: 'Small is a perfectly good place to start.', cost: 'Independence brings uncertainty and more demands on your energy.' },
      { title: 'Join a team you can grow with', note: 'Choose good people and room to learn.', effects: {connection:2,craft:1}, result: 'On day one, you ask a question without pretending you know the answer. Someone pulls up a chair.', dialogue: 'I can belong here and still be learning.', cost: 'You share control over your direction. You gain support, structure, and people to learn from.' },
      { title: 'Take a deliberate stepping stone', note: 'Pick steady work and keep space for your own life.', effects: {energy:2,craft:1,courage:-1}, result: 'You choose a manageable start. In the evenings, the notebook stays open and the people you love stay close.', dialogue: 'A life is more than a job title.', cost: 'Some ambitions move more slowly. You make room for the life around them.' },
    ],
  },
]
export interface LifeState { version: 1; name: string; dream: Dream; started: boolean; choices: number[]; revealed: boolean }
export const LIFE_KEY = 'plottwist.life-comic.v1'
export const emptyLife: LifeState = { version:1,name:'',dream:'build',started:false,choices:[],revealed:false }
export type LifeAction = {type:'start';name:string;dream:Dream} | {type:'choose';choice:number} | {type:'next'} | {type:'rewind';chapter:number} | {type:'restart'}
export function lifeReducer(state: LifeState, action: LifeAction): LifeState {
  if (action.type === 'restart') return { ...emptyLife, name:state.name,dream:state.dream }
  if (action.type === 'start') return action.name.trim() && dreams.some(d=>d.id===action.dream) ? { ...emptyLife,name:action.name.trim().slice(0,30),dream:action.dream,started:true } : state
  if (!state.started) return state
  if (action.type === 'choose' && !state.revealed && chapters[state.choices.length]?.choices[action.choice] && Number.isInteger(action.choice)) return { ...state,choices:[...state.choices,action.choice],revealed:true }
  if (action.type === 'next' && state.revealed) return {...state,revealed:false}
  if (action.type === 'rewind' && Number.isInteger(action.chapter) && action.chapter >= 0 && action.chapter < state.choices.length) return {...state,choices:state.choices.slice(0,action.chapter),revealed:false}
  return state
}
export function restoreLife(raw: string | null): LifeState {
  try {
    const s = JSON.parse(raw ?? 'null') as LifeState | null
    if (!s || s.version !== 1 || typeof s.name !== 'string' || s.name.length > 30 || typeof s.started !== 'boolean' || typeof s.revealed !== 'boolean' || !dreams.some(d=>d.id===s.dream) || !Array.isArray(s.choices) || s.choices.length > chapters.length || s.choices.some((choice,i)=>!Number.isInteger(choice) || !chapters[i].choices[choice]) || (s.started && !s.name.trim()) || (!s.started && (s.choices.length > 0 || s.revealed)) || (s.revealed && s.choices.length===0)) return emptyLife
    return {version:1,name:s.name,dream:s.dream,started:s.started,choices:s.choices,revealed:s.revealed}
  } catch { return emptyLife }
}
export function qualitiesFor(choices: number[]): Record<Quality,number> {
  const result = {craft:3,courage:3,connection:3,energy:5}
  choices.forEach((choice,i)=>{ const effects = chapters[i]?.choices[choice]?.effects; if(effects) for(const {id} of qualities) result[id]=Math.max(0,Math.min(12,result[id]+(effects[id]??0))) })
  return result
}
export function endingFor(state: LifeState) {
  const q=qualitiesFor(state.choices)
  const wanted=dreams.find(d=>d.id===state.dream)!
  if (q.energy <= 2) return {id:'pause',title:'A spark needs air.',subtitle:'The next chapter: a gentler pace.',body:'You made things happen. You also spent more energy than you had room to recover. Your next brave decision could be a boundary, a break, or asking someone to share the load.',reflection:`You began wanting to ${wanted.title.toLowerCase()}. Your ambition still matters. So does the person carrying it.`}
  if (q.connection >= 9) return {id:'together',title:'Look who’s beside you.',subtitle:'The next chapter: building together.',body:'A call, a conversation, an invitation to speak. Your choices built a circle of people as well as a set of skills. The future you arrive at has room for others.',reflection:state.dream==='people' ? 'The difference you wanted to make started with the people right in front of you.' : 'You may have pictured an individual achievement. Your path revealed how much you value shared progress.'}
  if (q.craft >= 9) return {id:'maker',title:'You made it real.',subtitle:'The next chapter: a maker’s life.',body:'Your notebook became a prototype. Your mistakes became practice. Your practice became something someone can use. You are still learning, with more proof that you can begin.',reflection:state.dream==='build' ? 'Your wish to make something your own became a habit, one small attempt at a time.' : 'Your choices pulled you toward making things. Consider how those skills can serve the life you originally imagined.'}
  if (q.energy >= 9) return {id:'room',title:'A life with room in it.',subtitle:'The next chapter: growing at your pace.',body:'You made space to think, recover, and choose deliberately. Some milestones will take longer. You arrive with energy to explore them, and a life that extends beyond the next achievement.',reflection:state.dream==='balance' ? 'You protected the breathing room you hoped for. That, too, took decisions.' : 'Your path revealed a need for space alongside ambition. You can carry both into your next chapter.'}
  if (q.courage >= 8) return {id:'explore',title:'The map is still unfolding.',subtitle:'The next chapter: finding your own way.',body:'You asked the awkward question, tried a different door, and kept moving after a setback. There is uncertainty ahead. There is also evidence that you can meet it.',reflection:`You started with a wish to ${wanted.title.toLowerCase()}. You now have more information about what that means to you.`}
  return {id:'becoming',title:'Still becoming.',subtitle:'The next chapter: yours to write.',body:'No single label holds this path. You mixed practice, people, and pauses. Some choices moved you closer to your first dream; others helped you discover a different one.',reflection:'A destination can change as you do. The useful question is what you want your next small choice to make possible.'}
}
