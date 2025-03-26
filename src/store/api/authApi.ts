import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '../slices/userSlice'
import { userDB, DbUser } from '../../dummyDB/userDB'

// Loại dữ liệu cho đăng nhập
export interface LoginRequest {
  email: string
  password: string
}

// Loại dữ liệu cho đăng ký
export interface RegisterRequest {
  fullName: string
  email: string
  password: string
}

// Loại dữ liệu trả về khi đăng nhập/đăng ký thành công
export interface AuthResponse {
  user: User
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Endpoint đăng nhập
    login: builder.mutation<AuthResponse, LoginRequest>({
      queryFn: (credentials) => {
        // Tìm user trong userDB
        const user = userDB.find((u: DbUser) => u.email === credentials.email)
        
        // Kiểm tra thông tin đăng nhập
        if (!user || user.password !== credentials.password) {
          return { 
            error: { 
              status: 401, 
              data: 'Email hoặc mật khẩu không chính xác' 
            } 
          }
        }

        // Trả về thông tin user (không bao gồm password)
        const { password, ...userWithoutPassword } = user
        return { 
          data: { 
            user: userWithoutPassword as User
          } 
        }
      },
    }),

    // Endpoint đăng ký
    register: builder.mutation<AuthResponse, RegisterRequest>({
      queryFn: (userData) => {
        // Kiểm tra email đã tồn tại chưa
        const existingUser = userDB.find((u: DbUser) => u.email === userData.email)
        if (existingUser) {
          return { 
            error: { 
              status: 409, 
              data: 'Email đã được sử dụng' 
            } 
          }
        }

        // Tạo user mới
        const newUser: DbUser = {
          id: userDB.length + 1,
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password
        }

        // Thêm vào userDB
        userDB.push(newUser)

        // Trả về thông tin user (không bao gồm password)
        const { password, ...userWithoutPassword } = newUser
        return { 
          data: { 
            user: userWithoutPassword as User
          } 
        }
      },
    }),

    // Endpoint đăng xuất
    logout: builder.mutation<{ success: boolean }, void>({
      queryFn: () => {
        return { data: { success: true } }
      },
    }),
  }),
})

export const { 
  useLoginMutation, 
  useRegisterMutation,
  useLogoutMutation 
} = authApi 
