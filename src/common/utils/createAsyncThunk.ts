import { createAsyncThunk } from '@reduxjs/toolkit'
import { AppDispatch, AppRootStateType } from 'app/store'
import { BaseResponse } from 'common/types'

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
    state: AppRootStateType
    dispatch: AppDispatch
    rejectValue: null | BaseResponse
}>()
