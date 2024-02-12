import { BaseResponse } from 'common/types'
import { instance } from 'common/api/api'
import { UpdateTodolistArg } from 'features/TodolistsList/api/todolists/todolistApiTypes'

export const todolistsAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<BaseResponse<{ item: TodolistType }>>('todo-lists', { title: title })
    },
    deleteTodolist(id: string) {
        return instance.delete<BaseResponse>(`todo-lists/${id}`)
    },
    updateTodolist(arg: UpdateTodolistArg) {
        return instance.put<BaseResponse>(`todo-lists/${arg.id}`, { title: arg.title })
    },
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
