import { appActions } from 'app/app-reducer'
import { createSlice } from '@reduxjs/toolkit'
import { todolistsThunks } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError, thunkTryCatch } from 'common/utils'
import { ResultCode, TaskPriorities, TaskStatuses } from 'common/enums'
import { tasksAPI } from 'features/TodolistsList/api/tasks/tasksApi'
import {
    AddTaskArg,
    DeleteTaskArg,
    TaskType,
    UpdateTaskArg,
    UpdateTaskModelType,
} from 'features/TodolistsList/api/tasks/taskApiTypes'

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        clearData: () => {
            return {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(removeTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
                if (index !== -1) state[action.payload.todolistId].splice(index, 1)
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
                let task = state[action.payload.todolistId][index]
                if (index !== -1) state[action.payload.todolistId][index] = { ...task, ...action.payload.domainModel }
            })
            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
    },
})

// thunks

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
    'tasks/fetchTasks',
    async (todolistId, thunkAPI) => {
        return thunkTryCatch(thunkAPI, async () => {
            const res = await tasksAPI.getTasks(todolistId)
            const tasks = res.data.items

            return { tasks, todolistId }
        })
    },
)

const removeTask = createAppAsyncThunk<DeleteTaskArg, DeleteTaskArg>('tasks/removeTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
        const res = await tasksAPI.deleteTask(arg)

        if (res.data.resultCode === ResultCode.success) {
            return { taskId: arg.taskId, todolistId: arg.todolistId }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })
})

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArg>('tasks/addTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
        const res = await tasksAPI.createTask(arg)
        const task = res.data.data.item

        if (res.data.resultCode === ResultCode.success) {
            return { task }
        } else {
            handleServerAppError(res.data, dispatch, false)
            return rejectWithValue(res.data)
        }
    })
})

const updateTask = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>('tasks/updateTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI

    return thunkTryCatch(thunkAPI, async () => {
        const state = getState()
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
        if (!task) {
            console.warn('task not found in the state')
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel,
        }

        const res = await tasksAPI.updateTask(arg.todolistId, arg.taskId, apiModel)

        if (res.data.resultCode === ResultCode.success) {
            return { taskId: arg.taskId, domainModel: arg.domainModel, todolistId: arg.todolistId }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    })
})

// types

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = Record<string, TaskType[]>

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask }
