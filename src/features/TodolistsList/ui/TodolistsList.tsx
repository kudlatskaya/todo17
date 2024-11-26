import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootState } from 'app/store'
import { TodolistDomainType, todolistsThunks } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { TasksStateType } from 'features/TodolistsList/model/tasks/tasksSlice'
import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'
import { isLoggedInSelector, tasksSelector, todolistsSelector } from 'features/TodolistsList/lib/todolistslist-selector'
import { AddItemForm } from 'common/components'
import { useActions } from 'common/hooks/ useActions'
import { TodoList } from './Todolist/Todolist'

type Props = {
    demo?: boolean
}

export const TodolistsList: React.FC<Props> = ({ demo = false }) => {
    const todolists = useSelector<AppRootState, Array<TodolistDomainType>>(todolistsSelector)

    const tasks = useSelector<AppRootState, TasksStateType>(tasksSelector)
    const isLoggedIn = useSelector<AppRootState, boolean>(isLoggedInSelector)

    const { fetchTodolists, addTodolist } = useActions(todolistsThunks)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [])

    const addTodolistCallback = useCallback((title: string) => {
        return addTodolist(title).unwrap()
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }

    return (
        <>
            {/* TODO: fix inline style */}
            <Grid container style={{ padding: '20px' }}>
                <AddItemForm addItem={addTodolistCallback} />
            </Grid>
            <Grid container spacing={3}>
                {todolists.map((tl) => {
                    let allTodolistTasks = tasks[tl.id]

                    return (
                        <Grid item key={tl.id}>
                            <Paper style={{ padding: '10px' }}>
                                <TodoList todolist={tl} tasks={allTodolistTasks} demo={demo} />
                            </Paper>
                        </Grid>
                    )
                })}
            </Grid>
        </>
    )
}
