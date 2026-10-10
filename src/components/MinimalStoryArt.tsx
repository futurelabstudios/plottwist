/** Small vector drawings keep story pages readable and require no image API. */
export default function MinimalStoryArt({ scene = 'crossroads', close = false }: { scene?: string; close?: boolean }) {
  const space = ['signal','ship','archive','bridge','dawn'].includes(scene)
  return <svg className="life-art minimal-story-art" viewBox="0 0 480 270" aria-hidden="true" focusable="false">
    <rect width="480" height="270" rx="10" fill="#161222" />
    <g fill="none" stroke="#66517d" strokeWidth="1.5"><path d="M0 230H480M40 230V130h40v100m20 0V95h60v135m190 0V115h50v115m25 0V70h35v160" /><ellipse cx="240" cy="75" rx="140" ry="35" transform="rotate(-12 240 75)" /></g>
    {space ? <g stroke="#39e4d2" fill="none" strokeWidth="2"><circle cx="365" cy="66" r="24" /><path d="m90 155 95-45 72 45-72 24Zm95-45v69m-65-30h100" /><circle cx="185" cy="149" r="8" fill="#d8fb8d" stroke="none" />{scene==='archive'&&<path d="M285 112h48v70h-48Zm7 15h34m-34 14h34m-34 14h34" />}{scene==='bridge'&&<path d="M55 210q180-100 360 0M55 215h360" />}<path d="M40 55h4m75-20h4m140 15h4m160 62h4" /></g> : <g stroke="#39e4d2" fill="none" strokeWidth="2">{scene==='masters'?<><path d="M290 150v70m-35-70h70m-12-27-53-21 16-40 53 21Z" /><path d="M57 198v-42h54v42m-27-42v42" /></>:scene==='business'?<><path d="M50 210v-55h110v55m-110-55 15-35h80l15 35m-55-35v35" /><rect x="300" y="168" width="70" height="43" rx="6" /><path d="m325 168 20-22 15 22" /></>:scene==='job'?<><rect x="52" y="140" width="110" height="55" rx="5" /><path d="M75 160h25l10 20 20-30h15M75 208h65" /></>:<><path d="M95 218v-44m-25 0h50m-25 0-25-20m25 20 25-20" /><path d="M322 215v-65h42v65m-14-52h4" /></>}</g>}
    <g transform={close?'translate(-80,-80) scale(1.4)':''} stroke="#f2edf7" strokeWidth="2.5" strokeLinecap="round" fill="#211b30"><circle cx="235" cy="145" r="15" /><path d="M225 134q12-15 24 1" stroke="#d8fb8d" /><path d="M216 204v-33q20-19 38 0v33m-29-30v35l-8 24m29-59v35l8 24m-38-56-15 24m53-24 15 24" /></g>
    <circle cx="416" cy="215" r="3" fill="#d8fb8d" />
  </svg>
}
