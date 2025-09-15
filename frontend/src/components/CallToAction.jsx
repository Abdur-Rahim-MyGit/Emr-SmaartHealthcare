import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaArrowRight } from 'react-icons/fa';

const CallToAction = () => {
    const navigate = useNavigate();

    return (
        <div className="py-20 bg-gradient-to-r from-primary to-primary/90 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* Floating Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            />
            <motion.div
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-2/3 text-center lg:text-left"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Ready to Take Care of Your Health?
                        </h2>
                        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto lg:mx-0">
                            Book an appointment with our expert doctors and start your journey
                            to better health today. We're here to provide you with the best
                            medical care.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/doctors')}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                                         bg-gradient-to-br from-white via-gray-50 to-gray-100 text-primary 
                                         rounded-xl font-semibold shadow-[0_20px_40px_-8px_rgba(255,255,255,0.3)]
                                         hover:shadow-[0_20px_40px_-8px_rgba(255,255,255,0.5)]
                                         overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-50 via-white to-gray-50 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <FaCalendarCheck className="relative z-10 text-xl group-hover:scale-110 transition-transform" />
                                <span className="relative z-10">Book Appointment Now</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/contact')}
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                                         bg-transparent text-white rounded-xl font-semibold
                                         border-2 border-white/30 hover:border-white/70
                                         overflow-hidden transition-all duration-300"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-white/5 
                                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative z-10">Contact Us</span>
                                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Content - Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="lg:w-1/3"
                    >
                       
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CallToAction; 