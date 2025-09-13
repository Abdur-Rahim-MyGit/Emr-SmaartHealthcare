import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUserMd, FaCalendarAlt, FaHospital, FaArrowRight, FaCalendarCheck } from 'react-icons/fa'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 z-10"
                    >
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Your Health, Our
                            <span className="text-primary block">Priority</span>
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Experience world-class healthcare with our expert doctors. 
                            Book appointments easily and get the care you deserve.
                        </p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-1">50+</div>
                                <div className="text-sm text-gray-600">Expert Doctors</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-1">10+</div>
                                <div className="text-sm text-gray-600">Specialties</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                                <div className="text-sm text-gray-600">Support</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/doctors')}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                                         bg-gradient-to-br from-primary via-blue-500 to-indigo-600 text-white 
                                         rounded-xl font-semibold shadow-[0_20px_40px_-8px_rgba(79,70,229,0.5)]
                                         hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.7)]
                                         overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-primary 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10">Find Doctors</span>
                                <FaArrowRight className="relative z-10 text-lg group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/doctors')}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                                         bg-white text-primary rounded-xl font-semibold
                                         shadow-[0_10px_30px_-8px_rgba(0,0,0,0.1)]
                                         hover:shadow-[0_20px_40px_-8px_rgba(0,0,0,0.2)]
                                         overflow-hidden border-2 border-primary/10 transition-all duration-300"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-50 via-white to-gray-50 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                    Book Appointment
                                </span>
                                <FaCalendarCheck className="relative z-10 text-lg text-primary group-hover:scale-110 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Content - Hero Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:w-1/2 relative"
                    >
                        <div className="relative">
                            {/* Main Image */}
                            <img
                                src="/header_img.png"
                                alt="Healthcare Professional"
                                className="w-full h-auto rounded-2xl shadow-2xl"
                            />
                            
                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <FaHospital className="text-primary text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">24/7 Service</div>
                                        <div className="text-xs text-gray-600">Always available</div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <FaUserMd className="text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Expert Doctors</div>
                                        <div className="text-xs text-gray-600">Qualified professionals</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Banner