import { getters, actions, mutations } from '../../../../src/store/modules/panoramas-list'
import { testAction } from '../main.spec'
const {
  isPanoramasListActive
} = getters
const {
  showPanoramasList,
  togglePanoramasList,
  closePanoramasList
} = actions
const {
  SET_PANORAMAS_LIST_ACTIVE
} = mutations

describe('store/modules/panoramas-list', () => {
  it('isPanoramasListActive', () => {
    const state = {
      isPanoramasListActive: false
    }
    const result = isPanoramasListActive(state, { isPanoramasListActive })
    expect(result).toEqual(false)
  })

  it('showPanoramasList', done => {
    const state = {
      isPanoramasListActive: false
    }
    testAction(showPanoramasList, undefined, state, [
      { type: 'SET_PANORAMAS_LIST_ACTIVE', payload: true }
    ], undefined, done)
  })

  it('togglePanoramasList', done => {
    const state = {
      isPanoramasListActive: false
    }
    testAction(togglePanoramasList, undefined, state, undefined, [
      { type: 'showPanoramasList' }
    ], done)

    state.isPanoramasListActive = true
    testAction(togglePanoramasList, undefined, state, undefined, [
      { type: 'closePanoramasList' }
    ], done)
  })

  it('closePanoramasList', done => {
    const state = {
      isPanoramasListActive: true
    }
    testAction(closePanoramasList, undefined, state, [
      { type: 'SET_PANORAMAS_LIST_ACTIVE', payload: false }
    ], undefined, done)
  })

  it('SET_PANORAMAS_LIST_ACTIVE', () => {
    const state = {
      isPanoramasListActive: false
    }
    SET_PANORAMAS_LIST_ACTIVE(state, true)
    expect(state.isPanoramasListActive)
      .toEqual(true)
  })
})
