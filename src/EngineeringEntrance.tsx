import EngineeringMangaArt from './components/EngineeringMangaArt'
import './EngineeringComic.css'
export function EngineeringEntrance({onEnter}:{onEnter:()=>void}) {
 return <article className="engineering-entrance">
   <div className="engineering-entrance-art"><EngineeringMangaArt tile={0}/><span>ONE STUDENT. ONE ASSISTANT.<br/>A DOZEN WAYS TO LEARN.</span></div>
   <div className="engineering-entrance-copy"><span className="engineering-eyebrow">WORK / AI ENGINEERING COMIC</span><h3>The assistant<br/>you build.</h3><p>A brilliant demo. A wrong answer. Your next decision turns a fragile prototype into a system worth trusting.</p><p>Learn RAG, context, agent loops, and hardening by directing the student’s story.</p><button className="plot-button plot-button-lime" onClick={onEnter}>Enter the AI lab <span aria-hidden="true">↗</span></button><small>12 pages · 4 panels per page · 4 choices at each turning point</small></div>
 </article>
}
