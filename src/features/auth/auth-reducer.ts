import { appActions } from 'app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { tasksActions } from 'features/TodolistsList/tasks-reducer'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authAPI, LoginParamsType } from 'features/auth/authApi'
import { ResultCode } from 'common/enums'

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false,
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    },
})

// thunks

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>('auth/login', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))

        const res = await authAPI.login(arg)

        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { isLoggedIn: true }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

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
export const authActions = slice.actions
export const authThunks = { login, logout }
