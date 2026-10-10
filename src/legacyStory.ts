export type Branch = 'negotiate' | 'rescue' | 'scan'
export interface Panel { caption: string; dialogue: string }
export interface StoryState { page: 0 | 1 | 2; name: string; branch: Branch | null; crewTrust: number; shipEnergy: number; alienRelationship: number }
export type Action = { type: 'start'; name: string } | { type: 'choose'; branch: Branch } | { type: 'reset' }
export const initialState: StoryState = { page: 0, name: '', branch: null, crewTrust: 50, shipEnergy: 100, alienRelationship: 0 }
export const choices: { id: Branch; label: string }[] = [{ id: 'negotiate', label: 'Ask Both Sides' }, { id: 'rescue', label: 'Send A Rescue Team' }, { id: 'scan', label: 'Scan For Separation' }]
const effects: Record<Branch, [number, number, number]> = { negotiate: [5, -5, 10], rescue: [10, -20, -10], scan: [5, -10, 5] }
export function reducer(state: StoryState, action: Action): StoryState {
  if (action.type === 'reset') return initialState
  if (action.type === 'start' && state.page === 0 && action.name.trim()) return { ...initialState, page: 1, name: action.name.trim().slice(0, 40) }
  if (action.type === 'choose' && state.page === 1 && Object.hasOwn(effects, action.branch)) {
    const [trust, energy, relationship] = effects[action.branch]
    return { ...state, page: 2, branch: action.branch, crewTrust: state.crewTrust + trust, shipEnergy: state.shipEnergy + energy, alienRelationship: state.alienRelationship + relationship }
  }
  return state
}
export const opening: [Panel, Panel, Panel, Panel] = [
  { caption: 'A flower-shaped station hangs above a silent planet.', dialogue: '“Four hundred survivors. Please hurry.”' },
  { caption: 'On the Wayfarer, Imani and Senn study the signal.', dialogue: 'Imani: “Their voices are real. But there are no bodies aboard.” Senn: “That doesn’t mean there are no people.”' },
  { caption: 'A child watches behind the glass. The station’s petals close.', dialogue: '“It won’t let us leave.”' },
  { caption: 'CONTACT CLOSES IN 90 SECONDS · Narrative tension, no real timer.', dialogue: '“They are my memories, Captain. Would you let someone cut yours away?”' },
]
export function continuation(branch: Branch): [Panel, Panel, Panel, Panel] {
  if (branch === 'scan') return [
    { caption: 'The separation scan begins.', dialogue: 'Imani: “Looking for a way to separate them safely.”' },
    { caption: 'Light strands reach back toward the Wayfarer.', dialogue: 'Senn: “Captain… the signal is following us.”' },
    { caption: 'The ship AI interrupts the scan.', dialogue: '“New lifeform detected on the bridge.”' },
    { caption: 'The child stands beside the command chair.', dialogue: '“I didn’t come alone.”' },
  ]
  if (branch === 'rescue') return [
    { caption: 'A rescue team enters the station.', dialogue: 'Imani: “We’re bringing them home.”' },
    { caption: 'The corridors rearrange around the team.', dialogue: '“This wasn’t the way we came in.”' },
    { caption: 'Senn opens a channel to the station.', dialogue: '“If you want us to understand, let us see.”' },
    { caption: 'A door opens onto a sky full of borrowed stars.', dialogue: '“You cannot rescue someone from a memory.”' },
  ]
  return [
    { caption: 'Two channels open. Two stories emerge.', dialogue: 'Senn: “We’re listening to both of you.”' },
    { caption: 'The child remembers a catastrophe.', dialogue: '“The station took us when the sky fell.”' },
    { caption: 'The station remembers a rescue.', dialogue: '“I preserved what their world could not.”' },
    { caption: 'Imani finds a gap in both accounts.', dialogue: '“Captain, neither story explains who sent that distress call.”' },
  ]
}
