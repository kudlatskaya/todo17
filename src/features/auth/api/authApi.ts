import { instance } from 'common/api/api'
import { BaseResponse } from 'common/types'
import { LoginParamsType } from 'features/auth/api/auth.types'

export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<BaseResponse<{ userId?: number }>>('auth/login', data)
    },
    logout() {
        return instance.delete<BaseResponse<{ userId?: number }>>('auth/login')
    },
    me() {
        return instance.get<BaseResponse<{ id: number; email: string; login: string }>>('auth/me')
    },
}
