import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaStar, FaStethoscope, FaUserMd, FaMoneyBillWave } from 'react-icons/fa'

const Appointment = () => {
    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [loading, setLoading] = useState(true)
    const [bookingInProgress, setBookingInProgress] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const fetchDocInfo = async () => {
        try {
            const docInfo = doctors.find((doc) => doc._id === docId)
            if (!docInfo) {
                toast.error('Doctor not found')
                navigate('/doctors')
                return
            }
            setDocInfo(docInfo)
        } catch (error) {
            console.error('Error fetching doctor info:', error)
            toast.error('Failed to load doctor information')
        }
    }

    const getAvailableSlots = async () => {
        try {
            setDocSlots([])
            let today = new Date()

            for (let i = 0; i < 7; i++) {
                let currentDate = new Date(today)
                currentDate.setDate(today.getDate() + i)

                let endTime = new Date()
                endTime.setDate(today.getDate() + i)
                endTime.setHours(21, 0, 0, 0)

                if (today.getDate() === currentDate.getDate()) {
                    currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
                    currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
                } else {
                    currentDate.setHours(10)
                    currentDate.setMinutes(0)
                }

                let timeSlots = []

                while (currentDate < endTime) {
                    let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                    let day = currentDate.getDate()
                    let month = currentDate.getMonth() + 1
                    let year = currentDate.getFullYear()

                    const availabilityCheckDate = `${day}_${month}_${year}`
                    const slotTime = formattedTime

                    const isSlotAvailable = !(docInfo.slots_booked[availabilityCheckDate] && docInfo.slots_booked[availabilityCheckDate].includes(slotTime))

                    if (isSlotAvailable) {
                        timeSlots.push({
                            datetime: new Date(currentDate),
                            time: formattedTime
                        })
                    }

                    currentDate.setMinutes(currentDate.getMinutes() + 30)
                }

                setDocSlots(prev => ([...prev, timeSlots]))
            }
        } catch (error) {
            console.error('Error getting available slots:', error)
            toast.error('Failed to load available slots')
        } finally {
            setLoading(false)
        }
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Please login to book an appointment')
            navigate('/login')
            return
        }

        if (!slotTime) {
            toast.warning('Please select an appointment time')
            return
        }

        try {
            setBookingInProgress(true)
            const date = docSlots[slotIndex][0].datetime
            const bookingDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`

            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                { docId, slotDate: bookingDate, slotTime },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(data.message)
                await getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error booking appointment:', error)
            toast.error(error.response?.data?.message || 'Failed to book appointment')
        } finally {
            setBookingInProgress(false)
        }
    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
        }
    }, [docInfo])

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return docInfo ? (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Doctor Profile Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                    <div className="md:flex">
                        {/* Doctor Image Section */}
                        <div className="md:w-1/3 relative">
                            <img 
                                className="w-full h-[300px] md:h-full object-cover" 
                                src={docInfo.image} 
                                alt={docInfo.name} 
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:hidden">
                                <h1 className="text-2xl font-bold text-white mb-1">{docInfo.name}</h1>
                                <p className="text-white/90">{docInfo.speciality}</p>
                            </div>
                        </div>

                        {/* Doctor Info Section */}
                        <div className="md:w-2/3 p-6 md:p-8">
                            <div className="hidden md:block">
                                <div className="flex items-center gap-3 mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">{docInfo.name}</h1>
                                    <img className='w-6' src={assets.verified_icon} alt="Verified" />
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="flex items-center gap-2 text-gray-600">
                                        <FaUserMd className="text-primary" />
                                        {docInfo.speciality}
                                    </span>
                                    <span className="flex items-center gap-2 text-gray-600">
                                        <FaStethoscope className="text-primary" />
                                        {docInfo.degree}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                        {docInfo.experience}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-primary mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Location</p>
                                            <p className="text-gray-900">{docInfo.address.line1}</p>
                                            <p className="text-gray-900">{docInfo.address.line2}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaMoneyBillWave className="text-primary mt-1" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Consultation Fee</p>
                                            {/* fees removed */}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">About Doctor</p>
                                    <p className="text-gray-600 line-clamp-4">{docInfo.about}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Appointment Booking Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h2>
                    
                    {/* Date Selection */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {docSlots.map((item, index) => (
                                item[0] && (
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setSlotIndex(index)
                                            setSlotTime('')
                                        }}
                                        key={index}
                                        className={`flex flex-col items-center min-w-[100px] p-4 rounded-xl transition-all ${
                                            slotIndex === index 
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span className="text-sm font-medium">{daysOfWeek[item[0].datetime.getDay()]}</span>
                                        <span className="text-2xl font-bold my-1">{item[0].datetime.getDate()}</span>
                                        <span className="text-sm">{monthNames[item[0].datetime.getMonth()]}</span>
                                    </motion.button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                            {docSlots[slotIndex]?.map((item, index) => (
                                <motion.button
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSlotTime(item.time)}
                                    key={index}
                                    className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${
                                        item.time === slotTime
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <FaClock className="text-sm" />
                                    <span className="text-sm font-medium">{item.time.toLowerCase()}</span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Booking Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={bookAppointment}
                        disabled={bookingInProgress || !slotTime}
                        className={`w-full sm:w-auto px-8 py-4 rounded-xl text-white font-medium transition-all ${
                            bookingInProgress || !slotTime
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30'
                        }`}
                    >
                        {bookingInProgress ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Booking...
                            </span>
                        ) : (
                            'Book Appointment'
                        )}
                    </motion.button>
                </motion.div>

                {/* Related Doctors Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                >
                    <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
                </motion.div>
            </div>
        </div>
    ) : null
}

export default Appointment