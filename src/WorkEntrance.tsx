import { IllustratedLifeArt } from './IllustratedLifeArt'
import './Cinematic.css'

/** Work-only addition: leaves the surrounding platform and Play UI unchanged. */
export default function WorkEntrance({ onEnter }: { onEnter: () => void }) {
  return <article className="cinema-work-feature">
    <div className="cinema-work-art"><IllustratedLifeArt scene="crossroads" /><span className="cinema-art-caption">The city can keep you alive.<br />What makes a life yours?</span></div>
    <div className="cinema-work-copy">
      <span className="cinema-genre">INTERACTIVE LIFE COMIC</span>
      <h3>The life<br />you make.</h3>
      <p>An impossible sky. A city that has everything. And one person still searching for a reason to begin.</p>
      <p className="cinema-work-paths">Study. Build a business. Take a job.<br />No certain path. One next move.</p>
      <button className="plot-button plot-button-lime" onClick={onEnter}>Enter your next chapter <span aria-hidden="true">↗</span></button>
      <span className="cinema-work-meta">3 career paths · 10 interactive pages · Rewind your choices</span>
    </div>
  </article>
}
