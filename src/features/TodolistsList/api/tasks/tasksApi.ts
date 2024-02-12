import { BaseResponse } from 'common/types'
import { instance } from 'common/api/api'
import {
    AddTaskArg,
    DeleteTaskArg,
    GetTasksResponse,
    TaskType,
    UpdateTaskModelType,
} from 'features/TodolistsList/api/tasks/taskApiTypes'

export const tasksAPI = {
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    deleteTask(arg: DeleteTaskArg) {
        return instance.delete<BaseResponse>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`)
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
