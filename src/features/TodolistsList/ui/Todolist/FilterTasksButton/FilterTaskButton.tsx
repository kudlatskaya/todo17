import React from 'react'
import { Button } from '@mui/material'
import {
    FilterValuesType,
    TodolistDomainType,
    todolistsActions,
} from 'features/TodolistsList/model/todolists/todolistsSlice'
import { useActions } from 'common/hooks/ useActions'
import { ButtonColor } from 'common/types/types'

type Props = {
    todolist: TodolistDomainType
    filter: FilterValuesType
    title: string
    color: ButtonColor
}

const FilterTaskButton = ({ todolist, filter, title, color }: Props) => {
    const { changeTodolistFilter } = useActions(todolistsActions)

    const filterHandler = () => {
        changeTodolistFilter({ id: todolist.id, filter })
    }

    return (
        <Button variant={todolist.filter === filter ? 'outlined' : 'text'} onClick={filterHandler} color={color}>
            {title}
        </Button>
    )
}

export default FilterTaskButton
