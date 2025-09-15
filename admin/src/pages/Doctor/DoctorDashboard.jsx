import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { motion } from 'framer-motion';
import { FaUserInjured, FaCalendarCheck, FaCalendarTimes, FaCalendarAlt, FaUserFriends, FaMoneyBillWave, FaCheckCircle, FaSearch, FaStethoscope } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import axios from 'axios';

const DoctorDashboard = () => {
  const { dashData, getDashData, loading, isInitialized, profileData, dToken, backendUrl } = useContext(DoctorContext);
  const navigate = useNavigate();
  
  const [scheduledPatients, setScheduledPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientsLoading, setPatientsLoading] = useState(false);

  useEffect(() => {
    if (isInitialized && !dashData) {
      getDashData();
    }
    if (isInitialized && dToken) {
      fetchScheduledPatients();
    }
  }, [isInitialized, dToken]);

  const fetchScheduledPatients = async () => {
    try {
      setPatientsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await axios.get(`${backendUrl}/api/doctor/scheduled-patients?date=${today}`, {
        headers: { Authorization: `Bearer ${dToken}` }
      });
      
      if (response.data.success) {
        setScheduledPatients(response.data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching scheduled patients:', error);
    } finally {
      setPatientsLoading(false);
    }
  };

  const handlePatientConsultation = (patientId) => {
    navigate(`/patient-consultation/${patientId}`);
  };

  const filteredPatients = scheduledPatients.filter(patient =>
    patient.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.uhid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Patients',
      value: dashData?.totalPatients || 0,
      icon: <FaUserFriends className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100'
    },
    {
      title: "Today's Appointments",
      value: dashData?.todayAppointments || 0,
      icon: <FaCalendarCheck className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Pending Appointments',
      value: dashData?.pendingAppointments || 0,
      icon: <FaCalendarTimes className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-100'
    },
    {
      title: 'Total Appointments',
      value: dashData?.totalAppointments || 0,
      icon: <FaCalendarCheck className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Completed Appointments',
      value: dashData?.completedAppointments || 0,
      icon: <FaCheckCircle className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100'
    },
    {
      title: 'Total Earnings',
      value: `$${dashData?.earnings || 0}`,
      icon: <FaMoneyBillWave className="w-6 h-6 text-yellow-600" />,
      color: 'bg-yellow-100'
    }
  ];

  if (!isInitialized || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Dr. {profileData?.name || 'Doctor'}</h1>
        <p className="text-gray-600">Here's an overview of your practice</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Today's Scheduled Patients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Today's Scheduled Patients</h2>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or UHID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          {patientsLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredPatients.length > 0 ? (
            <div className="grid gap-4">
              {filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient._id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUserInjured className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.patientName || patient.name}</h3>
                      <p className="text-sm text-gray-600">UHID: {patient.uhid || 'Not assigned'}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Age: {patient.age || 'N/A'}</span>
                        <span>Gender: {patient.gender || 'Not specified'}</span>
                        {patient.appointmentTime && (
                          <span>Time: {patient.appointmentTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePatientConsultation(patient._id)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaStethoscope className="mr-2" />
                    Start Consultation
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaCalendarAlt className="mx-auto w-12 h-12 mb-3 text-gray-300" />
              <p>No scheduled patients for today</p>
              {searchTerm && (
                <p className="text-sm mt-2">No patients found matching "{searchTerm}"</p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Appointments Section */}
      {dashData?.recentAppointments && dashData.recentAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Appointments</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="pb-4">Patient</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Time</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashData.recentAppointments.map((appointment, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-t"
                    >
                      <td className="py-4">{appointment.patientName}</td>
                      <td className="py-4">{new Date(appointment.date).toLocaleDateString()}</td>
                      <td className="py-4">{appointment.time}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DoctorDashboard;