import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import api from '../config/api'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaVenusMars, FaBirthdayCake, FaEdit, FaSave, FaTimes } from 'react-icons/fa'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [appointments, setAppointments] = useState([])
    const { token, backendUrl, userData, setUserData, loadUserProfileData, loading } = useContext(AppContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            loadUserProfileData()
            loadUserAppointments()
        } else {
            navigate('/login')
        }
    }, [token])

    const loadUserAppointments = async () => {
        try {
            const { data } = await api.get('/api/user/appointments')
            if (data.success) {
                setAppointments(data.appointments.slice(0, 3)) // Show only 3 recent appointments
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error loading appointments:', error)
            toast.error('Failed to load appointments')
        }
    }

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData()
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            if (image) {
                formData.append('image', image)
            }

            const { data } = await api.post('/api/user/update-profile', formData)

            if (data.success) {
                toast.success('Profile updated successfully')
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
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
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Loading profile...</h2>
                </div>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">No profile data found</h2>
                    <button 
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Login Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className='max-w-4xl mx-auto py-8 px-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Profile Section */}
                <div className='bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center mb-6'>
                    <div className='relative mb-4'>
                        <img 
                            className='w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow' 
                            src={userData.profilePicture || assets.profile_icon} 
                            alt="Profile" 
                        />
                        {isEdit && (
                            <label htmlFor='image' className='absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg'>
                                <FaEdit />
                                <input 
                                    onChange={(e) => setImage(e.target.files[0])} 
                                    type="file" 
                                    id="image" 
                                    accept="image/*"
                                    hidden 
                                />
                            </label>
                        )}
                    </div>
                    <div className='text-center'>
                        {isEdit ? (
                            <input 
                                className='text-2xl font-semibold bg-gray-50 p-2 rounded text-center mb-2 w-full' 
                                type="text" 
                                value={userData.name || ''}
                                onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} 
                                placeholder="Enter your name"
                            />
                        ) : (
                            <h2 className='text-2xl font-bold mb-1'>{userData.name || 'User'}</h2>
                        )}
                        <div className='flex items-center justify-center gap-2 text-gray-500 mb-1'>
                            <FaEnvelope /> {userData.email}
                        </div>
                    </div>
                    <div className='w-full border-t my-4'></div>
                    <div className='w-full space-y-3'>
                        <div className='flex items-center gap-2 text-gray-700'>
                            <FaPhone /> <span className='font-medium'>Phone:</span> 
                            {isEdit ? (
                                <input 
                                    type="tel"
                                    value={userData.phone || ''}
                                    onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="ml-2 p-1 border rounded"
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <span className='ml-2'>{userData.phone || 'Not set'}</span>
                            )}
                        </div>
                        <div className='flex items-center gap-2 text-gray-700'>
                            <FaMapMarkerAlt /> <span className='font-medium'>Address:</span>
                            {isEdit ? (
                                <input 
                                    type="text"
                                    value={userData.address?.line1 || ''}
                                    onChange={(e) => setUserData(prev => ({ 
                                        ...prev, 
                                        address: { ...prev.address, line1: e.target.value }
                                    }))}
                                    className="ml-2 p-1 border rounded"
                                    placeholder="Enter address"
                                />
                            ) : (
                                <span className='ml-2'>{userData.address?.line1 || 'Not set'}</span>
                            )}
                        </div>
                        <div className='flex items-center gap-2 text-gray-700'>
                            <FaVenusMars /> <span className='font-medium'>Gender:</span>
                            {isEdit ? (
                                <select
                                    value={userData.gender || ''}
                                    onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                    className="ml-2 p-1 border rounded"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <span className='ml-2'>{userData.gender || 'Not set'}</span>
                            )}
                        </div>
                        <div className='flex items-center gap-2 text-gray-700'>
                            <FaBirthdayCake /> <span className='font-medium'>Date of Birth:</span>
                            {isEdit ? (
                                <input 
                                    type="date"
                                    value={userData.dob || ''}
                                    onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                    className="ml-2 p-1 border rounded"
                                />
                            ) : (
                                <span className='ml-2'>{formatDate(userData.dob)}</span>
                            )}
                        </div>
                    </div>
                    <div className='mt-6'>
                        {isEdit ? (
                            <div className='flex gap-2'>
                                <button 
                                    onClick={updateUserProfileData}
                                    className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2'
                                >
                                    <FaSave /> Save
                                </button>
                                <button 
                                    onClick={() => {
                                        setIsEdit(false)
                                        setImage(false)
                                        loadUserProfileData()
                                    }}
                                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2'
                                >
                                    <FaTimes /> Cancel
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setIsEdit(true)}
                                className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2'
                            >
                                <FaEdit /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Appointments Section */}
                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <h3 className='text-xl font-semibold mb-4'>Recent Appointments</h3>
                    {appointments.length > 0 ? (
                        <div className='space-y-4'>
                            {appointments.map((appointment, index) => (
                                <div key={index} className='border rounded-lg p-4'>
                                    <div className='flex items-center gap-4 mb-2'>
                                        <img 
                                            src={appointment.docData.image} 
                                            alt={appointment.docData.name}
                                            className='w-12 h-12 rounded-full object-cover'
                                        />
                                        <div>
                                            <h4 className='font-medium'>{appointment.docData.name}</h4>
                                            <p className='text-sm text-gray-500'>{appointment.docData.speciality}</p>
                                        </div>
                                    </div>
                                    <div className='text-sm text-gray-600'>
                                        <p>Date: {formatDate(appointment.slotDate)}</p>
                                        <p>Time: {appointment.slotTime}</p>
                                        <p>Status: <span className={`font-medium ${appointment.cancelled ? 'text-red-500' : appointment.isCompleted ? 'text-green-500' : 'text-yellow-500'}`}>
                                            {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Pending'}
                                        </span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-8'>
                            <p className='text-gray-500 mb-4'>No appointments found</p>
                            <button 
                                onClick={() => navigate('/find-doctors')}
                                className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90'
                            >
                                Book an Appointment
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MyProfile