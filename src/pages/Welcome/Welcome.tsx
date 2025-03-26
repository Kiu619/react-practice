import React from 'react'

const Welcome: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold">
        Welcome to the app
      </h1>
      <a className="hover:text-blue-500" href="/lesson">👉 Go to lesson list </a>
    </div>
  )
}

export default Welcome