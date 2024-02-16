export type FieldErrorType = {
    error: string
    field: string
}

//❗ Чтобы у нас не было пересечения имен наовем общий тип BaseResponseType
export type BaseResponse<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
    fieldsErrors: FieldErrorType[]
}

export type ButtonColor = 'error' | 'inherit' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | undefined
