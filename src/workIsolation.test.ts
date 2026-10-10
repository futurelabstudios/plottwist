import { describe, expect, it } from 'vitest'
import cinematic from './Cinematic.css?raw'
import tokens from '../tokens.css?raw'
import platform from './platform/Platform.tsx?raw'
import bootstrap from './main.tsx?raw'

describe('Work ownership boundary', () => {
  it('does not override the platform, Play, shared brand, or document styles', () => {
    expect(cinematic).not.toMatch(/\.plot-platform|\.comic-main|(?:^|\n)\s*(?:html|body|:root|\.pt-brand)\b/)
    expect(tokens).not.toContain(':root')
  })

  it('adds its entrance only inside the existing Work section', () => {
    const entrance = platform.indexOf('<WorkEntrance onEnter={onWork} />')
    expect(entrance).toBeGreaterThan(platform.indexOf('<section id="work"'))
    expect(entrance).toBeLessThan(platform.indexOf('<section id="how"'))
    expect(platform).not.toContain('Cinematic.css')
  })

  it('keeps Work-specific imports out of the shared bootstrap', () => {
    expect(bootstrap).not.toMatch(/Cinematic|WorkComic|fontsource|tokens\.css/)
  })
})
