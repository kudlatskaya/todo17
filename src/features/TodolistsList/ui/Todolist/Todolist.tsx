import React, { useCallback, useEffect } from 'react'
import { Task } from 'features/TodolistsList/ui/Todolist/Task/Task'
import {
    TodolistDomainType,
    todolistsActions,
    todolistsThunks,
} from 'features/TodolistsList/model/todolists/todolistsSlice'
import { Button, IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'
import { AddItemForm, EditableSpan } from 'common/components'
import { TaskStatuses } from 'common/enums'
import { TaskType } from 'features/TodolistsList/api/tasks/taskApiTypes'
import { useAppDispatch } from 'common/hooks'
import { useActions } from 'common/hooks/ useActions'

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, todolist, tasks }: Props) {
    const dispatch = useAppDispatch()
    const { addTask } = useActions(tasksThunks)
    const { changeTodolistFilter } = useActions(todolistsActions)
    const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(tasksThunks.fetchTasks(todolist.id))
    }, [])

    const addTaskCallback = useCallback(
        (title: string) => {
            addTask({ title, todolistId: todolist.id })
        },
        [todolist.id],
    )

    const removeTodolistHandler = () => {
        removeTodolist(todolist.id)
    }

    const changeTodolistTitleHandler = useCallback(
        (title: string) => {
            changeTodolistTitle({ id: todolist.id, title })
        },
        [todolist.id],
    )

    const allFilterHandler = useCallback(() => changeTodolistFilter({ id: todolist.id, filter: 'all' }), [todolist.id])

    const activeFilterHandler = useCallback(
        () => changeTodolistFilter({ id: todolist.id, filter: 'active' }),
        [todolist.id],
    )

    const completedFilterHandler = useCallback(
        () => changeTodolistFilter({ id: todolist.id, filter: 'completed' }),
        [todolist.id],
    )

    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New)
    }

    if (todolist.filter === 'completed') {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed)
    }

    return (
        <div>
            <h3>
                <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
                <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === 'loading'}>
                    <Delete />
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'} />
            <div>
                {tasksForTodolist.map((t) => (
                    <Task key={t.id} task={t} todolistId={todolist.id} />
                ))}
            </div>
            <div style={{ paddingTop: '10px' }}>
                <Button
                    variant={todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={allFilterHandler}
                    color={'inherit'}>
                    All
                </Button>
                <Button
                    variant={todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={activeFilterHandler}
                    color={'primary'}>
                    Active
                </Button>
                <Button
                    variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={completedFilterHandler}
                    color={'secondary'}>
                    Completed
                </Button>
            </div>
        </div>
    )
})
