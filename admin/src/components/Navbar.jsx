import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { FaBell, FaCog, FaSignOutAlt, FaClinicMedical } from 'react-icons/fa'

const Navbar = () => {
  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    setDToken(null)
    setAToken(null)
    localStorage.removeItem('dToken')
    localStorage.removeItem('aToken')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-primary text-2xl">
              <FaClinicMedical />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                SMAART Healthcare
              </h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-primary relative"
              >
                <FaBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-primary">
              <FaCog className="w-5 h-5" />
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3 border-l pl-6">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <img 
                src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                alt="Profile" 
                className="w-8 h-8 rounded-full ring-2 ring-gray-200"
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="hidden md:block text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar