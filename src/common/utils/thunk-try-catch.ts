import { AppDispatch, AppRootState } from 'app/store'
import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk'
import { BaseResponse } from 'common/types'
import { handleServerNetworkError } from 'common/utils/handleServerNetworkError'
import { appActions } from 'app/app-reducer'

/**
 * thunkTryCatch - the function implements error handling using try/catch blocks
 * @param thunkAPI
 * @param logic - the function returns promise and called in try block
 */

export const thunkTryCatch = async <T>(
    thunkAPI: BaseThunkAPI<AppRootState, unknown, AppDispatch, null | BaseResponse>,
    logic: () => Promise<T>,
): Promise<T | ReturnType<typeof thunkAPI.rejectWithValue>> => {
    const { dispatch, rejectWithValue } = thunkAPI
    dispatch(appActions.setAppStatus({ status: 'loading' }))
    try {
        return await logic()
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
}
