import { useEffect, useRef, useState, type ReactNode } from 'react'
import './BookFrame.css'

/** Retain one outgoing leaf while the next four panels are already underneath. */
export default function BookFrame({ pageKey, children, motion = true }: { pageKey: number; children: ReactNode; motion?: boolean }) {
  const previous = useRef({ pageKey, children, height: 0 })
  const stage = useRef<HTMLDivElement>(null)
  const [leaf, setLeaf] = useState<{ children: ReactNode; backwards: boolean; height: number } | null>(null)
  useEffect(() => {
    if (previous.current.pageKey !== pageKey && motion && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLeaf({ children: previous.current.children, backwards: previous.current.pageKey > pageKey, height: previous.current.height })
    }
    previous.current = { pageKey, children, height: stage.current?.offsetHeight ?? 0 }
  }, [pageKey, children, motion])
  useEffect(() => {
    if (!leaf) return
    const timer = setTimeout(() => setLeaf(null), 1100)
    return () => clearTimeout(timer)
  }, [leaf])
  return <div ref={stage} className="chapter-book" style={leaf ? { minHeight: leaf.height } : undefined}>
    {children}
    <span className="chapter-book-spine" aria-hidden="true" />
    {leaf && <div className={`chapter-book-leaf ${leaf.backwards ? 'is-backwards' : ''}`} aria-hidden="true" inert onAnimationEnd={event => { if (event.target === event.currentTarget) setLeaf(null) }}>
      <div className="chapter-book-front">{leaf.children}<span className="chapter-book-curl" /></div>
      <div className="chapter-book-back"><span>PLOT TWIST<br /><small>Your next chapter.</small></span></div>
    </div>}
  </div>
}
