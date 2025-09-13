import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { FaSpinner, FaCalendarAlt, FaNotesMedical, FaFileMedical, FaArrowLeft, FaUserCircle, FaHeartbeat, FaStethoscope, FaUserMd, FaClock, FaFilter, FaSort, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const PatientDetails = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { getPatientDetails, getPatientClinicalRecords, updatePatientDetails } = useContext(AdminContext);
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);
    const [clinicalRecords, setClinicalRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState(null);

    useEffect(() => {
        loadPatientData();
    }, [patientId]);

    const loadPatientData = async () => {
        try {
            setLoading(true);
            const response = await getPatientDetails(patientId);
            
            if (!response || !response.patient) {
                throw new Error('Failed to load patient details');
            }

            // Log the raw dateOfBirth value received from the backend
            console.log('[PatientDetails] Raw dateOfBirth received:', response.patient.dateOfBirth);

            // Calculate age safely
            const dob = response.patient.dateOfBirth;
            const calculatedAge = calculateAge(dob);

            // Transform and validate patient data
            const validatedPatient = {
                ...response.patient,
                name: response.patient.patientName || response.patient.name || 'Unnamed Patient',
                email: response.patient.email || 'No email provided',
                phone: response.patient.phone || 'No phone provided',
                uhid: response.patient.uhid || 'Not assigned',
                gender: response.patient.gender || 'Not specified',
                bloodGroup: response.patient.bloodGroup || 'Not specified',
                dateOfBirth: dob, // Store the original value
                age: calculatedAge, // Store the calculated age
                appointments: response.patient.appointments || [],
                clinicalRecords: response.patient.clinicalRecords || [],
                medicalInfo: {
                    ...response.patient.medicalInfo,
                    allergies: response.patient.medicalInfo?.allergies || 'None reported',
                    chronicConditions: response.patient.medicalInfo?.chronicConditions || 'None reported',
                    currentMedications: response.patient.medicalInfo?.currentMedications || 'None reported',
                    emergencyContact: response.patient.medicalInfo?.emergencyContact || {}
                },
                address: response.patient.address || {}
            };
            
            setPatient(validatedPatient);
            
            const records = await getPatientClinicalRecords(patientId);
            if (records) {
                setClinicalRecords(records);
            }
        } catch (error) {
            console.error('Error loading patient details:', error);
            toast.error('Failed to load patient details');
            navigate('/patients-list');
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort records
    useEffect(() => {
        let filtered = [...clinicalRecords];

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(record => 
                record.currentClinicalStatus.toLowerCase() === filterStatus.toLowerCase()
            );
        }

        // Apply type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(record => 
                record.encounterType.toLowerCase() === filterType.toLowerCase()
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.encounterDate);
            const dateB = new Date(b.encounterDate);
            
            if (sortBy === 'date') {
                return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
            } else if (sortBy === 'status') {
                const statusA = a.currentClinicalStatus.toLowerCase();
                const statusB = b.currentClinicalStatus.toLowerCase();
                return sortOrder === 'asc' 
                    ? statusA.localeCompare(statusB)
                    : statusB.localeCompare(statusA);
            }
            return 0;
        });

        setFilteredRecords(filtered);
    }, [clinicalRecords, sortBy, sortOrder, filterStatus, filterType]);

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        // Check if the date is valid
        if (isNaN(birthDate.getTime())) {
            return 'N/A';
        }
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? age : 'N/A'; // Ensure age is not negative
    };

    const handleEdit = () => {
        setEditedPatient({ ...patient });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            // Call your API to update patient details
            const response = await updatePatientDetails(patient._id, editedPatient);
            if (response.success) {
                setPatient(editedPatient);
                toast.success('Patient details updated successfully');
            } else {
                throw new Error(response.message || 'Failed to update patient details');
            }
        } catch (error) {
            console.error('Error updating patient:', error);
            toast.error(error.message || 'Failed to update patient details');
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedPatient(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPatient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">Patient not found</h2>
                <p className="mt-2 text-gray-600">The requested patient information could not be found.</p>
                <button
                    onClick={() => navigate('/patients-list')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                    Return to Patients List
                </button>
            </div>
        );
    }

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'stable':
                return 'bg-green-100 text-green-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            case 'improving':
                return 'bg-blue-100 text-blue-800';
            case 'deteriorating':
                return 'bg-yellow-100 text-yellow-800';
            case 'resolved':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Function to safely format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString();
    };

    // Function to get displayable age
    const getDisplayAge = (dob) => {
        const age = calculateAge(dob);
        return age === 'N/A' ? 'N/A' : `${age} years`;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Back Button with enhanced styling */}
            <button
                onClick={() => navigate('/patients-list')}
                className="mb-6 flex items-center text-primary hover:text-primary-dark transition-colors duration-200 group"
            >
                <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Patients List</span>
            </button>

            {/* Patient Header with enhanced styling */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 transform hover:shadow-md transition-all duration-200">
                <div className="flex items-start justify-between flex-wrap md:flex-nowrap gap-6">
                    <div className="flex items-start gap-6 w-full md:w-auto">
                        <div className="flex-shrink-0 relative group">
                            {patient.avatar ? (
                                <img
                                    src={patient.avatar}
                                    alt={patient.name}
                                    className="w-24 h-24 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow duration-200"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                                    <FaUserCircle className="w-16 h-16 text-primary/60" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedPatient?.name || ''}
                                            onChange={handleInputChange}
                                            className="border rounded-lg px-3 py-1"
                                        />
                                    ) : (
                                        patient.name
                                    )}
                                </h1>
                                <button
                                    onClick={isEditing ? handleSave : handleEdit}
                                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    {isEditing ? <FaSave className="w-5 h-5" /> : <FaEdit className="w-5 h-5" />}
                                </button>
                                {isEditing && (
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <FaTimes className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                    UHID: {patient.uhid}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                    {patient.gender}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                                    Age: {getDisplayAge(patient.dateOfBirth)}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center text-gray-600">
                                    <FaStethoscope className="w-4 h-4 mr-2 text-primary" />
                                    <span>{patient.bloodGroup} Blood Group</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span>{patient.email}</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <span>{patient.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                activeTab === 'overview'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('clinical-records')}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                                activeTab === 'clinical-records'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/40'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Clinical Records
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Sections with enhanced styling */}
            {activeTab === 'overview' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FaUserCircle className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">UHID</p>
                                    <p className="mt-1 font-medium text-gray-900">{patient.uhid}</p>
                                </div>
                                {patient.alternateUhid && (
                                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                        <p className="text-sm font-medium text-gray-500">Alternate UHID</p>
                                        <p className="mt-1 font-medium text-gray-900">{patient.alternateUhid}</p>
                                    </div>
                                )}
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="mt-1 font-medium text-gray-900">{patient.name}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={editedPatient?.dateOfBirth && !isNaN(new Date(editedPatient.dateOfBirth).getTime()) 
                                                       ? new Date(editedPatient.dateOfBirth).toISOString().split('T')[0] 
                                                       : ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border rounded-lg px-3 py-1"
                                            />
                                        ) : (
                                            formatDate(patient.dateOfBirth)
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Age</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {getDisplayAge(patient.dateOfBirth)}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Gender</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {isEditing ? (
                                            <select
                                                name="gender"
                                                value={editedPatient?.gender || ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border rounded-lg px-3 py-1"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            patient.gender || 'Not specified'
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Blood Group</p>
                                    <p className="mt-1 font-medium text-gray-900">
                                        {isEditing ? (
                                            <select
                                                name="bloodGroup"
                                                value={editedPatient?.bloodGroup || ''}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full border rounded-lg px-3 py-1"
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
                                            patient.bloodGroup || 'Not specified'
                                        )}
                                    </p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="mt-1 font-medium text-gray-900">{patient.email}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="mt-1 font-medium text-gray-900">{patient.phone}</p>
                                </div>
                                {patient.occupation && (
                                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                        <p className="text-sm font-medium text-gray-500">Occupation</p>
                                        <p className="mt-1 font-medium text-gray-900">{patient.occupation}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact & Insurance Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Contact & Insurance</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Address</p>
                                <div className="mt-1 space-y-1">
                                    <p>{patient.address.line1}</p>
                                    {patient.address.line2 && <p>{patient.address.line2}</p>}
                                    <p>{patient.address.city}, {patient.address.state} {patient.address.zipCode}</p>
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                                <div className="mt-1 space-y-1">
                                    <p><strong>{patient.medicalInfo?.emergencyContact?.name}</strong></p>
                                    <p>Phone: {patient.medicalInfo?.emergencyContact?.phone}</p>
                                    {patient.medicalInfo?.emergencyContact?.relationship && (
                                        <p>Relationship: {patient.medicalInfo.emergencyContact.relationship}</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Insurance Status</p>
                                <p className="mt-1">{patient.insuranceStatus || 'Not specified'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Organ Donor Status</p>
                                <p className="mt-1">{patient.organDonorStatus || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <FaHeartbeat className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Height</p>
                                <p className="mt-1 font-medium text-gray-900">{patient.medicalInfo?.height ? `${patient.medicalInfo.height} cm` : 'Not recorded'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Weight</p>
                                <p className="mt-1 font-medium text-gray-900">{patient.medicalInfo?.weight ? `${patient.medicalInfo.weight} kg` : 'Not recorded'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Allergies</p>
                                <p className="mt-1 font-medium text-gray-900">{patient.medicalInfo?.allergies || 'None reported'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Chronic Conditions</p>
                                <p className="mt-1 font-medium text-gray-900">{patient.medicalInfo?.chronicConditions || 'None reported'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Current Medications</p>
                                <p className="mt-1 font-medium text-gray-900">{patient.medicalInfo?.currentMedications || 'None reported'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Card */}
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <FaClock className="w-6 h-6 text-purple-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Last Visit</p>
                                <p className="mt-1 font-medium text-gray-900">{clinicalRecords.length > 0 
                                    ? new Date(clinicalRecords[0].encounterDate).toLocaleDateString()
                                    : 'No visits recorded'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                <p className="text-sm font-medium text-gray-500">Total Visits</p>
                                <p className="mt-1 font-medium text-gray-900">{clinicalRecords.length}</p>
                            </div>
                            {clinicalRecords.length > 0 && (
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Current Clinical Status</p>
                                    <span className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${getStatusClass(clinicalRecords[0].currentClinicalStatus)}`}>
                                        {clinicalRecords[0].currentClinicalStatus}
                                    </span>
                                </div>
                            )}
                            {clinicalRecords.length > 0 && clinicalRecords[0].followUpDate && (
                                <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <p className="text-sm font-medium text-gray-500">Next Follow-up</p>
                                    <p className="mt-1 font-medium text-gray-900">{new Date(clinicalRecords[0].followUpDate).toLocaleDateString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FaNotesMedical className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Clinical Records</h2>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setSortBy('date');
                                    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                                }}
                                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                            >
                                <FaSort className="w-4 h-4 mr-2" />
                                Sort by Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                                >
                                    <FaFilter className="w-4 h-4 mr-2" />
                                    Filter Records
                                </button>
                                {showFilterDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                                        <div className="mb-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                className="w-full px-2 py-1 border rounded-md"
                                            >
                                                <option value="all">All Statuses</option>
                                                <option value="Stable">Stable</option>
                                                <option value="Critical">Critical</option>
                                                <option value="Improving">Improving</option>
                                                <option value="Deteriorating">Deteriorating</option>
                                                <option value="Under Observation">Under Observation</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                                value={filterType}
                                                onChange={(e) => setFilterType(e.target.value)}
                                                className="w-full px-2 py-1 border rounded-md"
                                            >
                                                <option value="all">All Types</option>
                                                <option value="Initial Visit">Initial Visit</option>
                                                <option value="Follow-up">Follow-up</option>
                                                <option value="Emergency">Emergency</option>
                                                <option value="Routine Checkup">Routine Checkup</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {clinicalRecords.length > 0 ? (
                        <div className="space-y-6">
                            {filteredRecords.map((record) => (
                                <div key={record._id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    {record.encounterType || 'Clinical Visit'}
                                            </h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(record.currentClinicalStatus)}`}>
                                                    {record.currentClinicalStatus}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <span className="flex items-center">
                                                    <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(record.encounterDate || record.createdAt).toLocaleDateString()}
                                                </span>
                                                {record.consultedDoctor && (
                                                    <span className="flex items-center">
                                                        <FaUserMd className="w-4 h-4 mr-2 text-gray-400" />
                                                        {record.consultedDoctor.name || 'Not specified'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Visit Details */}
                                        <div className="space-y-4">
                                            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Reason for Visit</h4>
                                                <p className="text-gray-900">{record.reasonForVisit || 'Not specified'}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Diagnosis</h4>
                                                <p className="text-gray-900">{record.diagnosis || 'Not specified'}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Treatment Plan</h4>
                                                <p className="text-gray-900">{record.treatment || 'Not specified'}</p>
                                            </div>
                                        </div>

                                        {/* Vital Signs */}
                                        {record.vitalSigns && Object.keys(record.vitalSigns).some(key => record.vitalSigns[key]) && (
                                            <div className="md:col-span-2">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Vital Signs</h4>
                                                <div className="grid grid-cols-2 gap-4">
                                                    {record.vitalSigns.bloodPressure && (
                                                        <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                            <p className="text-xs text-gray-500">Blood Pressure</p>
                                                            <p className="font-medium">{record.vitalSigns.bloodPressure}</p>
                                                        </div>
                                                    )}
                                                    {record.vitalSigns.heartRate && (
                                                        <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                            <p className="text-xs text-gray-500">Heart Rate</p>
                                                            <p className="font-medium">{record.vitalSigns.heartRate} bpm</p>
                                                        </div>
                                                    )}
                                                    {record.vitalSigns.temperature && (
                                                        <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                            <p className="text-xs text-gray-500">Temperature</p>
                                                            <p className="font-medium">{record.vitalSigns.temperature}°C</p>
                                                        </div>
                                                    )}
                                                    {record.vitalSigns.respiratoryRate && (
                                                        <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                            <p className="text-xs text-gray-500">Respiratory Rate</p>
                                                            <p className="font-medium">{record.vitalSigns.respiratoryRate} /min</p>
                                                        </div>
                                                    )}
                                                    {record.vitalSigns.oxygenSaturation && (
                                                        <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                            <p className="text-xs text-gray-500">O₂ Saturation</p>
                                                            <p className="font-medium">{record.vitalSigns.oxygenSaturation}%</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Prescriptions */}
                                        {record.prescription && record.prescription.length > 0 && (
                                            <div className="md:col-span-2">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Prescriptions</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {record.prescription.map((med, index) => (
                                                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                                                            <p className="font-medium text-gray-900">{med.medicine}</p>
                                                            <div className="mt-2 space-y-1 text-sm">
                                                                <p><span className="text-gray-500">Dosage:</span> {med.dosage}</p>
                                                                <p><span className="text-gray-500">Frequency:</span> {med.frequency}</p>
                                                                <p><span className="text-gray-500">Duration:</span> {med.duration}</p>
                                                                {med.notes && (
                                                                    <p><span className="text-gray-500">Notes:</span> {med.notes}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Lab Tests */}
                                        {record.labTests && record.labTests.length > 0 && (
                                            <div className="md:col-span-2">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Laboratory Tests</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {record.labTests.map((test, index) => (
                                                        <div key={index} className="bg-gray-50 rounded-lg p-3">
                                                            <p className="font-medium text-gray-900">{test.testName}</p>
                                                            <div className="mt-2 space-y-1 text-sm">
                                                                <p><span className="text-gray-500">Result:</span> {test.result}</p>
                                                                <p><span className="text-gray-500">Date:</span> {new Date(test.date).toLocaleDateString()}</p>
                                                                {test.normalRange && (
                                                                    <p><span className="text-gray-500">Normal Range:</span> {test.normalRange}</p>
                                                                )}
                                                                {test.interpretation && (
                                                                    <p><span className="text-gray-500">Interpretation:</span> {test.interpretation}</p>
                                                                )}
                                                                {test.notes && (
                                                                    <p><span className="text-gray-500">Notes:</span> {test.notes}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Notes and Follow-up */}
                                        <div className="md:col-span-2 space-y-4">
                                            {record.notes && (
                                                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                                    <h4 className="text-sm font-medium text-gray-500 mb-2">Clinical Notes</h4>
                                                    <p className="text-gray-900">{record.notes}</p>
                                                </div>
                                            )}
                                            {record.followUpDate && (
                                                <div className="flex items-center text-sm">
                                                    <FaCalendarAlt className="mr-2 text-gray-400" />
                                                    <span>
                                                        Follow-up Appointment: {new Date(record.followUpDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Attachments */}
                                        {record.attachments && record.attachments.length > 0 && (
                                            <div className="md:col-span-2">
                                                <h4 className="text-sm font-medium text-gray-500 mb-2">Attachments</h4>
                                                <div className="flex flex-wrap gap-4">
                                                    {record.attachments.map((attachment, index) => (
                                                        <a
                                                            key={index}
                                                            href={attachment.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                                                        >
                                                            <FaFileMedical className="text-gray-400" />
                                                            <span className="text-sm">{attachment.name}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FaFileMedical className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Clinical Records</h3>
                            <p className="text-gray-500 max-w-sm mx-auto">
                                No clinical records have been created for this patient yet.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Helper functions
const formatAddress = (address) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    const parts = [];
    if (address.line1) parts.push(address.line1);
    if (address.line2) parts.push(address.line2);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.zipCode) parts.push(address.zipCode);
    return parts.join(', ') || 'No address provided';
};

const formatEmergencyContact = (contact) => {
    if (!contact) return 'No emergency contact provided';
    const parts = [];
    if (contact.name) parts.push(contact.name);
    if (contact.phone) parts.push(contact.phone);
    if (contact.relationship) parts.push(`(${contact.relationship})`);
    return parts.join(' ') || 'No emergency contact provided';
};

export default PatientDetails; 