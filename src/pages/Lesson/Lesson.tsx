import React from 'react'
import Header from '../../components/Header'
import SideBar from '../../components/SideBar'
import LessonContent from '../../components/LessonContent'

const Lesson: React.FC = () => {
  return (
    <div>
      <Header />
      <SideBar />
      <LessonContent />
    </div>
  )
}

export default Lesson
