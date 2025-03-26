import React, { useState } from 'react'
import { Input, Button, message, Alert } from 'antd'
import { MailOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

interface ForgotPasswordFormData {
  email: string
}

const ForgotPasswordForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (data: ForgotPasswordFormData) => {
    // Giả lập gửi email
    setTimeout(() => {
      message.success('Đã gửi link reset password tới email của bạn')
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Quên mật khẩu?</h2>
      <p className="text-gray-600 text-center mb-8">
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi một link để đặt lại mật khẩu.
      </p>
      
      {isSubmitted ? (
        <Alert
          message="Email đã được gửi!"
          description={
            <div>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới email của bạn. Vui lòng kiểm tra hộp thư đến.
              <div className="mt-4">
                <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-800">
                  Quay lại đăng nhập
                </Link>
              </div>
            </div>
          }
          type="success"
          showIcon
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Địa chỉ email
            </label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Địa chỉ email không hợp lệ'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder="email@example.com"
                  size="large"
                  status={errors.email ? 'error' : ''}
                />
              )}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            size="large"
          >
            Đặt lại mật khẩu
          </Button>

          <div className="text-center text-gray-600 mt-4">
            <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-800">
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}

export default ForgotPasswordForm
