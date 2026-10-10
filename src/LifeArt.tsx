import { useId } from 'react'
import type { Scene } from './lifeStory'
export { IllustratedLifeArt as LifeArt } from './IllustratedLifeArt'

function Student({x=0,y=0,scale=1,friend=false,pose='wave'}:{x?:number;y?:number;scale?:number;friend?:boolean;pose?:'wave'|'think'|'work'}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} className={friend?'life-person life-friend':'life-person'}>
    <ellipse cx="0" cy="169" rx="49" ry="8" className="art-shadow" />
    <g className="person-arrive">
      <path d="M-27 100 -30 157 -7 157 0 114 8 157 31 157 27 100" className="art-trousers" />
      <path d="m-30 153-13 14q-2 6 7 6h31v-20m14 0v20h36q9-2 2-9l-16-11" className="art-shoes" />
      <path d="M-22 24Q-45 28-47 62l9 49h76l9-49q-3-30-25-38Z" className={friend?'art-shirt-friend':'art-shirt'} />
      <path d="m-13 22 13 16 13-16M0 38v64m-26-40h16v17h-16m38-17h14" className="art-line" />
      <path d="M-11 12v16q11 14 22 0V12" className="art-skin" />
      <g className="person-head"><path d="M-31-21q-1-32 31-35 36 0 32 37l-4 28q-25 27-52 0Z" className="art-skin" />
        <path d={friend?'M-32-2q-16-61 29-61Q40-64 34 0l-13-31q-22 8-41-4l-10 32Z':'M-32-5q-14-14-6-28-8-16 6-22 1-20 20-16 15-15 29-2 22-4 24 14 15 12 2 28l-12 1-6-18q-15 16-40 11l-5 22Z'} className="art-hair" />
        <path d="M-17-11h4m26 0h4" className="art-eyes" /><path d="m0-10-3 12h6m-14 7q11 10 22-1" className="art-line" />
        {friend&&<><circle cx="-14" cy="-10" r="11" className="art-glasses"/><circle cx="14" cy="-10" r="11" className="art-glasses"/><path d="M-3-11h6" className="art-line"/></>}
      </g>
      <path d="m-42 42-16 51 13 6 22-45" className={friend?'art-shirt-friend':'art-shirt'}/><path d="m-58 90 4 17q5 9 12 3l-2-17" className="art-skin"/>
      <g className={pose==='wave'?'person-wave':''}>
        <path d={pose==='think'?'M39 42 54 59 35 20 23 30 40 80 57 72 53 46':'M39 40 63 61 76 20 90 25 77 84Q67 94 56 85L27 62'} className={friend?'art-shirt-friend':'art-shirt'}/>
        <path d={pose==='think'?'m23 30-8-14q-2-9 4-10l13 9 3 8Z':'m76 24-3-20q0-8 5-7l5 12 2-18q4-6 7 0v18l5-11q6-3 5 5l-4 23-8 7Z'} className="art-skin"/>
      </g>
      {!friend&&<><path d="M-25 31q-23 11-15 58" className="art-strap"/><path d="M-45 49q-23 2-24 22v36q15 9 31 2Z" className="art-bag"/></>}
    </g>
  </g>
}
function Plant({x,y}:{x:number;y:number}) { return <g transform={`translate(${x} ${y})`}><path d="M-19 0h38l-5 34h-28Z" className="art-pot"/><path d="M0 0v-56M0-15q-38-1-29-29Q0-44 0-15M0-29q29-5 25-35Q-4-62 0-29" className="art-leaf"/></g> }
function Skyline(){return <g className="art-skyline"><path d="M0 240V131h46v-34h49v143h26V73h62v167h27V118h43v122h35V56h55v184h32V96h51v144h38V129h61v111h35V88h54v152h36V154h50v86"/><path d="M19 157h9m-9 24h9m110-75h10m-10 25h10m-10 26h10m160-70h12m-12 24h12m-12 24h12m84-11h12m-12 24h12m-12 24h12m150-57h12m-12 24h12" className="art-line"/></g>}

