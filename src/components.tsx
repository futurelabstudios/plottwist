import type { CSSProperties } from 'react'

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    arrow: 'M4 12h16m-6-6 6 6-6 6',
    back: 'M20 12H4m6-6-6 6 6 6',
    play: 'm9 5 11 7-11 7V5Z',
    book: 'M12 6C8 3 4 4 3 5v14c3-2 6-1 9 1 3-2 6-3 9-1V5c-3-2-6-1-9 1Zm0 0v14',
    code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16',
    grid: 'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z',
    check: 'm5 12 4 4L19 6',
    lock: 'M6 10h12v11H6Zm3 0V6a3 3 0 0 1 6 0v4',
    bolt: 'm13 2-9 12h7l-1 8 10-13h-7l0-7Z',
    flag: 'M5 22V3c6-4 8 5 15 0v11c-7 5-9-4-15 0',
    star: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6Z',
    map: 'm3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3V5Zm6-3v17m6-14v17',
    orbit: 'M21 12a9 9 0 1 1-9-9m9 0L3 21m12-18h6v6',
    home: 'm3 10 9-8 9 8v11h-7v-7h-4v7H3V10Z',
    user: 'M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 22v-3a8 8 0 0 1 16 0v3',
    reset: 'M3 11a9 9 0 1 1 2 7M3 4v7h7',
    bulb: 'M9 18h6m-6 3h6M8 15a7 7 0 1 1 8 0c-1 1-1 2-1 3H9c0-1 0-2-1-3Z',
    server: 'M3 3h18v7H3Zm0 11h18v7H3Zm4-7h.1M7 18h.1',
    database: 'M21 5c0 5-18 5-18 0s18-5 18 0Zm0 0v14c0 5-18 5-18 0V5m0 7c0 5 18 5 18 0',
    globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-18 0h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18Z',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v5l3 2',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] ?? paths.code} /></svg>
}
export function Brand({ small = false }: { small?: boolean }) {
  return <span className={small ? 'pt-brand small-brand' : 'pt-brand'}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 5h11v9H2Zm17 0h11v9H19ZM2 19h11v9H2Zm17 0h11v9H19Z" fill="currentColor" /><path d="m8 1 10 15-4 15 10-15L14 1Z" fill="var(--color-lime)" /></svg>plot<span>twist</span><sup>®</sup></span>
}
export function PathArt() {
  return <div className="path-art" aria-hidden="true"><svg viewBox="0 0 500 230"><path d="M60 170h80q30 0 30-30V90q0-30 30-30h90q30 0 30 30v50q0 30 30 30h90" className="path-track" /><path d="M60 170h80q30 0 30-30V90q0-30 30-30h90q30 0 30 30v50q0 30 30 30h90" className="path-active" /></svg>{[{x:12,y:74,icon:'code',label:'Frontend'}, {x:43,y:26,icon:'server',label:'Backend'}, {x:80,y:74,icon:'database',label:'Database'}].map((n,i)=><div className={'art-node node-'+i} style={{'--x':n.x+'%','--y':n.y+'%'} as CSSProperties} key={n.label}><Icon name={n.icon} size={27} /><span>{n.label}</span></div>)}<span className="art-spark">✳</span></div>
}
