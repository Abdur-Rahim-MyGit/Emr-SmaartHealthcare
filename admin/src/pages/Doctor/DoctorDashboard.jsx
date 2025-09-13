import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { motion } from 'framer-motion';
import { FaUserInjured, FaCalendarCheck, FaCalendarTimes, FaCalendarAlt, FaUserFriends, FaMoneyBillWave, FaCheckCircle } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';

const DoctorDashboard = () => {
  const { dashData, getDashData, loading, isInitialized, profileData } = useContext(DoctorContext);

  useEffect(() => {
    if (isInitialized && !dashData) {
      getDashData();
    }
  }, [isInitialized]);

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

      {/* Recent Appointments Section */}
      {dashData?.recentAppointments && dashData.recentAppointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
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