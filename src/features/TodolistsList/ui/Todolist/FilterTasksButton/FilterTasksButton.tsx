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
    filterValues: FilterValuesType
    title: string
    color: ButtonColor
}

const FilterTasksButton = ({ todolist, filterValues, title, color }: Props) => {
    const { id, filter } = todolist
    const { changeTodolistFilter } = useActions(todolistsActions)

    const filterHandler = () => {
        changeTodolistFilter({ id, filter: filterValues })
    }

    return (
        <Button variant={filter === filterValues ? 'outlined' : 'text'} onClick={filterHandler} color={color}>
            {title}
        </Button>
    )
}

export default FilterTasksButton
