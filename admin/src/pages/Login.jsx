import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FaUserMd, FaUserShield } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { RiLockPasswordLine } from 'react-icons/ri'

const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        
        if (data.success) {
          const token = data.token;
          localStorage.setItem('aToken', token);
          setAToken(token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios.defaults.headers.common['atoken'] = token;
          
          toast.success('Admin login successful');
          navigate('/admin-dashboard');
        } else {
          toast.error(data.message || 'Login failed');
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
        
        if (data.success) {
          const token = data.token;
          localStorage.setItem('dToken', token);
          setDToken(token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios.defaults.headers.common['dtoken'] = token;
          
          toast.success('Doctor login successful');
          navigate('/doctor-dashboard');
        } else {
          toast.error(data.message || 'Login failed');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {state === 'Admin' ? (
              <FaUserShield className="h-12 w-12 text-primary" />
            ) : (
              <FaUserMd className="h-12 w-12 text-primary" />
            )}
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            {state} Portal
          </h2>
          <p className="text-sm text-gray-600">
            Sign in to access your dashboard
          </p>
        </div>
        <form onSubmit={onSubmitHandler} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => !loading && setState(state === 'Admin' ? 'Doctor' : 'Admin')}
              className="text-sm text-gray-600 hover:text-primary transition-colors duration-200"
            >
              {state === 'Admin' ? 'Switch to Doctor Login' : 'Switch to Admin Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login