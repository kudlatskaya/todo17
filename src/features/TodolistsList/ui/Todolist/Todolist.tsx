import React, { useCallback, useEffect } from 'react'
import { TodolistDomainType } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'
import { AddItemForm } from 'common/components'
import { TaskType } from 'features/TodolistsList/api/tasks/taskApiTypes'
import { useAppDispatch } from 'common/hooks'
import { useActions } from 'common/hooks/ useActions'
import FilterTasksButton from 'features/TodolistsList/ui/Todolist/FilterTasksButton/FilterTasksButton'
import Tasks from 'features/TodolistsList/ui/Todolist/Tasks/Tasks'
import TodolistTitle from 'features/TodolistsList/ui/Todolist/TodolistTitle/TodolistTitle'

type Props = {
    todolist: TodolistDomainType
    tasks: Array<TaskType>
    demo?: boolean
}

export const Todolist = React.memo(function ({ demo = false, todolist, tasks }: Props) {
    const dispatch = useAppDispatch()
    const { addTask } = useActions(tasksThunks)

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

    return (
        <div>
            <TodolistTitle todolist={todolist} />

            <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'} />

            <Tasks todolist={todolist} tasks={tasks} />

            <div style={{ paddingTop: '10px' }}>
                <FilterTasksButton todolist={todolist} filterValues={'all'} title={'All'} color={'inherit'} />
                <FilterTasksButton todolist={todolist} filterValues={'active'} title={'Active'} color={'primary'} />
                <FilterTasksButton
                    todolist={todolist}
                    filterValues={'completed'}
                    title={'Completed'}
                    color={'secondary'}
                />
            </div>
        </div>
    )
})
