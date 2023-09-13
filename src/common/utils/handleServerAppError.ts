import { Dispatch } from 'redux'
import { appActions } from 'app/app-reducer'
import { BaseResponse } from 'common/types'

export const handleServerAppError = <D>(data: BaseResponse<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setAppError({ error: data.messages[0] }))
    } else {
        dispatch(appActions.setAppError({ error: 'Some error occurred' }))
    }
    dispatch(appActions.setAppStatus({ status: 'failed' }))
}
