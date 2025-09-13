import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUserAlt, FaEnvelope, FaLock, FaArrowRight } from 'react-icons/fa'

const Login = () => {
  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully!')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Welcome back!')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred')
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto"
      >
        {/* Logo or Brand */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {state === 'Sign Up' 
              ? 'Join us to access quality healthcare services' 
              : 'Sign in to manage your healthcare journey'}
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white py-8 px-6 shadow-xl rounded-2xl"
        >
          <form onSubmit={onSubmitHandler} className="space-y-6">
            {/* Name Field */}
            {state === 'Sign Up' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUserAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                             bg-gray-50 hover:bg-gray-100 transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           bg-gray-50 hover:bg-gray-100 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                           bg-gray-50 hover:bg-gray-100 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 
                       bg-gradient-to-r from-primary to-primary/90
                       text-white rounded-xl shadow-lg shadow-primary/30
                       hover:shadow-xl hover:shadow-primary/40 
                       transition-all duration-200 font-medium"
            >
              {state === 'Sign Up' ? 'Create Account' : 'Sign In'}
              <FaArrowRight className="h-4 w-4" />
            </motion.button>

            {/* Toggle State */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                  className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {state === 'Sign Up' ? 'Sign In' : 'Create One'}
                </button>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login