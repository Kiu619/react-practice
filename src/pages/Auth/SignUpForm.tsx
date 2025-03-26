import React, { useEffect } from 'react'
import { Input, Button, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useRegisterMutation } from '../../store/api/authApi'
import { useDispatch } from 'react-redux'
import { authStart, authSuccess, authFail } from '../../store/slices/userSlice'

interface SignUpFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const SignUpForm: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const password = watch('password')
  
  const [register, { isLoading, error }] = useRegisterMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      const errorMessage = 'data' in error ? String(error.data) : 'Đăng ký thất bại, vui lòng thử lại'
      message.error(errorMessage)
    }
  }, [error])

  const onSubmit = async (data: SignUpFormData) => {
    try {
      dispatch(authStart())
      const result = await register({
        fullName: data.fullName,
        email: data.email,
        password: data.password
      }).unwrap()
      
      dispatch(authSuccess(result.user))
      message.success('Đăng ký thành công!')
      
      // Chuyển hướng về trang chủ
      navigate('/')
    } catch (err) {
      // Lỗi đã được xử lý trong useEffect
      dispatch(authFail('Đăng ký thất bại'))
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-8">Tạo tài khoản mới</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên
          </label>
          <Controller
            name="fullName"
            control={control}
            rules={{ required: 'Họ và tên là bắt buộc' }}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined />}
                placeholder="Nguyễn Văn A"
                size="large"
                status={errors.fullName ? 'error' : ''}
                disabled={isLoading}
              />
            )}
          />
          {errors.fullName && (
            <span className="text-red-500 text-sm">{errors.fullName.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
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
                prefix={<MailOutlined />}
                placeholder="email@example.com"
                size="large"
                status={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
            )}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
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
                status={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
            )}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu
          </label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: 'Vui lòng xác nhận mật khẩu',
              validate: value => 
                value === password || 'Mật khẩu không khớp'
            }}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
                status={errors.confirmPassword ? 'error' : ''}
                disabled={isLoading}
              />
            )}
          />
          {errors.confirmPassword && (
            <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
          )}
        </div>

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large"
          loading={isLoading}
        >
          Đăng ký
        </Button>

        <div className="text-center text-gray-600 mt-4">
          Đã có tài khoản?{' '}
          <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-800">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignUpForm
