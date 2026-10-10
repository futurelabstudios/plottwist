export const signalChoices = [
  { id:'listen', title:'Open a channel', note:'Build trust; reveal your position.' },
  { id:'rescue', title:'Send a rescue pod', note:'Reach someone now; spend your reserve.' },
  { id:'decode', title:'Trace the signal', note:'Find evidence; let the clock run.' },
  { id:'shield', title:'Hold a safe perimeter', note:'Protect the crew; keep others waiting.' },
] as const
export type SignalChoice = typeof signalChoices[number]['id']
export interface SignalPanel { scene:string; caption:string; speech:string }
export interface SignalPage { title:string; subtitle:string; panels:SignalPanel[]; choices:typeof signalChoices; question:string; ending?:string }
export const SIGNAL_KEY = 'plottwist-last-signal-v1'
export function restoreSignal(raw:string|null): {name:string;history:SignalChoice[]} | null {
  try { const s=JSON.parse(raw??'null'); return s && typeof s.name==='string' && s.name.trim() && s.name.length<=30 && Array.isArray(s.history) && s.history.length<=4 && s.history.every((c:unknown)=>signalChoices.some(x=>x.id===c)) ? {name:s.name,history:s.history} : null } catch { return null }
}
const echoes:Record<SignalChoice,string>={listen:'The channel you opened lets the stranded pilot speak freely, but the storm now knows your coordinates.',rescue:'Your rescue pod reaches the station. Its empty fuel cells will matter when the storm closes in.',decode:'Your scan finds a second transmitter beneath the station. The time spent tracing it has brought the storm closer.',shield:'Your perimeter keeps the crew safe, but the station has spent its remaining power waiting for contact.'}
const assets:Record<SignalChoice,string>={listen:'a shared command phrase',rescue:'a pod tether between the ships',decode:'a map of the buried transmitter',shield:'a shield corridor through the storm'}
export function signalPage(name:string,history:SignalChoice[]):SignalPage {
  const index=history.length, first=history[0]??'listen', last=history.at(-1)??first
  const panel=(scene:string,caption:string,speech:string):SignalPanel=>({scene,caption,speech})
  const common={choices:signalChoices}
  if(index===0) return {...common,title:'A voice from tomorrow',subtitle:'PAGE 01 / THE DISTRESS CALL',question:`${name}, how do you answer?`,panels:[
    panel('signal','The courier ship Morrow crosses a violet storm. One station remains lit on the far side.',`Captain ${name}, a distress call is repeating your name.`),
    panel('ship','Engineer Imani checks the timestamp. It is seventeen minutes in the future.','“We have never been here. How does someone know who is coming?”'),
    panel('archive','A pilot named Ren appears on the screen beside a cracked emergency console.','“Do not destroy the transmitter. I made that mistake already.”'),
    panel('bridge','The station doors open. Inside, a second Morrow floats with its lights out.',`${name}, your ship is already waiting for you. The storm reaches the station in seventeen minutes.`),
  ]}
  if(index===1) return {...common,title:'The ship that came first',subtitle:'PAGE 02 / FOUR WAYS IN',question:`${name}, which risk will you take next?`,panels:[
    panel('signal',echoes[last],`Your decision leaves you with ${assets[last]}.`),
    panel('ship',first==='rescue'?'The rescue pod finds Ren alive beside the second ship.':first==='decode'?'The scan identifies your own hull number beneath an older coat of paint.':first==='shield'?'From behind the perimeter, Imani sees a figure waving inside the dark ship.':'Ren transmits a photograph of the dark ship’s bridge. Your mug is still on the console.','“The other Morrow is not an enemy,” Ren says. “It is a warning.”'),
    panel('archive','A flight recorder plays your voice giving an order to destroy the transmitter.',`“Captain ${name} authorised the strike.” Imani turns to you. “That has not happened yet.”`),
    panel('bridge','The transmitter is not sending a call through space. It is returning a memory through time.','Ren has survived this loop nine times. This is the first time you stopped to ask what he meant.'),
  ]}
  if(index===2) return {...common,title:'One crisis, four approaches',subtitle:'PAGE 03 / THE PATHS MEET',question:`${name}, what should the transmitter carry?`,panels:[
    panel('signal',echoes[last],`You carry ${assets[first]} from your first approach. The paths now meet at the transmitter chamber.`),
    panel('archive','Imani finds the original mission: the station was testing a device that sends a warning to its own past.','“It cannot move people. It can move one memory. We mistook the ghost ship for an invasion.”'),
    panel('bridge','A cracked core is feeding the loop. Destroying it repeats the explosion recorded on the dark ship.','Ren’s warning was true, but incomplete: he hid his role in starting the test because he feared you would leave him.'),
    panel('ship','The storm strikes the station. The memory window can carry a rescue route, a confession, a repair map or a protective signal.','There is enough power for one message. Every approach reaches this room; what you bring changes what happens next.'),
  ]}
  if(index===3) {
    const payload={listen:'Ren records the truth about the failed experiment, including the mistake he tried to hide.',rescue:'You send a safe evacuation route to the crew seventeen minutes earlier.',decode:'Imani transmits a verified repair sequence instead of a destructive command.',shield:'You send the precise timing for a protective corridor through the storm.'}[last]
    return {...common,title:'The cost of a second chance',subtitle:'PAGE 04 / THE LAST WINDOW',question:`${name}, how do you bring everyone home?`,panels:[
      panel('archive',payload,`The outgoing packet includes your name, ${name}, and the evidence gathered on this journey.`),
      panel('bridge',first==='rescue'?'The fuel you spent on the rescue pod leaves too little for a full-speed escape.':first==='shield'?'The corridor you held is stable, but Ren’s station battery is almost empty.':first==='decode'?'Your transmitter map shows a maintenance tunnel; the delay has closed the main exit.':'Your shared command phrase authenticates the warning. Opening the channel also attracted the storm’s tracking pulse.','Imani says, “Our first choice still has a cost. We cannot pretend we started over.”'),
      panel('signal','A reply arrives from your past self: “Warning received. We are changing course.”','The dark ship fades. Ren begins to smile, then notices the station is still losing power.'),
      panel('ship','Changing the past stopped the explosion. It did not move the people still here.','The final escape needs trust, a risky tow, a carefully timed repair or a shielded retreat. Choose the future you can actually carry.'),
    ]}
  }
  const outcomes:Record<SignalChoice,[string,string,string]>={
    listen:['The future we agreed on','You connect every crew member to the channel. Ren shares the override and Imani coordinates a slower, collective departure.','The crew leaves together. Ren’s testimony remains public; forgiveness does not erase responsibility.'],
    rescue:['No one left in the loop','You tether the station’s lifeboat to Morrow and take the longer route outside the storm. The engine survives, but the courier delivery is lost.','Every person returns. The cargo does not. Your next mission begins with an honest report of what you chose to sacrifice.'],
    decode:['A warning that became a method','Imani times the repair to the beacon’s pulse. You keep a complete record so the experiment can be examined rather than secretly repeated.','The station stabilises long enough for everyone to leave. Its future belongs to independent investigators, not to another reckless test.'],
    shield:['A corridor, freely given','You hold the shield while the lifeboat crosses. Morrow’s shield burns out at the exit; you return slowly under escort.','The people are safe. Your damaged ship needs help. The captain who protected everyone must now accept protection too.'],
  }
  const [title,resolution,after]=outcomes[last]
  const message={listen:'a truthful confession',rescue:'an evacuation route',decode:'a repair sequence',shield:'the shield timing'}[history[2]]
  return {...common,title,subtitle:'PAGE 05 / THE CHANGED MORNING',question:'Your next story is still unwritten.',ending:after,panels:[
    panel('bridge',resolution,`Captain ${name}, this is the future your final order made possible.`),
    panel('archive',`The archive retains ${message}, carried by the memory window.`,`Your first approach left ${assets[first]}; it became part of the escape, not a discarded branch.`),
    panel('dawn',after,`Ren says, “You did not save the person I was pretending to be. You saved me.”`),
    panel('signal','On the return journey, an ordinary message arrives with a timestamp from the present.',`“Welcome home, ${name}.” For once, tomorrow has not spoken first.`),
  ]}
}
