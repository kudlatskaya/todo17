import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { TodolistsList } from 'features/TodolistsList/ui/TodolistsList'
import { Login } from 'features/auth/ui/Login'
import { Container } from '@mui/material'

type Props = {
    demo?: boolean
}

const Routing = ({ demo = false }: Props) => {
    return (
        <Container fixed>
            <Routes>
                <Route path={'/'} element={<TodolistsList demo={demo} />} />
                <Route path={'/login'} element={<Login />} />
            </Routes>
        </Container>
    )
}

export default Routing
