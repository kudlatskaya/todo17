import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { authAPI } from 'features/auth/authApi'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { ResultCode } from 'common/enums'

const initialState = {
    status: 'idle' as RequestStatusType,
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
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
            state.isInitialized = action.payload.isInitialized
        },
    },
    // extraReducers: (builder) => {
    //     builder.addCase(initializeApp.fulfilled, (state, action) => {
    //         state.isInitialized = action.payload.isInitialized
    //     })
    // },
})

// const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
//     'app/initializeApp',
//     async (arg, thunkAPI) => {
//         const { dispatch, rejectWithValue } = thunkAPI
//
//         try {
//             const res = await authAPI.me()
//
//             if (res.data.resultCode === ResultCode.success) {
//                 return { isLoggedIn: true }
//             } else {
//                 handleServerAppError(res.data, dispatch)
//                 return rejectWithValue(null)
//             }
//
//             dispatch(appActions.setAppInitialized({ isInitialized: true }))
//         } catch (e: any) {
//             handleServerNetworkError(e, dispatch)
//             return rejectWithValue(null)
//         }
//     },
// )

// export const initializeAppTC = (): AppThunk => (dispatch) => {
//     authAPI.me().then((res) => {
//         if (res.data.resultCode === 0) {
//             dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
//         } else {
//         }
//
//         dispatch(appActions.setAppInitialized({ isInitialized: true }))
//     })
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AppInitialStateType = typeof initialState

export const appReducer = slice.reducer
export const appActions = slice.actions
// export const tasksThunks = { initializeApp }
