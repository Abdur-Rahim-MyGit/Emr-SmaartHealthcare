import React, { useEffect, useContext, useState } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import MyAppointments from './pages/MyAppointments';
import MyProfile from './pages/MyProfile';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify';
import Banner from './components/Banner';
import MedicalServices from './components/MedicalServices';
import TopDoctors from './components/TopDoctors';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import { AppContext } from './context/AppContext';

const API_BASE = import.meta.env.VITE_API_URL;

import Features from './components/Features';
import DoctorContextProvider from './context/DoctorContext';
import MedicalRecords from './pages/MedicalRecords';
import Services from './pages/Services';
import AppointmentBooking from './pages/AppointmentBooking';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AppContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const navigate = useNavigate();
  const { token, setToken } = useContext(AppContext);

  // State for controlling appointment modal
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    // If no token in context, check localStorage and set it if found
    if (!token) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      } else {
        // No token at all, no need to fetch profile
        return;
      }
    }

    // Fetch user profile only if token exists
    fetch(`${API_BASE}/api/user/get-profile`, {
      headers: {
        Authorization: `Bearer ${token || localStorage.getItem('token')}`,
      },
    })
      .then(async (res) => {
        if (res.status === 401) {
          // Unauthorized: token invalid or expired
          // Clear token and redirect to login
          setToken(null);
          localStorage.removeItem('token');
          navigate('/login');
          throw new Error('Unauthorized, please login again');
        }
        if (!res.ok) {
          // Other errors
          const errorText = await res.text();
          throw new Error(errorText || 'Failed to fetch profile');
        }
        return res.json();
      })
      .then((data) => {
        console.log('User profile:', data);
        // Optionally you can set user data in context here
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
      });
  }, [token, setToken, navigate]);

  const openAppointmentModal = () => setShowAppointmentModal(true);
  const closeAppointmentModal = () => setShowAppointmentModal(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer />
      <DoctorContextProvider>
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route
              path="/"
              element={
                <div className="flex flex-col space-y-0">
                  <div className="min-h-screen">
                    <Banner />
                    <div className="py-4">
                      <Features />
                    </div>
                    <div className="py-4">
                      <MedicalServices />
                    </div>
                    <div className="py-4">
                      <TopDoctors />
                    </div>
                    <div className="py-4">
                      <Testimonials />
                    </div>
                    <div className="py-4">
                      <CallToAction />
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/home" element={<Home openAppointmentModal={openAppointmentModal} />} />
            <Route path="/doctors" element={<Doctors openAppointmentModal={openAppointmentModal} />} />
            <Route path="/doctors/:speciality" element={<Doctors openAppointmentModal={openAppointmentModal} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointment/:docId" element={<Navigate to="/services" replace />} />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <MyAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/verify" element={<Verify />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/services" element={<Services openAppointmentModal={openAppointmentModal} />} />
          </Routes>
        </main>
        {showAppointmentModal && <AppointmentBooking onClose={closeAppointmentModal} />}
      </DoctorContextProvider>
      <Footer />
    </div>
  );
};

export default App;
