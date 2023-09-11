import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from 'api/todolists-api'
import { AppDispatch, AppRootStateType, AppThunk } from 'app/store'
import { appActions } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { todolistsActions } from 'features/TodolistsList/todolists-reducer'
import { createAppAsyncThunk } from 'utils/createAsyncThunk'

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
            const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
            if (index !== -1) state[action.payload.todolistId].splice(index, 1)
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTask: (
            state,
            action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>,
        ) => {
            const index = state[action.payload.todolistId].findIndex((t) => t.id === action.payload.taskId)
            let task = state[action.payload.todolistId][index]
            if (index !== -1) state[action.payload.todolistId][index] = { ...task, ...action.payload.model }
        },
        clearData: () => {
            return {}
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(todolistsActions.addTodolist, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(todolistsActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todolistsActions.setTodolists, (state, action) => {
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
            const res = await todolistsAPI.getTasks(todolistId)
            const tasks = res.data.items
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
            return { tasks, todolistId }
        } catch (e: any) {
            handleServerNetworkError(e, dispatch)
            return rejectWithValue(null)
        }
    },
)

export const removeTaskTC =
    (taskId: string, todolistId: string): AppThunk =>
    (dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
            dispatch(tasksActions.removeTask({ taskId, todolistId }))
        })
    }

export const addTaskTC =
    (title: string, todolistId: string): AppThunk =>
    (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI
            .createTask(todolistId, title)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(tasksActions.addTask({ task: res.data.data.item }))
                    dispatch(appActions.setAppStatus({ status: 'succeeded' }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
export const updateTaskTC =
    (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string): AppThunk =>
    (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find((t) => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel,
        }

        todolistsAPI
            .updateTask(todolistId, taskId, apiModel)
            .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(tasksActions.updateTask({ taskId, model: domainModel, todolistId }))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }

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
export const tasksThunks = { fetchTasks }
// export const tasksActions = slice.actions
