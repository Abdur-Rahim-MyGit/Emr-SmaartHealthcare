import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import api from '../config/api'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { motion } from 'framer-motion'
import { FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa'

const MyAppointments = () => {
    const { token, userData } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {
            setLoading(true)
            setError(null)
            
            if (!token) {
                navigate('/login');
                return;
            }

            const { data } = await api.get('/api/user/appointments');
            
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                setError(data.message)
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error fetching appointments:', error)
            setError(error.response?.data?.message || 'Failed to fetch appointments')
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false)
        }
    }

    // Function to cancel appointment
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await api.post(`/api/user/cancel-appointment`, { appointmentId });
            if (data.success) {
                toast.success('Appointment cancelled successfully')
                getUserAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment')
        }
    }

    const getStatusLabel = (appointment) => {
        if (appointment.cancelled) return 'Cancelled';
        if (appointment.isCompleted) return 'Completed';
        return 'Pending';
    };

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        getUserAppointments()
    }, [token])

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen pt-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                <p className="mt-4 text-gray-600">Loading your appointments...</p>
            </div>
        )
    }

    if (!token || !userData) {
        navigate('/login')
        return null
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen pt-16">
                <div className="text-red-500 text-xl mb-4">⚠️</div>
                <p className="text-gray-600">{error}</p>
                <button 
                    onClick={getUserAppointments}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen pt-16 bg-gray-50"
        >
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Appointments</h1>
                
                {appointments.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow p-8 text-center"
                    >
                        <img src={assets.no_data} alt="No appointments" className="w-48 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No appointments found</p>
                        <button 
                            onClick={() => navigate('/doctors')}
                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all"
                        >
                            Book an Appointment
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {appointments.map((appointment) => {
                            const status = getStatusLabel(appointment);
                            const statusColor = appointment.cancelled
                                ? 'bg-red-100 text-red-700'
                                : appointment.isCompleted
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700';
                            const statusIcon = appointment.cancelled
                                ? <FaTimesCircle className="inline mr-1" />
                                : appointment.isCompleted
                                    ? <FaCheckCircle className="inline mr-1" />
                                    : <FaHourglassHalf className="inline mr-1" />;
                            return (
                                <motion.div 
                                    key={appointment._id} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                        {/* Doctor Info */}
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={appointment.docData?.image || assets.profile_icon} 
                                                alt="Doctor" 
                                                className="w-20 h-20 rounded-full object-cover border-2 border-primary/20"
                                            />
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FaUserMd className="text-primary" />
                                                    <span className="text-xl font-semibold text-gray-900">Dr. {appointment.docData?.name}</span>
                                                </div>
                                                <div className="text-primary font-medium mb-1">{appointment.docData?.speciality}</div>
                                                <div className="text-gray-500 text-sm">{appointment.docData?.location || 'SMAART Healthcare Center'}</div>
                                            </div>
                                        </div>

                                        {/* Appointment Details */}
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-gray-800 border-b pb-1">Appointment Details</h4>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaCalendarAlt className="text-primary" />
                                                    <span className="font-medium">Date:</span> {formatDate(appointment.slotDate)}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <FaClock className="text-primary" />
                                                    <span className="font-medium">Time:</span> {appointment.slotTime}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="font-medium">Appointment ID:</span> 
                                                    <span className="text-gray-600 font-mono text-xs">{appointment._id?.slice(-8)}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-semibold text-gray-800 border-b pb-1">Patient Details</h4>
                                                <div className="text-sm">
                                                    <span className="font-medium">Name:</span> {appointment.userData?.name}
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-medium">Email:</span> {appointment.userData?.email}
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-medium">Phone:</span> {appointment.userData?.phone}
                                                </div>
                                                {appointment.userData?.message && (
                                                    <div className="text-sm">
                                                        <span className="font-medium">Message:</span> 
                                                        <p className="text-gray-600 mt-1">{appointment.userData.message}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status and Actions */}
                                        <div className="flex flex-col items-end gap-3">
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColor} flex items-center`}>
                                                {statusIcon} {status}
                                            </span>
                                            
                                            {appointment.amount > 0 && (
                                                <div className="text-right">
                                                    <span className="text-sm text-gray-500">Amount:</span>
                                                    <div className="text-lg font-semibold text-green-600">₹{appointment.amount}</div>
                                                </div>
                                            )}

                                            <div className="text-xs text-gray-400">
                                                Booked on: {formatDate(appointment.createdAt || appointment.slotDate)}
                                            </div>

                                            {status === 'Pending' && (
                                                <button
                                                    onClick={() => cancelAppointment(appointment._id)}
                                                    className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                                >
                                                    Cancel Appointment
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default MyAppointments