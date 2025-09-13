import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaHeart } from 'react-icons/fa'

const Footer = () => {
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

  const socialLinks = [
    { icon: <FaFacebookF />, href: '#', color: 'hover:bg-blue-600' },
    { icon: <FaTwitter />, href: '#', color: 'hover:bg-sky-500' },
    { icon: <FaInstagram />, href: '#', color: 'hover:bg-pink-600' },
    { icon: <FaLinkedinIn />, href: '#', color: 'hover:bg-blue-700' },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          {/* Company Info */}
          <motion.div variants={item} className="space-y-6">
            <Link to="/" className="block">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                SMAART Healthcare
              </span>
            </Link>
            <p className="text-gray-600 leading-relaxed">
              Empowering healthcare through innovative solutions and compassionate care. Your health is our priority.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors duration-300 ${social.color} bg-gray-800`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item} className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/doctors', label: 'Find Doctors' },
                { to: '/contact', label: 'Contact' },
              ].map((link, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link 
                    to={link.to}
                    className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span className="h-px w-4 bg-primary/50"></span>
                    <span>{link.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={item} className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Our Services</h4>
            <ul className="space-y-3">
              {[
                { to: '/services/appointments', label: 'Online Appointments' },
                { to: '/services/emergency', label: 'Emergency Care' },
                { to: '/services/telemedicine', label: 'Telemedicine' },
                { to: '/services/medical-records', label: 'Medical Records' },
              ].map((service, index) => (
                <motion.li key={index} whileHover={{ x: 5 }}>
                  <Link 
                    to={service.to}
                    className="text-gray-600 hover:text-primary transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span className="h-px w-4 bg-primary/50"></span>
                    <span>{service.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={item} className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Contact Info</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+1234567890" className="flex items-start space-x-3 group">
                  <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <FaPhoneAlt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Call Us</p>
                    <p className="text-gray-900 font-medium">+91 9444764260</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:contact@example.com" className="flex items-start space-x-3 group">
                  <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <FaEnvelope className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Us</p>
                    <p className="text-gray-900 font-medium">hello@smaarthealtcare.com</p>
                  </div>
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FaClock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Working Hours</p>
                  <p className="text-gray-900 font-medium">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {new Date().getFullYear()} SMAART Healthcare. All rights reserved.
            </p>
            <p className="text-gray-600 text-sm flex items-center gap-1">
              Made with <FaHeart className="text-red-500" /> by SMAART Healthcare Team
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
