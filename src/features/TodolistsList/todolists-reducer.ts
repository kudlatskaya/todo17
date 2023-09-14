import { appActions, RequestStatusType } from 'app/app-reducer'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { AppThunk } from 'app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ResultCode, tasksActions, tasksThunks } from 'features/TodolistsList/tasks-reducer'
import { todolistsAPI, TodolistType } from 'features/TodolistsList/todolistsApi'
import { createAppAsyncThunk } from 'common/utils'

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
            state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(tasksActions.clearData, () => {
                return []
            })
            .addCase(fetchTodolists.fulfilled, (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
                return action.payload.todolists.map((tl) => ({ ...tl, filter: 'all', entityStatus: 'idle' }))
            })
    },
})

// thunks
const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void>(
    'todolists/fetchTodolists',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.getTodolists()
            let todolists = res.data

            todolists.forEach((tl) => {
                dispatch(tasksThunks.fetchTasks(tl.id))
            })

            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { todolists }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    },
)

// export const fetchTodolistsTC = (): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({ status: 'loading' }))
//         todolistsAPI
//             .getTodolists()
//             .then((res) => {
//                 dispatch(todolistsActions.setTodolists({ todolists: res.data }))
//                 dispatch(appActions.setAppStatus({ status: 'succeeded' }))
//                 return res.data
//             })
//             .then((todos) => {
//                 todos.forEach((tl) => {
//                     dispatch(tasksThunks.fetchTasks(tl.id))
//                 })
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }
// }

export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'loading' }))
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
            dispatch(todolistsActions.changeTodolistTitle({ id, title }))
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
export const todolistsThunks = { fetchTodolists }
