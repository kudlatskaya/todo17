import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Login } from 'features/auth/ui/Login'
import { Container } from '@mui/material'
import { TodolistsList } from 'features/TodolistsList/ui/TodolistsList'

type Props = {}

const Routing = ({}: Props) => {
    return (
        <Container fixed>
            <Routes>
                <Route path={'/'} element={<TodolistsList demo={false} />} />
                <Route path={'/login'} element={<Login />} />
            </Routes>
        </Container>
    )
}

export default Routing
