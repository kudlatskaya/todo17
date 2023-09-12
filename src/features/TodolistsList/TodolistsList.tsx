import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from 'app/store'
import {
    addTodolistTC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType,
    todolistsActions,
} from './todolists-reducer'
import { removeTaskTC, TasksStateType, tasksThunks } from './tasks-reducer'
import { TaskStatuses } from 'api/todolists-api'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from 'components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'hooks/useAppDispatch'
import { isLoggedInSelector, tasksSelector, todolistsSelector } from 'features/TodolistsList/todolistslist-selector'

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(todolistsSelector)

    const tasks = useSelector<AppRootStateType, TasksStateType>(tasksSelector)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(isLoggedInSelector)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        const thunk = fetchTodolistsTC()
        dispatch(thunk)
    }, [])

    const removeTask = useCallback(function (id: string, todolistId: string) {
        const thunk = removeTaskTC(id, todolistId)
        dispatch(thunk)
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({ title, todolistId }))
    }, [])

    const changeStatus = useCallback(function (taskId: string, status: TaskStatuses, todolistId: string) {
        dispatch(tasksThunks.updateTask({ taskId, todolistId, domainModel: { status } }))
    }, [])

    const changeTaskTitle = useCallback(function (taskId: string, newTitle: string, todolistId: string) {
        const thunk = tasksThunks.updateTask(taskId, { title: newTitle }, todolistId)
        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        dispatch(todolistsActions.changeTodolistFilter({ id, filter }))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        const thunk = removeTodolistTC(id)
        dispatch(thunk)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        const thunk = changeTodolistTitleTC(id, title)
        dispatch(thunk)
    }, [])

    const addTodolist = useCallback(
        (title: string) => {
            const thunk = addTodolistTC(title)
            dispatch(thunk)
        },
        [dispatch],
    )

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }

    return (
        <>
            <Grid container style={{ padding: '20px' }}>
                <AddItemForm addItem={addTodolist} />
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
                                    removeTask={removeTask}
                                    changeFilter={changeFilter}
                                    addTask={addTask}
                                    changeTaskStatus={changeStatus}
                                    removeTodolist={removeTodolist}
                                    changeTaskTitle={changeTaskTitle}
                                    changeTodolistTitle={changeTodolistTitle}
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
