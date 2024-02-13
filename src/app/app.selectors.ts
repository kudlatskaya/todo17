import { AppRootState } from 'app/store'

export const statusSelector = (state: AppRootState) => state.app.status
export const isInitializedSelector = (state: AppRootState) => state.app.isInitialized
export const isLoggedInSelector = (state: AppRootState) => state.auth.isLoggedIn
