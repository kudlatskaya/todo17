import { appActions, appReducer, AppInitialState } from './app-reducer'

let startState: AppInitialState

beforeEach(() => {
    startState = {
        error: null,
        status: 'idle',
        isInitialized: false,
    }
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, appActions.setAppError({ error: 'some error' }))
    expect(endState.error).toBe('some error')
})

test('correct status should be set', () => {
    const endState = appReducer(startState, appActions.setAppStatus({ status: 'loading' }))
    expect(endState.status).toBe('loading')
})

test('app should be initialized success', () => {
    const endState = appReducer(startState, appActions.setAppInitialized({ isInitialized: true }))
    expect(endState.isInitialized).toBe(true)
})
