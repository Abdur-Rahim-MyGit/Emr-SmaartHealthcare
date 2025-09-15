import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaUsers, FaUserMd, FaUserShield } from 'react-icons/fa';
import { assets } from '../assets/assets';

const DoctorSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { path: '/doctor-dashboard', name: 'Dashboard', icon: <FaChartLine /> },
    { path: '/doctor-appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/doctor/patients-list', name: 'Patient List', icon: <FaUsers /> },
    { path: '/doctor-profile', name: 'Profile', icon: <FaUserMd /> },
  ];

  return (
    <div className={`bg-white border-r shadow-sm h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="text-xl font-bold text-primary">Doctor Panel</h2>}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <img 
            src={isCollapsed ? assets.expand_icon : assets.collapse_icon} 
            alt="Toggle Sidebar" 
            className="w-5 h-5"
          />
        </button>
      </div>

      <ul className="py-4 flex-1">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 py-3 px-4 mx-2 rounded-lg
                transition-all duration-200
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {!isCollapsed && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3">
            <FaUserShield className="w-10 h-10 text-primary" />
            <div>
              <p className="font-medium text-gray-900">Doctor</p>
              <p className="text-xs text-gray-500">Medical Professional</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSidebar; 