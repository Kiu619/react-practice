import React, { useEffect } from 'react'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'
import ForgotPasswordForm from './ForgotPasswordForm'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../../store/slices/userSlice'

const Auth: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const isLogin = location.pathname === '/auth/sign-in'
  const isRegister = location.pathname === '/auth/sign-up'
  const isForgotPassword = location.pathname === '/auth/forgot-password'
  
  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/welcome')
    }
  }, [isAuthenticated, navigate])
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      {isLogin && <SignInForm />}
      {isRegister && <SignUpForm />}
      {isForgotPassword && <ForgotPasswordForm />}
    </div>
  )
}

export default Auth
