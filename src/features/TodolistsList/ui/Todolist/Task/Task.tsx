import React, { ChangeEvent } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { TaskStatuses } from 'common/enums'
import { TaskType } from 'features/TodolistsList/api/tasks/taskApiTypes'
import { EditableSpan } from 'common/components'
import { useActions } from 'common/hooks/ useActions'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'
import s from './Task.module.css'

type Props = {
    task: TaskType
    todolistId: string
}

export const Task = React.memo(({ task, todolistId }: Props) => {
    const { removeTask, updateTask } = useActions(tasksThunks)

    const removeTaskHandler = () => removeTask({ taskId: task.id, todolistId })

    const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({
            taskId: task.id,
            todolistId,
            domainModel: { status },
        })
    }

    const changeTaskTitleHandler = (title: string) =>
        updateTask({ taskId: task.id, todolistId, domainModel: { title } })

    return (
        <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ''}>
            <Checkbox
                checked={task.status === TaskStatuses.Completed}
                color='primary'
                onChange={changeTaskStatusHandler}
            />

            <EditableSpan value={task.title} onChange={changeTaskTitleHandler} />
            <IconButton onClick={removeTaskHandler}>
                <Delete />
            </IconButton>
        </div>
    )
})
