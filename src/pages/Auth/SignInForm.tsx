import React, { useEffect, useState } from 'react'
import { Input, Button, Checkbox, message, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useLoginMutation } from '../../store/api/authApi'
import { useDispatch } from 'react-redux'
import { authStart, authSuccess, authFail } from '../../store/slices/userSlice'

interface SignInFormData {
  email: string
  password: string
  remember: boolean
}

const SignInForm: React.FC = () => {
  const [loginError, setLoginError] = useState<string | null>(null)
  const { control, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: true
    }
  })

  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onSubmit = async (data: SignInFormData) => {
    try {
      setLoginError(null)
      dispatch(authStart())
      const result = await login({
        email: data.email,
        password: data.password
      }).unwrap()
      
      dispatch(authSuccess(result.user))
      message.success('Đăng nhập thành công!')
      
      // Lưu trạng thái "remember me" nếu được chọn
      if (data.remember) {
        localStorage.setItem('remember_email', data.email)
      } else {
        localStorage.removeItem('remember_email')
      }
      
      // Chuyển hướng về trang chủ
      navigate('/')
    } catch (err: any) {
      // Xử lý thông báo lỗi cụ thể
      let errorMessage = 'Đăng nhập thất bại, vui lòng thử lại'
      
      if (err.data === 'Email hoặc mật khẩu không chính xác') {
        errorMessage = 'Email hoặc mật khẩu không chính xác'
      }
      
      setLoginError(errorMessage)
      dispatch(authFail(errorMessage))
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-8">Đăng nhập vào tài khoản</h2>
      
      {loginError && (
        <Alert
          message={loginError}
          type="error"
          showIcon
          className="mb-4"
        />
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            Email <p className='text-xs text-gray-500'>( nghiakiu@gmail.com )</p>
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email là bắt buộc',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email không hợp lệ'
              }
            }}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined />}
                placeholder="name@company.com"
                size="large"
                status={errors.email || loginError ? 'error' : ''}
                disabled={isLoading}
                onChange={(e) => {
                  field.onChange(e)
                  setLoginError(null) // Xóa thông báo lỗi khi người dùng nhập lại
                }}
              />
            )}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            Mật khẩu <p className='text-xs text-gray-500'>( 123456 )</p>
          </label>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Mật khẩu là bắt buộc',
              minLength: {
                value: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
              }
            }}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
                status={errors.password || loginError ? 'error' : ''}
                disabled={isLoading}
                onChange={(e) => {
                  field.onChange(e)
                  setLoginError(null) // Xóa thông báo lỗi khi người dùng nhập lại
                }}
              />
            )}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <Controller
            name="remember"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} disabled={isLoading}>
                Ghi nhớ đăng nhập
              </Checkbox>
            )}
          />
          <Link to="/auth/forgot-password" className="text-blue-600 hover:text-blue-800">
            Quên mật khẩu?
          </Link>
        </div>

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          loading={isLoading}
        >
          Đăng nhập
        </Button>

        <div className="text-center text-gray-600 mt-4">
          Chưa có tài khoản?{' '}
          <Link to="/auth/sign-up" className="text-blue-600 hover:text-blue-800">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignInForm
