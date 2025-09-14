import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

export default function AppointmentBooking({ onClose }) {
  const { userData, token } = useContext(AppContext);
  const [form, setForm] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    location: '',
    speciality: '',
    doctor: '',
    date: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'This field is required.';
    if (!form.email) newErrors.email = 'This field is required.';
    if (!form.phone) newErrors.phone = 'This field is required.';
    if (!form.location) newErrors.location = 'This field is required.';
    if (!form.speciality) newErrors.speciality = 'This field is required.';
    if (!form.doctor) newErrors.doctor = 'This field is required.';
    if (!form.date) newErrors.date = 'This field is required.';
    return newErrors;
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSubmitError('');
    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      try {
        // Check if user is logged in
        if (!userData || !token) {
          setSubmitError('Please login to book an appointment.');
          return;
        }

        // Prepare required fields for backend
        const appointmentData = {
          userId: userData._id,
          docId: null,
          userData: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            location: form.location,
            message: form.message,
            speciality: form.speciality,
            doctor: form.doctor,
            date: form.date
          },
          docData: {
            name: form.doctor,
            speciality: form.speciality,
            location: form.location
          },
          amount: 0,
          slotTime: '09:00',
          slotDate: form.date,
          cancelled: false,
          payment: false,
          isCompleted: false,
          paymentDetails: null
        };
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/appointment-booking/book`, appointmentData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data.success) {
          alert('Appointment submitted!');
          if (typeof onClose === 'function') onClose();
        } else {
          setSubmitError(response.data.message || 'Failed to submit appointment.');
        }
      } catch (err) {
        setSubmitError(err.response?.data?.message || 'Failed to submit appointment.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <form className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md relative font-sans border border-gray-100" onSubmit={handleSubmit}>
  <button type="button" className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-primary" onClick={onClose}>&times;</button>
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">Make an appointment</h2>
        <div className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20" />
          {errors.name && <div className="text-red-600 text-xs">{errors.name}</div>}
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20" />
          {errors.email && <div className="text-red-600 text-xs">{errors.email}</div>}
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20" />
          {errors.phone && <div className="text-red-600 text-xs">{errors.phone}</div>}
          <select name="location" value={form.location} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20">
            <option value="">- Select Location -</option>
            <option value="Center 1">Center 1</option>
            <option value="Center 2">Center 2</option>
          </select>
          {errors.location && <div className="text-red-600 text-xs">{errors.location}</div>}
          <select name="speciality" value={form.speciality} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20">
            <option value="">- Select Speciality -</option>
            <option value="Metabolism">Metabolism</option>
            <option value="Minds">Minds</option>
            <option value="Physio">Physio</option>
            <option value="Eyes">Eyes</option>
            <option value="Balance">Balance</option>
          </select>
          {errors.speciality && <div className="text-red-600 text-xs">{errors.speciality}</div>}
          <select name="doctor" value={form.doctor} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20">
            <option value="">- Select Doctor -</option>
            <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
            <option value="Dr. Michael Chen">Dr. Michael Chen</option>
            <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
            <option value="Dr. David Kim">Dr. David Kim</option>
            <option value="Dr. Lisa Thompson">Dr. Lisa Thompson</option>
            <option value="Dr. James Wilson">Dr. James Wilson</option>
            <option value="Dr. Maria Garcia">Dr. Maria Garcia</option>
            <option value="Dr. Robert Lee">Dr. Robert Lee</option>
          </select>
          {errors.doctor && <div className="text-red-600 text-xs">{errors.doctor}</div>}
          <input name="date" type="date" value={form.date} onChange={handleChange} placeholder="Enter Date" className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20" />
          {errors.date && <div className="text-red-600 text-xs">{errors.date}</div>}
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Messages" className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-primary/20" />
        </div>
        {submitError && <div className="text-red-600 text-sm mt-2 text-center">{submitError}</div>}
        <button type="submit" className="w-full mt-6 py-3 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Submitting...' : 'SUBMIT'}
        </button>
      </form>
    </div>
  );
}
