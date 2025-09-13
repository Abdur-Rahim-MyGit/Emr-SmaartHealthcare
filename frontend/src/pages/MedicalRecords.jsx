import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../config/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaNotesMedical, FaClipboardList, FaPills, FaHeartbeat } from 'react-icons/fa';

const MedicalRecords = () => {
  const { token, userData } = useContext(AppContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/user/medical-records');
        if (data.success) {
          setRecords(data.records);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch medical records');
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [token, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading medical records...</div>;
  }

  if (!records.length) {
    return <div className="flex flex-col justify-center items-center min-h-screen pt-16">
      <p className="text-gray-500 text-lg">No medical records found.</p>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Medical Records</h1>
      <div className="space-y-8">
        {records.map((rec) => (
          <div key={rec._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <FaClipboardList className="text-primary text-2xl" />
              <div className="font-semibold text-lg text-gray-900 flex-1">{new Date(rec.encounterDate).toLocaleDateString()}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaUserMd /> {rec.consultedDoctor?.name || 'N/A'}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div className="mb-2"><span className="font-semibold"><FaNotesMedical className='inline mr-1' /> Diagnosis:</span> {rec.diagnosis}</div>
              <div className="mb-2"><span className="font-semibold"><FaHeartbeat className='inline mr-1' /> Status:</span> {rec.currentClinicalStatus}</div>
            </div>
            <div className="mb-2"><span className="font-semibold">Treatment:</span> {rec.treatment}</div>
            {rec.notes && <div className="mb-2"><span className="font-semibold">Notes:</span> {rec.notes}</div>}
            {rec.prescription && rec.prescription.length > 0 && (
              <div className="mb-2 bg-gray-50 rounded-lg p-4 mt-2">
                <span className="font-semibold flex items-center mb-2"><FaPills className='mr-2' />Prescriptions:</span>
                <ul className="list-disc ml-6 mt-1 space-y-1">
                  {rec.prescription.map((presc, idx) => (
                    <li key={idx} className="mb-1">
                      <span className="font-medium">{presc.medicine}</span> - {presc.dosage}, {presc.frequency}, {presc.duration}
                      {presc.notes && <span className="text-gray-500"> ({presc.notes})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecords; 