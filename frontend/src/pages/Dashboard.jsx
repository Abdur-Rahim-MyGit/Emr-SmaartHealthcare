import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FaCalendarCheck, 
  FaUserMd, 
  FaFileMedicalAlt, 
  FaHeartbeat,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
  FaEye,
  FaDownload,
  FaShare,
  FaPlus,
  FaBell,
  FaCog
} from 'react-icons/fa'
import DashboardLayout from '../components/DashboardLayout'

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: '3',
      change: '+12%',
      changeType: 'positive',
      icon: <FaCalendarCheck />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Medical Records',
      value: '12',
      change: '+5%',
      changeType: 'positive',
      icon: <FaFileMedicalAlt />,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Doctors Consulted',
      value: '5',
      change: '+2',
      changeType: 'positive',
      icon: <FaUserMd />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Health Score',
      value: '98%',
      change: '+3%',
      changeType: 'positive',
      icon: <FaHeartbeat />,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100'
    }
  ]

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
      location: 'Main Hospital, Room 205',
      avatar: '/avatars/doctor1.jpg'
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'Dermatology',
      date: '2024-01-18',
      time: '2:30 PM',
      status: 'pending',
      location: 'Clinic A, Room 102',
      avatar: '/avatars/doctor2.jpg'
    },
    {
      id: 3,
      doctor: 'Dr. Emily Rodriguez',
      specialty: 'General Medicine',
      date: '2024-01-20',
      time: '9:15 AM',
      status: 'confirmed',
      location: 'Main Hospital, Room 301',
      avatar: '/avatars/doctor3.jpg'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment with Dr. Sarah Johnson',
      description: 'Cardiology consultation completed',
      time: '2 hours ago',
      icon: <FaCalendarCheck />,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'record',
      title: 'Medical record updated',
      description: 'Blood test results added',
      time: '1 day ago',
      icon: <FaFileMedicalAlt />,
      color: 'text-green-500'
    },
    {
      id: 3,
      type: 'prescription',
      title: 'New prescription issued',
      description: 'Medication dosage updated',
      time: '2 days ago',
      icon: <FaHeartbeat />,
      color: 'text-red-500'
    }
  ]

  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', status: 'normal', color: 'text-green-500' },
    { label: 'Heart Rate', value: '72 bpm', status: 'normal', color: 'text-green-500' },
    { label: 'Weight', value: '70 kg', status: 'normal', color: 'text-blue-500' },
    { label: 'BMI', value: '22.5', status: 'normal', color: 'text-green-500' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome back, John!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's what's happening with your health today
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`stat-card bg-gradient-to-br ${stat.bgColor} relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' ? <FaArrowUp /> : <FaArrowDown />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 dashboard-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Appointments</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center space-x-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>Book New</span>
              </motion.button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:border-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                      {appointment.doctor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.specialty}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaClock />
                          <span>{appointment.date} at {appointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaMapMarkerAlt />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-300"
                      >
                        <FaEye className="w-4 h-4 text-gray-600" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-300"
                      >
                        <FaPhoneAlt className="w-4 h-4 text-gray-600" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Health Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="dashboard-card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Health Metrics</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-300"
              >
                <FaChartLine className="w-5 h-5 text-gray-600" />
              </motion.button>
            </div>
            <div className="space-y-4">
              {healthMetrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-lg"
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-xs text-gray-500 capitalize">{metric.status}</div>
                  </div>
                  <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="dashboard-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <FaBell className="w-4 h-4" />
              <span>View All</span>
            </motion.button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ x: 8 }}
                className="flex items-center space-x-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/70 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl bg-white/80 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-300"
                  >
                    <FaShare className="w-4 h-4 text-gray-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-300"
                  >
                    <FaDownload className="w-4 h-4 text-gray-600" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="dashboard-card"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <FaCalendarCheck />, label: 'Book Appointment', color: 'from-blue-500 to-blue-600' },
              { icon: <FaFileMedicalAlt />, label: 'View Records', color: 'from-green-500 to-green-600' },
              { icon: <FaUserMd />, label: 'Find Doctor', color: 'from-purple-500 to-purple-600' },
              { icon: <FaCog />, label: 'Settings', color: 'from-gray-500 to-gray-600' }
            ].map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`p-6 rounded-xl bg-gradient-to-r ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium">{action.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
