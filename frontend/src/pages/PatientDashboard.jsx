import React, { useState, useEffect, useContext } from 'react'
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
  FaCog,
  FaUser,
  FaMoneyBillWave,
  FaPrescriptionBottleAlt,
  FaIdCard,
  FaBirthdayCake,
  FaTint,
  FaVenusMars
} from 'react-icons/fa'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import DashboardLayout from '../components/DashboardLayout'

const PatientDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  const { backendUrl, token } = useContext(AppContext)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (token) {
      fetchDashboardData()
    }
  }, [token])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/patient/dashboard`, {
        headers: { token }
      })
      
      if (data.success) {
        setDashboardData(data.data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
            <p className="text-gray-600">Unable to load your dashboard data.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { patient, stats, appointments, prescriptions, bills, medicalRecords, vitals } = dashboardData

  const statsCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      change: '+12%',
      changeType: 'positive',
      icon: <FaCalendarCheck />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      change: '+5%',
      changeType: 'positive',
      icon: <FaClock />,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100'
    },
    {
      title: 'Prescriptions',
      value: stats.totalPrescriptions,
      change: '+2',
      changeType: 'positive',
      icon: <FaPrescriptionBottleAlt />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Bills',
      value: stats.totalBills,
      change: '+1',
      changeType: 'positive',
      icon: <FaMoneyBillWave />,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100'
    }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateAge = (dateOfBirth) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
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

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="dashboard-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('appointments')}
            className="btn-secondary flex items-center space-x-2"
          >
            <FaEye className="w-4 h-4" />
            <span>View All</span>
          </motion.button>
        </div>
        <div className="space-y-4">
          {appointments.slice(0, 3).map((appointment, index) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                  <FaUserMd />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {appointment.docData?.name || appointment.docId?.name || 'Doctor'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {appointment.docData?.speciality || appointment.docId?.speciality || 'General'}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <FaClock />
                      <span>{formatDate(appointment.slotDate)} at {appointment.slotTime}</span>
                    </div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.cancelled 
                    ? 'bg-red-100 text-red-700' 
                    : appointment.isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Scheduled'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderProfile = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Patient Profile</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-secondary flex items-center space-x-2"
        >
          <FaCog className="w-4 h-4" />
          <span>Edit Profile</span>
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo and Basic Info */}
        <div className="lg:col-span-1">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {patient.photograph ? (
                <img 
                  src={patient.photograph} 
                  alt={patient.patientName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                patient.patientName.charAt(0)
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{patient.patientName}</h3>
            <p className="text-gray-600">UHID: {patient.uhid}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaEnvelope className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Email</span>
              </div>
              <p className="text-gray-900">{patient.email}</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaPhoneAlt className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Phone</span>
              </div>
              <p className="text-gray-900">{patient.phone}</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaBirthdayCake className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Age</span>
              </div>
              <p className="text-gray-900">{calculateAge(patient.dateOfBirth)} years</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaVenusMars className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Gender</span>
              </div>
              <p className="text-gray-900">{patient.gender}</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaTint className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Blood Group</span>
              </div>
              <p className="text-gray-900">{patient.bloodGroup || 'Not specified'}</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <FaMapMarkerAlt className="text-primary" />
                <span className="text-sm font-medium text-gray-700">Address</span>
              </div>
              <p className="text-gray-900 text-sm">
                {patient.address?.line1}, {patient.address?.city}, {patient.address?.state} {patient.address?.zipCode}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderAppointments = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">All Appointments</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Book New</span>
        </motion.button>
      </div>
      
      <div className="space-y-4">
        {appointments.map((appointment, index) => (
          <motion.div
            key={appointment._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white">
                  <FaUserMd />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {appointment.docData?.name || appointment.docId?.name || 'Doctor'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {appointment.docData?.speciality || appointment.docId?.speciality || 'General'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(appointment.slotDate)} at {appointment.slotTime}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  appointment.cancelled 
                    ? 'bg-red-100 text-red-700' 
                    : appointment.isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Scheduled'}
                </span>
                <p className="text-sm text-gray-600 mt-1">₹{appointment.amount || 0}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderPrescriptions = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Prescriptions</h2>
      </div>
      
      <div className="space-y-4">
        {prescriptions.length > 0 ? prescriptions.map((prescription, index) => (
          <motion.div
            key={prescription._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white">
                  <FaPrescriptionBottleAlt />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Dr. {prescription.consultedDoctor?.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {prescription.medications?.length || 0} medications prescribed
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(prescription.createdAt)}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-300"
              >
                <FaDownload className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-8">
            <FaPrescriptionBottleAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions available</p>
          </div>
        )}
      </div>
    </motion.div>
  )

  const renderBills = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
      </div>
      
      <div className="space-y-4">
        {bills.length > 0 ? bills.map((bill, index) => (
          <motion.div
            key={bill._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white">
                  <FaMoneyBillWave />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Bill #{bill.billNumber || bill._id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {bill.description || 'Medical services'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(bill.createdAt)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">₹{bill.totalAmount || bill.amount || 0}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bill.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {bill.paymentStatus || 'Pending'}
                </span>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="text-center py-8">
            <FaMoneyBillWave className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bills available</p>
          </div>
        )}
      </div>
    </motion.div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'appointments', label: 'Appointments', icon: <FaCalendarCheck /> },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FaPrescriptionBottleAlt /> },
    { id: 'bills', label: 'Bills', icon: <FaMoneyBillWave /> }
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
                Welcome back, {patient.patientName}!
              </h1>
              <p className="text-gray-600 mt-2">
                Here's your health dashboard overview
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

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-2"
        >
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'appointments' && renderAppointments()}
          {activeTab === 'prescriptions' && renderPrescriptions()}
          {activeTab === 'bills' && renderBills()}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default PatientDashboard
