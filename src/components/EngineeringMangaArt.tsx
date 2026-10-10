/** Square cells retain their native proportions; diagrams remain live SVG overlays. */
const panels = [
 [0,2,1,6], [2,3,5,6], [4,4,1,6], [2,5,5,6], [6,2,1,6], [7,7,1,6],
 [8,8,9,14], [10,11,9,14], [12,12,9,14], [13,13,1,14], [15,11,9,14], [15,13,14,15]
]
export default function EngineeringMangaArt({page=0,panel=0,tile}:{page?:number;panel?:number;tile?:number}) {
 const scene=tile??panels[page]?.[panel]??0
 const cell=512,x=(scene%4)*cell,y=Math.floor((scene%8)/4)*cell
 return <svg className="engineering-manga" viewBox={`${x+2} ${y+2} 508 508`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" data-manga-scene={scene}>
  <image href={`/art/ai-lab-manga-${scene<8?'foundations':'systems'}.webp`} width={2048} height={1024} preserveAspectRatio="xMinYMin meet" />
 </svg>
}
