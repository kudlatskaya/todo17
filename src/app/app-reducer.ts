import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
})

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppInitialState = typeof initialState

export const appReducer = slice.reducer
export const appActions = slice.actions
