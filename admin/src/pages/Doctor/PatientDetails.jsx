import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { FaSpinner, FaCalendarAlt, FaNotesMedical, FaFileMedical, FaArrowLeft, FaUserCircle, FaHeartbeat, FaStethoscope, FaUserMd, FaClock } from 'react-icons/fa';

const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
};

const PatientDetails = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { getPatientDetails } = useContext(DoctorContext);
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

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

            // Transform and validate patient data
            const validatedPatient = {
                ...response.patient,
                name: response.patient.patientName || response.patient.name || 'Unnamed Patient',
                email: response.patient.email || 'No email provided',
                phone: response.patient.phone || 'No phone provided',
                uhid: response.patient.uhid || 'Not assigned',
                gender: response.patient.gender || 'Not specified',
                bloodGroup: response.patient.bloodGroup || 'Not specified',
                age: calculateAge(response.patient.dateOfBirth) || 'N/A',
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
        } catch (error) {
            console.error('Error loading patient details:', error);
            toast.error('Failed to load patient details');
            navigate('/doctor/patients-list');
        } finally {
            setLoading(false);
        }
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
                    onClick={() => navigate('/doctor/patients-list')}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                >
                    Return to Patients List
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate('/doctor/patients-list')}
                className="mb-6 flex items-center text-primary hover:text-primary-dark transition-colors duration-200"
            >
                <FaArrowLeft className="mr-2" />
                Back to Patients List
            </button>

            {/* Patient Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                            {patient.avatar ? (
                                <img
                                    src={patient.avatar}
                                    alt={patient.name}
                                className="w-24 h-24 rounded-xl object-cover"
                                />
                            ) : (
                            <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                                <FaUserCircle className="w-12 h-12 text-primary" />
                                </div>
                            )}
                        </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                        <div className="flex flex-wrap gap-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                                    UHID: {patient.uhid}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                    {patient.gender}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700">
                                Age: {patient.age}
                                </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                                activeTab === 'overview'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                    onClick={() => setActiveTab('appointments')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'appointments'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    Appointments
                </button>
                <button
                    onClick={() => setActiveTab('records')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'records'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            Clinical Records
                        </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-900">{patient.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-gray-900">{patient.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Blood Group</p>
                                    <p className="text-gray-900">{patient.bloodGroup}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                        <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Allergies</p>
                                    <p className="text-gray-900">{patient.medicalInfo.allergies}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Chronic Conditions</p>
                                    <p className="text-gray-900">{patient.medicalInfo.chronicConditions}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Medications</p>
                                    <p className="text-gray-900">{patient.medicalInfo.currentMedications}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'appointments' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>
                        {patient.appointments.length > 0 ? (
                            <div className="space-y-4">
                                {patient.appointments.map((appointment) => (
                                    <div
                                        key={appointment._id}
                                        className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200"
                                    >
                                        <div className="flex justify-between items-start">
                                        <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(appointment.date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500">{appointment.time}</p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    appointment.status === 'completed'
                                                        ? 'bg-green-50 text-green-700'
                                                        : appointment.status === 'cancelled'
                                                        ? 'bg-red-50 text-red-700'
                                                        : 'bg-yellow-50 text-yellow-700'
                                                }`}
                                            >
                                                {appointment.status}
                                                    </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                        ) : (
                            <p className="text-gray-500">No appointments found.</p>
                        )}
                                            </div>
                                        )}

                {activeTab === 'records' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Records</h3>
                        {patient.clinicalRecords.length > 0 ? (
                            <div className="space-y-4">
                                {patient.clinicalRecords.map((record) => (
                                    <div
                                        key={record._id}
                                        className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(record.encounterDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Dr. {record.consultedDoctor?.name}
                                                </p>
                                            </div>
                                                </div>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">Diagnosis</p>
                                            <p className="text-gray-900">{record.diagnosis}</p>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">Treatment</p>
                                            <p className="text-gray-900">{record.treatment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                            <p className="text-gray-500">No clinical records found.</p>
                    )}
                </div>
            )}
            </div>
        </div>
    );
};

export default PatientDetails; 