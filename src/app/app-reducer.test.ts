import { appActions, appReducer, InitialStateType } from './app-reducer'

let startState: InitialStateType

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
