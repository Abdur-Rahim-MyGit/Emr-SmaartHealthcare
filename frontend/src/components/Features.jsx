import React from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaCalendarAlt, FaHospital, FaMobileAlt, FaLock, FaClock } from 'react-icons/fa';

const features = [
    {
        icon: <FaUserMd />,
        title: "Expert Doctors",
        description: "Highly qualified & experienced healthcare professionals across various specialties.",
        color: "blue"
    },
    {
        icon: <FaCalendarAlt />,
        title: "Easy Scheduling",
        description: "Book appointments online with just a few clicks, anytime and anywhere.",
        color: "green"
    },
    {
        icon: <FaHospital />,
        title: "Modern Facilities",
        description: "State-of-the-art medical facilities equipped with the latest technology.",
        color: "purple"
    },
    
    
];

const Features = () => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose SMAART Healthcare?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience healthcare reimagined with our comprehensive suite of
                        features designed to make your medical journey seamless.
                    </p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="relative group"
                        >
                            <div className={`absolute inset-0 bg-${feature.color}-50 rounded-2xl 
                                          transform transition-transform group-hover:scale-105 duration-300`}
                            />
                            <div className="relative p-8 bg-white rounded-2xl shadow-lg 
                                          transform transition-transform group-hover:-translate-y-2 
                                          group-hover:translate-x-2 duration-300"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 
                                              flex items-center justify-center mb-6 text-${feature.color}-600 
                                              text-2xl group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 text-center"
                >
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        Our commitment to excellence in healthcare delivery is backed by years
                        of experience and thousands of satisfied patients. Join us in our
                        mission to make quality healthcare accessible to all.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Features; 