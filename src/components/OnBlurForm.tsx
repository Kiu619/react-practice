import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input, DatePicker, Button } from 'antd'
import { RangePickerProps } from 'antd/es/date-picker'
import dayjs from 'dayjs'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, GlobalOutlined, LinkedinOutlined, FacebookOutlined, CalendarOutlined, UserAddOutlined } from '@ant-design/icons'
const { RangePicker } = DatePicker

interface FormValues {
  username: string
  password: string
  confirmPassword: string
  email: string
  phoneNumber: string
  website: string
  dateOfBirth: dayjs.Dayjs
  firstName: string
  lastName: string
  linkedIn?: string
  facebook?: string
  activeRange: [dayjs.Dayjs, dayjs.Dayjs]
}

const OnBlurForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger
  } = useForm<FormValues>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      phoneNumber: '',
      website: '',
      firstName: '',
      lastName: '',
      linkedIn: '',
      facebook: ''
    }
  })

  const password = watch('password')

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)
  }

  // Range picker validation
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current < dayjs().startOf('day')
  }

  // Date of Birth validation
  const disabledDateOfBirth: RangePickerProps['disabledDate'] = (current) => {
    return current && (
      current < dayjs('1980-01-01').startOf('day') ||
      current > dayjs('2025-12-31').endOf('day')
    )
  }

  return (
    <div className="max-w p-6">
      <p className='font-bold mb-5'>Thực hành validate form - onBlur</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Controller
              name="username"
              control={control}
              rules={{
                required: 'Username is required',
                minLength: {
                  value: 8,
                  message: 'Username must be at least 8 characters'
                },
                validate: (value) => {
                  if (/[A-Z]/.test(value)) {
                    return 'Username cannot contain uppercase letters'
                  }
                  if (/[0-9]/.test(value)) {
                    return 'Username cannot contain numbers'
                  }
                  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return 'Username cannot contain special characters'
                  }
                  return true
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  status={errors.username ? 'error' : ''}
                  className={`w-full border rounded px-3 py-2`}
                  onBlur={() => {
                    field.onBlur()
                    trigger('username')
                  }}
                />
              )}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                validate: (value) => {
                  if (!/[A-Z]/.test(value)) {
                    return 'Password must contain at least one uppercase letter'
                  }
                  if (!/[0-9]/.test(value)) {
                    return 'Password must contain at least one number'
                  }
                  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return 'Password must contain at least one special character'
                  }
                  return true
                }
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Password"
                  prefix={<LockOutlined />}
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.password ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('password')
                    if (watch('confirmPassword')) {
                      trigger('confirmPassword')
                    }
                  }}
                />
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium mb-2">Confirm password</label>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.confirmPassword ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('confirmPassword')
                  }}
                />
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Email address */}
          <div>
            <label className="block text-sm font-medium mb-2">Email address</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<MailOutlined />}
                  placeholder="Email address"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.email ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('email')
                  }}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* PhoneNumber */}
          <div>
            <label className="block text-sm font-medium mb-2">Phone number address</label>
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: 'Phone number is required',
                validate: (value) => {
                  if (!/^0\d{9,}$/.test(value)) {
                    return 'Phone number must start with 0 and have at least 10 digits'
                  }
                  if (/[A-Za-z]/.test(value)) {
                    return 'Phone number cannot contain letters'
                  }
                  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return 'Phone number cannot contain special characters'
                  }
                  return true
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<PhoneOutlined />}
                  placeholder="Phone number address"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.phoneNumber ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('phoneNumber')
                  }}
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium mb-2">Website</label>
            <Controller
              name="website"
              control={control}
              rules={{
                required: 'Website is required',
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                  message: 'Invalid website URL format'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<GlobalOutlined />}
                  placeholder="Website"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.website ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('website')
                  }}
                />
              )}
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <Controller
              name="dateOfBirth"
              control={control}
              rules={{
                required: 'Date of birth is required'
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  prefix={<CalendarOutlined />}
                  placeholder="Select date"
                  format="DD-MM-YYYY"
                  disabledDate={disabledDateOfBirth}
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.dateOfBirth ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('dateOfBirth')
                  }}
                />
              )}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
            )}
          </div>

          {/* First name */}
          <div>
            <label className="block text-sm font-medium mb-2">First name</label>
            <Controller
              name="firstName"
              control={control}
              rules={{
                required: 'First Name is required'
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserAddOutlined />}
                  placeholder="First name"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.firstName ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('firstName')
                  }}
                />
              )}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last name */}
          <div>
            <label className="block text-sm font-medium mb-2">Last name</label>
            <Controller
              name="lastName"
              control={control}
              rules={{
                required: 'Last Name is required'
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<UserAddOutlined />}
                  placeholder="Last name"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.lastName ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('lastName')
                  }}
                />
              )}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium mb-2">LinkedIn</label>
            <Controller
              name="linkedIn"
              control={control}
              rules={{
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]{5,30}[a-zA-Z0-9]$/,
                  message: 'Invalid LinkedIn URL format'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<LinkedinOutlined />}
                  placeholder="LinkedIn"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.linkedIn ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('linkedIn')
                  }}
                />
              )}
            />
            {errors.linkedIn && (
              <p className="text-red-500 text-sm mt-1">{errors.linkedIn.message}</p>
            )}
          </div>

          {/* Facebook */}
          <div>
            <label className="block text-sm font-medium mb-2">Facebook</label>
            <Controller
              name="facebook"
              control={control}
              rules={{
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?facebook\.com\/(profile\.php\?id=\d+|[A-Za-z0-9.]{5,})/,
                  message: 'Invalid Facebook URL format'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  prefix={<FacebookOutlined />}
                  placeholder="Facebook"
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.facebook ? 'error' : ''}
                  onBlur={() => {
                    field.onBlur()
                    trigger('facebook')
                  }}
                />
              )}
            />
            {errors.facebook && (
              <p className="text-red-500 text-sm mt-1">{errors.facebook.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Active range</label>
            <Controller
              name="activeRange"
              control={control}
              rules={{
                required: 'Active range is required'
              }}
              render={({ field }) => (
                <RangePicker
                  {...field}
                  prefix={<CalendarOutlined />}
                  className={`w-full border rounded px-3 py-2`}
                  status={errors.activeRange ? 'error' : ''}
                  disabledDate={disabledDate}
                  format="DD-MM-YYYY"
                  placeholder={['Start date', 'End date']}
                  onBlur={() => {
                    field.onBlur()
                    trigger('activeRange')
                  }}
                />
              )}
            />
            {errors.activeRange && (
              <p className="text-red-500 text-sm mt-1">{errors.activeRange.message}</p>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Button
            type="primary"
            htmlType="submit"
            disabled={!isValid}
            className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded px-6 py-2"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default OnBlurForm
