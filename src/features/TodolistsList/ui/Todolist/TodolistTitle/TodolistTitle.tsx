import React, { useCallback } from 'react'
import { EditableSpan } from 'common/components'
import { IconButton } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { TodolistDomainType, todolistsThunks } from 'features/TodolistsList/model/todolists/todolistsSlice'
import { useActions } from 'common/hooks/ useActions'

type Props = {
    todolist: TodolistDomainType
}

const TodolistTitle = ({ todolist }: Props) => {
    const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks)
    const { id, title, entityStatus } = todolist

    const removeTodolistHandler = () => {
        removeTodolist(id)
    }

    const changeTodolistTitleHandler = useCallback(
        (title: string) => {
            changeTodolistTitle({ id, title })
        },
        [id],
    )

    return (
        <h3>
            <EditableSpan value={title} onChange={changeTodolistTitleHandler} />
            <IconButton onClick={removeTodolistHandler} disabled={entityStatus === 'loading'}>
                <Delete />
            </IconButton>
        </h3>
    )
}

export default TodolistTitle
