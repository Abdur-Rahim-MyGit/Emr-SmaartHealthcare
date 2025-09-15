import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { FaSpinner, FaCalendarAlt, FaNotesMedical, FaFileMedical, FaArrowLeft, FaUserCircle, FaHeartbeat, FaStethoscope, FaUserMd, FaClock, FaFilter, FaSort, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const PatientDetails = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { getPatientDetails } = useContext(AdminContext);
    
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState(null);
    const [clinicalRecords, setClinicalRecords] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    
    // Modal state for vitals entry
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [vitalsForm, setVitalsForm] = useState({
        height: '',
        weight: '',
        // ...other vitals fields...
    });

    useEffect(() => {
        if (patientId) {
            fetchPatientDetails();
        }
    }, [patientId]);

    const fetchPatientDetails = async () => {
        try {
            setLoading(true);
            const response = await getPatientDetails(patientId);
            if (response.success) {
                setPatient(response.patient);
                setClinicalRecords(response.patient.clinicalRecords || []);
            }
        } catch (error) {
            console.error('Error fetching patient details:', error);
            toast.error('Failed to load patient details');
        } finally {
            setLoading(false);
        }
    };

    // Helper functions
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

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString();
    };

    const getDisplayAge = (dob) => {
        const age = calculateAge(dob);
        return age === 'N/A' ? 'N/A' : `${age} years`;
    };

    // ...existing code...
    // Remove all stray closing braces and duplicate return statements
    // Only one main return statement below

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
            return 0; // Default case if sortBy is not 'date' or 'status'
        });

        // If you need to set state with filtered, do it here (e.g., setFilteredRecords(filtered));
    }, [clinicalRecords, filterStatus, filterType, sortBy, sortOrder]);
    
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

    // Main return statement
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/patients-list')}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Patients
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Patient Details</h1>
                    </div>
                </div>

                {/* Patient Basic Info Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <FaUserCircle className="w-16 h-16 text-gray-400" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{patient?.name || 'Unknown Patient'}</h2>
                                <p className="text-gray-600">UHID: {patient?.uhid || 'Not assigned'}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaEdit className="mr-2" />
                                    Edit
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <FaSave className="mr-2" />
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        <FaTimes className="mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900">{patient?.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <p className="text-gray-900">{patient?.phone || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <p className="text-gray-900">{getDisplayAge(patient?.dateOfBirth)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <p className="text-gray-900">{patient?.gender || 'Not specified'}</p>
                        </div>
                    </div>
                </div>

                {/* Clinical Records Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Clinical Records</h3>
                    {clinicalRecords.length === 0 ? (
                        <p className="text-gray-600">No clinical records found for this patient.</p>
                    ) : (
                        <div className="space-y-4">
                            {clinicalRecords.map((record, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">{record.reasonForVisit}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(record.currentClinicalStatus)}`}>
                                            {record.currentClinicalStatus}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-2">
                                        Date: {formatDate(record.encounterDate)} | Doctor: {record.consultedDoctor}
                                    </p>
                                    <p className="text-gray-700">{record.diagnosis}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PatientDetails;