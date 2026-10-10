import Brand from './components/Brand'
import { Icon } from './components'
import WorkComic from './WorkComic'
import { lazy, Suspense } from 'react'
const EngineeringComic = lazy(() => import('./EngineeringComic'))
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import './Cinematic.css'

export default function WorkScreen({ onExit, engineering = false, onSwitch }: { onExit: () => void; engineering?: boolean; onSwitch: (engineering: boolean) => void }) {
  return <div className="cinematic-work">
    <header className="cinema-header">
      <button className="cinema-brand" onClick={onExit} aria-label="PlotTwist home"><Brand /></button>
      <nav aria-label="Story modes">
        <button onClick={onExit}><Icon name="play" size={16} /> Play</button>
        <button aria-current="page"><Icon name="bolt" size={16} /> Work</button>
      </nav>
      <button className="cinema-home" onClick={onExit}><Icon name="back" size={16} /> All stories</button>
    </header>
    <nav className="work-library-switch" aria-label="Work comics">
      <button aria-current={!engineering ? 'page' : undefined} onClick={() => onSwitch(false)}>The life you make <span>Career decisions</span></button>
      <button aria-current={engineering ? 'page' : undefined} onClick={() => onSwitch(true)}>The assistant you build <span>AI engineering</span></button>
    </nav>
    {engineering ? <Suspense fallback={<p className="engineering-loading" role="status">Opening the AI lab…</p>}><EngineeringComic /></Suspense> : <WorkComic active onPlay={onExit} />}
  </div>
}
