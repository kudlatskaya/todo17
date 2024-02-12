import { UpdateDomainTaskModelType } from 'features/TodolistsList/model/tasks/tasksSlice'
import { TaskPriorities, TaskStatuses } from 'common/enums'

export type DeleteTaskArg = {
    taskId: string
    todolistId: string
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

export type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
