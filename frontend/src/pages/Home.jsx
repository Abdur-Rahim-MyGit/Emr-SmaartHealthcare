import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUserMd, FaCalendarCheck, FaHospital, FaHeartbeat, FaClock, FaUserFriends, FaAward, FaPhoneAlt, FaQuoteLeft } from 'react-icons/fa'
import { RiMentalHealthFill } from 'react-icons/ri'
import { HiOutlineArrowNarrowRight } from 'react-icons/hi'

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const features = [
        {
            icon: <FaUserMd className="w-8 h-8" />,
            title: "Expert Doctors",
            description: "Our team of highly qualified doctors provides personalized care and treatment."
        },
        {
            icon: <FaCalendarCheck className="w-8 h-8" />,
            title: "Easy Appointments",
            description: "Book appointments online with just a few clicks, anytime, anywhere."
        },
        {
            icon: <RiMentalHealthFill className="w-8 h-8" />,
            title: "Comprehensive Care",
            description: "From diagnosis to treatment, we provide complete healthcare solutions."
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
            <div className="relative min-h-[90vh] bg-gradient-to-br from-primary/5 via-primary/10 to-transparent overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ duration: 2 }}
                        className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
                    />
                </div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>

                {/* Floating Elements */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 right-[20%] w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                >
                    <FaHeartbeat className="w-10 h-10 text-primary" />
                </motion.div>

                <motion.div
                    animate={{
                        y: [0, 20, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-32 left-[15%] w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                >
                    <FaUserMd className="w-8 h-8 text-primary" />
                </motion.div>

                {/* Main Content */}
                <div className="container mx-auto px-6 h-full flex items-center relative z-10">
                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-primary font-medium shadow-sm">
                                <FaAward className="w-5 h-5" />
                                <span>Trusted Healthcare Provider</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-bold">
                                Your Health
                                <div className="relative">
                                    <span className="text-primary block mt-2">Our Priority</span>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="absolute -bottom-2 left-0 h-1 bg-primary/20 rounded-full"
                                    />
                                </div>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Experience world-class healthcare with our team of expert doctors. 
                                Book your appointment today and take the first step towards better health.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative bg-gradient-to-r from-primary via-primary/90 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium 
                                             transition-all duration-300 shadow-[0_10px_20px_-3px_rgba(79,70,229,0.3)] hover:shadow-[0_20px_30px_-3px_rgba(79,70,229,0.4)]
                                             flex items-center gap-3 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-primary/90 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10">Book Appointment</span>
                                    <HiOutlineArrowNarrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative bg-gradient-to-r from-white to-gray-50 text-transparent bg-clip-text px-8 py-4 rounded-xl text-lg font-medium 
                                             transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-primary/20 hover:border-primary/30
                                             flex items-center gap-2"
                                >
                                    <FaPhoneAlt className="w-5 h-5 text-primary" />
                                    <span className="bg-gradient-to-r from-primary to-blue-600 text-transparent bg-clip-text font-semibold">Contact Us</span>
                                </motion.button>
                            </div>

                            {/* Stats Preview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-8 pt-8"
                            >
                                {stats.slice(0, 2).map((stat, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center text-primary">
                                            {stat.icon}
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                            <div className="text-sm text-gray-500">{stat.label}</div>
                                        </div>
                                    </div>
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
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="bg-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
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
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience the best healthcare services with our state-of-the-art facilities and expert medical professionals.
                        </p>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-primary mb-6">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold mb-4">What Our Patients Say</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Read about the experiences of our patients and how we've helped them with their healthcare needs.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
                            >
                                <div className="absolute top-8 right-8 text-primary/10 text-4xl">
                                    <FaQuoteLeft />
                                </div>
                                
                                <div className="flex items-center gap-4 mb-6">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/10"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                                        <p className="text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 relative z-10">
                                    "{testimonial.quote}"
                                </p>

                                <div className="flex gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-5 h-5 text-yellow-400"
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
                            to="/appointment"
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