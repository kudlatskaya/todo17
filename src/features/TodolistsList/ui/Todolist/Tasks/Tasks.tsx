import React from 'react'
import { Task } from 'features/TodolistsList/ui/Todolist/Task/Task'
import { TaskStatuses } from 'common/enums'
import { TodolistDomainType } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { TaskType } from 'features/TodolistsList/api/tasks/taskApiTypes'

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
}

const Tasks = ({ tasks, todolist }: Props) => {
    const { id, filter } = todolist
    let tasksForTodolist = tasks

    if (filter === 'active') {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
    }

    if (filter === 'completed') {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
    }

    return (
        <>
            {tasksForTodolist.map((t) => (
                <Task key={t.id} task={t} todolistId={id} />
            ))}
        </>
    )
}

export default Tasks
