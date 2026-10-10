import { describe,expect,it } from 'vitest'
import { commitLab, engineeringChapters, labPage, restoreLab, type LabSave, type LabChoice } from './engineeringStory'
describe('AI engineering learning comic',()=>{
 it('offers four distinct decisions, consequences and applied exercises on all eleven turning points',()=>{
  expect(engineeringChapters).toHaveLength(12)
  for(const c of engineeringChapters.slice(0,11)) {
   expect(new Set(c.labels).size).toBe(4)
   expect(new Set(c.outcomes).size).toBe(4)
   for(const result of c.outcomes)expect(result.length).toBeGreaterThan(100)
   expect(c.exercise.length).toBeGreaterThan(45)
  }
 })
 it('remembers every previous decision and keeps the student name throughout all pages',()=>{
  for(let page=0;page<12;page++)for(let choice=0;choice<4;choice++) {
   const history=Array.from({length:11},()=>choice as LabChoice)
   const story=labPage('Asha',history,page)
   expect(story.scene).toContain('Asha')
   expect(story.scene).not.toContain('{name}')
   if(page>0)expect(story.callback).toContain(engineeringChapters[page-1].outcomes[choice])
  }
 })
 it('rewrites the future while preserving prior choices and notes',()=>{
  const s:LabSave={name:'Asha',history:[0,1,2,3],notes:{0:'keep',1:'current',2:'old future'}}
  expect(commitLab(s,1,3)).toEqual({name:'Asha',history:[0,3],notes:{0:'keep',1:'current'}})
  expect(commitLab(s,8,0)).toBe(s)
  expect(commitLab(s,11,0)).toBe(s)
 })
 it('restores only valid, bounded independent progress',()=>{
  expect(restoreLab(JSON.stringify({name:' Asha ',history:[0,3],notes:{0:'test'}}))).toEqual({name:'Asha',history:[0,3],notes:{0:'test'}})
  for(const v of [null,{name:'',history:[]},{name:'Asha',history:[4]},{name:'Asha',history:[-1]},{name:'Asha',history:[1.5]},{name:'Asha',history:Array(12).fill(0)}])expect(restoreLab(JSON.stringify(v))).toBeNull()
  expect(restoreLab(JSON.stringify({name:'Asha',history:[],notes:{1:4,evil:'ignore',0:'x'.repeat(3000)}}))?.notes).toEqual({0:'x'.repeat(2000)})
 })
})
