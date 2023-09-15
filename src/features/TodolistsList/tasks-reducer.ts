import { AppThunk } from 'app/store'
import { appActions } from 'app/app-reducer'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsActions, todolistsThunks } from 'features/TodolistsList/todolists-reducer'
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from 'common/utils'
import { TaskPriorities, TaskStatuses } from 'common/enums'
import { tasksAPI } from 'features/TodolistsList/tasksApi'
import {
    AddTaskArg,
    DeleteTaskArg,
    TaskType,
    UpdateTaskArg,
    UpdateTaskModelType,
} from 'features/TodolistsList/taskApiTypes'

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
        const { dispatch, rejectWithValue } = thunkAPI

        try {
            dispatch(appActions.setAppStatus({ status: 'loading' }))
            const res = await tasksAPI.getTasks(todolistId)
            const tasks = res.data.items
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { tasks, todolistId }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    },
)

const removeTask = createAppAsyncThunk<DeleteTaskArg, DeleteTaskArg>('tasks/removeTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await tasksAPI.deleteTask(arg)

        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { taskId: arg.taskId, todolistId: arg.todolistId }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

// export const removeTaskTC =
//     (taskId: string, todolistId: string): AppThunk =>
//     (dispatch) => {
//         tasksAPI.deleteTask(todolistId, taskId).then((res) => {
//             dispatch(tasksActions.removeTask({ taskId, todolistId }))
//         })
//     }

export enum ResultCode {
    success = 0,
    error = 1,
    captcha = 10,
}

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArg>('tasks/addTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI

    try {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        const res = await tasksAPI.createTask(arg)
        const task = res.data.data.item

        if (res.data.resultCode === ResultCode.success) {
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { task }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

// export const _addTaskTC =
//     (title: string, todolistId: string): AppThunk =>
//     (dispatch) => {
//         dispatch(appActions.setAppStatus({ status: 'loading' }))
//         tasksAPI
//             .createTask(todolistId, title)
//             .then((res) => {
//                 if (res.data.resultCode === 0) {
//                     dispatch(tasksActions.addTask({ task: res.data.data.item }))
//                     dispatch(appActions.setAppStatus({ status: 'succeeded' }))
//                 } else {
//                     handleServerAppError(res.data, dispatch)
//                 }
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }

const updateTask = createAppAsyncThunk<UpdateTaskArg, UpdateTaskArg>('tasks/updateTask', async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI

    try {
        const state = getState()
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId)
        if (!task) {
            //throw new Error("task not found in the state");
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

        if (res.data.resultCode === 0) {
            return { taskId: arg.taskId, domainModel: arg.domainModel, todolistId: arg.todolistId }
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

// export const _updateTaskTC =
//     (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
//     (dispatch, getState: () => AppRootStateType) => {
//         const state = getState()
//         const task = state.tasks[todolistId].find((t) => t.id === taskId)
//         if (!task) {
//             //throw new Error("task not found in the state");
//             console.warn('task not found in the state')
//             return
//         }
//
//         const apiModel: UpdateTaskModelType = {
//             deadline: task.deadline,
//             description: task.description,
//             priority: task.priority,
//             startDate: task.startDate,
//             title: task.title,
//             status: task.status,
//             ...domainModel,
//         }
//
//         todolistsAPI
//             .updateTask(todolistId, taskId, apiModel)
//             .then((res) => {
//                 if (res.data.resultCode === 0) {
//                     dispatch(tasksActions.updateTask({ taskId, model: domainModel, todolistId }))
//                 } else {
//                     handleServerAppError(res.data, dispatch)
//                 }
//             })
//             .catch((error) => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }

// types

export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask }
