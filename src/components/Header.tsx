import { Button } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/userSlice'
import { useDispatch } from 'react-redux'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/sign-in')
  }
  
  return (
    <div className='flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-white p-5 border-b border-gray-200'>
      <Button>
       <Link to='/lesson'>All lessons</Link>
      </Button>
      <h3 className='text-xl font-bold'>
        Bài thực hành react ( ts required )
      </h3>
      <Button
        type="primary"
        className='text-xl'
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  )
}

export default Header
