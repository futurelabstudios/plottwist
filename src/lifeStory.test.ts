import { describe,expect,it } from 'vitest'
import { chapters, dreams, emptyLife, endingFor, lifeReducer, qualitiesFor, restoreLife, type LifeState } from './lifeStory'

function journey(choices:number[],dream:LifeState['dream']='build') {
  let state=lifeReducer(emptyLife,{type:'start',name:'Alex',dream})
  for(const choice of choices) {state=lifeReducer(state,{type:'choose',choice});state=lifeReducer(state,{type:'next'})}
  return state
}
describe('a life shaped by choices',()=>{
  it('reaches an ending for every complete path and aspiration',()=>{
    const endings=new Set<string>()
    for(const dream of dreams) for(let encoded=0;encoded<3**chapters.length;encoded++) {
      let value=encoded
      const choices=chapters.map(()=>{const choice=value%3;value=Math.floor(value/3);return choice})
      const state=journey(choices,dream.id)
      expect(state.choices).toHaveLength(5)
      expect(state.revealed).toBe(false)
      expect(restoreLife(JSON.stringify(state))).toEqual(state)
      for(const score of Object.values(qualitiesFor(state.choices))) expect(score).toBeGreaterThanOrEqual(0)
      endings.add(endingFor(state).id)
    }
    expect(endings.size).toBe(6)
  })
  it('cannot skip consequences, double-submit a choice or advance past the ending',()=>{
    const started=lifeReducer(emptyLife,{type:'start',name:'Alex',dream:'build'})
    expect(lifeReducer(started,{type:'next'})).toEqual(started)
    const chosen=lifeReducer(started,{type:'choose',choice:0})
    expect(lifeReducer(chosen,{type:'choose',choice:2})).toEqual(chosen)
    const end=journey([0,1,2,0,1])
    expect(lifeReducer(end,{type:'choose',choice:1})).toEqual(end)
  })
  it('rewinds consequences and recalculates later outcomes from the replacement path',()=>{
    const first=journey([0,0,0,0,0])
    expect(endingFor(first).id).toBe('pause')
    const rewind=lifeReducer(first,{type:'rewind',chapter:1})
    expect(rewind.choices).toEqual([0])
    expect(qualitiesFor(rewind.choices)).toEqual(qualitiesFor([0]))
    let revised=rewind
    for(const choice of [2,1,1,1]) {revised=lifeReducer(revised,{type:'choose',choice});revised=lifeReducer(revised,{type:'next'})}
    expect(endingFor(revised).id).not.toBe('pause')
  })
  it('rejects malformed or impossible saved stories',()=>{
    const valid=journey([0,1])
    for(const data of [{...valid,choices:[9]},{...valid,choices:[-1]},{...valid,choices:[0,0,0,0,0,0]},{...valid,dream:'fame'},{...valid,name:''},{...valid,started:false},{...emptyLife,revealed:true}]) expect(restoreLife(JSON.stringify(data))).toEqual(emptyLife)
    expect(restoreLife('broken json')).toEqual(emptyLife)
  })
})
