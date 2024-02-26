import { RequestStatus } from 'app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { tasksActions, tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'
import { todolistsAPI, TodolistType } from 'features/TodolistsList/api/todolists/todolistsApi'
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from 'common/utils'
import { UpdateTodolistArg } from 'features/TodolistsList/api/todolists/todolistApiTypes'
import { ResultCode } from 'common/enums'

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
            action: PayloadAction<{ todolistId: string; entityStatus: RequestStatus }>,
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

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, undefined>(
    'todolists/fetchTodolists',
    async () => {
        const res = await todolistsAPI.getTodolists()
        return { todolists: res.data }
    },
)

const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
    'todolists/removeTodolist',
    async (todolistId, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        return thunkTryCatch(thunkAPI, async () => {
            dispatch(todolistsActions.changeTodolistEntityStatus({ todolistId, entityStatus: 'loading' }))

            const res = await todolistsAPI.deleteTodolist(todolistId)
            if (res.data.resultCode === ResultCode.success) {
                return { id: todolistId }
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        })
    },
)

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
    'todolists/addTodolist',
    async (title, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI

        const res = await todolistsAPI.createTodolist(title)

        if (res.data.resultCode === ResultCode.success) {
            return { todolist: res.data.data.item }
        } else {
            return rejectWithValue(res.data)
        }
    },
)

const changeTodolistTitle = createAppAsyncThunk<UpdateTodolistArg, UpdateTodolistArg>(
    'todolists/changeTodolistTitle',
    async (arg, thunkAPI) => {
        const { dispatch, rejectWithValue } = thunkAPI
        const { id, title } = arg

        return thunkTryCatch(thunkAPI, async () => {
            let res = await todolistsAPI.updateTodolist({ id, title })

            if (res.data.resultCode === ResultCode.success) {
                return { id, title }
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        })
    },
)

// types

export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatus
}

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle }
