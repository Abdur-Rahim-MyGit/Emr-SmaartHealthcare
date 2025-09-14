import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUserMd, FaCalendarCheck, FaHospital, FaHeartbeat, FaClock, FaUserFriends, FaAward, FaPhoneAlt, FaQuoteLeft, FaEye } from 'react-icons/fa'
import { RiMentalHealthFill } from 'react-icons/ri'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const features = [
        {
            icon: <FaUserMd className="w-8 h-8" />,
            title: "Medical Excellence",
            description: "Global quality standards with precision medicine and outcome-driven approach."
        },
        {
            icon: <FaCalendarCheck className="w-8 h-8" />,
            title: "Accessible & Affordable",
            description: "Telehealth services for convenience & accessibility with affordable healthcare solutions."
        },
        {
            icon: <FaEye className="w-8 h-8" />,
            title: "Technology Driven",
            description: "Advanced AI-powered healthcare combining physical and digital treatment modalities."
        }
    ];

    const stats = [
        { icon: <FaUserMd />, value: "50+", label: "Expert Doctors" },
        { icon: <FaUserFriends />, value: "10k+", label: "Happy Patients" },
        { icon: <FaAward />, value: "15+", label: "Years Experience" },
        { icon: <FaHospital />, value: "99%", label: "Success Rate" }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Regular Patient",
            image: "/avatars/avatar1.jpg",
            quote: "The doctors here are incredibly professional and caring. The online booking system made it so easy to schedule my appointments.",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Regular Patient",
            image: "/avatars/avatar2.jpg",
            quote: "I've been coming here for years. The medical care is top-notch, and the staff is always friendly and helpful.",
            rating: 5
        },
        {
            name: "Emily Rodriguez",
            role: "Patient",
            image: "/avatars/avatar3.jpg",
            quote: "The facility is modern and clean. I appreciate how the doctors take time to explain everything thoroughly.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative min-h-[90vh] bg-gradient-to-br from-gray-50 via-blue-50/30 to-teal-50/20 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -100 }}
                        animate={{ 
                            opacity: [0.2, 0.4, 0.2], 
                            scale: [0.8, 1.2, 0.8],
                            x: [-100, 0, -100],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ 
                            duration: 8, 
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 100 }}
                        animate={{ 
                            opacity: [0.1, 0.3, 0.1], 
                            scale: [0.5, 1.5, 0.5],
                            y: [100, -50, 100],
                            rotate: [0, -180, -360]
                        }}
                        transition={{ 
                            duration: 10, 
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2
                        }}
                        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ 
                            opacity: [0.1, 0.25, 0.1], 
                            scale: [0.3, 1, 0.3],
                            rotate: [0, 360, 720]
                        }}
                        transition={{ 
                            duration: 12, 
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/15 rounded-full blur-3xl"
                    />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>

                {/* Enhanced Floating Elements */}
                <motion.div
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{
                        opacity: 1,
                        scale: [0.8, 1.2, 0.8],
                        y: [0, -30, 0],
                        rotate: [0, 360, 0],
                        x: [0, 10, 0]
                    }}
                    transition={{
                        opacity: { duration: 1 },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        x: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    whileHover={{ scale: 1.5, rotate: 180 }}
                    className="absolute top-20 right-[20%] w-20 h-20 bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer"
                >
                    <motion.div
                        animate={{ rotate: [0, -360, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                        <FaHeartbeat className="w-10 h-10 text-primary" />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0, x: -100 }}
                    animate={{
                        opacity: 1,
                        scale: [0.9, 1.1, 0.9],
                        y: [0, 25, 0],
                        x: [0, 15, 0],
                        rotate: [0, -10, 10, 0]
                    }}
                    transition={{
                        opacity: { duration: 1.2, delay: 0.5 },
                        scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                        y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 },
                        x: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
                        rotate: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }
                    }}
                    whileHover={{ scale: 1.4, y: -20 }}
                    className="absolute bottom-32 left-[15%] w-16 h-16 bg-gradient-to-br from-white via-teal-50 to-white rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <FaUserMd className="w-8 h-8 text-primary" />
                    </motion.div>
                </motion.div>

                {/* Additional Floating Elements */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                        opacity: [0.7, 1, 0.7],
                        y: [0, -20, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute top-1/3 left-[5%] w-12 h-12 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full shadow-lg flex items-center justify-center"
                >
                    <FaHospital className="w-6 h-6 text-primary" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{
                        opacity: [0.6, 0.9, 0.6],
                        x: [0, -15, 0],
                        scale: [0.8, 1.1, 0.8]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 3
                    }}
                    className="absolute bottom-1/3 right-[8%] w-14 h-14 bg-gradient-to-br from-teal-100 to-primary/10 rounded-xl shadow-lg flex items-center justify-center"
                >
                    <FaCalendarCheck className="w-7 h-7 text-primary" />
                </motion.div>

                {/* Main Content */}
                <div className="container mx-auto px-6 h-full flex items-center relative z-10">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ 
                                duration: 1.2, 
                                ease: "easeOut",
                                staggerChildren: 0.2
                            }}
                            className="space-y-8"
                        >
                            <motion.div 
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                whileHover={{ scale: 1.05, x: 10 }}
                                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-primary font-medium shadow-sm cursor-pointer"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                >
                                    <FaAward className="w-5 h-5" />
                                </motion.div>
                                <span>Advanced Healthcare Powered with AI</span>
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 1 }}
                                className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-primary to-teal-600 bg-clip-text text-transparent"
                            >
                                <motion.span
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7, duration: 0.8 }}
                                >
                                    SMAART{" "}
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9, duration: 0.8 }}
                                >
                                    Healthcare
                                </motion.span>
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.8 }}
                                className="text-xl text-gray-600 leading-relaxed"
                            >
                                Multispecialty Phygital Clinics combining physical & digital healthcare. 
                                Seamless blend of preventive care, diagnostics, advanced treatment, and compassionate patient-centric care.
                            </motion.p>
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.3, duration: 0.8 }}
                                className="flex flex-wrap gap-4"
                            >
                                <motion.button
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.5, duration: 0.6 }}
                                    whileHover={{ 
                                        scale: 1.05, 
                                        boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4)",
                                        y: -2
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium 
                                             transition-all duration-300 shadow-lg hover:shadow-2xl
                                             flex items-center gap-3 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10">Book Appointment</span>
                                    <HiOutlineArrowNarrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1.7, duration: 0.6 }}
                                    whileHover={{ 
                                        scale: 1.05, 
                                        boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.2)",
                                        y: -2,
                                        borderColor: "rgba(79, 70, 229, 0.5)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    className="group relative bg-white text-primary px-8 py-4 rounded-xl text-lg font-medium 
                                             transition-all duration-300 shadow-lg hover:shadow-xl border border-primary/20 hover:border-primary/30
                                             flex items-center gap-2"
                                >
                                    <FaPhoneAlt className="w-5 h-5 text-primary" />
                                    <span className="bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text font-semibold">Contact Us</span>
                                </motion.button>
                            </motion.div>

                            {/* Stats Preview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.9, duration: 0.8 }}
                                className="flex items-center gap-8 pt-8"
                            >
                                {stats.slice(0, 2).map((stat, index) => (
                                    <motion.div 
                                        key={index} 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 2.1 + index * 0.2, duration: 0.6 }}
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        className="flex items-center gap-3"
                                    >
                                        <motion.div 
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-primary"
                                        >
                                            {stat.icon}
                                        </motion.div>
                                        <div>
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 2.3 + index * 0.2 }}
                                                className="text-2xl font-bold text-gray-900"
                                            >
                                                {stat.value}
                                            </motion.div>
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 2.5 + index * 0.2 }}
                                                className="text-sm text-gray-500"
                                            >
                                                {stat.label}
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block relative"
                        >
                            <div className="relative">
                                <img 
                                    src="/images/doctor-hero.png" 
                                    alt="Doctor" 
                                    className="w-full h-auto max-w-2xl mx-auto drop-shadow-2xl relative z-10"
                                />
                                {/* Background Glow */}
                                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-3xl z-0"></div>
                            </div>

                            {/* Floating Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-3 rounded-xl">
                                        <FaClock className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Working Hours</p>
                                        <p className="font-semibold">24/7 Available</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Experience Badge */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                                className="absolute -top-5 -right-5 bg-white px-6 py-3 rounded-xl shadow-xl"
                            >
                                <div className="flex items-center gap-3">
                                    <FaAward className="w-6 h-6 text-primary" />
                                    <div>
                                        <p className="font-semibold text-gray-900">15+ Years</p>
                                        <p className="text-sm text-gray-500">Experience</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-gradient-to-br from-white via-blue-50/10 to-teal-50/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center bg-gradient-to-br from-white via-white to-blue-50/20 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 backdrop-blur-sm"
                            >
                                <div className="bg-gradient-to-br from-primary/10 to-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-gray-500">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                            <FaHeartbeat className="text-primary" />
                            Why Choose Us
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the best healthcare services with our state-of-the-art facilities and expert medical professionals.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-gradient-to-br from-white via-white to-blue-50/20 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-white/50 backdrop-blur-sm"
                            >
                                <div className="relative aspect-[3/2] overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-blue-100 to-teal-100 flex items-center justify-center group-hover:from-primary/30 group-hover:via-blue-200 group-hover:to-teal-200 transition-all duration-300">
                                        {React.cloneElement(feature.icon, { className: "text-primary text-6xl" })}
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                                        <div className="absolute bottom-4 left-4">
                                            <div className="flex items-center gap-2 text-white">
                                                <FaHeartbeat className="w-5 h-5" />
                                                <span className="font-medium">Healthcare Excellence</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-20 bg-gradient-to-br from-white via-blue-50/10 to-teal-50/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                            <FaQuoteLeft className="text-primary" />
                            What Our Patients Say
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Read about the experiences of our patients and how we've helped them with their healthcare needs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-gradient-to-br from-white via-white to-blue-50/20 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 backdrop-blur-sm relative"
                            >
                                <div className="absolute top-6 right-6 text-primary/10 text-3xl">
                                    <FaQuoteLeft />
                                </div>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 relative z-10">
                                    "{testimonial.quote}"
                                </p>

                                <div className="flex gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-4 h-4 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative py-20 bg-primary overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative max-w-7xl mx-auto px-4 text-center"
                >
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Take Care of Your Health?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Book an appointment with our expert doctors and start your journey to better health today.
                    </p>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            to="/services"
                            className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-white via-gray-50 to-white text-primary px-8 py-4 rounded-xl text-lg font-semibold 
                                     transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-white/50 hover:border-white/70"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                            <FaCalendarCheck className="relative z-10" />
                            <span className="relative z-10">Book Appointment Now</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Cases</h3>
                            <p className="text-gray-600">24/7 Emergency Medical Care Available</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-primary to-blue-600 p-4 rounded-full shadow-lg">
                                <FaPhoneAlt className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Emergency Contact</p>
                                <p className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text">+1 234 567 890</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Home