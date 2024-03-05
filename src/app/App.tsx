import React, { useEffect } from 'react'
import { TodolistsList } from 'features/TodolistsList/ui/TodolistsList'
import { useSelector } from 'react-redux'
import { AppRootState } from './store'
import { Route, Routes } from 'react-router-dom'
import { Login } from 'features/auth/ui/Login'
import { authThunks } from 'features/auth/model/auth-reducer'
import { CircularProgress, Container } from '@mui/material'
import { isInitializedSelector } from 'app/app.selectors'
import { ErrorSnackbar } from 'common/components'
import { useActions } from 'common/hooks/ useActions'
import Header from 'app/Header/Header'

type Props = {
    demo?: boolean
}

function App({ demo = false }: Props) {
    const isInitialized = useSelector<AppRootState, boolean>(isInitializedSelector)
    const { initializeApp } = useActions(authThunks)

    useEffect(() => {
        initializeApp()
    }, [])

    if (!isInitialized) {
        return (
            <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
                <CircularProgress />
            </div>
        )
    }

    return (
        <div className='App'>
            <ErrorSnackbar />
            <Header />
            <Container fixed>
                <Routes>
                    <Route path={'/'} element={<TodolistsList demo={demo} />} />
                    <Route path={'/login'} element={<Login />} />
                </Routes>
            </Container>
        </div>
    )
}

export default App
