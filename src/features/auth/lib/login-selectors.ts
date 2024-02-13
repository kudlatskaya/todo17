import { AppRootState } from 'app/store'

export const isLoggedInSelector = (state: AppRootState) => state.auth.isLoggedIn