// Keep the original vector cast available as a lightweight fallback/reference.
export function SvgLifeArt({scene='campus',close=false,celebrate=false}:{scene?:Scene;close?:boolean;celebrate?:boolean}) {
  const id=useId().replace(/:/g,'')
  return <svg className={`life-art scene-${scene} ${close?'art-close':''}`} viewBox="0 0 640 380" aria-hidden="true">
    <defs><pattern id={id} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" className="art-dot"/></pattern></defs>
    <rect width="640" height="380" className="art-background"/>
    <rect width="640" height="380" fill={`url(#${id})`} opacity=".38"/>
    {close ? <><circle cx="326" cy="210" r="151" className="art-halo"/><path d="m90 62 88 59m-127 41 101 21m322-106-51 54m138 12-92 39m69 113-92-21" className="art-speed"/><Student x={310} y={234} scale={2.1} pose={celebrate?'wave':'think'}/></> : <>
      {(scene==='campus')&&<>
        <circle cx="548" cy="70" r="42" className="art-sun"/>
        <path d="M0 258h640v122H0Z" className="art-ground"/>
        <path d="M19 98 153 49 287 98v160H19Z" className="art-building"/><path d="M0 106 153 37 303 106Z" className="art-roof"/>
        {[56,122,188].map(x=><g key={x}><rect x={x} y="128" width="36" height="58" rx="17" className="art-window"/><path d={`M${x} 158h36m-18-29v55`} className="art-line"/></g>)}
        <path d="M131 258v-48q22-27 44 0v48" className="art-door"/>
        <g transform="rotate(3 450 174)"><rect x="369" y="93" width="159" height="156" rx="5" className="art-board"/><path d="M383 108h130v123H383Z" className="art-cork"/><path d="m394 122 48-5 4 50-49 5Zm62 4 44 5-4 58-44-5Zm-60 64 40-7 8 36-42 5Z" className="art-papers"/><path d="m408 137 21-3m-19 13 17-3m46-2 14 2m-15 9 14 2m-70 44 18-3" className="art-line"/><path d="M388 249v42m120-42v42" className="art-strap"/></g>
        <Plant x={579} y={273}/><Student x={290} y={208} scale={.85}/><Student x={480} y={227} scale={.7} friend/>
        <path d="m42 326 135-29m361 55 63-27" className="art-speed"/>
      </>}
      {scene==='bedroom'&&<>
        <rect x="29" y="28" width="190" height="193" rx="5" className="art-window-night"/><circle cx="165" cy="70" r="26" className="art-moon"/><path d="M122 28v193M29 126h190" className="art-strap"/>
        <path d="M47 181v-35h27v35m16 0v-50h26v50m23 0v-20h41v20" className="art-skyline"/>
        <path d="M380 49h170v98H380Z" className="art-board"/><path d="m399 63 38 4-4 39-40-3m57-35h32v53h-32m45-50h39v30h-39" className="art-papers"/>
        <Student x={320} y={200} scale={1} pose="think"/>
        <path d="M166 291h354v18H166Zm17 18v71m321-71v71" className="art-table"/>
        <path d="m352 286 15-81h104l-14 81Zm-11 0h126v9H341Z" className="art-laptop"/><path d="m403 236 11 8-11 8m-16-16-11 8 11 8" className="art-screen-line"/>
        <path d="m213 276 52 5-3 10h-51m7-19 49 4m-19-16v19" className="art-papers"/>
        <path d="M527 290v-78l-37-31m-21 1 31-15 20 20-38 13Z" className="art-lamp"/><Plant x={586} y={307}/>
      </>}
      {scene==='studio'&&<>
        <path d="M0 270h640v110H0Z" className="art-ground"/><rect x="32" y="34" width="218" height="163" rx="5" className="art-board"/><path d="M52 54h178v120H52Z" className="art-papers"/><path d="M70 141 104 91 133 121 174 71 207 97m-134 63h133" className="art-line"/>
        <path d="M340 53h208v96H340Z" className="art-banner"/><path d="m366 87 23 13-23 13m155-26-23 13 23 13m-54-35-11 43" className="art-line"/>
        <Student x={170} y={203} scale={.8} friend/><Student x={352} y={194} scale={.92}/><Student x={519} y={210} scale={.75} friend pose="think"/>
        <path d="M78 294h505v20H78Zm22 20v66m460-66v66" className="art-table"/><path d="m214 290 13-71h93l-13 71Zm-13 0h117v7H201Z" className="art-laptop"/><path d="m421 284 57-6 6 13-64 6" className="art-papers"/>
      </>}
      {scene==='rain'&&<>
        <Skyline/><path d="M0 265h640v115H0Z" className="art-wet-ground"/>
        <path d="m38 37-12 25m83-10-12 25m72-42-12 25m92-28-12 25m80 7-12 25m97-42-12 25m110-21-12 25m99-25-12 25M46 115l-12 25m78-10-12 25m107-40-12 25m293-22-12 25m98-3-12 25" className="art-rain"/>
        <ellipse cx="322" cy="347" rx="134" ry="12" className="art-puddle"/><path d="M175 163q128-178 258 0-37-23-64 0-43-26-65 0-32-26-63 0-31-22-66 0Z" className="art-umbrella"/><path d="M304 161v83q-7 27-25 6" className="art-strap"/>
        <Student x={295} y={209} scale={.77} pose="think"/><Student x={428} y={229} scale={.63} friend/>
      </>}
      {(scene==='rooftop'||scene==='future')&&<>
        <circle cx="455" cy="102" r="74" className="art-sun"/><Skyline/><path d="M0 247h640v133H0Z" className="art-ground"/>
        <path d="M0 238h640v27H0Zm55 27v61m89-61v61m99-61v61m99-61v61m99-61v61m99-61v61" className="art-railing"/>
        <Student x={267} y={210} scale={.94} pose={celebrate?'wave':'think'}/><Student x={432} y={232} scale={.78} friend/>
        {scene==='rooftop'&&<g className="art-graduation"><path d="m216 142 52-19 51 19-51 18Z" className="art-trousers"/><path d="M310 145v29" className="art-line"/></g>}
        {celebrate&&<g className="art-possibility"><path d="m89 80 65 15-39 17Z" className="art-papers"/><path d="m115 112-6 21 45-38" className="art-line"/><path d="m173 78 12-9m327 111 15-5m-7-10 8 12m-359-37-11 5" className="art-speed"/></g>}
        <Plant x={571} y={307}/>
      </>}
    </>}
  </svg>
}
