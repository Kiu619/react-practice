import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface Todo {
  id: string
  text: string
  completed: boolean
}

export interface TodoState {
  todos: Todo[]
}

// Lấy dữ liệu từ localStorage nếu có
const loadTodosFromStorage = (): Todo[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      return JSON.parse(storedTodos)
    }
  } catch (error) {
    console.error('Không thể tải dữ liệu từ localStorage:', error)
  }
  return []
}

const initialState: TodoState = {
  todos: loadTodosFromStorage(),
}

// Helper để lưu danh sách todos vào localStorage
const saveTodosToStorage = (todos: Todo[]) => {
  try {
    localStorage.setItem('todos', JSON.stringify(todos))
  } catch (error) {
    console.error('Không thể lưu dữ liệu vào localStorage:', error)
  }
}

export const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Thêm một task mới
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
      }
      state.todos.push(newTodo)
      saveTodosToStorage(state.todos)
    },
    
    // Sửa nội dung của task
    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const { id, text } = action.payload
      const todoToEdit = state.todos.find(todo => todo.id === id)
      if (todoToEdit) {
        todoToEdit.text = text
        saveTodosToStorage(state.todos)
      }
    },
    
    // Xóa một task
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload)
      saveTodosToStorage(state.todos)
    },
    
    // Đánh dấu một task là hoàn thành hoặc chưa hoàn thành
    toggleComplete: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(todo => todo.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
        saveTodosToStorage(state.todos)
      }
    },
    
    // Di chuyển vị trí của task
    moveTodo: (state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) => {
      const { fromIndex, toIndex } = action.payload
      if (
        fromIndex >= 0 && 
        fromIndex < state.todos.length && 
        toIndex >= 0 && 
        toIndex < state.todos.length &&
        fromIndex !== toIndex
      ) {
        // Lấy task cần di chuyển
        const [movedTodo] = state.todos.splice(fromIndex, 1)
        // Chèn task vào vị trí mới
        state.todos.splice(toIndex, 0, movedTodo)
        saveTodosToStorage(state.todos)
      }
    },
    
    // Tải todos từ localStorage (sử dụng khi cần refetch)
    loadTodos: (state) => {
      state.todos = loadTodosFromStorage()
    }
  },
})

// Export các actions
export const { addTodo, editTodo, deleteTodo, toggleComplete, moveTodo, loadTodos } = todoSlice.actions

// Export selector
export const selectTodos = (state: RootState) => state.todos.todos

// Export reducer
export default todoSlice.reducer 
