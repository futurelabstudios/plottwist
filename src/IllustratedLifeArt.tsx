import type { Scene } from './careerStory'
import './IllustratedLifeArt.css'

const sceneTiles: Record<Scene, number> = {
  crossroads: 0, masters: 1, business: 2, job: 3, setback: 4, future: 5,
}
const atlas = { width: 1774, height: 887, tile: 443.5, inset: 2 }

/** One illustrated cast across every scene; narration remains accessible HTML. */
export function IllustratedLifeArt({ scene = 'crossroads', close = false, celebrate = false }: {
  scene?: Scene; close?: boolean; celebrate?: boolean
}) {
  const tile = close ? (celebrate ? 7 : 6) : sceneTiles[scene]
  const x = (tile % 4) * atlas.tile
  const y = Math.floor(tile / 4) * atlas.tile
  const crop = `${x + atlas.inset} ${y + atlas.inset} ${atlas.tile - atlas.inset * 2} ${atlas.tile - atlas.inset * 2}`
  return <svg className={`life-art life-illustrated scene-${scene} ${close ? 'art-close' : ''}`}
    viewBox={crop} preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false" data-art-tile={tile}>
      <g className="life-camera" style={{ transformOrigin: `${x + atlas.tile / 2}px ${y + atlas.tile / 2}px` }}>
        <image href="/art/life-crossroads-atlas-v2.png" width={atlas.width} height={atlas.height} />
      </g>
    <svg x={x} y={y} width={atlas.tile} height={atlas.tile} viewBox="0 0 640 380" preserveAspectRatio="none" overflow="hidden">
    {scene === 'setback' && !close ? <g className="life-weather" aria-hidden="true">
      {[44, 132, 226, 348, 462, 574].map((left, i) => <path key={left} d={`M${left} ${18 + i * 16}l-7 23 M${left + 27} ${210 + i * 12}l-7 23`} />)}
    </g> : <g className="life-motes" aria-hidden="true">
      <circle cx="86" cy="100" r="2" /><circle cx="525" cy="70" r="2.5" /><circle cx="480" cy="293" r="1.5" />
    </g>}
    </svg>
  </svg>
}
