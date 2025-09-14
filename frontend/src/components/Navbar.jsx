import React, { useContext, useState, useEffect, useRef } from 'react'
import logo from '../assets/lOGOSmaart.svg';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCircle, FaCalendarCheck, FaSignOutAlt, FaUserMd, FaHome, FaInfoCircle, FaPhoneAlt, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { token, setToken, handleLogout } = useContext(AppContext)
  
  // Debug: Log token state
  console.log('Navbar token state:', token, typeof token)
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const logout = () => {
    handleLogout()
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome /> },
    { path: '/doctors', label: 'Find Doctors', icon: <FaUserMd /> },
    { path: '/services', label: 'Services', icon: <FaCalendarCheck /> },
    { path: '/about', label: 'About Us', icon: <FaInfoCircle /> },
    { path: '/contact', label: 'Contact', icon: <FaPhoneAlt /> },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-blue-50/95 via-white/95 to-teal-50/95 backdrop-blur-xl border-b border-white/20 ${scrolled ? 'shadow-xl' : 'shadow-lg'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                <span style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                  {/* Inline SVG logo */}
                  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 857.53 99.01" style={{ height: '32px' }}>
                    <defs>
                      <linearGradient id="linear-gradient" x1="73.08" y1="172.09" x2="318.24" y2="-73.08" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#004d99"/>
                        <stop offset="1" stopColor="#42a89b"/>
                      </linearGradient>
                    </defs>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="Layer_1-2" data-name="Layer 1">
                        <path style={{fill: "url(#linear-gradient)"}} d="M305.6,39.21a7.42,7.42,0,0,1-1.92,5.35,6.74,6.74,0,0,1-5.11,2H286.88V31.77h11.69a6.7,6.7,0,0,1,5.11,2A7.56,7.56,0,0,1,305.6,39.21ZM229.09,54.74h15.29L236.86,35ZM391.32,0V99H0V0ZM65.61,62q0-6.54-4.17-10.38T49.18,45.09l-7.93-2.61a13.66,13.66,0,0,1-4.9-2.54,4.92,4.92,0,0,1-1.64-3.84A5,5,0,0,1,37,31.69a12,12,0,0,1,6.67-1.56,31.23,31.23,0,0,1,15.36,4.09L63.57,25a42.82,42.82,0,0,0-20.35-5q-9.81,0-15.58,4.49a14.73,14.73,0,0,0-5.76,12.27,13.44,13.44,0,0,0,3.8,9.72q3.81,3.93,12.14,6.7l7.93,2.54q6.95,2.2,7,6.78a5.36,5.36,0,0,1-2.54,4.66,12.37,12.37,0,0,1-7,1.72q-9.06,0-18-6.13L20,72.39Q29.48,79,43.13,79q10.47,0,16.48-4.5A14.75,14.75,0,0,0,65.61,62Zm76.68,16.11L137,20.9H124.22l-16.1,38.82L91.93,20.9H79.26L74,78.12H86.7l3-34.91,14,34.25h8.75l14.06-34.25,2.94,34.91Zm63.43,0L183.07,20.9H171L148.66,78.12H161.9l5-13.24h20.27l5.07,13.24Zm59.75,0L242.82,20.9H230.73L208.41,78.12h13.24l5-13.24h20.27L252,78.12Zm53.45-1.23L305.19,55.15l.9-.25a15.06,15.06,0,0,0,9.07-5.64,16.36,16.36,0,0,0,3.27-10.13q0-8.18-5.19-13.21t-13.61-5H274.05V78.12h12.83V55.64h5.72l13.33,22.48h13Zm52.4-56h-47V31.77H341.4V78.12H354V31.77h17.33Zm-202,33.84h15.29L177.1,35Z"/>
                        <path style={{fill: "#004d99"}} d="M458.73,78.12H446V56H424.07V78.12H411.32V20.9h12.75V45.58H446V20.9h12.75Z"/>
                        <path style={{fill: "#004d99"}} d="M506.26,40.8q5.85,5.69,5.85,14.92a14.49,14.49,0,0,1-.33,3.76h-30.9a9,9,0,0,0,3.56,7.15q3.39,2.66,9,2.66,6.7,0,10.54-2.54l4.5,7.69Q501.88,79,492.24,79q-10.55,0-16.88-6T469,56.86q0-9.64,6.05-15.69t15.85-6.05Q500.42,35.12,506.26,40.8Zm-22.07,5.72A9.93,9.93,0,0,0,481,52.86h19.54a8.61,8.61,0,0,0-2.86-6.34,9.84,9.84,0,0,0-6.79-2.41A9.68,9.68,0,0,0,484.19,46.52Z"/>
                        <path style={{fill: "#004d99"}} d="M554.69,40.19q5.47,5.07,5.48,13.49V78.12H547.66V72.23a14.43,14.43,0,0,1-6,4.9A18.46,18.46,0,0,1,533.68,79q-7,0-11.36-3.76a12.47,12.47,0,0,1-4.33-9.9,11.38,11.38,0,0,1,4.78-9.56q4.79-3.6,12.71-3.6a24.3,24.3,0,0,1,12.34,3.35V53.18a8,8,0,0,0-2.57-6.25q-2.58-2.32-7.23-2.33a24.67,24.67,0,0,0-6.83,1.11,21.76,21.76,0,0,0-6.09,2.65l-3.92-7.68a23.32,23.32,0,0,1,8.13-4,36.26,36.26,0,0,1,10.5-1.59Q549.22,35.12,554.69,40.19ZM532.87,60.83A4.93,4.93,0,0,0,530.66,65a4.53,4.53,0,0,0,2,3.84,9.06,9.06,0,0,0,5.4,1.47A12.15,12.15,0,0,0,543.58,69,12.7,12.7,0,0,0,548,65.45V61.77a17.6,17.6,0,0,0-9.32-2.54A9.62,9.62,0,0,0,532.87,60.83Z"/>
                        <path style={{fill: "#004d99"}} d="M584.28,78.12H571.77V19h12.51Z"/>
                        <path style={{fill: "#004d99"}} d="M611.42,36h11.93v9.24H611.42V63.73a5.19,5.19,0,0,0,1.39,3.84A5.06,5.06,0,0,0,616.57,69a11.32,11.32,0,0,0,6-1.47l2.94,8.09Q620.73,79,613.38,79a14.58,14.58,0,0,1-10.3-3.64,12.38,12.38,0,0,1-3.92-9.53V45.26h-6.3V36h7.36l2.12-11.28h9.08Z"/>
                        <path style={{fill: "#004d99"}} d="M645.5,42.72a12.16,12.16,0,0,1,5.15-5.52,15.24,15.24,0,0,1,7.77-2.08,13.86,13.86,0,0,1,11.2,5.11q4.25,5.1,4.25,13.53V78.12H661.36V54.41a10.52,10.52,0,0,0-2-6.7,6.4,6.4,0,0,0-5.27-2.54A7.66,7.66,0,0,0,647.83,48a11.93,11.93,0,0,0-2.33,7.76V78.12H633V19h12.5Z"/>
                        <path style={{fill: "#004d99"}} d="M716.13,36.76A23.15,23.15,0,0,1,724.05,41l-5.72,7.77a16.49,16.49,0,0,0-10.79-3.68A11.55,11.55,0,0,0,699,48.4a11.86,11.86,0,0,0-3.27,8.71A11.23,11.23,0,0,0,707.54,69a16.44,16.44,0,0,0,10.79-3.68l5.72,7.77a23.16,23.16,0,0,1-7.92,4.25A31.12,31.12,0,0,1,706.24,79q-10.4-.09-16.72-6.09t-6.34-15.82q0-9.81,6.34-15.86t16.72-6.13A31.12,31.12,0,0,1,716.13,36.76Z"/>
                        <path style={{fill: "#004d99"}} d="M766.23,40.19q5.47,5.07,5.48,13.49V78.12H759.2V72.23a14.43,14.43,0,0,1-6.05,4.9A18.46,18.46,0,0,1,745.22,79q-7,0-11.36-3.76a12.47,12.47,0,0,1-4.33-9.9,11.38,11.38,0,0,1,4.78-9.56q4.79-3.6,12.71-3.6a24.3,24.3,0,0,1,12.34,3.35V53.18a8,8,0,0,0-2.57-6.25q-2.58-2.32-7.23-2.33a24.62,24.62,0,0,0-6.83,1.11,21.76,21.76,0,0,0-6.09,2.65l-3.92-7.68a23.32,23.32,0,0,1,8.13-4,36.26,36.26,0,0,1,10.5-1.59Q760.76,35.12,766.23,40.19ZM744.41,60.83A4.93,4.93,0,0,0,742.2,65a4.53,4.53,0,0,0,2,3.84,9.06,9.06,0,0,0,5.4,1.47A12.15,12.15,0,0,0,755.12,69a12.79,12.79,0,0,0,4.41-3.55V61.77a17.6,17.6,0,0,0-9.32-2.54A9.62,9.62,0,0,0,744.41,60.83Z"/>
                        <path style={{fill: "#004d99"}} d="M809.55,35.28v12.1a20.58,20.58,0,0,0-4-.33,8.31,8.31,0,0,0-7,3.72q-2.7,3.72-2.7,9.94V78.12H783.31V36h12.1V47.3a15.81,15.81,0,0,1,4.21-8.83,10.73,10.73,0,0,1,7.89-3.35Z"/>
                        <path style={{fill: "#004d99"}} d="M851.69,40.8q5.85,5.69,5.84,14.92a14.61,14.61,0,0,1-.32,3.76h-30.9a9.05,9.05,0,0,0,3.55,7.15,14.3,14.3,0,0,0,9,2.66q6.71,0,10.54-2.54l4.5,7.69Q847.31,79,837.67,79q-10.54,0-16.88-6t-6.33-16.11q0-9.64,6-15.69t15.86-6.05Q845.84,35.12,851.69,40.8Zm-22.07,5.72a9.93,9.93,0,0,0-3.15,6.34H846a8.64,8.64,0,0,0-2.86-6.34,9.84,9.84,0,0,0-6.79-2.41A9.68,9.68,0,0,0,829.62,46.52Z"/>
                      </g>
                    </g>
                  </svg>
                </span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  relative group flex items-center space-x-1 text-sm font-medium transition-colors duration-300
                  ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: location.pathname === item.path ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </NavLink>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {token && token !== '' && token !== 'false' ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-300"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <FaUserCircle className="text-xl" />
                  <span className="font-medium">My Account</span>
                </motion.button>
                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <NavLink 
                        to="/my-appointments" 
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                      >
                        <FaCalendarCheck />
                        <span>My Appointments</span>
                      </NavLink>
                      <NavLink 
                        to="/medical-records" 
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                      >
                        <FaUserMd />
                        <span>Medical Records</span>
                      </NavLink>
                      <NavLink 
                        to="/my-profile" 
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                      >
                        <FaUserCircle />
                        <span>My Profile</span>
                      </NavLink>
                      <button 
                        onClick={logout}
                        className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-300"
                      >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-300"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white border-t"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setShowMenu(false)}
                  className={({ isActive }) => `
                    flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-300
                    ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
              {token && token !== '' && token !== 'false' ? (
                <>
                  <NavLink
                    to="/my-appointments"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-300"
                  >
                    <FaCalendarCheck className="text-lg" />
                    <span>My Appointments</span>
                  </NavLink>
                  <button
                    onClick={() => {
                      logout()
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-300"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/login')
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar