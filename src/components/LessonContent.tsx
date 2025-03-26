import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import Lesson1 from './Lessons/Lesson1'
import Lesson2 from './Lessons/Lesson2'
import Lesson3 from './Lessons/Lesson3'
import Lesson4 from './Lessons/Lesson4'
import Lesson5 from './Lessons/Lesson5'
import Lesson6 from './Lessons/Lesson6'
import Lesson7 from './Lessons/Lesson7'

const LessonContent: React.FC = () => {

  const { id } = useParams()

  if (id && id !== '1' && id !== '2' && id !== '3' && id !== '4' && id !== '5' && id !== '6' && id !== '7') {
    return <Navigate to="/not-found" />
  }

  const lessons = [
    { id: '1', title: 'Lesson 1' },
    { id: '2', title: 'Lesson 2' },
    { id: '3', title: 'Lesson 3' },
    { id: '4', title: 'Lesson 4' },
    { id: '5', title: 'Lesson 5' },
    { id: '6', title: 'Lesson 6' },
    { id: '7', title: 'Lesson 7' },

  ]

  return (
    <div className='relative top-[73px] left-[120px] right-0 bottom-0 min-h-[calc(100vh-93px)] w-[calc(100%-120px)] p-5'>
      {!id && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
          {lessons.map((lesson) => (
            <Link  key={lesson.id}  to={`/lesson/${lesson.id}`}>
              <div className='bg-white p-10 rounded-lg shadow-md'>
                <h3 className='text-lg font-bold'>{lesson.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
      {id === '1' && <Lesson1 />}
      {id === '2' && <Lesson2 />}
      {id === '3' && <Lesson3 />}
      {id === '4' && <Lesson4 />}
      {id === '5' && <Lesson5 />}
      {id === '6' && <Lesson6 />}
      {id === '7' && <Lesson7 />}
    </div>
  )
}

export default LessonContent