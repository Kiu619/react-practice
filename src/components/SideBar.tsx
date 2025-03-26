import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const SideBar: React.FC = () => {
  const location = useLocation()
  
  const lessons = [
    { id: 1, name: 'Lesson 1', path: '/lesson/1' },
    { id: 2, name: 'Lesson 2', path: '/lesson/2' },
    { id: 3, name: 'Lesson 3', path: '/lesson/3' },
    { id: 4, name: 'Lesson 4', path: '/lesson/4' },
    { id: 5, name: 'Lesson 5', path: '/lesson/5' },
    { id: 6, name: 'Lesson 6', path: '/lesson/6' },
    { id: 7, name: 'Lesson 7', path: '/lesson/7' },
    { id: 8, name: 'Lesson 8', path: '/lesson/8' },
  ]

  return (
    <div className="flex flex-col items-center fixed top-[73px] left-0 bottom-0 w-[120px] bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="py-2">
        {lessons.map((lesson) => (
          <Link 
            key={lesson.id} 
            to={lesson.path}
            className={`block px-4 py-3 hover:bg-gray-100 rounded-md font-medium ${
              location.pathname === lesson.path ? 'bg-gray-100 font-medium' : ''
            }`}
          >
            {lesson.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SideBar
