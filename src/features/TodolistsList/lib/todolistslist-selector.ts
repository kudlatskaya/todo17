import { AppRootState } from 'app/store'

export const todolistsSelector = (state: AppRootState) => state.todolists

export const tasksSelector = (state: AppRootState) => state.tasks
export const isLoggedInSelector = (state: AppRootState) => state.auth.isLoggedIn
