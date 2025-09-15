import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { FaHome, FaUserPlus, FaUserMd, FaUsers, FaCalendarAlt, FaNotesMedical, FaUserShield } from 'react-icons/fa'

const AdminSidebar = () => {
  const { profileData } = useContext(AdminContext)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const menuItems = [
    { path: '/admin-dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/all-appointments', icon: <FaCalendarAlt />, label: 'Appointments' },
    { path: '/add-doctor', icon: <FaUserPlus />, label: 'Add Doctor' },
    { path: '/add-patient', icon: <FaUserPlus />, label: 'Add Patient' },
    { path: '/doctor-list', icon: <FaUserMd />, label: 'Doctors List' },
    { path: '/patients-list', icon: <FaUsers />, label: 'Patients List' },
    { path: '/billing', icon: <FaNotesMedical />, label: 'Billing' }
  ]

  return (
    <div className={`bg-white border-r shadow-sm h-full flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="text-xl font-bold text-primary">Admin Panel</h2>}
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
              {!isCollapsed && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {!isCollapsed && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center gap-3">
            <FaUserShield className="w-10 h-10 text-primary" />
            <div>
              <p className="font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSidebar