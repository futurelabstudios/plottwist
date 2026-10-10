import { routeFor, type Route } from './careerStory'

export const panelLabels = ['Look closer', 'Inner voice', 'Read the signal']

/** Optional observations: context to weigh, not clues to a correct answer. */
export function discoveriesFor(page: number, choices: number[]): string[] {
  const route: Route = routeFor(choices)
  const object = { scholar: 'the observation notebook', founder: 'the unfinished device', professional: 'the handwritten shift log' }[route]
  const details = [
    ['Three unopened messages sit beside the window: an admission notice, a workshop listing and a transit vacancy. None promises a life without uncertainty.', 'The room is safe, but its routines have become a way of postponing the next decision. Comfort and direction are not the same thing.', 'The broken ring has been there for seven years. Waiting for the sky to explain itself has not made the choice easier.'],
    [`A blank page in ${object} is dated today. There is no rule that says the first attempt must be impressive.`, 'The fear changes its name after you choose a direction. It does not automatically disappear.', 'The lights in the next building are still on. Other people are beginning, practising and asking for help, too.'],
    [`Three small corrections in ${object} show progress no public announcement would capture.`, 'The wish to be recognised is human. Making recognition the only evidence of progress leaves you dependent on an audience.', 'A meal has gone cold beside the work. The evening is not an unlimited resource.'],
    ['The rejection names one specific problem. It does not contain a verdict on every possible version of your future.', 'You are tempted to turn “this did not work” into “I do not belong”. Those are different claims.', 'There is a contact name at the end of the message. Asking a precise question is still possible.'],
    ['The notebook contains a year of ordinary days, not one heroic turning point. The direction came from repeating small actions.', 'Your first wish still matters, but you have learned more about the person who made it.', 'The ring has shifted. A change outside does not have to erase the work already done inside your life.'],
    ['The invitation has a deadline, a scope and a name you can reply to. Each is something you can ask about, not a command.', choices[4] === 1 ? 'You recently chose a sustainable rhythm. The new opportunity will test whether you can protect it when the offer is flattering.' : 'Your last choice made the ambition more concrete. This invitation asks how much of your life you are willing to commit to it.', 'No budget for extra support is mentioned. Before saying yes, you can find out who carries the work when the plan slips.'],
    [`A discrepancy in ${object} is small enough to overlook and important enough to change the claim.`, 'The urge to protect your reputation may feel like protecting the work. Sometimes it is the opposite.', 'Someone else will act on what you publish or promise. Their ability to choose depends on the limits you make visible.'],
    ['The newcomer has already tried two things. Asking what they tried may be more useful than starting with advice.', 'You remember how long it took you to ask your first question. Competence has not erased that memory.', 'Your calendar has one open slot. Giving it deliberately is different from promising to always be available.'],
    ['The nearest exit still works. A list of immediate needs is more useful than a theory about the whole emergency.', choices[7] === 2 ? 'You recently practised offering help within a boundary. That boundary can matter even more under pressure.' : 'The help you offered someone else has become part of your practice. You do not have to meet this moment entirely alone.', 'The silent ring is new information, not proof that everything you learned was wasted. Some methods still work without the old system.'],
    [`You chose ${route === 'scholar' ? 'study' : route === 'founder' ? 'a business' : 'a job'} on the first page. Nine later decisions have made that word mean something much more personal.`, 'The old question was “What should I become?” The new one may be “What kind of days do I want to keep living?”', 'The notebook has another blank page. An ending can record a direction without pretending the future is settled.'],
  ]
  return details[page] ?? []
}
