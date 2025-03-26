import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

// Khai báo interface cho người dùng
export interface User {
  id: number
  fullName: string
  email: string
}

// Khai báo interface cho trạng thái
export interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Trạng thái ban đầu
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null
}

// Tạo slice cho user
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Bắt đầu đăng nhập/đăng ký
    authStart: (state) => {
      state.loading = true
      state.error = null
    },
    
    // Đăng nhập/đăng ký thành công
    authSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false
      state.isAuthenticated = true
      state.currentUser = action.payload
      state.error = null
    },
    
    // Đăng nhập/đăng ký thất bại
    authFail: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.isAuthenticated = false
      state.currentUser = null
      state.error = action.payload
    },
    
    // Đăng xuất
    logout: (state) => {
      state.isAuthenticated = false
      state.currentUser = null
      state.error = null
    },
    
    // Xóa thông báo lỗi
    clearError: (state) => {
      state.error = null
    }
  }
})

// Export các actions
export const { authStart, authSuccess, authFail, logout, clearError } = userSlice.actions

// Export selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated
export const selectLoading = (state: RootState) => state.user.loading
export const selectError = (state: RootState) => state.user.error

// Export reducer
export default userSlice.reducer
