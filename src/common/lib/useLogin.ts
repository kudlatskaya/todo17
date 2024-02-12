import { useAppDispatch } from 'common/hooks'
import { FormikHelpers, useFormik } from 'formik'
import { LoginParamsType } from 'features/auth/authApi'
import { authThunks } from 'features/auth/auth-reducer'
import { BaseResponse } from 'common/types'

type FormikErrorType = Partial<Omit<LoginParamsType, 'captcha'>>

export const useLogin = () => {
    const dispatch = useAppDispatch()

    const formik = useFormik({
        validate: (values) => {
            const errors: FormikErrorType = {}

            if (!values.email) {
                errors.email = 'Email is required'
            }
            if (!values.password) {
                errors.password = 'Password is required'
            }
        },
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        onSubmit: (values, formikHelpers: FormikHelpers<LoginParamsType>) => {
            dispatch(authThunks.login(values))
                .unwrap()
                .catch((err: BaseResponse) => {
                    err.fieldsErrors?.forEach((item) => {
                        formikHelpers.setFieldError(item.field, item.error)
                    })
                })
        },
    })

    return { formik }
}
