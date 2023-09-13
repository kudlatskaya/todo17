import { BaseResponse } from 'common/types'
import { instance } from 'common/api/api'
import { AddTaskArg, GetTasksResponse, TaskType, UpdateTaskModelType } from 'features/TodolistsList/taskApiTypes'

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
