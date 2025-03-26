import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import { productApi } from './api/productApi'
import { authApi } from './api/authApi'
import todoReducer from './slices/todoSlice'
import userReducer from './slices/userSlice'

// Cấu hình persist
const persistConfig = {
  key: 'react-practice', // Đổi key để tránh xung đột với các project khác
  storage,
  whitelist: ['user'], // Chỉ lưu state của user
  blacklist: [
    productApi.reducerPath, 
    authApi.reducerPath,
    'todos' // Không lưu todos nữa
  ]
}

// Kết hợp các reducers
const rootReducer = combineReducers({
  [productApi.reducerPath]: productApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  todos: todoReducer,
  user: userReducer,
})

// Tạo persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Tạo store với persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(productApi.middleware, authApi.middleware),
})

// Tạo persistor
export const persistor = persistStore(store)

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch 