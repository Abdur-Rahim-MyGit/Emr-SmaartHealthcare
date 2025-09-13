import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { FaSignOutAlt, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

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
    <nav className="bg-white border-b px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {profileData?.name ? `Dr. ${profileData.name}'s Dashboard` : 'Doctor Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaBell className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {profileData?.image && (
              <img
                src={profileData.image}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">
                {profileData?.name ? `Dr. ${profileData.name}` : 'Doctor'}
              </p>
              <p className="text-xs text-gray-500">{profileData?.speciality}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar; 