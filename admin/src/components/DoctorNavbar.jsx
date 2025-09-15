import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { FaSignOutAlt, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import logoSvg from '../assets/lOGOSmaart.svg';

const DoctorNavbar = () => {
  const navigate = useNavigate();
  const { setDToken, profileData } = useContext(DoctorContext);

  const handleLogout = () => {
    localStorage.removeItem('dToken');
    setDToken('');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoSvg} 
              alt="SMAART Healthcare Logo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {profileData?.name ? `Dr. ${profileData.name}` : 'Doctor'}
                </p>
                <p className="text-xs text-gray-500">{profileData?.speciality || 'Specialist'}</p>
              </div>
              {profileData?.image ? (
                <img
                  src={profileData.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <img 
                  src="https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff"
                  alt="Profile" 
                  className="w-10 h-10 rounded-full ring-2 ring-primary/20"
                />
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;