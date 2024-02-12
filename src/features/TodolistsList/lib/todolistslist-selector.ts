import { AppRootStateType } from 'app/store'

export const todolistsSelector = (state: AppRootStateType) => state.todolists

export const tasksSelector = (state: AppRootStateType) => state.tasks
export const isLoggedInSelector = (state: AppRootStateType) => state.auth.isLoggedIn
