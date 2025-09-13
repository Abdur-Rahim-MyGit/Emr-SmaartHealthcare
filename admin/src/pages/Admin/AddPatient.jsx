import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHospital } from 'react-icons/fa'

const AddPatient = () => {
  const { aToken } = useContext(AdminContext)
  const [formData, setFormData] = useState({
    uhid: '',
    alternateUhid: '',
    patientName: '',
    email: '',
    password: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    occupation: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: ''
    },
    medicalInfo: {
      height: '',
      weight: '',
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    },
    insuranceStatus: 'Not Insured',
    organDonorStatus: 'No',
    photograph: '',
    governmentId: { type: '', number: '' },
    insuranceDetails: { provider: '', policyNumber: '', validity: '' },
    consent: {
      dataCollection: false,
      clinicalTreatment: false,
      teleconsultation: false,
      dataSharing: false
    }
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleMedicalInfoChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [_, field] = name.split('.')
      setFormData(prev => ({
        ...prev,
        medicalInfo: {
          ...prev.medicalInfo,
          [field]: value
        }
      }))
    }
  }

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target
    const field = name.split('.')[2]
    setFormData(prev => ({
      ...prev,
      medicalInfo: {
        ...prev.medicalInfo,
        emergencyContact: {
          ...prev.medicalInfo.emergencyContact,
          [field]: value
        }
      }
    }))
  }

  const validateForm = () => {
    if (!formData.uhid.trim()) {
      toast.error('UHID is required')
      return false
    }
    if (!formData.patientName.trim()) {
      toast.error('Patient name is required')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    }
    if (!formData.password.trim()) {
      toast.error('Password is required')
      return false
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required')
      return false
    }
    if (!formData.dateOfBirth) {
      toast.error('Date of birth is required')
      return false
    }
    if (!formData.gender) {
      toast.error('Gender is required')
      return false
    }
    if (!formData.bloodGroup) {
      toast.error('Blood group is required')
      return false
    }
    if (!formData.address.line1.trim() || !formData.address.city.trim() || !formData.address.state.trim() || !formData.address.zipCode.trim()) {
      toast.error('Address fields (except line 2) are required')
      return false
    }
    if (!formData.medicalInfo.emergencyContact.name.trim() || !formData.medicalInfo.emergencyContact.phone.trim()) {
      toast.error('Emergency contact name and phone are required')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!aToken) {
      toast.error('Not authorized. Please login again.')
      return
    }

    if (!validateForm()) {
      return
    }
    
    setLoading(true)

    try {
      const form = new FormData();
      form.append('uhid', formData.uhid);
      form.append('alternateUhid', formData.alternateUhid);
      form.append('patientName', formData.patientName);
      form.append('email', formData.email);
      form.append('password', formData.password);
      form.append('phone', formData.phone);
      form.append('dateOfBirth', formData.dateOfBirth.split('-').reverse().join('_'));
      form.append('gender', formData.gender);
      form.append('bloodGroup', formData.bloodGroup);
      form.append('occupation', formData.occupation);
      form.append('address', JSON.stringify(formData.address));
      form.append('medicalInfo', JSON.stringify(formData.medicalInfo));
      form.append('insuranceStatus', formData.insuranceStatus);
      form.append('organDonorStatus', formData.organDonorStatus);
      form.append('governmentId', JSON.stringify(formData.governmentId));
      form.append('insuranceDetails', JSON.stringify(formData.insuranceDetails));
      form.append('consent', JSON.stringify(formData.consent));
      if (formData.photograph) {
        form.append('photograph', formData.photograph);
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-patient`,
        form,
        {
          headers: {
            Authorization: `Bearer ${aToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      if (response.data.success) {
        toast.success('Patient added successfully');
        setFormData({
          uhid: '',
          alternateUhid: '',
          patientName: '',
          email: '',
          password: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          bloodGroup: '',
          occupation: '',
          address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            zipCode: ''
          },
          medicalInfo: {
            height: '',
            weight: '',
            allergies: '',
            chronicConditions: '',
            currentMedications: '',
            emergencyContact: {
              name: '',
              phone: '',
              relationship: ''
            }
          },
          insuranceStatus: 'Not Insured',
          organDonorStatus: 'No',
          photograph: '',
          governmentId: { type: '', number: '' },
          insuranceDetails: { provider: '', policyNumber: '', validity: '' },
          consent: {
            dataCollection: false,
            clinicalTreatment: false,
            teleconsultation: false,
            dataSharing: false
          }
        });
      } else {
        throw new Error(response.data.message || 'Failed to add patient');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error(error.response?.data?.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Patient</h1>
        <p className="text-gray-500">Fill in the details to add a new patient to the system</p>
      </div>

  <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photograph <span className="text-red-500">*</span></label>
              <input type="file" accept="image/*" name="photograph" onChange={e => setFormData(prev => ({ ...prev, photograph: e.target.files[0] }))} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UHID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="uhid"
                  value={formData.uhid}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate UHID</label>
                <input
                  type="text"
                  name="alternateUhid"
                  value={formData.alternateUhid}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters long</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group <span className="text-red-500">*</span>
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="medicalInfo.height"
                    value={formData.medicalInfo.height}
                    onChange={handleMedicalInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    min="0"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    name="medicalInfo.weight"
                    value={formData.medicalInfo.weight}
                    onChange={handleMedicalInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    min="0"
                    max="500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <textarea
                  name="medicalInfo.allergies"
                  value={formData.medicalInfo.allergies}
                  onChange={handleMedicalInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  rows="2"
                  placeholder="List any known allergies"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Conditions</label>
                <textarea
                  name="medicalInfo.chronicConditions"
                  value={formData.medicalInfo.chronicConditions}
                  onChange={handleMedicalInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  rows="2"
                  placeholder="List any chronic conditions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                <textarea
                  name="medicalInfo.currentMedications"
                  value={formData.medicalInfo.currentMedications}
                  onChange={handleMedicalInfoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  rows="2"
                  placeholder="List current medications"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="medicalInfo.emergencyContact.name"
                  value={formData.medicalInfo.emergencyContact.name}
                  onChange={handleEmergencyContactChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="medicalInfo.emergencyContact.phone"
                  value={formData.medicalInfo.emergencyContact.phone}
                  onChange={handleEmergencyContactChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <input
                  type="text"
                  name="medicalInfo.emergencyContact.relationship"
                  value={formData.medicalInfo.emergencyContact.relationship}
                  onChange={handleEmergencyContactChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.line1"
                  value={formData.address.line1}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                <input
                  type="text"
                  name="address.line2"
                  value={formData.address.line2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                  pattern="[0-9]{6}"
                  title="Please enter a valid 6-digit ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Government ID Proof</label>
            <select name="governmentId.type" value={formData.governmentId.type} onChange={e => setFormData(prev => ({ ...prev, governmentId: { ...prev.governmentId, type: e.target.value } }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Select ID Type</option>
              <option value="Aadhaar">Aadhaar</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
            </select>
            <input type="text" name="governmentId.number" value={formData.governmentId.number} onChange={e => setFormData(prev => ({ ...prev, governmentId: { ...prev.governmentId, number: e.target.value } }))} placeholder="ID Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Details</label>
            <input type="text" name="insuranceDetails.provider" value={formData.insuranceDetails.provider} onChange={e => setFormData(prev => ({ ...prev, insuranceDetails: { ...prev.insuranceDetails, provider: e.target.value } }))} placeholder="Provider" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" />
            <input type="text" name="insuranceDetails.policyNumber" value={formData.insuranceDetails.policyNumber} onChange={e => setFormData(prev => ({ ...prev, insuranceDetails: { ...prev.insuranceDetails, policyNumber: e.target.value } }))} placeholder="Policy Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2" />
            <input type="text" name="insuranceDetails.validity" value={formData.insuranceDetails.validity} onChange={e => setFormData(prev => ({ ...prev, insuranceDetails: { ...prev.insuranceDetails, validity: e.target.value } }))} placeholder="Validity" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Consent</label>
            <div className="space-y-2">
              <label className="flex items-center"><input type="checkbox" checked={formData.consent.dataCollection} onChange={e => setFormData(prev => ({ ...prev, consent: { ...prev.consent, dataCollection: e.target.checked } }))} /> <span className="ml-2">Consent for Data Collection & Storage</span></label>
              <label className="flex items-center"><input type="checkbox" checked={formData.consent.clinicalTreatment} onChange={e => setFormData(prev => ({ ...prev, consent: { ...prev.consent, clinicalTreatment: e.target.checked } }))} /> <span className="ml-2">Consent for Clinical Treatment</span></label>
              <label className="flex items-center"><input type="checkbox" checked={formData.consent.teleconsultation} onChange={e => setFormData(prev => ({ ...prev, consent: { ...prev.consent, teleconsultation: e.target.checked } }))} /> <span className="ml-2">Consent for Teleconsultation</span></label>
              <label className="flex items-center"><input type="checkbox" checked={formData.consent.dataSharing} onChange={e => setFormData(prev => ({ ...prev, consent: { ...prev.consent, dataSharing: e.target.checked } }))} /> <span className="ml-2">Consent for Data Sharing</span></label>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Status</label>
                <select
                  name="insuranceStatus"
                  value={formData.insuranceStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="Not Insured">Not Insured</option>
                  <option value="Insured">Insured</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organ Donor Status</label>
                <select
                  name="organDonorStatus"
                  value={formData.organDonorStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
          </div>
  </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Patient...' : 'Add Patient'}
          </button>
        </div>
      </div>
      </form>
    </div>
  )
}

export default AddPatient 