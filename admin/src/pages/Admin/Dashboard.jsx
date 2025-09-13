import React, { useState, useEffect, useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import { FaUserMd, FaUsers, FaCalendarCheck, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaEllipsisH } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = () => {
  const { aToken, dashData, getDashData } = useContext(AdminContext)
  const { currency } = useContext(AppContext)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (aToken) {
      loadDashboardData()
    }
  }, [aToken])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      await getDashData()
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Sample data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Appointments',
        data: [30, 45, 35, 50, 40, 60],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: 'black',
        bodyColor: 'black',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }

  const StatCard = ({ title, value, icon, color, percentage, isIncrease, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <FaEllipsisH />
        </button>
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {percentage && (
            <span className={`flex items-center text-sm ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
              {isIncrease ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
              {percentage}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Admin! 👋</h1>
        <p className="text-gray-600">Here's what's happening with your hospital today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Doctors"
          value={dashData?.doctors || 0}
          icon={<FaUserMd className="w-6 h-6 text-blue-600" />}
          color="bg-blue-50"
          percentage="12"
          isIncrease={true}
          onClick={() => navigate('/doctor-list')}
        />
        <StatCard
          title="Total Patients"
          value={dashData?.patients || 0}
          icon={<FaUsers className="w-6 h-6 text-green-600" />}
          color="bg-green-50"
          percentage="8"
          isIncrease={true}
          onClick={() => navigate('/patients-list')}
        />
        <StatCard
          title="Total Appointments"
          value={dashData?.appointments || 0}
          icon={<FaCalendarCheck className="w-6 h-6 text-purple-600" />}
          color="bg-purple-50"
          percentage="5"
          isIncrease={false}
          onClick={() => navigate('/all-appointments')}
        />
      </div>

      {/* Recent Activity Section Only */}
      <div className="grid grid-cols-1 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            {dashData?.latestAppointments?.slice(0, 5).map((appointment, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={`https://ui-avatars.com/api/?name=${appointment.userData?.name || 'User'}&background=random`}
                    alt={appointment.userData?.name}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {appointment.userData?.name || 'Unknown Patient'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Appointment with Dr. {appointment.docData?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {appointment.slotDate} at {appointment.slotTime}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  appointment.cancelled
                    ? 'bg-red-100 text-red-800'
                    : appointment.isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Active'}
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/all-appointments')}
            className="mt-6 w-full py-2 text-sm text-primary hover:text-primary-dark transition-colors"
          >
            View All Activity
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard