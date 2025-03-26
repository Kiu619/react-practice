import { useSelector } from 'react-redux'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/Auth/Auth'
import Lesson from './pages/Lesson/Lesson'
import NotFound from './pages/NotFound/NotFound'
import Welcome from './pages/Welcome/Welcome'
import { selectCurrentUser } from './store/slices/userSlice'

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
        <Route path="" element={<Welcome />} />
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
