import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaUsers, FaUserMd } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DoctorSidebar = () => {
  const menuItems = [
    { path: '/doctor-dashboard', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/doctor-appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/doctor/patients-list', name: 'Patient List', icon: <FaUsers /> },
    { path: '/doctor/clinical-records', name: 'Clinical Records', icon: <FaUserMd /> },
    { path: '/doctor-profile', name: 'Profile', icon: <FaUserMd /> },
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">SMAART</h1>
        <p className="text-sm text-gray-600">Doctor Panel</p>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                ${isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`
              }
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
              </motion.div>
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default DoctorSidebar; 