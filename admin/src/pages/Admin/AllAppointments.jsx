import React, { useState, useEffect, useContext, useMemo } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { 
  HiOutlineSearch, 
  HiOutlineAdjustments,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUserCircle,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineUserGroup,
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown
} from 'react-icons/hi'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AllAppointments = () => {
  const { appointments, getAllAppointments } = useContext(AdminContext)
  const { currency } = useContext(AppContext)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [processingId, setProcessingId] = useState(null)
  const navigate = useNavigate()


  useEffect(() => {
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      await getAllAppointments()
    } catch (error) {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (appointmentId, action) => {
    setProcessingId(appointmentId)
    try {
      const endpoint = action === 'cancel' 
        ? '/api/admin/cancel-appointment'
        : '/api/admin/activate-appointment'
      
      const { data } = await axios.post(endpoint, { appointmentId })
      
      if (data.success) {
        toast.success(action === 'cancel' 
          ? 'Appointment cancelled successfully' 
          : 'Appointment activated successfully')
        await loadAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update appointment status')
    } finally {
      setProcessingId(null)
    }
  }

  const filteredAppointments = appointments?.filter(appointment => {
    const matchesSearch = (
      appointment.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.docData?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const matchesFilter = filterStatus === 'all' ? true :
      filterStatus === 'active' ? !appointment.isCompleted && !appointment.cancelled :
      filterStatus === 'completed' ? appointment.isCompleted :
      filterStatus === 'cancelled' ? appointment.cancelled : true
      
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    if (status.cancelled) return 'bg-red-50 text-red-700 border border-red-200'
    if (status.isCompleted) return 'bg-green-50 text-green-700 border border-green-200'
    return 'bg-blue-50 text-blue-700 border border-blue-200'
  }

  const AppointmentCard = ({ appointment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${appointment.userData?.name || 'Patient'}&background=random`}
                  alt="Patient"
                  className="w-14 h-14 rounded-full ring-2 ring-primary/20"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${
                  appointment.cancelled ? 'bg-red-400' :
                  appointment.isCompleted ? 'bg-green-400' :
                  'bg-blue-400'
                } ring-2 ring-white`}></div>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.userData?.name || 'Unknown Patient'}
                </h3>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(appointment)}`}>
                  {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Active'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-1">Patient Details</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiOutlineUser className="w-4 h-4 text-gray-400" />
                    <span>{appointment.userData?.email || 'No email'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiOutlineCash className="w-4 h-4 text-gray-400" />
                    <span>{appointment.userData?.phone || 'No phone'}</span>
                  </div>
                  {appointment.userData?.message && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Message:</span> {appointment.userData.message}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 border-b pb-1">Appointment Info</h4>
                  {appointment.docData?.name && (
                    <div className="flex items-center gap-2 text-sm text-green-700 font-semibold">
                      <HiOutlineUserCircle className="w-4 h-4 text-green-700" />
                      <span>Dr. {appointment.docData.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiOutlineCalendar className="w-4 h-4 text-gray-400" />
                    <span>{appointment.slotDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HiOutlineClock className="w-4 h-4 text-gray-400" />
                    <span>{appointment.slotTime}</span>
                  </div>
                  {appointment.amount > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                      <HiOutlineCurrencyDollar className="w-4 h-4 text-green-600" />
                      <span>₹{appointment.amount}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400">
                    ID: {appointment._id?.slice(-8)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!appointment.isCompleted && (
              <>
                {!appointment.cancelled ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange(appointment._id, 'cancel')}
                    disabled={processingId === appointment._id}
                    className="inline-flex items-center px-3 py-2 
                             bg-red-50 text-red-700 rounded-lg text-sm font-medium
                             hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-300 border border-red-200"
                  >
                    <HiOutlineX className="w-4 h-4 mr-1.5" />
                    Cancel
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleStatusChange(appointment._id, 'activate')}
                    disabled={processingId === appointment._id}
                    className="inline-flex items-center px-3 py-2
                             bg-green-50 text-green-700 rounded-lg text-sm font-medium
                             hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-300 border border-green-200"
                  >
                    <HiOutlineCheck className="w-4 h-4 mr-1.5" />
                    Activate
                  </motion.button>
                )}
              </>
            )}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/appointment-details', { state: { appointment } })}
              className="inline-flex items-center px-3 py-2 
                        bg-primary/5 text-primary rounded-lg text-sm font-medium
                        hover:bg-primary/10 transition-all duration-300"
            >
              <HiOutlineClipboardList className="w-4 h-4 mr-1.5" />
              View Details
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                console.log('Navigating to schedule-appointment with:', appointment);
                navigate('/admin/schedule-appointment', { state: { appointment } });
              }}
              className="inline-flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-all duration-300 ml-2"
            >
              Schedule with Doctor
            </motion.button>
          </div>
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <HiOutlineUserGroup className="w-7 h-7 text-primary" />
              All Appointments
            </h1>
            <p className="text-gray-600 mt-1">Manage and track all appointments</p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64 bg-white"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white w-full"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <HiOutlineAdjustments className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>



        <div className="space-y-6">
          {filteredAppointments?.length > 0 ? (
            filteredAppointments.map((appointment, index) => (
              <AppointmentCard key={index} appointment={appointment} />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <HiOutlineCalendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900">No appointments found</h3>
              <p className="mt-1 text-base text-gray-500">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No appointments have been scheduled yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllAppointments