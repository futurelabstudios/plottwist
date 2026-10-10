import { describe, expect, it } from 'vitest'
import { choices, continuation, initialState, opening, reducer } from './story'
describe('offline story', () => {
  it('has exactly four panels for each fixture', () => {
    expect(opening).toHaveLength(4)
    choices.forEach(c => expect(continuation(c.id)).toHaveLength(4))
  })
  it('preserves branch consequences and ignores duplicate orders', () => {
    const start = reducer(initialState, { type: 'start', name: 'Ada' })
    const states = choices.map(c => reducer(start, { type: 'choose', branch: c.id }))
    expect(new Set(states.map(s => s.shipEnergy)).size).toBe(3)
    states.forEach(s => {
      expect(s.page).toBe(2)
      expect(s.name).toBe('Ada')
      expect(reducer(s, { type: 'choose', branch: 'scan' })).toEqual(s)
      expect(reducer(s, { type: 'reset' })).toEqual(initialState)
    })
  })
})
