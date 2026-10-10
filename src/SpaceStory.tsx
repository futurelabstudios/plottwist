import { useEffect, useReducer, useState } from 'react'
import { initialState, reducer, choices, opening, continuation, type Branch } from './legacyStory'
import './App.css'
import { Brand, Icon } from './components'

const titles: Record<Branch, string> = { scan: 'The Scan That Answered', rescue: 'The Shifting Corridors', negotiate: 'Two Sides of a Memory' }
const illustrations: Record<Branch, number[]> = { scan: [4, 5, 6, 7], rescue: [4, 0, 1, 3], negotiate: [1, 2, 3, 4] }
function Mark() { return <span className="mark" aria-hidden="true"><i /><i /><i /><i /></span> }
function SpaceStory({ onExit, onWork, active }: { onExit: () => void; onWork: () => void; active: boolean }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => { if (active) window.scrollTo({ top: 0, behavior: 'instant' }) }, [state.page, active])
  const [name, setName] = useState('')
  const [pending, setPending] = useState<Branch | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const panels = state.page === 1 ? opening : continuation(state.branch ?? 'scan')
  const art = state.page === 1 ? [0, 1, 2, 3] : illustrations[state.branch ?? 'scan']
  const reset = () => { dispatch({ type: 'reset' }); setPending(null) }
  return <main className="space-mode">
    <header className="adventure-topbar"><button className="world-back" onClick={onExit}><Icon name="back" size={16} /> All adventures</button><span className="adventure-label"><Icon name="orbit" size={17} /> Play / The Borrowed Stars</span><span className="badge"><span /> Storyboard example</span></header>
    {state.page === 0 ? <section className="landing">
      <div className="hero-copy"><p className="eyebrow">YOUR NEXT WHAT IF?</p><h1>The Borrowed<br />Stars</h1><p className="tagline">Your crew. Your choices. Your universe.</p></div>
      <div className="hero-art illustration tile-0" role="img" aria-label="The Wayfarer approaches a luminous flower-shaped alien station above a planet." />
      <div className="mission"><h2>Become the captain. Choose your next move.</h2><form onSubmit={e => { e.preventDefault(); if (name.trim()) dispatch({ type: 'start', name: name.trim() }) }}>
        <label htmlFor="captain">Your captain’s name<input id="captain" required maxLength={40} value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" autoComplete="given-name" /></label>
        <button className="primary">Begin your mission <span aria-hidden="true">→</span></button>
      </form><button className="help-button" onClick={() => setShowHelp(!showHelp)} aria-expanded={showHelp}><span aria-hidden="true">▷</span> See how it works</button>
      {showHelp && <p className="help">Read four illustrated panels, choose an order, then confirm to reveal its consequences. Replay to try another path. Voice is planned; this example works with choice buttons.</p>}
      <div className="features"><div><Mark /><strong>4-panel chapters</strong></div><div><span aria-hidden="true">⌁</span><strong>Captain’s choices</strong></div><div><span aria-hidden="true">⑂</span><strong>A changing story</strong></div></div><p className="tagline small">Every decision opens a new possibility.</p></div>
    </section> : <section className="episode">
      <div className="captain-bar"><div className="avatar illustration tile-3" aria-hidden="true" /><div className="captain-info"><div><strong>Captain {state.name}</strong><span>PAGE {state.page} / 2</span></div><div className="progress" aria-label={`Page ${state.page} of 2`}><i className="active" /><i className={state.page === 2 ? 'active' : ''} /></div></div><button className="reset" onClick={reset}>Reset</button></div>
      <div className="episode-heading"><h1>The Borrowed Stars</h1><h2>{state.page === 1 ? 'Please Don’t Save Us' : titles[state.branch!]}</h2>{state.page === 2 && <p className="order-pill">✓ {choices.find(c => c.id === state.branch)?.label}</p>}</div>
      <div className="panels">{panels.map((panel, i) => <article className={`panel panel-${i}`} key={panel.caption}><div className={`illustration tile-${art[i]}`} role="img" aria-label={panel.caption} /><span className="panel-number">0{i + 1}</span><p className="bubble">{panel.dialogue}</p><p className={`caption ${state.page === 1 && i === 3 ? 'warning' : ''}`}>{panel.caption}</p></article>)}</div>
      <section className="decision" aria-labelledby="decision-title"><h2 id="decision-title">{state.page === 1 ? 'What’s your order, Captain?' : 'Your orders, Captain?'}</h2>
      {state.page === 1 ? <><p className="voice-preview"><span aria-hidden="true">♩</span> Your next move shapes the story <span className="wave" aria-hidden="true">▂▅▇▃▆▅▂</span></p><div className="choices">{choices.map((choice,i) => <button className="secondary" onClick={() => setPending(choice.id)} key={choice.id}><span aria-hidden="true">{['◯','♟','◎'][i]}</span>{choice.label}</button>)}</div>{pending && <div className="confirmation" role="status"><p>Confirm order: <strong>{choices.find(c => c.id === pending)?.label}</strong></p><button onClick={() => { dispatch({ type: 'choose', branch: pending }); setPending(null) }}>Confirm command →</button><button className="secondary" onClick={() => setPending(null)}>Cancel</button></div>}<p className="decision-note">Your decision shapes the next four panels.</p></> : <><p className="decision-note">The next chapter is yours to imagine.</p><div className="next-choices" aria-label="Preview of future choices">{(state.branch === 'scan' ? ['Talk to the child','Check the ship','Contact the station'] : ['Hear their story','Protect the crew','Contact the station']).map(label => <span key={label}>{label}</span>)}</div><p className="note">End of the two-page storyboard example. Next-chapter choices and voice are coming later.</p><button className="primary replay" onClick={reset}>Replay another path ↻</button></>}
      </section><div className="consequences"><span>Crew trust <strong>{state.crewTrust}</strong></span><span>Ship energy <strong>{state.shipEnergy}</strong></span><span>Alien relationship <strong>{state.alienRelationship > 0 ? '+' : ''}{state.alienRelationship}</strong></span></div>
    </section>}
    <aside className="world-bridge"><div><span className="bridge-symbol" aria-hidden="true">↝</span><p><strong>A different kind of universe?</strong><span>Step into a student’s life. Discover who your choices help you become.</span></p></div><button onClick={onWork}>Explore Work <Icon name="arrow" size={18} /></button></aside>
    <footer><span><Brand small /> A story in every step.</span><span>Read. Decide. Discover.</span></footer>
  </main>
}
export default SpaceStory
