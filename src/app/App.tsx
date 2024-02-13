import React, { useCallback, useEffect } from 'react'
import { TodolistsList } from 'features/TodolistsList/ui/TodolistsList'
import { useSelector } from 'react-redux'
import { AppRootState } from './store'
import { RequestStatus } from './app-reducer'
import { Route, Routes } from 'react-router-dom'
import { Login } from 'features/auth/ui/Login'
import { authThunks } from 'features/auth/model/auth-reducer'
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography,
} from '@mui/material'
import { Menu } from '@mui/icons-material'
import { isInitializedSelector, isLoggedInSelector, statusSelector } from 'app/app.selectors'
import { ErrorSnackbar } from 'common/components'
import { useActions } from 'common/hooks/ useActions'

type Props = {
    demo?: boolean
}

function App({ demo = false }: Props) {
    const status = useSelector<AppRootState, RequestStatus>(statusSelector)
    const isInitialized = useSelector<AppRootState, boolean>(isInitializedSelector)
    const isLoggedIn = useSelector<AppRootState, boolean>(isLoggedInSelector)
    const { initializeApp, logout } = useActions(authThunks)

    useEffect(() => {
        initializeApp()
    }, [])

    const logoutHandler = useCallback(() => {
        logout()
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
            <AppBar position='static'>
                <Toolbar>
                    <IconButton edge='start' color='inherit' aria-label='menu'>
                        <Menu />
                    </IconButton>
                    <Typography variant='h6'>News</Typography>
                    {isLoggedIn && (
                        <Button color='inherit' onClick={logoutHandler}>
                            Log out
                        </Button>
                    )}
                </Toolbar>
                {status === 'loading' && <LinearProgress />}
            </AppBar>
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
