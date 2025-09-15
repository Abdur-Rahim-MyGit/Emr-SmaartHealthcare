import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaCommentDots, FaUserMd } from 'react-icons/fa';
import { toast } from 'react-toastify';

const services = [
  "SMAART Metabolism",
  "SMAART Minds", 
  "SMAART Physio",
  "SMAART Eyes",
  "SMAART Balance"
];

const BookingModal = ({ isOpen, onClose, doctorInfo = null, onBookingSuccess = null }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    date: '',
    service: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.date || !formData.service) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Debug: Log doctor info to verify it's being passed correctly
      console.log('Doctor Info:', doctorInfo);
      
      // Prepare appointment data in the format expected by backend
      const appointmentData = {
        userData: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        docData: {
          name: doctorInfo?.name || 'General Practitioner',
          speciality: doctorInfo?.speciality || formData.service,
          _id: doctorInfo?._id || null,
          fees: doctorInfo?.fees || 0
        },
        slotDate: formData.date,
        slotTime: '09:00', // Default time
        amount: doctorInfo?.fees || 0,
        message: formData.message
      };

      // Debug: Log appointment data being sent
      console.log('Appointment Data:', appointmentData);

      // Send to backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/appointment-booking/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Appointment request submitted successfully!');
        
        // Call success callback if provided (to update booked doctors state)
        if (onBookingSuccess && doctorInfo?._id) {
          onBookingSuccess(doctorInfo._id);
        }
        
        // Reset form and close modal
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          date: '',
          service: '',
          message: ''
        });
        onClose();
      } else {
        toast.error(result.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to submit appointment request. Please try again.');
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      date: '',
      service: '',
      message: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              {doctorInfo && (
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <FaUserMd className="text-primary" />
                  Dr. {doctorInfo.name} - {doctorInfo.speciality}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service *
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              >
                <option value="">Choose a service...</option>
                {services.map((service, index) => (
                  <option key={index} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message (Optional)
              </label>
              <div className="relative">
                <FaCommentDots className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                  placeholder="Any additional information or special requests..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg hover:from-primary/90 hover:to-blue-500 transition-all font-medium shadow-md hover:shadow-lg"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
