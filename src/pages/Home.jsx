import React, { useState } from 'react'
import Login from './auth/Login'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'

const Home = () => {
  const [activeForm, setActiveForm] = useState('login')

  const renderForm = () => {
    switch (activeForm) {
      case 'login':
        return <Login onRegisterClick={() => setActiveForm('register')} onForgotClick={() => setActiveForm('forgot')} />
      case 'register':
        return <Register onLoginClick={() => setActiveForm('login')} />
      case 'forgot':
        return <ForgotPassword onLoginClick={() => setActiveForm('login')} />
      default:
        return <Login onRegisterClick={() => setActiveForm('register')} onForgotClick={() => setActiveForm('forgot')} />
    }
  }

  return (
    <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
      {/* Left side - Content */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 md:py-20 md:px-12 flex flex-col justify-center">
        <div className="text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">CodeSpace</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Your Collaborative Coding Platform</h2>
          <p className="text-indigo-100 mb-8 text-lg">
            Write, share, and collaborate on code in real-time. Join thousands of developers who trust CodeSpace for their coding needs.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-indigo-500 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Real-time collaboration</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Multiple language support</span>
            </div>
            <div className="flex items-center">
              <div className="bg-indigo-500 rounded-full p-2 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-lg">Secure cloud storage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          {renderForm()}
        </div>
      </div>
    </div>
  )
}

export default Home