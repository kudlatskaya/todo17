import React from 'react'
import { AppBar, Button, IconButton, LinearProgress, Toolbar, Typography } from '@mui/material'
import { Menu } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { AppRootState } from 'app/store'
import { isLoggedInSelector, statusSelector } from 'app/app.selectors'
import { RequestStatus } from 'app/app-reducer'
import { useActions } from 'common/hooks/ useActions'
import { authThunks } from 'features/auth/model/auth-reducer'

const Header = () => {
    const status = useSelector<AppRootState, RequestStatus>(statusSelector)
    const isLoggedIn = useSelector<AppRootState, boolean>(isLoggedInSelector)
    const { logout } = useActions(authThunks)

    const logoutHandler = () => {
        logout()
    }

    return (
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
    )
}

export default Header