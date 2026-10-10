import { useEffect, useRef } from 'react'
import { Icon } from './components'
import { qualities, qualitiesFor, type LifeAction, type LifeState, type LifeChapter } from './careerStory'
import { discoveriesFor, panelLabels } from './careerExploration'
import './WorkExtras.css'

export function Discoveries({ state, page, open, onInspect }: { state: LifeState; page: number; open: number | null; onInspect: (panel: number) => void }) {
  const seen = state.discoveries[page] ?? []
  const details = discoveriesFor(page, state.choices)
  return <section className="work-discoveries" aria-label="Explore this page">
    <div className="work-discovery-heading"><Icon name="orbit" size={18} /><p><strong>There’s more between the lines.</strong><span>Explore the panels. Nothing here is a right answer.</span></p><small>{seen.length}/3 explored</small></div>
    <div className="work-discovery-tabs">{panelLabels.map((label, panel) => <button key={label} aria-expanded={open === panel} aria-controls={`discovery-${page}`} onClick={() => onInspect(panel)}>{seen.includes(panel) ? <Icon name="check" size={15} /> : <span className="work-discovery-number">{panel + 1}</span>}{label}</button>)}</div>
    {open !== null && <div id={`discovery-${page}`} className="work-discovery-detail" role="status"><span>{panelLabels[open]}</span><p>{details[open]}</p></div>}
  </section>
}

export function ChoicePreview({ state, page, chapter, choice, onCommit, onCancel }: { state: LifeState; page: number; chapter: LifeChapter; choice: number; onCommit: () => void; onCancel: () => void }) {
  const previewTitle=useRef<HTMLHeadingElement>(null)
  useEffect(()=>{previewTitle.current?.focus({preventScroll:true}); previewTitle.current?.scrollIntoView({block:'center',behavior:'instant'})},[choice])
  const target = chapter.choices[choice]
  const before = qualitiesFor(state.choices)
  const after = qualitiesFor([...state.choices, choice])
  return <section id="work-choice-preview" className="work-preview" aria-labelledby="work-preview-title">
    <div><span className="life-issue">BEFORE YOU MAKE IT REAL</span><h3 id="work-preview-title" ref={previewTitle} tabIndex={-1}>{target.title}</h3><p>{target.cost}</p></div>
    <div className="work-preview-signals" aria-label="Possible story signals">{qualities.filter(q => target.effects[q.id]).map(q => <span key={q.id}>{q.label}<strong>{before[q.id]} <span aria-hidden="true">→</span> {after[q.id]}<small>/12</small></strong></span>)}</div>
    <p className="work-preview-note">A preview of this fictional choice—not a guarantee about real life. Explore another option or commit to turn it into your story.</p>
    <div className="work-preview-actions"><button className="life-primary" onClick={onCommit}>Choose this path <Icon name="arrow" size={18} /></button><button className="life-rewrite" onClick={onCancel}>Keep thinking</button></div>
    <span className="work-preview-page">PAGE {String(page + 1).padStart(2, '0')}</span>
  </section>
}

export function Notebook({ state, page, act, saved }: { state: LifeState; page: number; act: (action: LifeAction) => void; saved: boolean }) {
  return <details className="work-notebook">
    <summary><Icon name="book" size={18} /><span>Your field notes</span><small>{state.notes[page] ? 'Note written' : 'Optional · just for you'}</small><span aria-hidden="true">+</span></summary>
    <div><label htmlFor={`field-note-${page}`}>What are you thinking at this point in the story?</label><textarea id={`field-note-${page}`} rows={3} maxLength={1200} value={state.notes[page] ?? ''} placeholder="A reason for your choice. A question. Something you want to remember…" onChange={event => act({ type: 'note', page, text: event.target.value })} /><p>{saved ? 'Kept on this device with your story. Nothing is sent to a server.' : 'Available this session; browser storage could not save this note.'}<span>{(state.notes[page] ?? '').length}/1200</span></p></div>
  </details>
}

export function StoryNotebook({ state, chapters }: { state: LifeState; chapters: LifeChapter[] }) {
  const announcement = useRef<HTMLParagraphElement>(null)
  function download() {
    const text = [`THE LIFE YOU MAKE`, `A story shaped by ${state.name}`, '', ...state.choices.flatMap((choice, page) => [`PAGE ${page + 1} · ${chapters[page].title}`, `Choice: ${chapters[page].choices[choice].title}`, chapters[page].choices[choice].result, ...(state.notes[page] ? [`Your note: ${state.notes[page]}`] : []), ''])].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url; link.download = 'the-life-you-make-notebook.txt'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    if (announcement.current) announcement.current.textContent = 'Your notebook download is ready.'
  }
  return <section className="work-notebook-ending"><div><h2>Keep a piece of this life.</h2><p>Your ten choices and any field notes, in one private notebook.</p></div><button className="life-secondary" onClick={download}><Icon name="book" size={18} /> Save notebook</button><p ref={announcement} role="status" /></section>
}
