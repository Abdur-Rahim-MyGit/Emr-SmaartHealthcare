import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlineCalendar, HiOutlineAcademicCap } from 'react-icons/hi'
import BookingModal from './BookingModal'
import { RiStethoscopeLine, RiMentalHealthLine } from 'react-icons/ri'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors, currencySymbol } = useContext(AppContext)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [selectedDoctor, setSelectedDoctor] = useState(null)

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                        <RiMentalHealthLine className="text-primary text-4xl" />
                        Meet Our Expert Team
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Our team of highly qualified healthcare professionals is here to provide
                        you with the best medical care and treatment.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {doctors.slice(0, 6).map((doctor, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="group"
                        >
                            <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
                                {/* Doctor Image */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={doctor.image || 'https://placehold.co/400x300?text=Doctor+Image'}
                                        alt={doctor.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                                        <div className="absolute bottom-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                doctor.available 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                                {doctor.available ? 'Available Now' : 'Not Available'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                        {doctor.name}
                                    </h3>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-gray-600">
                                            <RiStethoscopeLine className="w-5 h-5 mr-3 text-primary" />
                                            <span>{doctor.speciality}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <HiOutlineAcademicCap className="w-5 h-5 mr-3 text-primary" />
                                            <span>{doctor.experience} Experience</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <HiOutlineClock className="w-5 h-5 mr-3 text-primary" />
                                            <span>Mon - Fri: 9:00 AM - 5:00 PM</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center py-4 border-t border-gray-100">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => {
                                                setSelectedDoctor(doctor)
                                                setShowBookingModal(true)
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary 
                                                     rounded-lg font-medium hover:bg-primary hover:text-white transition-all ml-auto"
                                        >
                                            <HiOutlineCalendar className="w-5 h-5" />
                                            Book Now
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center mt-12"
                >
                    <button
                        onClick={() => {
                            navigate('/doctors')
                            window.scrollTo(0, 0)
                        }}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 
                                 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow"
                    >
                        View All Doctors
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </button>
                </motion.div>
            </div>
            
            {/* Booking Modal */}
            <BookingModal 
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                doctorInfo={selectedDoctor}
            />
        </div>
    )
}

export default TopDoctors