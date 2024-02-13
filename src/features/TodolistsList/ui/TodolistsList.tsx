import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootState } from 'app/store'
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
    todolistsThunks,
} from 'features/TodolistsList/model/todolists/todolistsSlice'
import { TasksStateType, tasksThunks } from 'features/TodolistsList/model/tasks/tasksSlice'
import { Grid, Paper } from '@mui/material'
import { Todolist } from 'features/TodolistsList/ui/Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { isLoggedInSelector, tasksSelector, todolistsSelector } from 'features/TodolistsList/lib/todolistslist-selector'
import { AddItemForm } from 'common/components'
import { useActions } from 'common/hooks/ useActions'

type Props = {
    demo?: boolean
}

export const TodolistsList: React.FC<Props> = ({ demo = false }) => {
    const todolists = useSelector<AppRootState, Array<TodolistDomainType>>(todolistsSelector)

    const tasks = useSelector<AppRootState, TasksStateType>(tasksSelector)
    const isLoggedIn = useSelector<AppRootState, boolean>(isLoggedInSelector)

    const { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle } = useActions(todolistsThunks)
    // const { removeTask, addTask, updateTask } = useActions(tasksThunks)
    // const { changeTodolistFilter } = useActions(todolistsActions)
    const { changeTodolistFilter, addTask, updateTask } = useActions({
        ...tasksThunks,
        ...todolistsActions,
    })

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [])

    const addTaskCB = useCallback(function (title: string, todolistId: string) {
        addTask({ title, todolistId })
    }, [])

    const changeFilterCB = useCallback(function (filter: FilterValuesType, id: string) {
        changeTodolistFilter({ id, filter })
    }, [])

    const removeTodolistCB = useCallback(function (id: string) {
        removeTodolist(id)
    }, [])

    const changeTodolistTitleCB = useCallback(function (id: string, title: string) {
        changeTodolistTitle({ id, title })
    }, [])

    const addTodolistCB = useCallback((title: string) => {
        addTodolist({ title })
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }

    return (
        <>
            <Grid container style={{ padding: '20px' }}>
                <AddItemForm addItem={addTodolistCB} />
            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {
                    let allTodolistTasks = tasks[tl.id]

                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{ padding: '10px' }}>
                                <Todolist
                                    todolist={tl}
                                    tasks={allTodolistTasks}
                                    changeFilter={changeFilterCB}
                                    addTask={addTaskCB}
                                    removeTodolist={removeTodolistCB}
                                    changeTodolistTitle={changeTodolistTitleCB}
                                    demo={demo}
                                />
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}
