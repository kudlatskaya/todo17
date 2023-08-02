import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistsAPI,
    TodolistType,
    UpdateTaskModelType,
} from 'api/todolists-api'
import { AppRootStateType, AppThunk } from 'app/store'
import { appActions } from 'app/app-reducer'
import { handleServerAppError, handleServerNetworkError } from 'utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        removeTask: (state, action: PayloadAction<{ taskId: string; todolistId: string }>) => {
            state = {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].filter(
                    (t) => t.id != action.payload.taskId,
                ),
            }
        },
        addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
            state = {
                ...state,
                [action.payload.task.todoListId]: [action.payload.task, ...state[action.payload.task.todoListId]],
            }
        },
        updateTask: (
            state,
            action: PayloadAction<{ taskId: string; model: UpdateDomainTaskModelType; todolistId: string }>,
        ) => {
            state = {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
                    t.id === action.payload.taskId ? { ...t, ...action.payload.model } : t,
                ),
            }
        },
        setTasks: (state, action: PayloadAction<{ tasks: Array<TaskType>; todolistId: string }>) => {
            state = { ...state, [action.payload.todolistId]: action.payload.tasks }
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state = { ...state, [action.payload.todolist.id]: [] }
        },
        removeTodolist: (state, action: PayloadAction<{ todolistId: string }>) => {
            const _state = { ...state }
            delete _state[action.payload.todolistId]
            return _state
        },
        setTodolists: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
            const _state = { ...state }
            action.payload.todolists.forEach((tl) => {
                _state[tl.id] = []
            })
            return _state
        },
    },
})

// thunks
export const fetchTasksTC =
    (todolistId: string): AppThunk =>
    (dispatch) => {
        dispatch(appActions.setAppStatus({ status: 'loading' }))
        todolistsAPI.getTasks(todolistId).then((res) => {
            const tasks = res.data.items
            dispatch(tasksActions.setTasks({ tasks: tasks, todolistId: todolistId }))
            dispatch(appActions.setAppStatus({ status: 'succeeded' }))
        })
    }
export const removeTaskTC =
    (taskId: string, todolistId: string): AppThunk =>
    (dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
            dispatch(tasksActions.removeTask({ taskId: taskId, todolistId: todolistId }))
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
