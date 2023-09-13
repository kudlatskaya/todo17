import { appActions } from 'app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from 'app/store'
import { tasksActions } from 'features/TodolistsList/tasks-reducer'
import { handleServerAppError, handleServerNetworkError } from 'common/utils'
import { authAPI, LoginParamsType } from 'features/auth/authApi'

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
})

// thunks
export const loginTC =
    (data: LoginParamsType): AppThunk =>
    (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        authAPI
            .login(data)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(authActions.setIsLoggedIn({ isLoggedIn: true }))
                    dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    authAPI
        .logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({ isLoggedIn: false }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                dispatch(tasksActions.clearData())
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}

// types

export const authReducer = slice.reducer
export const authActions = slice.actions
