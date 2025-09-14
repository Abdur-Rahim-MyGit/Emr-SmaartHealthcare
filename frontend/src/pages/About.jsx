import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineHeart, HiOutlineLightBulb, HiOutlineScale, HiOutlineArrowNarrowRight } from 'react-icons/hi'
import { RiMentalHealthLine, RiHospitalLine, RiUserHeartLine, RiStethoscopeLine } from 'react-icons/ri'
import { TbHeartRateMonitor, TbReportMedical, TbDeviceMobile } from 'react-icons/tb'

const About = () => {
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            SMAART Healthcare - Redefining Medical Excellence
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Multispecialty Phygital Clinics combining physical & digital healthcare with AI-powered precision medicine
          </p>
        </motion.div>
      </div>

      {/* Mission and Vision */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            variants={item}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <RiMentalHealthLine className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To democratize healthcare by making quality medical services accessible and affordable 
              through innovative phygital clinics that combine the best of physical and digital healthcare, 
              powered by AI-driven precision medicine and compassionate patient-centric care.
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <HiOutlineLightBulb className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To become the global leader in phygital healthcare delivery, transforming how patients 
              experience medical care through seamless integration of technology, personalized treatment 
              protocols, and outcome-driven healthcare solutions that set new industry standards.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Values */}
      <div className="bg-white py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide our actions and define our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={item}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-6">
                <HiOutlineHeart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Medical Excellence</h3>
              <p className="text-gray-600">
                Global quality standards with precision medicine, evidence-based protocols, 
                and outcome-driven approach to deliver superior healthcare results.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-6">
                <RiStethoscopeLine className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Accessibility & Affordability</h3>
              <p className="text-gray-600">
                Making quality healthcare accessible to all through telehealth services, 
                affordable pricing, and convenient phygital clinic locations.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex p-4 bg-primary/10 rounded-xl mb-6">
                <HiOutlineScale className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Technology Driven</h3>
              <p className="text-gray-600">
                Advanced AI-powered healthcare combining physical and digital treatment modalities 
                for personalized, data-driven medical solutions.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Facilities */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">State-of-the-Art Facilities</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience healthcare in a modern and comfortable environment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            variants={item}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                alt="Modern Equipment"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 text-white">
                    <TbHeartRateMonitor className="w-5 h-5" />
                    <span className="font-medium">Modern Equipment</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                State-of-the-art medical technology for accurate diagnosis and treatment.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                alt="Comfortable Environment"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 text-white">
                    <RiHospitalLine className="w-5 h-5" />
                    <span className="font-medium">Comfortable Environment</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                A welcoming and relaxing atmosphere for patients and visitors.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                alt="Emergency Care"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-4 left-4">
                  <div className="flex items-center gap-2 text-white">
                    <TbReportMedical className="w-5 h-5" />
                    <span className="font-medium">Emergency Care</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                24/7 emergency services with quick response times.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Healthcare Excellence */}
      <div className="bg-white py-20">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Healthcare Excellence</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Delivering exceptional care through innovation and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              variants={item}
              className="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <RiHospitalLine className="text-primary w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">World-class Technologies</h3>
              <p className="text-gray-600">Equipped with cutting-edge facility for exceptional healthcare</p>
            </motion.div>

            <motion.div
              variants={item}
              className="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <RiUserHeartLine className="text-primary w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Specialists</h3>
              <p className="text-gray-600">Highly skilled and internationally trained specialists</p>
            </motion.div>

            <motion.div
              variants={item}
              className="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <TbDeviceMobile className="text-primary w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Telehealth Services</h3>
              <p className="text-gray-600">Quality care at your fingertips, ensuring accessibility</p>
            </motion.div>

            <motion.div
              variants={item}
              className="bg-gray-50 p-6 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <RiStethoscopeLine className="text-primary w-8 h-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comprehensive Care</h3>
              <p className="text-gray-600">Complete healthcare solutions under one roof</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Your Health Journey Begins Here
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience healthcare that puts you first. Book an appointment today and take the first step towards better health.
          </p>
          <button 
            onClick={() => navigate('/services')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 
                     bg-gradient-to-br from-primary via-blue-500 to-indigo-600 text-white 
                     rounded-xl font-semibold shadow-[0_20px_40px_-8px_rgba(79,70,229,0.5)]
                     hover:shadow-[0_20px_40px_-8px_rgba(79,70,229,0.7)]
                     overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-primary 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Book an Appointment</span>
            <HiOutlineArrowNarrowRight className="relative z-10 text-lg group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default About

