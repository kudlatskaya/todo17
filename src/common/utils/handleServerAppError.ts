import { Dispatch } from 'redux'
import { appActions } from 'app/app-reducer'
import { BaseResponse } from 'common/types'

/**
 * handleServerAppError - error handling function
 * @param data - data that is returned from the server as a result of a request
 * @param dispatch - method that saves data to state
 * @param showError - errors returned from the server
 */

export const handleServerAppError = <D>(data: BaseResponse<D>, dispatch: Dispatch, showError: boolean = true): void => {
    if (showError) {
        if (data.messages.length) {
            dispatch(appActions.setAppError({ error: data.messages[0] }))
        } else {
            dispatch(appActions.setAppError({ error: 'Some error occurred' }))
        }
    }

    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
