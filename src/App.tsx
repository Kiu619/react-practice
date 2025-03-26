import React from 'react'
import './App.css'
import { Outlet, Route, Routes, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome/Welcome'
import Auth from './pages/Auth/Auth'
import Lesson from './pages/Lesson/Lesson'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './store/slices/userSlice'
import NotFound from './pages/NotFound/NotFound'

function App() {

  const PrivateRoute = ({ user }: { user: any }) => {
    if (!user) {
      return <Navigate to="/auth/sign-in  " replace={true} />
    }   
    return <Outlet />
  }

  const currentUser = useSelector(selectCurrentUser)
  
  return (

    <Routes>
      <Route path='/' element={<PrivateRoute user={currentUser} />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/lesson" element={<Lesson />} />
        <Route path="/lesson/:id" element={<Lesson />} />
      </Route>

      <Route path="/auth/sign-in" element={<Auth />} />
      <Route path="/auth/sign-up" element={<Auth />} />
      <Route path="/auth/forgot-password" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
