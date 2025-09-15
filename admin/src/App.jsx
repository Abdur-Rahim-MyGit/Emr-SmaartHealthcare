import React, { useContext } from 'react';
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, Navigate } from 'react-router-dom';
import Billing from './pages/Admin/Billing.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AppointmentDetails from './pages/Admin/AppointmentDetails';
import ScheduleWithDoctor from './pages/Admin/ScheduleWithDoctor';
import AddDoctor from './pages/Admin/AddDoctor';
import AddPatient from './pages/Admin/AddPatient';
import DoctorsList from './pages/Admin/DoctorsList';
import PatientsList from './pages/Admin/PatientsList';
import PatientDetails from './pages/Admin/PatientDetails';
import PatientConsultation from './pages/Doctor/PatientConsultation';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorPatientsList from './pages/Doctor/PatientsList';
import DoctorPatientDetails from './pages/Doctor/PatientDetails';

const AdminRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  if (!aToken) {
    return <Navigate to="/" />;
  }
  return children;
};

const DoctorRoute = ({ children }) => {
  const { dToken } = useContext(DoctorContext);
  if (!dToken) {
    return <Navigate to="/" />;
  }
  return children;
};

const App = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);

  return (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      {(dToken || aToken) ? (
        <Layout>
          <Routes>
            {/* Admin Routes */}
            <Route path='/' element={aToken ? <Navigate to="/admin-dashboard" /> : <Navigate to="/doctor-dashboard" />} />
            <Route path='/admin-dashboard' element={<AdminRoute><Dashboard /></AdminRoute>} />
            <Route path='/all-appointments' element={<AdminRoute><AllAppointments /></AdminRoute>} />
            <Route path='/admin/appointment-details' element={<AdminRoute><AppointmentDetails /></AdminRoute>} />
            <Route path='/admin/schedule-appointment' element={<AdminRoute><ScheduleWithDoctor /></AdminRoute>} />
            <Route path='/add-doctor' element={<AdminRoute><AddDoctor /></AdminRoute>} />
            <Route path='/add-patient' element={<AdminRoute><AddPatient /></AdminRoute>} />
            <Route path='/doctor-list' element={<AdminRoute><DoctorsList /></AdminRoute>} />
            <Route path='/patients-list' element={<AdminRoute><PatientsList /></AdminRoute>} />
            <Route path="/patient-details/:patientId" element={<PatientDetails />} />
            <Route path="/patient-consultation/:patientId" element={<PatientConsultation />} />
            <Route path='/billing' element={<AdminRoute><Billing /></AdminRoute>} />
            
            {/* Doctor Routes */}
            <Route path='/doctor-dashboard' element={<DoctorRoute><DoctorDashboard /></DoctorRoute>} />
            <Route path='/doctor-appointments' element={<DoctorRoute><DoctorAppointments /></DoctorRoute>} />
            <Route path='/doctor-profile' element={<DoctorRoute><DoctorProfile /></DoctorRoute>} />
            <Route path='/doctor/patients-list' element={<DoctorRoute><DoctorPatientsList /></DoctorRoute>} />
            <Route path='/doctor/patient-details/:patientId' element={<DoctorRoute><DoctorPatientDetails /></DoctorRoute>} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path='*' element={<Login />} />
        </Routes>
      )}
    </div>
  );
};

export default App;