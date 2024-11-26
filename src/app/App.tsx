import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootState } from './store'
import { authThunks } from 'features/auth/model/auth-reducer'
import { CircularProgress } from '@mui/material'
import { isInitializedSelector } from 'app/app.selectors'
import { ErrorSnackbar } from 'common/components'
import { useActions } from 'common/hooks/ useActions'
import Header from 'app/Header/Header'
import Routing from 'app/Routing/Routing'

type Props = {}

function App({}: Props) {
    const isInitialized = useSelector<AppRootState, boolean>(isInitializedSelector)
    const { initializeApp } = useActions(authThunks)

    useEffect(() => {
        if (isInitialized) initializeApp()
    }, [])

    // if (!isInitialized) {
    //     return (
    //         <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
    //             <CircularProgress />
    //         </div>
    //     )
    // }

    return (
        <div className='App'>
            <ErrorSnackbar />
            <Header />
            <Routing />
        </div>
    )
}

export default App
