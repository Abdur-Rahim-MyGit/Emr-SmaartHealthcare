import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { HiOutlineUpload, HiOutlineX } from 'react-icons/hi'

const AddDoctor = () => {
  const { aToken, getAllDoctors } = useContext(AdminContext)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: ''
    }
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    
    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password || formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (!formData.speciality.trim()) newErrors.speciality = 'Speciality is required'
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required'
    if (!formData.experience) newErrors.experience = 'Experience is required'
    if (formData.experience < 0) newErrors.experience = 'Experience cannot be negative'
    if (!formData.fees) newErrors.fees = 'Consultation fees is required'
    if (formData.fees < 0) newErrors.fees = 'Fees cannot be negative'
    if (!formData.about.trim()) newErrors.about = 'About section is required'
    if (!formData.address.line1.trim()) newErrors.addressLine1 = 'Address line 1 is required'
    if (!formData.address.city.trim()) newErrors.city = 'City is required'
    if (!formData.address.state.trim()) newErrors.state = 'State is required'
    if (!formData.address.zipCode.trim()) newErrors.zipCode = 'ZIP code is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly')
      return
    }
    if (!image) {
      toast.error('Please upload a profile image')
      return
    }
    if (!aToken) {
      toast.error('Not authorized. Please login again.')
      return
    }
    
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })
      formDataToSend.append('image', image)

      const response = await axios.post(
        '/api/admin/add-doctor',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${aToken}`
          }
        }
      )

      if (response.data.success) {
        toast.success('Doctor added successfully')
        await getAllDoctors() // Refresh doctors list
        navigate('/doctor-list') // Redirect to doctors list
      } else {
        throw new Error(response.data.message || 'Failed to add doctor')
      }
    } catch (error) {
      console.error('Error adding doctor:', error)
      toast.error(error.response?.data?.message || 'Failed to add doctor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add New Doctor</h1>
        <p className="text-gray-500">Fill in the details to add a new doctor to the system</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image Upload */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Image</h2>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <HiOutlineUpload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload profile image</span>
                    <span className="text-xs text-gray-400">(Max size: 5MB)</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Speciality*</label>
                <input
                  type="text"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.speciality ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.speciality && <p className="mt-1 text-sm text-red-500">{errors.speciality}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree*</label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.degree ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.degree && <p className="mt-1 text-sm text-red-500">{errors.degree}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)*</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees*</label>
                <input
                  type="number"
                  name="fees"
                  value={formData.fees}
                  onChange={handleChange}
                  min="0"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.fees ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.fees && <p className="mt-1 text-sm text-red-500">{errors.fees}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About*</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.about ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.about && <p className="mt-1 text-sm text-red-500">{errors.about}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1*</label>
                <input
                  type="text"
                  name="address.line1"
                  value={formData.address.line1}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.addressLine1 && <p className="mt-1 text-sm text-red-500">{errors.addressLine1}</p>}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State*</label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code*</label>
                <input
                  type="text"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {errors.zipCode && <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                <span>Adding Doctor...</span>
              </>
            ) : (
              <span>Add Doctor</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDoctor