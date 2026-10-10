import { useEffect, useRef, useState, type FormEvent } from 'react'
import Brand from '../components/Brand'
import BookFrame from '../components/BookFrame'
import MinimalStoryArt from '../components/MinimalStoryArt'
import { restoreSignal, signalPage, SIGNAL_KEY, type SignalChoice } from './secondStory'
import './SignalComic.css'

export default function SignalComic({ onExit }: {onExit:()=>void}) {
  const [save,setSave]=useState(()=>{try{return restoreSignal(localStorage.getItem(SIGNAL_KEY))}catch{return null}})
  const [name,setName]=useState(save?.name??'')
  const [view,setView]=useState(save?.history.length??0)
  const [chosen,setChosen]=useState<SignalChoice|null>(null)
  const [storageError,setStorageError]=useState(false)
  const heading=useRef<HTMLHeadingElement>(null)
  const page=signalPage(save?.name??name,save?.history.slice(0,view)??[])
  useEffect(()=>{heading.current?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})},[view])
  function navigate(page:number) { setChosen(null); setView(page) }
  function persist(next:{name:string;history:SignalChoice[]}) {setSave(next);try{localStorage.setItem(SIGNAL_KEY,JSON.stringify(next));setStorageError(false)}catch{setStorageError(true)}}
  function start(event:FormEvent) {event.preventDefault();if(name.trim()){persist({name:name.trim().slice(0,30),history:[]});navigate(0)}}
  function turn() {if(!chosen||!save)return;persist({...save,history:[...save.history.slice(0,view),chosen]});navigate(view+1)}
  return <div className="signal-reader">
    <header><button onClick={onExit} aria-label="Back to PlotTwist"><Brand/></button><span>PLAY / SCI-FI 002</span><button className="signal-small" onClick={onExit}>All stories ↗</button></header>
    {!save?<section className="signal-cover"><p className="signal-label">FIVE PAGES · FOUR APPROACHES · A SHARED CRISIS</p><h1 ref={heading} tabIndex={-1}>The Last<br/><em>Signal.</em></h1><p>A distress call knows your name. Its timestamp is tomorrow.<br/>Your choices decide whether the warning becomes another disaster.</p><MinimalStoryArt scene="signal"/><form onSubmit={start}><label htmlFor="signal-name">Your captain’s name</label><input id="signal-name" required maxLength={30} value={name} onChange={e=>setName(e.target.value)} autoComplete="given-name"/><button className="signal-primary">Open the book →</button></form></section>:<main>
      <div className="signal-progress"><span>Captain {save.name}</span><span>Page {view+1} / 5</span></div>
      <p className="signal-label">{page.subtitle}</p><h1 ref={heading} tabIndex={-1}>{page.title}</h1>
      <BookFrame pageKey={view}><section className="signal-panels" aria-label={`Page ${view+1}: four comic panels`}>{page.panels.map((panel,i)=><article key={i}><span className="signal-panel-number">{i+1}</span><MinimalStoryArt scene={panel.scene}/><div><p className="signal-caption">{panel.caption}</p><p className="signal-speech">{panel.speech}</p></div></article>)}</section></BookFrame>
      <nav className="signal-page-nav" aria-label="Comic pages"><button className="signal-small" disabled={view===0} onClick={()=>navigate(view-1)}>← Previous page</button><span>{view+1} / 5</span><button className="signal-small" disabled={view>=save.history.length} onClick={()=>navigate(view+1)}>Next page →</button></nav>
      {view<4?<section className="signal-decision"><p className="signal-label">YOUR ORDER CHANGES THE NEXT FOUR PANELS</p><h2>{page.question}</h2>{view<save.history.length&&<p>A new order here replaces the pages after this one.</p>}<div className="signal-choices">{page.choices.map(choice=><button key={choice.id} aria-pressed={chosen===choice.id} onClick={()=>setChosen(choice.id)}><strong>{choice.title}</strong><span>{choice.note}</span></button>)}</div><button className="signal-primary" disabled={!chosen} onClick={turn}>Commit order & turn the page →</button></section>:<section className="signal-ending"><p className="signal-label">A STORY SHAPED BY {save.name.toUpperCase()}</p><h2>{page.ending}</h2><button className="signal-primary" onClick={()=>{persist({...save,history:[]});navigate(0)}}>Try another future ↻</button><button className="signal-small" onClick={onExit}>Explore more stories ↗</button></section>}
      {storageError&&<p role="status">Your story works in this session, but this browser could not save it.</p>}
    </main>}
    <footer>THE LAST SIGNAL · PLOTTWIST BY FUTURELAB STUDIOS</footer>
  </div>
}
