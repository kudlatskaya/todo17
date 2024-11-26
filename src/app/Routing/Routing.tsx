import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Todolist from 'features/TodolistsList/ui/Todolist/Todolist'
import { Login } from 'features/auth/ui/Login'
import { Container } from '@mui/material'

type Props = {}

const Routing = ({}: Props) => {
    return (
        <Container fixed>
            <Routes>
                <Route path={'/'} element={<Todolist demo={false} />} />
                <Route path={'/login'} element={<Login />} />
            </Routes>
        </Container>
    )
}

export default Routing
