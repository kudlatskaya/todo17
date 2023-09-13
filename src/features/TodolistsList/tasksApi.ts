import { BaseResponse } from 'common/types'
import { instance } from 'common/api/api'
import { UpdateDomainTaskModelType } from 'features/TodolistsList/tasks-reducer'
import { TaskPriorities, TaskStatuses } from 'common/enums'

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<BaseResponse>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    createTask(arg: AddTaskArg) {
        return instance.post<BaseResponse<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {
            title: arg.title,
        })
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<BaseResponse<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
}

export type AddTaskArg = {
    title: string
    todolistId: string
}

export type UpdateTaskArg = {
    todolistId: string
    taskId: string
    domainModel: UpdateDomainTaskModelType
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
