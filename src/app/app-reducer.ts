import { AnyAction, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { todolistsThunks } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'

const initialState = {
    status: 'idle' as RequestStatus,
    error: null as string | null,
    isInitialized: false,
}

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatus }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(isPending, (state) => {
                state.status = 'loading'
            })
            .addMatcher(isRejected, (state, action: AnyAction) => {
                state.status = 'failed'
                if (action.payload) {
                    if (action.type === 'todo/addTodolist/rejected') return

                    state.error = action.payload.messages[0]
                } else {
                    state.error = action.error.message ? action.error.message : 'Some error occurred'
                }
            })
            .addMatcher(isFulfilled, (state) => {
                state.status = 'succeeded'
            })
    },
})

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppInitialState = typeof initialState

export const appReducer = slice.reducer
export const appActions = slice.actions
