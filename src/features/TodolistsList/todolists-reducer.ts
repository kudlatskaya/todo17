import { appActions, RequestStatusType } from 'app/app-reducer'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { tasksActions, tasksThunks } from 'features/TodolistsList/tasks-reducer'
import { todolistsAPI, TodolistType } from 'features/TodolistsList/todolistsApi'
import { createAppAsyncThunk } from 'common/utils'
import { UpdateTodolistArg } from 'features/TodolistsList/todolistApiTypee'

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (
            state,
            action: PayloadAction<{ todolistId: string; entityStatus: RequestStatusType }>,
        ) => {
            const index = state.findIndex((todo) => todo.id === action.payload.todolistId)
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
            .addCase(removeTodolist.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(addTodolist.fulfilled, (state, action: PayloadAction<{ todolist: TodolistType }>) => {
                state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
            })
            .addCase(changeTodolistTitle.fulfilled, (state, action: PayloadAction<{ id: string; title: string }>) => {
                const index = state.findIndex((todo) => todo.id === action.payload.id)
                if (index !== -1) state[index].title = action.payload.title
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

const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
    'todolists/removeTodolist',
    async (todolistId, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' }))

            const res = await todolistsAPI.deleteTodolist(todolistId)
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))

            return { id: todolistId }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    },
)

// export const removeTodolistTC = (todolistId: string): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({ status: 'loading' }))
//         dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: 'loading' }))
//         todolistsAPI.deleteTodolist(todolistId).then((res) => {
//             dispatch(todolistsActions.removeTodolist({ id: todolistId }))
//             dispatch(appActions.setAppStatus({ status: 'succeeded' }))
//         })
//     }
// }

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, { title: string }>(
    'todolists/addTodolist',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await todolistsAPI.createTodolist(arg.title)
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))

            return { todolist: res.data.data.item }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    },
)

// const addTodolistTC = (title: string): AppThunk => {
//     return (dispatch) => {
//         dispatch(appActions.setAppStatus({ status: 'loading' }))
//         todolistsAPI.createTodolist(title).then((res) => {
//             dispatch(todolistsActions.addTodolist({ todolist: res.data.data.item }))
//             dispatch(appActions.setAppStatus({ status: 'succeeded' }))
//         })
//     }
// }

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistArg, UpdateTodolistArg>(
    'todolists/changeTodolistTitle',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        const { id, title } = arg

        try {
            let res = await todolistsAPI.updateTodolist({ id, title })
            return { id, title }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    },
)

// export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
//     return (dispatch) => {
//         todolistsAPI.updateTodolist(id, title).then((res) => {
//             dispatch(todolistsActions.changeTodolistTitle({ id, title }))
//         })
//     }
// }

// types

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist }
