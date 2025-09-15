import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaUserCircle, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaVenusMars, 
  FaBirthdayCake, 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaCalendarAlt, 
  FaPrescriptionBottle, 
  FaFileAlt, 
  FaUser,
  FaIdCard,
  FaTint,
  FaCamera
} from 'react-icons/fa'

const PatientProfile = () => {
  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(null)
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token, backendUrl } = useContext(AppContext)
  const [formData, setFormData] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      loadPatientProfile()
    } else {
      navigate('/login')
    }
  }, [token])

  const loadPatientProfile = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${backendUrl}/api/patient/profile`, {
        headers: { token }
      })
      
      if (data.success) {
        setPatientData(data.patient)
        setFormData(data.patient)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error loading patient profile:', error)
      toast.error('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }))
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleCancel = () => {
    setIsEdit(false)
    setFormData(patientData || {})
    setImage(null)
  }

  const handleEditClick = () => {
    setFormData(patientData || {})
    setIsEdit(true)
  }

  const handleSaveClick = async () => {
    try {
      const formPayload = new FormData()
      formPayload.append('patientName', formData.patientName || '')
      formPayload.append('phone', formData.phone || '')
      formPayload.append('bloodGroup', formData.bloodGroup || '')
      formPayload.append('occupation', formData.occupation || '')
      formPayload.append('address', JSON.stringify(formData.address || {}))
      formPayload.append('emergencyContact', JSON.stringify(formData.emergencyContact || {}))
      
      if (image) {
        formPayload.append('photograph', image)
      }

      const { data } = await axios.put(`${backendUrl}/api/patient/profile`, formPayload, {
        headers: { 
          token,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        toast.success('Profile updated successfully')
        setPatientData(data.patient)
        setFormData(data.patient)
        setIsEdit(false)
        setImage(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Not set'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return `${age} years`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 pt-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 pt-20">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
            <p className="text-gray-600">Unable to load your profile data.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Patient Profile
              </h1>
              <p className="text-gray-600 mt-2">Manage your personal information</p>
            </div>
            <div className="flex space-x-3">
              {!isEdit ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEditClick}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </motion.button>
              ) : (
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveClick}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <FaSave />
                    <span>Save</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Profile Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo and Basic Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                    {patientData.photograph ? (
                      <img 
                        src={patientData.photograph} 
                        alt={patientData.patientName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      patientData.patientName?.charAt(0) || 'P'
                    )}
                  </div>
                  {isEdit && (
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                      <FaCamera className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{patientData.patientName}</h3>
                <p className="text-gray-600 flex items-center justify-center space-x-1">
                  <FaIdCard />
                  <span>UHID: {patientData.uhid}</span>
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="lg:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaUser className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Full Name</span>
                  </div>
                  {isEdit ? (
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{patientData.patientName || 'Not set'}</p>
                  )}
                </div>

                {/* Email */}
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaEnvelope className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Email</span>
                  </div>
                  <p className="text-gray-900">{patientData.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                
                {/* Phone */}
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaPhone className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Phone</span>
                  </div>
                  {isEdit ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{patientData.phone || 'Not set'}</p>
                  )}
                </div>
                
                {/* Age */}
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBirthdayCake className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Age</span>
                  </div>
                  <p className="text-gray-900">{calculateAge(patientData.dateOfBirth)}</p>
                  <p className="text-xs text-gray-500 mt-1">Born: {formatDate(patientData.dateOfBirth)}</p>
                </div>
                
                {/* Gender */}
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaVenusMars className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Gender</span>
                  </div>
                  <p className="text-gray-900">{patientData.gender || 'Not set'}</p>
                </div>
                
                {/* Blood Group */}
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaTint className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Blood Group</span>
                  </div>
                  {isEdit ? (
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{patientData.bloodGroup || 'Not specified'}</p>
                  )}
                </div>

                {/* Occupation */}
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaUser className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Occupation</span>
                  </div>
                  {isEdit ? (
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{patientData.occupation || 'Not specified'}</p>
                  )}
                </div>

                {/* Address */}
                <div className="bg-white/50 rounded-lg p-4 md:col-span-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="text-primary" />
                    <span className="text-sm font-medium text-gray-700">Address</span>
                  </div>
                  {isEdit ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="line1"
                        placeholder="Address Line 1"
                        value={formData.address?.line1 || ''}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <input
                        type="text"
                        name="line2"
                        placeholder="Address Line 2 (Optional)"
                        value={formData.address?.line2 || ''}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.address?.city || ''}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={formData.address?.state || ''}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="ZIP Code"
                          value={formData.address?.zipCode || ''}
                          onChange={handleAddressChange}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900">
                      {patientData.address ? (
                        <>
                          {patientData.address.line1}
                          {patientData.address.line2 && <>, {patientData.address.line2}</>}
                          <br />
                          {patientData.address.city}, {patientData.address.state} {patientData.address.zipCode}
                        </>
                      ) : (
                        'Not set'
                      )}
                    </p>
                  )}
                </div>

                {/* Emergency Contact */}
                {patientData.emergencyContact && (
                  <div className="bg-white/50 rounded-lg p-4 md:col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaPhone className="text-primary" />
                      <span className="text-sm font-medium text-gray-700">Emergency Contact</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-gray-900">{patientData.emergencyContact.name || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-gray-900">{patientData.emergencyContact.phone || 'Not set'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Relationship</p>
                        <p className="text-gray-900">{patientData.emergencyContact.relationship || 'Not set'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PatientProfile
