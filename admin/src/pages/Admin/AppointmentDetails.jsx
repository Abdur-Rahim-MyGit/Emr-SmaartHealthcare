import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AppointmentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const appointment = location.state?.appointment;

  if (!appointment) {
    return <div className="p-8 text-center text-gray-500">No appointment details found.</div>;
  }

  const { userData, docData, slotDate, slotTime, message } = appointment;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold text-primary mb-6 text-center">Appointment Details</h2>
      <div className="space-y-4 text-gray-700">
        <div><span className="font-semibold">Name:</span> {userData?.name}</div>
        <div><span className="font-semibold">Email:</span> {userData?.email}</div>
        <div><span className="font-semibold">Phone:</span> {userData?.phone}</div>
        <div><span className="font-semibold">Location:</span> {userData?.location}</div>
        <div><span className="font-semibold">Speciality:</span> {userData?.speciality || docData?.speciality}</div>
        <div><span className="font-semibold">Preferred Date:</span> {userData?.date || slotDate}</div>
        <div><span className="font-semibold">Message:</span> {userData?.message || message || '-'}</div>
        {docData?.name && (
          <div className="pt-4">
            <div className="text-green-700 font-semibold">Scheduled Doctor: Dr. {docData.name}</div>
            <div className="text-green-700">Scheduled Date: {slotDate}</div>
            <div className="text-green-700">Scheduled Time: {slotTime}</div>
          </div>
        )}
      </div>
      <button
        className="mt-8 w-full py-3 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-colors"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
}
