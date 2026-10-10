import { describe, expect, it } from 'vitest'
import { chaptersFor, dreams, emptyLife, endingFor, LIFE_KEY, PAGE_COUNT, lifeReducer, qualitiesFor, restoreLife, routeFor, type LifeState } from './careerStory'
import { discoveriesFor } from './careerExploration'

function journey(choices: number[], dream: LifeState['dream'] = 'build') {
  let state = lifeReducer(emptyLife, { type: 'start', name: 'Ari', dream })
  for (const choice of choices) {
    state = lifeReducer(state, { type: 'choose', choice })
    state = lifeReducer(state, { type: 'next' })
  }
  return state
}
describe('a solitary man at a sci-fi career crossroads', () => {
  it('provides three distinct careers, later settings and route-specific endings', () => {
    const expected = [
      { id: 'scholar', scene: 'masters', text: 'admission' },
      { id: 'founder', scene: 'business', text: 'workshop' },
      { id: 'professional', scene: 'job', text: 'badge' },
    ]
    expected.forEach((route, i) => {
      const state = journey([i, 2, 2, 2, 1, 1, 1, 2, 2, 1])
      expect(routeFor(state.choices)).toBe(route.id)
      expect(chaptersFor(state.choices)[1].scene).toBe(route.scene)
      expect(chaptersFor(state.choices)[1].caption.toLowerCase()).toContain(route.text)
      expect(endingFor(state).id).toBe(route.id)
    })
  })
  it('validates 2187 complete ten-page journeys across all wishes and later choices', () => {
    const endings = new Set<string>()
    for (const wish of dreams) for (let encoded = 0; encoded < 3 ** 5; encoded++) for(let suffix=0;suffix<3;suffix++) {
      let value = encoded
      const choices = Array.from({ length: 5 }, () => { const choice = value % 3; value = Math.floor(value / 3); return choice })
      choices.push(...choices.map(choice=>(choice+suffix)%3))
      const state = journey(choices, wish.id)
      expect(state.choices).toHaveLength(PAGE_COUNT)
      expect(restoreLife(JSON.stringify(state))).toEqual(state)
      for (const score of Object.values(qualitiesFor(choices))) {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(12)
      }
      endings.add(endingFor(state).id)
    }
    expect(endings).toEqual(new Set(['scholar', 'founder', 'professional', 'pause']))
  })
  it('keeps exhaustion consequential without declaring a career wrong', () => {
    expect(endingFor(journey([0, 0, 0, 0, 0])).id).toBe('pause')
    expect(endingFor(journey([1, 0, 0, 0, 0])).id).toBe('pause')
    // The steadier job start still exhausts energy after four demanding choices.
    expect(qualitiesFor([2, 0, 0, 0, 0]).energy).toBe(0)
    expect(endingFor(journey([2, 0, 0, 0, 0])).id).toBe('pause')
  })
  it('rewriting the first decision changes all dependent career content', () => {
    const first = journey([0, 2, 2, 2, 1])
    const rewound = lifeReducer(first, { type: 'rewind', chapter: 0 })
    expect(rewound.choices).toEqual([])
    const replaced = lifeReducer(rewound, { type: 'choose', choice: 1 })
    expect(chaptersFor(replaced.choices)[1].scene).toBe('business')
    expect(qualitiesFor(replaced.choices)).toEqual(qualitiesFor([1]))
  })
  it('prevents skipping, duplicate choices, invalid choices and extra chapters', () => {
    const start = journey([])
    expect(lifeReducer(start, { type: 'next' })).toEqual(start)
    for (const choice of [-1, 3, 1.5, NaN]) expect(lifeReducer(start, { type: 'choose', choice })).toEqual(start)
    const chosen = lifeReducer(start, { type: 'choose', choice: 0 })
    expect(lifeReducer(chosen, { type: 'choose', choice: 2 })).toEqual(chosen)
    const end = journey([0, 2, 2, 2, 1, 1, 1, 2, 2, 1])
    expect(lifeReducer(end, { type: 'choose', choice: 1 })).toEqual(end)
    expect(lifeReducer(end, { type: 'next' })).toEqual(end)
  })
  it('rejects malformed saves and isolates the previous student story', () => {
    expect(LIFE_KEY).not.toBe('plottwist.life-comic.v1')
    const valid = journey([0, 1])
    for (const data of [{ ...valid, choices: [9] }, { ...valid, choices: [-1] }, { ...valid, choices: [null] }, { ...valid, choices: Array(11).fill(0) }, { ...valid, dream: 'people' }, { ...valid, name: '' }, { ...valid, started: false }, { ...emptyLife, revealed: true }]) expect(restoreLife(JSON.stringify(data))).toEqual(emptyLife)
    expect(restoreLife('not json')).toEqual(emptyLife)
  })
  it('provides ten distinct pages, three choices and three optional discoveries on each career route',()=>{
    for(const route of [0,1,2]) {
      const pages=chaptersFor([route])
      expect(pages).toHaveLength(10)
      expect(new Set(pages.map(p=>p.title)).size).toBe(10)
      pages.forEach((page,index)=>{
        expect(page.choices).toHaveLength(3)
        expect(discoveriesFor(index,[route])).toHaveLength(3)
        for(const choice of page.choices) { expect(choice.result.length).toBeGreaterThan(50); expect(choice.cost.length).toBeGreaterThan(50) }
      })
    }
    expect(chaptersFor([0])[8].choices[0].result).not.toBe(chaptersFor([1])[8].choices[0].result)
  })
  it('upgrades a five-page save without changing the meaning of its previous choices',()=>{
    const old={version:1,name:'Ari',dream:'build',started:true,choices:[1,2,1,0,2],revealed:false}
    const upgraded=restoreLife(JSON.stringify(old))
    expect(upgraded.version).toBe(2)
    expect(upgraded.choices).toEqual(old.choices)
    expect(upgraded.notes).toEqual({})
    expect(upgraded.discoveries).toEqual({})
    expect(chaptersFor(upgraded.choices)[5].title).toBe('The invitation.')
    expect(lifeReducer(upgraded,{type:'choose',choice:1}).choices).toHaveLength(6)
    expect(restoreLife(JSON.stringify({...old,choices:Array(6).fill(0)}))).toEqual(emptyLife)
  })
  it('saves discoveries and notes independently of decisions and trims them on rewrite',()=>{
    let state=journey([0,2])
    state=lifeReducer(state,{type:'note',page:2,text:'I want a life I can sustain.'})
    state=lifeReducer(state,{type:'discover',page:2,panel:1})
    state=lifeReducer(state,{type:'discover',page:2,panel:1})
    expect(state.choices).toEqual([0,2])
    expect(state.discoveries[2]).toEqual([1])
    expect(restoreLife(JSON.stringify(state))).toEqual(state)
    expect(lifeReducer(state,{type:'note',page:8,text:'skip'})).toEqual(state)
    expect(lifeReducer(state,{type:'discover',page:2,panel:9})).toEqual(state)
    expect(lifeReducer(state,{type:'note',page:2,text:'x'.repeat(2000)}).notes[2]).toHaveLength(1200)
    const rewritten=lifeReducer(state,{type:'rewind',chapter:1})
    expect(rewritten.choices).toEqual([0])
    expect(rewritten.notes).toEqual({})
    expect(rewritten.discoveries).toEqual({})
  })
  it('sanitises untrusted notebook fields without losing valid progress',()=>{
    const state=journey([2])
    const restored=restoreLife(JSON.stringify({...state,notes:{0:'kept',9:'future',1:42},discoveries:{0:[0,1,1,8,'2'],9:[0]}}))
    expect(restored.notes).toEqual({0:'kept'})
    expect(restored.discoveries).toEqual({0:[0,1]})
    expect(restored.choices).toEqual([2])
  })
})
