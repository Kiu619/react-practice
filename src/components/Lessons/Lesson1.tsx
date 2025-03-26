import React from 'react'

const Lesson1: React.FC = () => {
  return (
    <div>
      <p className='text-xl font-bold pb-5'>
        Khởi tạo dự án
      </p>
      <p className='font-bold'>
        {`1. Khởi tạo react ts với vite: `}
        <a className='hover:text-blue-500 font-normal' href="https://vitejs.dev/guide/">https://vitejs.dev/guide/</a>
      </p>
      <p className='font-bold'>
        {`2. Sửa lại nội dung file eslint : `}
        <a className='hover:text-blue-500 font-normal' href="https://github.com/thangpqtechlead/test-node-example/blob/lint/.eslintrc.js">https://github.com/thangpqtechlead/test-node-example/blob/lint/.eslintrc.js</a>
      </p>
      <p className='font-bold'>
        3. Upload code lên github
      </p>
    </div>
  )
}

export default Lesson1