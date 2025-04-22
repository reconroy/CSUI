import React, { useState, useEffect } from 'react'
import Login from './auth/Login'
import Register from './auth/Register'
import ForgotPassword from './auth/ForgotPassword'
import Menu from './auth/Menu'
import '../styles/formTransitions.css'

const Home = () => {
  const [activeForm, setActiveForm] = useState('menu')
  const [isAnimating, setIsAnimating] = useState(false)
  const [currentForm, setCurrentForm] = useState('menu')

  useEffect(() => {
    if (activeForm !== currentForm) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setCurrentForm(activeForm)
        setIsAnimating(false)
      }, 300) // Match this with the CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [activeForm, currentForm])

  const renderForm = () => {
    switch (currentForm) {
      case 'menu':
        return <Menu onLoginClick={() => setActiveForm('login')} onRegisterClick={() => setActiveForm('register')} />
      case 'login':
        return <Login
          onRegisterClick={() => setActiveForm('register')}
          onForgotClick={() => setActiveForm('forgot')}
          onBackToMenuClick={() => setActiveForm('menu')}
        />
      case 'register':
        return <Register
          onLoginClick={() => setActiveForm('login')}
          onBackToMenuClick={() => setActiveForm('menu')}
        />
      case 'forgot':
        return <ForgotPassword onLoginClick={() => setActiveForm('login')} />
      default:
        return <Menu onLoginClick={() => setActiveForm('login')} onRegisterClick={() => setActiveForm('register')} />
    }
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 md:gap-16">
      {/* Left side - Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <div className="text-white">
          <div className="flex items-center mb-6">
            <div className="bg-green-500 w-10 h-10 rounded-lg mr-3 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">CodeSpace</h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-green-400">Your Collaborative Coding Platform</h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Write, share, and collaborate on code in real-time. Join thousands of developers who trust CodeSpace for their coding needs.
          </p>

          <div className="space-y-6">
            <div className="flex items-start group">
              <div className="bg-gray-800 border border-green-500 rounded-lg p-2 mr-4 group-hover:bg-green-500/20 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400">Real-time collaboration</h3>
                <p className="text-gray-400">Work together with your team in real-time, seeing changes as they happen.</p>
              </div>
            </div>

            <div className="flex items-start group">
              <div className="bg-gray-800 border border-green-500 rounded-lg p-2 mr-4 group-hover:bg-green-500/20 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400">Multiple language support</h3>
                <p className="text-gray-400">Code in JavaScript, Python, Java, C++, and many more languages.</p>
              </div>
            </div>

            <div className="flex items-start group">
              <div className="bg-gray-800 border border-green-500 rounded-lg p-2 mr-4 group-hover:bg-green-500/20 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-400">Secure cloud storage</h3>
                <p className="text-gray-400">Your code is securely stored in the cloud, accessible from anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Forms */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-xl border border-gray-700 shadow-2xl relative z-20">
          <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {renderForm()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home