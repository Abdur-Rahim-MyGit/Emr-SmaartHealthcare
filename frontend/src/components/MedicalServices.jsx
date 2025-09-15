import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStethoscope, FaHeartbeat, FaTooth, FaBrain } from 'react-icons/fa';
import { GiMedicines, GiLungs } from 'react-icons/gi';
import { MdChildCare } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import { IoIosFitness } from 'react-icons/io';
import { RiMentalHealthLine } from 'react-icons/ri';

const services = [
  { icon: <FaStethoscope className="w-8 h-8" />, name: 'General Medicine', color: 'blue' },
  // { icon: <FaHeartbeat className="w-8 h-8" />, name: 'Cardiology', color: 'red' },
  // { icon: <FaTooth className="w-8 h-8" />, name: 'Dental Care', color: 'cyan' },
  { icon: <FaBrain className="w-8 h-8" />, name: 'SMAART Balance', color: 'purple' },
  // { icon: <MdChildCare className="w-8 h-8" />, name: 'Pediatrics', color: 'pink' },
  { icon: <AiOutlineEye className="w-8 h-8" />, name: 'SMAART Eyes', color: 'green' },
    { icon: <RiMentalHealthLine className="w-8 h-8" />, name: 'SMAART Minds', color: 'rose' },

  { icon: <IoIosFitness className="w-8 h-8" />, name: 'SMAART Physio', color: 'orange' },
  // { icon: <GiLungs className="w-8 h-8" />, name: 'Pulmonology', color: 'teal' },
  // { icon: <GiMedicines className="w-8 h-8" />, name: 'Allergology', color: 'yellow' },
];

const MedicalServices = () => {
  const navigate = useNavigate();

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
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Medical Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare solutions tailored to your needs. Our expert team provides
            specialized care across multiple disciplines.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/doctors/${service.name}`)}
            >
              <div className={`relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl 
                              transition-all duration-300 border border-${service.color}-100
                              hover:border-${service.color}-200`}
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-${service.color}-50 
                                rounded-bl-full rounded-tr-2xl opacity-50 transition-opacity
                                group-hover:opacity-100`}>
                </div>
                
                <div className="relative">
                  <div className={`w-16 h-16 rounded-xl bg-${service.color}-100 
                                 flex items-center justify-center mb-4 
                                 group-hover:bg-${service.color}-200 transition-colors`}
                  >
                    <div className={`text-${service.color}-600`}>
                      {service.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4">
                    Expert care and treatment in {service.name.toLowerCase()}
                  </p>
                  
                  <div className={`inline-flex items-center text-${service.color}-600 
                                 text-sm font-medium group-hover:underline`}
                  >
                    Learn more
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" 
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" 
                            strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default MedicalServices; 