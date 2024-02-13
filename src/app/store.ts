import { tasksReducer } from 'features/TodolistsList/model/tasks/tasksSlice'
import { todolistsReducer } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { appReducer } from './app-reducer'
import { authReducer } from 'features/auth/model/auth-reducer'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        todolists: todolistsReducer,
        app: appReducer,
        auth: authReducer,
    },
})

// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware))

export type AppRootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store
