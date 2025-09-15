import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import api from '../config/api'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { FaUserCircle, FaPhone, FaEnvelope, FaMapMarkerAlt, FaVenusMars, FaBirthdayCake, FaEdit, FaSave, FaTimes, FaCalendarAlt, FaPrescriptionBottle, FaFileAlt, FaUser } from 'react-icons/fa'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [prescriptions, setPrescriptions] = useState([])
    const [medicalRecords, setMedicalRecords] = useState([])
    const [activeTab, setActiveTab] = useState('profile')
    const { token, userData, loadUserProfileData, loading } = useContext(AppContext)
    const [formData, setFormData] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            if (!userData) {
                loadUserProfileData();
            }
            loadUserAppointments();
            loadMedicalRecords();
            loadPrescriptions();
        } else {
            navigate('/login');
        }
    }, [token, userData]);

    useEffect(() => {
        if (userData) {
            setFormData(userData);
        }
    }, [userData]);

    const loadUserAppointments = async () => {
        try {
            const userType = localStorage.getItem('userType')
            console.log('Loading appointments for userType:', userType)
            let data
            
            if (userType === 'patient') {
                // Use patient-specific endpoint
                console.log('Making API call to /api/patient/appointments')
                const response = await api.get('/api/patient/appointments')
                data = response.data
                console.log('Patient appointments response:', data)
            } else {
                // Use regular user endpoint
                const response = await api.get('/api/user/appointments')
                data = response.data
            }
            
            if (data.success) {
                console.log('Setting appointments:', data.appointments.length, 'appointments')
                setAppointments(data.appointments)
            } else {
                console.log('API error:', data.message)
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Error loading appointments:', error)
            toast.error('Failed to load appointments')
        }
    }

    const loadMedicalRecords = async () => {
        try {
            const userType = localStorage.getItem('userType')
            
            if (userType === 'patient') {
                // Use patient-specific endpoint - get from dashboard data
                const { data } = await api.get('/api/patient/dashboard')
                if (data.success) {
                    setMedicalRecords(data.data.medicalRecords || [])
                }
            } else {
                // Use regular user endpoint
                const { data } = await api.get('/api/user/medical-records')
                if (data.success) {
                    setMedicalRecords(data.records)
                } else {
                    console.log('No medical records found')
                }
            }
        } catch (error) {
            console.error('Error loading medical records:', error)
        }
    }

    const loadPrescriptions = async () => {
        try {
            const userType = localStorage.getItem('userType')
            console.log('Loading prescriptions for userType:', userType)
            
            if (userType === 'patient') {
                // Use patient-specific endpoint
                console.log('Making API call to /api/patient/prescriptions')
                const { data } = await api.get('/api/patient/prescriptions')
                console.log('Patient prescriptions response:', data)
                if (data.success) {
                    console.log('Setting prescriptions:', data.prescriptions.length, 'prescriptions')
                    setPrescriptions(data.prescriptions)
                }
            } else {
                // Get patient data from localStorage if available for regular users
                const patientData = JSON.parse(localStorage.getItem('patientData') || '{}')
                if (patientData._id) {
                    const { data } = await api.get(`/api/admin/patient-prescriptions/${patientData._id}`)
                    if (data.success) {
                        setPrescriptions(data.prescriptions)
                    }
                }
            }
        } catch (error) {
            console.error('Error loading prescriptions:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleCancel = () => {
        setIsEdit(false);
        setFormData(userData || {});
        setImage(null);
    };

    const handleEditClick = () => {
        setFormData(userData || {});
        setIsEdit(true);
    };

    const handleSaveClick = () => {
        updateUserProfileData();
    };

    const updateUserProfileData = async () => {
        try {
            const formPayload = new FormData();
            formPayload.append('name', formData.name || '');
            formPayload.append('phone', formData.phone || '');
            formPayload.append('address', JSON.stringify(formData.address || {}));
            formPayload.append('gender', formData.gender || '');
            formPayload.append('dob', formData.dob || '');
            if (image) {
                formPayload.append('image', image);
            }

            const { data } = await api.post('/api/user/update-profile', formPayload);

            if (data.success) {
                toast.success('Profile updated successfully');
                await loadUserProfileData(); // This will trigger the useEffect to update formData
                setIsEdit(false);
                setImage(null);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getSafeDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
    };



    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Loading profile...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-6xl mx-auto py-8 px-4'>
            {/* Tab Navigation */}
            <div className='bg-white rounded-2xl shadow-lg mb-8'>
                <div className='flex border-b'>
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                            activeTab === 'profile' 
                                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                    >
                        <FaUser /> Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                            activeTab === 'appointments' 
                                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                    >
                        <FaCalendarAlt /> Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                            activeTab === 'prescriptions' 
                                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                    >
                        <FaPrescriptionBottle /> Prescriptions
                    </button>
                    <button
                        onClick={() => setActiveTab('records')}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                            activeTab === 'records' 
                                ? 'text-primary border-b-2 border-primary bg-primary/5' 
                                : 'text-gray-600 hover:text-primary'
                        }`}
                    >
                        <FaFileAlt /> Medical Records
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    {/* Profile Section */}
                    <div className='bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center mb-6'>
                        <div className='relative mb-4 group'>
                            <div className='relative'>
                                <div className='w-32 h-32 rounded-full border-4 border-primary/20 shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-2xl hover:border-primary/40 group-hover:brightness-110 bg-gradient-to-br from-yellow-300 via-orange-200 to-pink-200 flex items-center justify-center overflow-hidden'
                                    style={{
                                        animation: 'profilePulse 3s ease-in-out infinite'
                                    }}>
                                    {/* Cartoon Face */}
                                    <div className='relative w-full h-full flex items-center justify-center'>
                                        {/* Face Base */}
                                        <div className='w-28 h-28 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full relative'>
                                            {/* Eyes */}
                                            <div className='absolute top-8 left-6 w-3 h-3 bg-black rounded-full animate-bounce' style={{animationDelay: '0s', animationDuration: '2s'}}></div>
                                            <div className='absolute top-8 right-6 w-3 h-3 bg-black rounded-full animate-bounce' style={{animationDelay: '0.1s', animationDuration: '2s'}}></div>
                                            
                                            {/* Eye sparkles */}
                                            <div className='absolute top-7 left-7 w-1 h-1 bg-white rounded-full animate-ping'></div>
                                            <div className='absolute top-7 right-7 w-1 h-1 bg-white rounded-full animate-ping' style={{animationDelay: '0.5s'}}></div>
                                            
                                            {/* Nose */}
                                            <div className='absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 rounded-full'></div>
                                            
                                            {/* Mouth */}
                                            <div className='absolute top-16 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-pink-500 rounded-full animate-pulse'></div>
                                            
                                            {/* Cheeks */}
                                            <div className='absolute top-13 left-2 w-3 h-2 bg-pink-300 rounded-full opacity-60 animate-pulse'></div>
                                            <div className='absolute top-13 right-2 w-3 h-2 bg-pink-300 rounded-full opacity-60 animate-pulse'></div>
                                            
                                            {/* Hair */}
                                            <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-r from-brown-400 to-brown-600 rounded-t-full'></div>
                                            <div className='absolute -top-1 left-4 w-3 h-6 bg-brown-500 rounded-full transform rotate-12 animate-sway'></div>
                                            <div className='absolute -top-1 right-4 w-3 h-6 bg-brown-500 rounded-full transform -rotate-12 animate-sway' style={{animationDelay: '0.5s'}}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                <div className='absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300'></div>
                            </div>
                            {isEdit && (
                                <label htmlFor='image' className='absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-primary/90 hover:shadow-xl'>
                                    <FaEdit className='animate-pulse' />
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
                        <style jsx>{`
                            @keyframes profilePulse {
                                0%, 100% {
                                    box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4);
                                }
                                50% {
                                    box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
                                }
                            }
                            @keyframes sway {
                                0%, 100% {
                                    transform: rotate(12deg);
                                }
                                50% {
                                    transform: rotate(18deg);
                                }
                            }
                            .animate-sway {
                                animation: sway 2s ease-in-out infinite;
                            }
                        `}</style>
                        <div className='w-full text-left'>
                            <div className='text-center mb-6'>
                                {isEdit ? (
                                    <input 
                                        className='text-2xl font-semibold bg-gray-50 p-2 rounded text-center w-full' 
                                        type="text" 
                                        name="name"
                                        value={formData?.name || ''}
                                        onChange={handleInputChange} 
                                        placeholder="Enter your name"
                                    />
                                ) : (
                                    <h2 className='text-2xl font-bold'>{userData?.name || 'User'}</h2>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <FaEnvelope className="text-primary mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-gray-800">{userData?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaPhone className="text-primary mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Phone</p>
                                        {isEdit ? (
                                            <input type="tel" name="phone" value={formData?.phone || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50" placeholder="Enter phone number" />
                                        ) : (
                                            <p className="font-medium text-gray-800">{userData?.phone || 'Not set'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="text-primary mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Address</p>
                                        {isEdit ? (
                                            <input type="text" name="line1" value={formData?.address?.line1 || ''} onChange={handleAddressChange} className="w-full p-2 border rounded-lg bg-gray-50" placeholder="Enter address" />
                                        ) : (
                                            <p className="font-medium text-gray-800">{userData?.address?.line1 || 'Not set'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaVenusMars className="text-primary mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Gender</p>
                                        {isEdit ? (
                                            <select name="gender" value={formData?.gender || ''} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50">
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <p className="font-medium text-gray-800">{userData?.gender || 'Not set'}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FaBirthdayCake className="text-primary mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500">Date of Birth</p>
                                        {isEdit ? (
                                            <input type="date" name="dob" value={getSafeDateForInput(formData?.dob)} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50" />
                                        ) : (
                                            <p className="font-medium text-gray-800">{formatDate(userData?.dob)}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {isEdit ? (
                                <div className='flex justify-end gap-4 mt-4'>
                                    <button 
                                        onClick={handleCancel}
                                        className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2'
                                    >
                                        <FaTimes /> Cancel
                                    </button>
                                    <button 
                                        onClick={updateUserProfileData}
                                        className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2'
                                    >
                                        <FaSave /> Save
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleEditClick}
                                    className='px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2'
                                >
                                    <FaEdit /> Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats Section */}
                    <div className='bg-white rounded-2xl shadow-lg p-8'>
                        <h3 className='text-xl font-semibold mb-4'>Quick Overview</h3>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className='text-center p-4 bg-blue-50 rounded-lg'>
                                <div className='text-2xl font-bold text-blue-600'>{appointments.length}</div>
                                <div className='text-sm text-gray-600'>Total Appointments</div>
                            </div>
                            <div className='text-center p-4 bg-green-50 rounded-lg'>
                                <div className='text-2xl font-bold text-green-600'>{prescriptions.length}</div>
                                <div className='text-sm text-gray-600'>Prescriptions</div>
                            </div>
                            <div className='text-center p-4 bg-purple-50 rounded-lg'>
                                <div className='text-2xl font-bold text-purple-600'>{medicalRecords.length}</div>
                                <div className='text-sm text-gray-600'>Medical Records</div>
                            </div>
                            <div className='text-center p-4 bg-orange-50 rounded-lg'>
                                <div className='text-2xl font-bold text-orange-600'>
                                    {appointments.filter(apt => apt.isCompleted).length}
                                </div>
                                <div className='text-sm text-gray-600'>Completed Visits</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <h3 className='text-xl font-semibold mb-6'>My Appointments</h3>
                    {appointments.length > 0 ? (
                        <div className='space-y-4'>
                            {appointments.map((appointment, index) => (
                                <div key={index} className='border rounded-lg p-6 hover:shadow-md transition-shadow'>
                                    <div className='flex items-center gap-4 mb-4'>
                                        <img 
                                            src={appointment.docData?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.docData?.name || 'Doctor')}&background=10b981&color=ffffff&size=48`} 
                                            alt={appointment.docData?.name || 'Doctor'}
                                            className='w-16 h-16 rounded-full object-cover'
                                        />
                                        <div className='flex-1'>
                                            <h4 className='text-lg font-medium'>Dr. {appointment.docData?.name || 'N/A'}</h4>
                                            <p className='text-gray-600'>{appointment.docData?.speciality || 'No speciality'}</p>
                                        </div>
                                        <div className='text-right'>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                appointment.cancelled ? 'bg-red-100 text-red-800' : 
                                                appointment.isCompleted ? 'bg-green-100 text-green-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {appointment.cancelled ? 'Cancelled' : appointment.isCompleted ? 'Completed' : 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                                        <div>
                                            <span className='text-gray-500'>Date:</span>
                                            <p className='font-medium'>{formatDate(appointment.slotDate)}</p>
                                        </div>
                                        <div>
                                            <span className='text-gray-500'>Time:</span>
                                            <p className='font-medium'>{appointment.slotTime}</p>
                                        </div>
                                        <div>
                                            <span className='text-gray-500'>Fee:</span>
                                            <p className='font-medium'>₹{appointment.amount || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className='text-gray-500'>Payment:</span>
                                            <p className='font-medium'>{appointment.payment ? 'Paid' : 'Pending'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <FaCalendarAlt className='mx-auto text-6xl text-gray-300 mb-4' />
                            <p className='text-gray-500 mb-4'>No appointments found</p>
                            <button 
                                onClick={() => navigate('/services')}
                                className='px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
                            >
                                Book Your First Appointment
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <h3 className='text-xl font-semibold mb-6'>My Prescriptions</h3>
                    {prescriptions.length > 0 ? (
                        <div className='space-y-6'>
                            {prescriptions.map((prescription, index) => (
                                <div key={index} className='border rounded-lg p-6 hover:shadow-md transition-shadow'>
                                    <div className='flex justify-between items-start mb-4'>
                                        <div>
                                            <h4 className='text-lg font-medium'>Dr. {prescription.doctorName || 'N/A'}</h4>
                                            <p className='text-gray-600'>{formatDate(prescription.createdAt)}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            prescription.status === 'Finalized' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {prescription.status || 'Draft'}
                                        </span>
                                    </div>
                                    
                                    {prescription.clinicalNotes && (
                                        <div className='mb-4'>
                                            <h5 className='font-medium text-gray-700 mb-2'>Clinical Notes:</h5>
                                            <p className='text-gray-600 bg-gray-50 p-3 rounded'>{prescription.clinicalNotes}</p>
                                        </div>
                                    )}

                                    {prescription.medications && prescription.medications.length > 0 && (
                                        <div className='mb-4'>
                                            <h5 className='font-medium text-gray-700 mb-2'>Medications:</h5>
                                            <div className='space-y-2'>
                                                {prescription.medications.map((med, medIndex) => (
                                                    <div key={medIndex} className='bg-blue-50 p-3 rounded'>
                                                        <div className='font-medium'>{med.name}</div>
                                                        <div className='text-sm text-gray-600'>
                                                            {med.dosage} - {med.frequency} - {med.duration}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <FaPrescriptionBottle className='mx-auto text-6xl text-gray-300 mb-4' />
                            <p className='text-gray-500 mb-4'>No prescriptions found</p>
                            <p className='text-sm text-gray-400'>Your prescriptions will appear here after doctor consultations</p>
                        </div>
                    )}
                </div>
            )}

            {/* Medical Records Tab */}
            {activeTab === 'records' && (
                <div className='bg-white rounded-2xl shadow-lg p-8'>
                    <h3 className='text-xl font-semibold mb-6'>Medical Records</h3>
                    {medicalRecords.length > 0 ? (
                        <div className='space-y-6'>
                            {medicalRecords.map((record, index) => (
                                <div key={index} className='border rounded-lg p-6 hover:shadow-md transition-shadow'>
                                    <div className='flex justify-between items-start mb-4'>
                                        <div>
                                            <h4 className='text-lg font-medium'>{record.encounterType || 'Medical Record'}</h4>
                                            <p className='text-gray-600'>{formatDate(record.encounterDate)}</p>
                                            <p className='text-sm text-gray-500'>Dr. {record.consultedDoctor?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                        <div>
                                            <h5 className='font-medium text-gray-700 mb-2'>Reason for Visit:</h5>
                                            <p className='text-gray-600 bg-gray-50 p-3 rounded'>{record.reasonForVisit || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <h5 className='font-medium text-gray-700 mb-2'>Diagnosis:</h5>
                                            <p className='text-gray-600 bg-gray-50 p-3 rounded'>{record.diagnosis || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-12'>
                            <FaFileAlt className='mx-auto text-6xl text-gray-300 mb-4' />
                            <p className='text-gray-500 mb-4'>No medical records found</p>
                            <p className='text-sm text-gray-400'>Your medical records will appear here after doctor visits</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default MyProfile