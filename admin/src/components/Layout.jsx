import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import AdminSidebar from './AdminSidebar';
import DoctorSidebar from './DoctorSidebar';
import AdminNavbar from './Navbar';
import DoctorNavbar from './DoctorNavbar';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { aToken } = useContext(AdminContext);
  const { dToken, getProfileData } = useContext(DoctorContext);

  useEffect(() => {
    // If no tokens, redirect to login
    if (!aToken && !dToken) {
      navigate('/');
      return;
    }

    // If doctor is logged in, fetch their profile data
    if (dToken) {
      getProfileData();
    }
  }, [aToken, dToken, navigate, getProfileData]);

  // Determine which components to render based on token
  const renderSidebar = () => {
    if (aToken) return <AdminSidebar />;
    if (dToken) return <DoctorSidebar />;
    return null;
  };

  const renderNavbar = () => {
    if (aToken) return <AdminNavbar />;
    if (dToken) return <DoctorNavbar />;
    return null;
  };

  if (!aToken && !dToken) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {renderNavbar()}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;