import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';

export default function ScheduleWithDoctor() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;
  // Debug: Log appointment object
  useEffect(() => {
    console.log('ScheduleWithDoctor: appointment:', appointment);
  }, [appointment]);
  const { getAllAppointments } = useContext(AdminContext);

  const [doctor, setDoctor] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorList, setDoctorList] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  useEffect(() => {
    // Fetch doctors from backend
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/all-doctors`);
        if (response.data.success) {
          setDoctorList(response.data.doctors);
        }
      } catch (err) {
        // ignore error for now
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (doctor === '') {
      setFilteredDoctors([]);
      setSelectedDoctor(null);
    } else {
      const filtered = doctorList.filter(d =>
        d.name.toLowerCase().includes(doctor.toLowerCase())
      );
      setFilteredDoctors(filtered);
      // If exact match, set selectedDoctor
      const exact = filtered.find(d => d.name.toLowerCase() === doctor.toLowerCase());
      setSelectedDoctor(exact || null);
    }
  }, [doctor, doctorList]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    if (!appointment || !appointment._id) {
      setError('Appointment is not defined. Please go back and select a valid appointment.');
      setSubmitting(false);
      return;
    }
    if (!selectedDoctor) {
      setError('Please select a valid doctor from the list.');
      setSubmitting(false);
      return;
    }
    try {
      // Debug: Log request payload
      console.log('Scheduling appointment:', {
        appointmentId: appointment._id,
        doctor: selectedDoctor.name,
        date,
        time
      });
      // Update appointment in backend
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/schedule-appointment/${appointment._id}`, {
        doctor: selectedDoctor.name,
        date,
        time
      });
      // Debug: Log backend response
      console.log('Backend response:', response);
      if (response.data.success) {
        alert(`Appointment scheduled with Dr. ${selectedDoctor.name} on ${date} at ${time}`);
        await getAllAppointments();
        navigate(-1);
      } else {
        setError(response.data.message || 'Failed to schedule appointment.');
      }
    } catch (err) {
      console.error('ScheduleWithDoctor error:', err);
      setError(err.response?.data?.message || 'Failed to schedule appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!appointment || !appointment._id) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-6">No Appointment Selected</h2>
        <p className="text-gray-700 mb-4">Please go back and select a valid appointment to schedule with a doctor.</p>
        <button
          type="button"
          className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold text-lg mt-2"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Schedule with Doctor</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="relative">
          <label className="block font-semibold mb-2">Select Doctor</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg border border-gray-200"
            placeholder="Type to search doctor..."
            value={doctor}
            onChange={e => setDoctor(e.target.value)}
            autoComplete="off"
            required
          />
          {filteredDoctors.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-48 overflow-y-auto shadow-lg">
              {filteredDoctors.map(d => (
                <li
                  key={d._id}
                  className="px-4 py-2 cursor-pointer hover:bg-green-100"
                  onClick={() => {
                    setDoctor(d.name);
                    setSelectedDoctor(d);
                  }}
                >
                  {d.name} <span className="text-xs text-gray-500">({d.speciality})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className="block font-semibold mb-2">Date</label>
          <input
            type="date"
            className="w-full p-3 rounded-lg border border-gray-200"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Time</label>
          <input
            type="time"
            className="w-full p-3 rounded-lg border border-gray-200"
            value={time}
            onChange={e => setTime(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          disabled={submitting}
        >
          {submitting ? 'Scheduling...' : 'Schedule Appointment'}
        </button>
        <button
          type="button"
          className="w-full py-3 rounded-lg bg-gray-200 text-gray-700 font-bold text-lg mt-2"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
