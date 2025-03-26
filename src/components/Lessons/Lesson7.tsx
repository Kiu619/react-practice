import {
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MenuOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined
} from '@ant-design/icons'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Empty,
  Input,
  List,
  message,
  Popconfirm,
  Tooltip,
  Typography,
} from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addTodo,
  deleteTodo,
  editTodo,
  loadTodos,
  moveTodo,
  selectTodos,
  Todo,
  toggleComplete
} from '../../store/slices/todoSlice'

const { Text, Title } = Typography

// Tạo các styles tùy chỉnh sử dụng React CSSProperties
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '16px'
  },
  title: {
    textAlign: 'center' as const,
    marginBottom: '8px'
  },
  card: {
    marginBottom: '40px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center'
  },
  input: {
    flexGrow: 1,
    marginRight: '8px'
  },
  reloadButton: {
    marginLeft: '8px'
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '-1px -2px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)'
  },
  listItem: (completed: boolean, isDragging: boolean) => ({
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.3s',
    backgroundColor: isDragging ? '#e5e7eb' : completed ? 'rgb(229 242 255)' : 'white',
    cursor: isDragging ? 'grabbing' : 'auto',
    borderRadius: isDragging ? '4px' : 'none',
    boxShadow: isDragging ? '0 5px 10px rgba(0,0,0,0.1)' : 'none'
  }),
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px'
  },
  checkbox: {
    marginRight: '12px'
  },
  dragHandle: {
    cursor: 'grab',
    color: '#9ca3af',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1000, 
    touchAction: 'none' as const
  },
  todoText: (completed: boolean) => ({
    flexGrow: 1,
    color: completed ? '#9ca3af' : 'inherit'
  }),
  statsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#6b7280'
  }
}

// SortableItem component - wraps List.Item with sortable functionality
const SortableItem = (props: {
  todo: Todo
  index: number
  editingId: string | null
  editedText: string
  onEditStart: (todo: Todo) => void
  onEditSave: () => void
  onEditCancel: () => void
  onEditChange: (value: string) => void
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
}) => {
  const {
    todo,
    editingId,
    editedText,
    onEditStart,
    onEditSave,
    onEditCancel,
    onEditChange,
    onToggleComplete,
    onDelete
  } = props
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id })
  
  const inputRef = useRef<any>(null)
  
  // Focus input when editing starts
  useEffect(() => {
    if (editingId === todo.id && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingId, todo.id])
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  return (
    <div ref={setNodeRef} style={style}>
      <List.Item
        style={styles.listItem(todo.completed, isDragging)}
        actions={
          editingId === todo.id
            ? [
                <Button key="save" icon={<SaveOutlined />} onClick={onEditSave} />,
                <Button key="cancel" icon={<CloseCircleOutlined />} onClick={onEditCancel} />
              ]
            : [
                <Tooltip key="edit" title="Chỉnh sửa">
                  <Button icon={<EditOutlined />} onClick={() => onEditStart(todo)} />
                </Tooltip>,
                <Popconfirm
                  key="delete"
                  title="Bạn có chắc chắn muốn xóa?"
                  onConfirm={() => onDelete(todo.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ]
        }
      >
        <div style={styles.todoContent}>
          {/* Drag handle */}
          <div {...attributes} {...listeners} style={styles.dragHandle}>
            <MenuOutlined />
          </div>
          
          <Checkbox
            checked={todo.completed}
            onChange={() => onToggleComplete(todo.id)}
            style={styles.checkbox}
          />
          
          {editingId === todo.id ? (
            <Input
              ref={inputRef}
              value={editedText}
              onChange={(e) => onEditChange(e.target.value)}
              onPressEnter={onEditSave}
              onBlur={onEditSave}
              style={{ flexGrow: 1 }}
            />
          ) : (
            <Text
              // delete={todo.completed}
              style={styles.todoText(todo.completed)}
            >
              {todo.text}
            </Text>
          )}
        </div>
      </List.Item>
    </div>
  )
}



const Lesson7: React.FC = () => {
  const todos = useSelector(selectTodos)
  const dispatch = useDispatch()
  
  const [newTodoText, setNewTodoText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedText, setEditedText] = useState('')
  
  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  // Load todos từ localStorage khi component mount
  useEffect(() => {
    dispatch(loadTodos())
  }, [dispatch])
  
  // Xử lý thêm todo mới
  const handleAddTodo = () => {
    if (newTodoText.trim() !== '') {
      dispatch(addTodo(newTodoText.trim()))
      setNewTodoText('')
      message.success('Đã thêm công việc mới!')
    }
  }
  
  // Bắt đầu chỉnh sửa todo
  const startEditingTodo = (todo: Todo) => {
    setEditingId(todo.id)
    setEditedText(todo.text)
  }
  
  // Hoàn thành chỉnh sửa
  const saveEditedTodo = () => {
    if (editingId && editedText.trim() !== '') {
      dispatch(editTodo({ id: editingId, text: editedText.trim() }))
      setEditingId(null)
      setEditedText('')
      message.success('Đã cập nhật công việc!')
    }
  }
  
  // Hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingId(null)
    setEditedText('')
  }
  
  // Đánh dấu hoàn thành/chưa hoàn thành
  const handleToggleComplete = (id: string) => {
    dispatch(toggleComplete(id))
  }
  
  // Xóa todo
  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id))
    message.info('Đã xóa công việc!')
  }
  
  // Xử lý kéo thả todo
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(todo => todo.id === active.id)
      const newIndex = todos.findIndex(todo => todo.id === over.id)
      
      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(moveTodo({ fromIndex: oldIndex, toIndex: newIndex }))
      }
    }
  }
  
  return (
    <div style={styles.container}>
      <Title level={2} style={styles.title}>Todo App Redux</Title>
      
      <Card style={styles.card}>
        <div style={styles.inputGroup}>
          <Input
            placeholder="Nhập công việc mới..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onPressEnter={handleAddTodo}
            style={styles.input}
            size="large"
          />
          <Button
            type="primary"
            onClick={handleAddTodo}
            icon={<PlusOutlined />}
            size="large"
          >
            Thêm
          </Button>
          <Tooltip title="Tải lại dữ liệu từ localStorage">
            <Button
              onClick={() => dispatch(loadTodos())}
              icon={<ReloadOutlined />}
              style={styles.reloadButton}
              size="large"
            />
          </Tooltip>
        </div>
      </Card>
      
      <div style={styles.listContainer}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={todos.map(todo => todo.id)}
            strategy={verticalListSortingStrategy}
          >
            <List
              locale={{ emptyText: <Empty description="Chưa có công việc nào" /> }}
              dataSource={todos}
              renderItem={(todo: Todo, index: number) => (
                <SortableItem
                  key={todo.id}
                  todo={todo}
                  index={index}
                  editingId={editingId}
                  editedText={editedText}
                  onEditStart={startEditingTodo}
                  onEditSave={saveEditedTodo}
                  onEditCancel={cancelEdit}
                  onEditChange={setEditedText}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTodo}
                />
              )}
            />
          </SortableContext>
        </DndContext>
        
        <Divider style={{ margin: 0 }} />
        
        <div style={styles.statsContainer}>
          <span>
            Tổng số: <strong>{todos.length}</strong> công việc
          </span>
          <span>
            Hoàn thành: <strong>{todos.filter(todo => todo.completed).length}</strong> công việc
          </span>
        </div>
      </div>
    </div>
  )
}

export default Lesson7
