import { describe,it,expect } from 'vitest'
import { signalPage, signalChoices, restoreSignal } from './secondStory'
import { chaptersFor } from '../careerStory'

describe('The Last Signal',()=>{
  it('keeps four panels and a personalised captain on every one of 256 journeys',()=>{
    for(let value=0;value<256;value++) {
      let code=value
      const history=Array.from({length:4},()=>{const c=signalChoices[code%4].id;code=Math.floor(code/4);return c})
      for(let page=0;page<5;page++) {
        const story=signalPage('Asha',history.slice(0,page))
        expect(story.panels).toHaveLength(4)
        expect(JSON.stringify(story)).toContain('Asha')
        expect(Boolean(story.ending)).toBe(page===4)
      }
    }
  })
  it('merges the crisis while preserving the first route and the third decision in the ending',()=>{
    const listen=signalPage('Asha',['listen','decode'])
    const rescue=signalPage('Asha',['rescue','decode'])
    expect(listen.title).toBe(rescue.title)
    expect(listen.panels[0]).not.toEqual(rescue.panels[0])
    expect(signalPage('Asha',['listen','decode','rescue','shield']).panels[1]).not.toEqual(signalPage('Asha',['rescue','decode','listen','shield']).panels[1])
    expect(new Set(signalChoices.map(c=>signalPage('Asha',['listen','decode','rescue',c.id]).title)).size).toBe(4)
  })
  it('restores only valid, bounded saved journeys',()=>{
    expect(restoreSignal(JSON.stringify({name:'Asha',history:['listen','decode']}))?.history).toHaveLength(2)
    for(const s of [null,{name:'',history:[]},{name:'Asha',history:['unknown']},{name:'Asha',history:Array(5).fill('listen')}])expect(restoreSignal(JSON.stringify(s))).toBeNull()
  })
})
describe('career scenario continuity',()=>{
  it('adds a concrete twist and practical lesson to all thirty route pages',()=>{
    for(const route of [0,1,2])for(const chapter of chaptersFor([route])) {
      expect(chapter.turningPoint?.length).toBeGreaterThan(50)
      expect(chapter.lesson?.length).toBeGreaterThan(40)
    }
    expect(chaptersFor([1,0])[2].turningPoint).not.toBe(chaptersFor([1,2])[2].turningPoint)
  })
})
