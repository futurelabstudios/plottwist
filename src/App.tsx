import { useReducer, useState } from 'react'
import { initialState, reducer, choices, opening, continuation, type Branch } from './story'
import './App.css'

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [name, setName] = useState('')
  const [pending, setPending] = useState<Branch | null>(null)
  const panels = state.page === 1 ? opening : continuation(state.branch!)
  return <main>
    <header><a href="/" className="brand">PLOT<span>TWIST</span><small>YOUR VOICE. THEIR UNIVERSE.</small></a><span className="badge">Offline demo</span></header>
    {state.page === 0 ? <section className="landing">
      <p className="eyebrow">AN INTERACTIVE COMIC · EPISODE 01</p>
      <h1>The universe has a story.<br /><em>You decide the twist.</em></h1>
      <p className="intro">Take command of the Wayfarer. A distress call, four hundred survivors, and a station that refuses to let them go.</p>
      <form onSubmit={e => { e.preventDefault(); if (name.trim()) dispatch({ type: 'start', name: name.trim() }) }}>
        <label htmlFor="captain">What should we call you, Captain?</label>
        <div className="name-row"><input id="captain" required maxLength={40} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /><button>Take command ↗</button></div>
      </form><p className="note">A playable starter with placeholder art. Voice and live story generation are coming later.</p>
    </section> : <section className="episode">
      <div className="episode-heading"><div><p className="eyebrow">THE BORROWED STARS · PAGE {state.page} / 2</p><h1>{state.page === 1 ? "Please Don't Save Us" : state.branch === 'scan' ? 'An unexpected passenger' : state.branch === 'rescue' ? 'The shifting corridors' : 'Two sides of a memory'}</h1></div><button className="secondary" onClick={() => { dispatch({ type: 'reset' }); setPending(null) }}>Reset</button></div>
      <p className="status">Captain {state.name} <span>Trust {state.crewTrust} · Energy {state.shipEnergy} · Relations {state.alienRelationship}</span></p>
      <div className="panels">{panels.map((panel, i) => <article className={`panel scene-${i}`} key={panel.caption}><div className="art" aria-hidden="true"><span>{['✺', '◈', '◎', '✧'][i]}</span></div><span className="panel-number">0{i + 1}</span><p className="bubble">{panel.dialogue}</p><p className="caption">{panel.caption}</p></article>)}</div>
      <section className="decision" aria-labelledby="decision-title"><p className="eyebrow">YOUR COMMAND CHANGES THE STORY</p><h2 id="decision-title">{state.page === 1 ? 'What’s the call, Captain?' : 'To be continued…'}</h2>
      {state.page === 1 ? <><div className="choices">{choices.map(choice => <button className="secondary" onClick={() => setPending(choice.id)} key={choice.id}>{choice.label}</button>)}</div>{pending && <div className="confirmation" role="status"><p>Confirm order: <strong>{choices.find(c => c.id === pending)?.label}</strong></p><button onClick={() => { dispatch({ type: 'choose', branch: pending }); setPending(null) }}>Confirm command →</button><button className="secondary" onClick={() => setPending(null)}>Cancel</button></div>}</> : <><p>This scaffold previews the first branching decision. A third-page resolution, typed orders, saved progress, and voice will follow.</p><button onClick={() => dispatch({ type: 'reset' })}>Replay episode ↻</button></>}
      </section>
    </section>}
    <footer>THE BORROWED STARS <span>A PlotTwist original · Scaffold v0.1</span></footer>
  </main>
}
export default App
