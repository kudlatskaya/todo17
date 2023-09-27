import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from 'app/store'
import { FilterValuesType, TodolistDomainType, todolistsActions, todolistsThunks } from './todolists-reducer'
import { TasksStateType, tasksThunks } from './tasks-reducer'
import { Grid, Paper } from '@mui/material'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { isLoggedInSelector, tasksSelector, todolistsSelector } from 'features/TodolistsList/todolistslist-selector'
import { TaskStatuses } from 'common/enums'
import { AddItemForm } from 'common/components'
import { useActions } from 'common/hooks/ useActions'

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(todolistsSelector)

    const tasks = useSelector<AppRootStateType, TasksStateType>(tasksSelector)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(isLoggedInSelector)

    const { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle } = useActions(todolistsThunks)
    // const { removeTask, addTask, updateTask } = useActions(tasksThunks)
    // const { changeTodolistFilter } = useActions(todolistsActions)
    const { changeTodolistFilter, addTask, updateTask, removeTask } = useActions({
        ...tasksThunks,
        ...todolistsActions,
    })

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        fetchTodolists()
    }, [])

    const removeTaskCB = useCallback(function (taskId: string, todolistId: string) {
        removeTask({ taskId, todolistId })
    }, [])

    const addTaskCB = useCallback(function (title: string, todolistId: string) {
        addTask({ title, todolistId })
    }, [])

    const changeStatusCB = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        updateTask({ taskId, todolistId, domainModel: { status } })
    }, [])

    const changeTaskTitleCB = useCallback(function (taskId: string, title: string, todolistId: string) {
        updateTask({ taskId, todolistId, domainModel: { title } })
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
                                    removeTask={removeTaskCB}
                                    changeFilter={changeFilterCB}
                                    addTask={addTaskCB}
                                    changeTaskStatus={changeStatusCB}
                                    removeTodolist={removeTodolistCB}
                                    changeTaskTitle={changeTaskTitleCB}
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
