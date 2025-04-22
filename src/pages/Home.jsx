import React from 'react'
import Login from './auth/Login'

const Home = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome to CodeSpace</h2>
        <Login />
      </div>
    </div>
  )
}

export default Home