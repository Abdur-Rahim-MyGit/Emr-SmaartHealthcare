import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaHome, 
  FaUserMd, 
  FaCalendarCheck, 
  FaChartLine, 
  FaCog, 
  FaBell, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaHeartbeat,
  FaFileMedicalAlt,
  FaUsers,
  FaHospital
} from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { token, setToken } = useContext(AppContext)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  const menuItems = [
    { 
      path: '/dashboard', 
      label: 'Dashboard', 
      icon: <FaHome />,
      description: 'Overview & Analytics'
    },
    { 
      path: '/doctors', 
      label: 'Find Doctors', 
      icon: <FaUserMd />,
      description: 'Browse Specialists'
    },
    { 
      path: '/my-appointments', 
      label: 'Appointments', 
      icon: <FaCalendarCheck />,
      description: 'Schedule & Manage'
    },
    { 
      path: '/medical-records', 
      label: 'Medical Records', 
      icon: <FaFileMedicalAlt />,
      description: 'Health History'
    },
    { 
      path: '/services', 
      label: 'Services', 
      icon: <FaHospital />,
      description: 'Medical Services'
    },
    { 
      path: '/my-profile', 
      label: 'Profile', 
      icon: <FaUserCircle />,
      description: 'Account Settings'
    }
  ]

  const quickStats = [
    { icon: <FaCalendarCheck />, value: '3', label: 'Upcoming Appointments', color: 'text-blue-500' },
    { icon: <FaFileMedicalAlt />, value: '12', label: 'Medical Records', color: 'text-green-500' },
    { icon: <FaUserMd />, value: '5', label: 'Doctors Consulted', color: 'text-purple-500' },
    { icon: <FaHeartbeat />, value: '98%', label: 'Health Score', color: 'text-red-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23004d99' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-20 right-20 w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center z-10"
      >
        <FaHeartbeat className="w-8 h-8 text-primary" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="fixed bottom-32 left-20 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center z-10"
      >
        <FaUserMd className="w-6 h-6 text-secondary" />
      </motion.div>

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : '-100%'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-80 glass-sidebar z-50 lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <motion.div 
            className="p-6 border-b border-white/20"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 857.53 99.01" className="w-8 h-8">
                  <defs>
                    <linearGradient id="logo-gradient" x1="73.08" y1="172.09" x2="318.24" y2="-73.08" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#004d99"/>
                      <stop offset="1" stopColor="#42a89b"/>
                    </linearGradient>
                  </defs>
                  <path style={{fill: "url(#logo-gradient)"}} d="M305.6,39.21a7.42,7.42,0,0,1-1.92,5.35,6.74,6.74,0,0,1-5.11,2H286.88V31.77h11.69a6.7,6.7,0,0,1,5.11,2A7.56,7.56,0,0,1,305.6,39.21ZM229.09,54.74h15.29L236.86,35ZM391.32,0V99H0V0ZM65.61,62q0-6.54-4.17-10.38T49.18,45.09l-7.93-2.61a13.66,13.66,0,0,1-4.9-2.54,4.92,4.92,0,0,1-1.64-3.84A5,5,0,0,1,37,31.69a12,12,0,0,1,6.67-1.56,31.23,31.23,0,0,1,15.36,4.09L63.57,25a42.82,42.82,0,0,0-20.35-5q-9.81,0-15.58,4.49a14.73,14.73,0,0,0-5.76,12.27,13.44,13.44,0,0,0,3.8,9.72q3.81,3.93,12.14,6.7l7.93,2.54q6.95,2.2,7,6.78a5.36,5.36,0,0,1-2.54,4.66,12.37,12.37,0,0,1-7,1.72q-9.06,0-18-6.13L20,72.39Q29.48,79,43.13,79q10.47,0,16.48-4.5A14.75,14.75,0,0,0,65.61,62Zm76.68,16.11L137,20.9H124.22l-16.1,38.82L91.93,20.9H79.26L74,78.12H86.7l3-34.91,14,34.25h8.75l14.06-34.25,2.94,34.91Zm63.43,0L183.07,20.9H171L148.66,78.12H161.9l5-13.24h20.27l5.07,13.24Zm59.75,0L242.82,20.9H230.73L208.41,78.12h13.24l5-13.24h20.27L252,78.12Zm53.45-1.23L305.19,55.15l.9-.25a15.06,15.06,0,0,0,9.07-5.64,16.36,16.36,0,0,0,3.27-10.13q0-8.18-5.19-13.21t-13.61-5H274.05V78.12h12.83V55.64h5.72l13.33,22.48h13Zm52.4-56h-47V31.77H341.4V78.12H354V31.77h17.33Zm-202,33.84h15.29L177.1,35Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Smart Health
                </h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  whileHover={{ x: 8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(item.path)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30'
                      : 'text-gray-600 hover:bg-white/50 hover:text-primary'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </motion.button>
              </motion.div>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-white/20">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/50 backdrop-blur-sm rounded-lg p-3 text-center"
                >
                  <div className={`text-lg ${stat.color} mb-1`}>{stat.icon}</div>
                  <div className="text-xs font-semibold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <motion.button
              whileHover={{ x: 8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="font-medium">Sign Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Navigation */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`sticky top-0 z-30 glass-navbar ${scrolled ? 'shadow-xl' : 'shadow-lg'}`}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-white/50 transition-colors duration-300"
              >
                {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {menuItems.find(item => item.path === location.pathname)?.description || 'Welcome to your health dashboard'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-white/70 transition-all duration-300 relative"
              >
                <FaBell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/50 backdrop-blur-sm"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <FaUserCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">Patient</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

export default DashboardLayout
