import { useEffect, useReducer, useRef, useState, type FormEvent, type CSSProperties } from 'react'
import { Brand, Icon } from './components'
import { LifeArt } from './LifeArt'
import { chaptersFor, dreams, emptyLife, endingFor, LIFE_KEY, lifeReducer, qualities, qualitiesFor, restoreLife, type Dream, type LifeAction } from './careerStory'
import './WorkComic.css'
import { ChoicePreview, Discoveries, Notebook, StoryNotebook } from './WorkExtras'
import { panelLabels } from './careerExploration'

function initialLife() { try { return restoreLife(localStorage.getItem(LIFE_KEY)) } catch { return emptyLife } }

export default function WorkComic({ active, onPlay }: {active:boolean;onPlay:()=>void}) {
  const [state,dispatch]=useReducer(lifeReducer,undefined,initialLife)
  const chapters=chaptersFor(state.choices)
  const [name,setName]=useState(state.name)
  const [dream,setDream]=useState<Dream>(state.dream)
  const [motion,setMotion]=useState(true)
  const [saveFailed,setSaveFailed]=useState(false)
  const [preview,setPreview]=useState<number|null>(null)
  const [discoveryOpen,setDiscoveryOpen]=useState<number|null>(null)
  const [rewrite,setRewrite]=useState<number|null>(null)
  const rewriteDialog=useRef<HTMLDialogElement>(null)
  const previewChoice=useRef<HTMLButtonElement|null>(null)
  const heading=useRef<HTMLHeadingElement>(null)
  const resultHeading=useRef<HTMLHeadingElement>(null)
  const index=state.choices.length-(state.revealed?1:0)
  const chapter=chapters[index]
  const selected=state.revealed ? chapter?.choices[state.choices[index]] : undefined
  const finished=state.started && index===chapters.length
  const scores=qualitiesFor(state.choices)
  const ending=endingFor(state)
  const previous=index>0 ? chapters[index-1].choices[state.choices[index-1]] : undefined
  function act(action:LifeAction) {
    const next=lifeReducer(state,action)
    try { localStorage.setItem(LIFE_KEY,JSON.stringify(next)); setSaveFailed(false) } catch { setSaveFailed(true) }
    dispatch(action)
    if(['start','choose','next','rewind','restart'].includes(action.type)) { setPreview(null); setDiscoveryOpen(null) }
  }
  function inspect(panel:number) { act({type:'discover',page:index,panel}); setDiscoveryOpen(discoveryOpen===panel?null:panel) }
  function askRewrite(page:number) { setRewrite(page) }
  useEffect(()=>{ if(rewrite!==null) rewriteDialog.current?.showModal(); else rewriteDialog.current?.close() },[rewrite])
  function start(e:FormEvent) { e.preventDefault(); if(name.trim()) act({type:'start',name,dream}) }
  useEffect(()=>{
    if(active) {
      const target=state.revealed?resultHeading.current:heading.current
      target?.focus({preventScroll:true})
      if(state.revealed) target?.scrollIntoView({behavior:'instant',block:'center'})
      else window.scrollTo({top:0,behavior:'instant'})
    }
  },[active,state.started,state.revealed,state.choices.length])

  return <main className={`work-comic ${motion?'motion-on':'motion-off'}`}>
    <div className="life-toolbar"><span className="life-series"><Icon name="bolt" size={16}/> WORK · THE LIFE YOU MAKE</span><div><span className="life-edition">An existential sci-fi comic</span><button className="life-motion" aria-pressed={motion} onClick={()=>setMotion(!motion)}><Icon name={motion?'orbit':'clock'} size={16}/><span>Animation {motion?'on':'off'}</span></button></div></div>
    {saveFailed&&<p className="life-save-error" role="status">Your story is available in this session. Browser storage couldn’t save it for next time.</p>}
    {!state.started ? <>
      <section className="life-cover">
        <div className="life-cover-copy"><span className="life-issue">ISSUE 01 / AFTER THE SKY CHANGED</span><h1 ref={heading} tabIndex={-1}>The life<br/>you <span>make.</span></h1><p className="life-lede">The world moved on.<br/>You’re still finding a way forward.</p><p className="life-premise">A solitary man. An impossible sky. A city that provides everything except a reason to begin. Pursue a master’s, build a business or take a job—and discover what the choice asks of you.</p><div className="life-cover-meta"><span><Icon name="map" size={16}/> 3 career paths</span><span><Icon name="clock" size={16}/> 10 story pages</span><span><Icon name="reset" size={16}/> More than one ending</span></div></div>
        <div className="life-cover-art"><div className="life-cover-main"><LifeArt scene="crossroads"/><span className="life-cover-caption">The city can keep you alive. What makes a life yours?</span><p className="life-speech cover-speech">What am I waiting<br/>to become?</p></div><div className="life-cover-inset"><LifeArt scene="future" celebrate/><span>The unknown is still ahead.</span></div><span className="life-cover-stamp">NO CERTAIN PATH.<br/>ONE NEXT MOVE.</span></div>
      </section>
      <form className="life-casting" onSubmit={start}>
        <div className="life-casting-intro"><span className="life-handnote">First, meet the lead. <span aria-hidden="true">↴</span></span><h2>Who’s in this story?</h2><label htmlFor="life-name">Your character’s name</label><input id="life-name" placeholder="Your first name" autoComplete="given-name" required maxLength={30} value={name} onChange={e=>setName(e.target.value)} pattern=".*\S.*"/><p>You can be yourself. Or try someone new.</p></div>
        <fieldset className="life-dreams"><legend>What are you hoping to find?</legend><p className="life-dream-hint">A starting wish, not a promise. You may change your mind.</p><div className="life-dream-options">{dreams.map(d=><label key={d.id} className={`life-dream ${dream===d.id?'is-picked':''}`}><input type="radio" name="life-dream" value={d.id} checked={dream===d.id} onChange={()=>setDream(d.id)}/><Icon name={d.icon}/><span><strong>{d.title}</strong><small>{d.note}</small></span></label>)}</div></fieldset>
        <div className="life-start-row"><p><strong>No perfect answers. Real trade-offs.</strong><span>A fictional life to explore, not a prediction of yours.</span></p><button type="submit" className="life-primary">Step into the story <Icon name="arrow"/></button></div>
      </form>
    </> : <>
      <div className="work-page-status"><span>{finished?'10 pages. One life.':`Page ${index+1} of ${chapters.length}`}</span><progress max={chapters.length} value={state.choices.length} aria-label={`${state.choices.length} of ${chapters.length} choices written`}/></div>
      <nav className="life-chapters" aria-label="Your life chapters">{chapters.map((c,i)=><button key={c.title} disabled={i>=state.choices.length} aria-current={!finished&&i===index?'step':undefined} className={i<state.choices.length?'is-written':i===index?'is-current':''} onClick={()=>askRewrite(i)} aria-label={`${i<state.choices.length?'Rewrite':'Chapter'} ${i+1}: ${c.title}`}><span>{i<state.choices.length?<Icon name="check" size={16}/>:String(i+1).padStart(2,'0')}</span><span>{c.title}</span></button>)}</nav>
      {finished ? <section className="life-ending">
        <div className="life-ending-heading"><span className="life-issue">TEN CHOICES LATER…</span><h1 ref={heading} tabIndex={-1}>{ending.title}</h1><p>{state.name}, this is where your story has brought you.</p></div>
        <div className={`life-ending-scene ending-${ending.id}`}><LifeArt scene="future" celebrate={ending.id!=='pause'}/><div className="life-ending-caption"><span>TO BE CONTINUED</span><h2>{ending.subtitle}</h2><p>{ending.body}</p></div><span className="life-ending-tag">Every ending is<br/>another beginning.</span></div>
        <div className="life-reflection"><Icon name="star" size={28}/><div><h2>The dream you started with</h2><p>{ending.reflection}</p></div></div>
        <StoryNotebook state={state} chapters={chapters}/>
        <section className="life-choice-history"><div className="life-section-heading"><h2>It wasn’t one big moment.</h2><p>It was the little choices, adding up. Revisit one to discover another path.</p></div><ol>{state.choices.map((choice,i)=><li key={i}><span className="life-history-number">{String(i+1).padStart(2,'0')}</span><div><span>{chapters[i].title}</span><h3>{chapters[i].choices[choice].title}</h3><p>{chapters[i].choices[choice].cost}</p></div><button aria-label={`Rewrite chapter ${i+1}`} onClick={()=>askRewrite(i)}><Icon name="reset" size={18}/> Rewrite</button></li>)}</ol></section>
        <div className="life-ending-actions"><button className="life-primary" onClick={()=>act({type:'restart'})}>Live another version <Icon name="reset"/></button><button className="life-secondary" onClick={onPlay}>Explore Play <Icon name="arrow"/></button></div>
        <p className="life-fiction-note">This ending reflects the choices in this fictional story. Real lives also involve opportunity, circumstance, and other people—and there is always more story ahead.</p>
      </section> : <>
        <section className="life-chapter-heading"><div><span className="life-issue">PAGE {String(index+1).padStart(2,'0')} / 10 / {chapter.time}</span><h1 ref={heading} tabIndex={-1}>{chapter.title}</h1></div><span className="life-character-chip"><span>{state.name.charAt(0).toUpperCase()}</span>{state.name}<small>THE MAIN CHARACTER</small></span></section>
        {previous&&<p className="life-callback"><Icon name="back" size={15}/><span><strong>Previously in your story:</strong> {previous.result}</span></p>}
        <section key={`${index}-${motion}`} className="life-comic-page" aria-label={`Chapter ${index+1} comic`}>
          <article className="life-panel life-establishing"><span className="life-panel-caption">{chapter.place}</span><LifeArt scene={chapter.scene}/><p className="life-narration">{chapter.caption}</p><button className="work-panel-inspect" onClick={()=>inspect(0)} aria-label={`Panel 1: ${panelLabels[0]}`} aria-expanded={discoveryOpen===0}>{state.discoveries[index]?.includes(0)?<Icon name="check" size={16}/>:<Icon name="orbit" size={16}/>}<span>1</span></button></article>
          <article className="life-panel life-thought-panel"><LifeArt scene={chapter.scene} close/><p className="life-thought">{chapter.thought}</p><span className="life-panel-signature">{state.name} / THINKING OUT LOUD</span><button className="work-panel-inspect" onClick={()=>inspect(1)} aria-label={`Panel 2: ${panelLabels[1]}`} aria-expanded={discoveryOpen===1}>{state.discoveries[index]?.includes(1)?<Icon name="check" size={16}/>:<Icon name="orbit" size={16}/>}<span>2</span></button></article>
          <article className="life-panel life-dialogue-panel"><LifeArt scene={chapter.scene}/><div className="life-dialogue"><span>{chapter.speaker}</span><p>{chapter.dialogue}</p></div><button className="work-panel-inspect" onClick={()=>inspect(2)} aria-label={`Panel 3: ${panelLabels[2]}`} aria-expanded={discoveryOpen===2}>{state.discoveries[index]?.includes(2)?<Icon name="check" size={16}/>:<Icon name="orbit" size={16}/>}<span>3</span></button></article>
        </section>
        <Discoveries state={state} page={index} open={discoveryOpen} onInspect={inspect}/>
        <section className={`life-decision ${selected?'decision-made':''}`} aria-labelledby="life-decision-title">
          <div className="life-decision-heading"><span className="life-your-move"><Icon name="bolt" size={17}/> YOUR MOVE, {state.name.toUpperCase()}</span><h2 id="life-decision-title">{chapter.question}</h2><p>Every choice opens something. Every choice asks something.</p></div>
          {!selected&&<p className="work-choice-instruction"><Icon name="orbit" size={15}/> Try an option to preview its trade-off. Your story changes only when you commit.</p>}
          <div className="life-decisions">{chapter.choices.map((choice,i)=><button className={`life-choice ${selected===choice?'is-chosen':''} ${preview===i?'is-previewed':''}`} key={choice.title} disabled={!!selected} aria-pressed={selected===choice||preview===i} aria-controls={!selected&&preview===i?'work-choice-preview':undefined} onClick={event=>{previewChoice.current=event.currentTarget;setPreview(i)}}><span className="life-choice-letter">{selected===choice?<Icon name="check" size={18}/>:String.fromCharCode(65+i)}</span><strong>{choice.title}</strong><span className="life-choice-note">{choice.note}</span><span className="life-choice-arrow" aria-hidden="true">↗</span></button>)}</div>
          {!selected&&preview!==null&&<ChoicePreview state={state} page={index} chapter={chapter} choice={preview} onCommit={()=>act({type:'choose',choice:preview})} onCancel={()=>{setPreview(null);previewChoice.current?.focus()}}/>}
        </section>
        <Notebook key={index} state={state} page={index} act={act} saved={!saveFailed}/>
        {selected&&<section className="life-consequence" key={`${index}-${state.choices[index]}`} aria-labelledby="life-result-title"><div className="life-result-art"><LifeArt scene={chapter.scene} close celebrate/><p className="life-speech">{selected.dialogue}</p></div><div className="life-result-copy"><span className="life-issue">AND SO, SOMETHING CHANGES.</span><h2 id="life-result-title" tabIndex={-1} ref={resultHeading}>{selected.result}</h2><p>{selected.cost}</p><div className="life-effects" aria-label="What changed">{qualities.filter(q=>selected.effects[q.id]).map(q=><span key={q.id} className={(selected.effects[q.id]??0)>0?'effect-gain':'effect-cost'}>{(selected.effects[q.id]??0)>0?'+':''}{selected.effects[q.id]} {q.label}</span>)}</div><div className="life-result-actions"><button className="life-primary" onClick={()=>act({type:'next'})}>{index===chapters.length-1?'See where you arrive':'Turn the page'}<Icon name="arrow"/></button><button className="life-rewrite" onClick={()=>act({type:'rewind',chapter:index})}><Icon name="reset" size={16}/> Try another choice</button></div></div></section>}
      </>}
      <section className="life-baggage" aria-label="What you carry forward"><div><h2>What you carry forward</h2><p>Story signals, not a score for your life.</p></div><div className="life-quality-list">{qualities.map(q=><div key={q.id}><span>{q.label}<b>{scores[q.id]}<small>/12</small></b></span><div className="life-quality-track"><i style={{'--quality':scores[q.id]/12} as CSSProperties}/></div></div>)}</div></section>
      {!finished&&<div className="life-bottom-note"><p><Icon name="map" size={16}/> Your first wish: {dreams.find(d=>d.id===state.dream)?.title.toLowerCase()}.</p><button onClick={()=>act({type:'restart'})}><Icon name="reset" size={15}/> Start a new story</button></div>}
    </>}
    <footer className="life-footer"><Brand small/><span>Read. Decide. Become.</span><button onClick={onPlay}>A different universe? <Icon name="arrow" size={16}/></button></footer>
    <dialog className="work-rewrite-dialog" ref={rewriteDialog} onCancel={()=>setRewrite(null)} aria-labelledby="work-rewrite-title">
      <h2 id="work-rewrite-title">Try a different future?</h2><p>Rewriting page {rewrite===null?'':rewrite+1} replaces its choice and everything after it, including later field notes and discoveries. Earlier pages stay unchanged.</p><div><button className="life-secondary" onClick={()=>setRewrite(null)}>Keep my story</button><button className="life-primary" onClick={()=>{if(rewrite!==null) act({type:'rewind',chapter:rewrite}); setRewrite(null)}}>Rewrite from here <Icon name="reset" size={17}/></button></div>
    </dialog>
  </main>
}
