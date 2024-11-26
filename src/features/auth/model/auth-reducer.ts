import { appActions, RequestStatus } from 'app/app-reducer'
import { AnyAction, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { tasksActions } from 'features/TodolistsList/model/tasks/tasksSlice'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from 'common/utils'
import { authAPI } from 'features/auth/api/authApi'
import { ResultCode } from 'common/enums'
import { BaseResponse } from 'common/types'
import { LoginParamsType } from 'features/auth/api/auth.types'

const initialState = {
    isLoggedIn: false,
}

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(
            isAnyOf(authThunks.login.fulfilled, authThunks.logout.fulfilled, authThunks.initializeApp.fulfilled),
            (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            },
        )
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

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, { rejectValue: BaseResponse | null }>(
    'auth/login',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))

            const res = await authAPI.login(arg)
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
export type AuthInitialState = typeof initialState

export const authReducer = slice.reducer
export const authThunks = { login, logout, initializeApp }
