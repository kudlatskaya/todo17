import { appActions } from 'app/app-reducer'
import { createSlice } from '@reduxjs/toolkit'
import { tasksActions } from 'features/TodolistsList/tasks-reducer'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from 'common/utils'
import { authAPI, LoginParamsType } from 'features/auth/authApi'
import { ResultCode } from 'common/enums'
import { BaseResponse } from 'common/types'

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(initializeApp.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    },
})

// thunks
const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
    'auth/initializeApp',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        return thunkTryCatch(thunkAPI, async () => {
            const res = await authAPI.me()

            if (res.data.resultCode === ResultCode.success) {
                return { isLoggedIn: true }
            } else {
                return rejectWithValue(null)
            }
        }).finally(() => {
            dispatch(appActions.setAppInitialized({ isInitialized: true }))
        })
    },
)

const _initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>(
    'auth/initializeApp',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        try {
            const res = await authAPI.me()

            if (res.data.resultCode === ResultCode.success) {
                return { isLoggedIn: true }
            } else {
                return rejectWithValue(null)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        } finally {
            dispatch(appActions.setAppInitialized({ isInitialized: true }))
        }
    },
)

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, { rejectValue: BaseResponse | null }>(
    'auth/login',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))

            const res = await authAPI.login(arg)
            // console.log(res.data.resultCode)
            if (res.data.resultCode === ResultCode.success) {
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                return { isLoggedIn: true }
            } else {
                const isShowAppError = !res.data.fieldsErrors.length
                handleServerAppError(res.data, dispatch, isShowAppError)
                return rejectWithValue(res.data)
            }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    },
)

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, undefined>('auth/logout', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await authAPI.logout()

        if (res.data.resultCode === ResultCode.success) {
            dispatch(tasksActions.clearData())
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))

            return { isLoggedIn: false }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

// types

export const authReducer = slice.reducer
export const authThunks = { login, logout, initializeApp }
