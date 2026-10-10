import './AnimeStoryArt.css'

/** Each atlas cell is square; its viewBox and meet fitting preserve the drawing. */
export default function AnimeStoryArt({ kind, tile, className='' }: { kind:'signal'|'ember'; tile:number; className?:string }) {
  const cell=512
  const x=(tile%4)*cell, y=Math.floor(tile/4)*cell
  return <svg className={`anime-story-art ${className}`} viewBox={`${x+2} ${y+2} ${cell-4} ${cell-4}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-art-tile={tile}>
    <image href={`/art/${kind}-anime-atlas.webp`} width={2048} height={1024} preserveAspectRatio="xMinYMin meet" />
  </svg>
}
