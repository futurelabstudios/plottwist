import { describe, expect, it } from 'vitest'
import { emptyLearning, learningReducer, missions, pathFor, restoreLearning, type Profile } from './learning'

const profile: Profile = { name: 'Alex', goal: 'fullstack', experience: 'new' }
const start = () => learningReducer(emptyLearning, { type: 'start', profile })
describe('learning progression', () => {
  it('keeps wrong answers retryable and only awards completion once', () => {
    const wrong = learningReducer(start(), { type: 'answer', missionId: 'web', answer: 0 })
    expect(wrong.completed).toEqual([])
    expect(wrong.attempts.web).toBe(1)
    const solved = learningReducer(wrong, { type: 'answer', missionId: 'web', answer: 1 })
    expect(solved.completed).toEqual(['web'])
    expect(solved.attempts.web).toBe(2)
    expect(learningReducer(solved, { type: 'answer', missionId: 'web', answer: 1 })).toBe(solved)
  })
  it('rejects locked, missing, negative, and non-integer answer submissions', () => {
    const state = start()
    expect(learningReducer(state, { type: 'answer', missionId: 'launch', answer: 0 })).toBe(state)
    for (const answer of [-1, 3, 1.5, NaN]) expect(learningReducer(state, { type: 'answer', missionId: 'web', answer })).toBe(state)
  })
  it('completes each goal in order and restores the result', () => {
    for (const goal of ['frontend', 'fullstack'] as const) {
      let state = learningReducer(emptyLearning, { type: 'start', profile: { ...profile, goal } })
      const path = pathFor(goal)
      for (const mission of path) state = learningReducer(state, { type: 'answer', missionId: mission.id, answer: mission.correct })
      expect(state.completed).toEqual(path.map(m => m.id))
      expect(restoreLearning(JSON.stringify(state))).toEqual(state)
      expect(learningReducer(state, { type: 'answer', missionId: path[path.length - 1].id, answer: 0 })).toBe(state)
    }
  })
  it('rejects damaged or out-of-order stored progress', () => {
    for (const value of [null, '{broken', '{}', JSON.stringify({ ...start(), completed: ['launch'] }), JSON.stringify({ ...start(), completed: ['web', 'web'] }), JSON.stringify({ ...start(), profile: { ...profile, goal: 'invalid' } }), JSON.stringify({ ...start(), attempts: { web: -2 } })]) {
      expect(restoreLearning(value)).toEqual(emptyLearning)
    }
  })
  it('starts a fresh profile deliberately and keeps published state untouched', () => {
    const prior = learningReducer(start(), { type: 'answer', missionId: 'web', answer: 1 })
    const next = learningReducer(prior, { type: 'start', profile: { name: '  Sam  ', goal: 'frontend', experience: 'some' } })
    expect(next.completed).toEqual([])
    expect(next.profile?.name).toBe('Sam')
    expect(prior.completed).toEqual(['web'])
    expect(learningReducer(prior, { type: 'reset' })).toEqual(emptyLearning)
    expect(learningReducer(prior, { type: 'start', profile: { ...profile, name: ' ' } })).toBe(prior)
  })
  it('provides four story panels, an answer, and explanation for every mission', () => {
    for (const m of missions) {
      expect(m.story).toHaveLength(4)
      expect(m.correct).toBeLessThan(m.answers.length)
      expect(m.feedback).toHaveLength(m.answers.length)
      expect(m.explanation.length).toBeGreaterThan(60)
    }
  })
})
