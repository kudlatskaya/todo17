import { todolistsAPI, TodolistType } from 'api/todolists-api'
import { appActions, RequestStatusType } from 'app/app-reducer'
import { handleServerNetworkError } from 'utils/error-utils'
import { AppThunk } from 'app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            // return [{ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' }, ...state]
            state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            // return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
            state.forEach((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl))
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
            return state.map((tl) =>
                tl.id === action.payload.id ? { ...tl, entityStatus: action.payload.status } : tl,
            )
        },
        setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
            // debugger
            return action.payload.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
        },
    },
})

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI
            .getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({ todolists: res.data }))
                dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}
export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: 'loading' }))
        todolistsAPI.deleteTodolist(todolistId).then((res) => {
            dispatch(todolistsActions.removeTodolist({ id: todolistId }))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title).then((res) => {
            dispatch(todolistsActions.changeTodolistTitle({ id: id, title: title }))
        })
    }
}

// types

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
