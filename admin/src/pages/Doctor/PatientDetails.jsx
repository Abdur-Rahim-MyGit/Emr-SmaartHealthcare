import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaArrowLeft, FaUserCircle, FaCalendarAlt, FaFileMedical, FaEdit, FaSave, FaTimes, FaSpinner, FaHeartbeat, FaStethoscope, FaNotesMedical, FaUserMd, FaPrint } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import PrescriptionPrint from '../../components/PrescriptionPrint';

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
    const { getPatientDetails, dToken } = useContext(DoctorContext);
    const [loading, setLoading] = useState(true);
    const [patient, setPatient] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [vitals, setVitals] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [expandedVital, setExpandedVital] = useState(null);
    const [expandedPrescription, setExpandedPrescription] = useState(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);

    useEffect(() => {
        loadPatientData();
    }, [patientId]);

    const fetchVitals = async (patientUhid) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/doctor/patient-vitals/${patientUhid}`, {
                headers: { Authorization: `Bearer ${dToken}` }
            });
            if (response.data.success) {
                setVitals(response.data.vitals || []);
            }
        } catch (error) {
            console.error('Error fetching vitals:', error);
        }
    };

    const fetchPrescriptions = async (patientUhid) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/doctor/patient-prescriptions/${patientUhid}`, {
                headers: { Authorization: `Bearer ${dToken}` }
            });
            if (response.data.success) {
                setPrescriptions(response.data.prescriptions || []);
            }
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    };

    const handlePrintPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setShowPrintPreview(true);
    };

    const closePrintPreview = () => {
        setShowPrintPreview(false);
        setSelectedPrescription(null);
    };

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
            
            // Fetch vitals and prescriptions
            if (validatedPatient.uhid && validatedPatient.uhid !== 'Not assigned') {
                await fetchVitals(validatedPatient.uhid);
                await fetchPrescriptions(validatedPatient.uhid);
            }
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
                                Age: {calculateAge(patient.dateOfBirth) || patient.age || 'N/A'}
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
                    <FaUserCircle className="inline mr-2" />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('vitals')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'vitals'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <FaHeartbeat className="inline mr-2" />
                    Vitals ({vitals.length})
                </button>
                <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'prescriptions'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <FaNotesMedical className="inline mr-2" />
                    Prescriptions ({prescriptions.filter(p => p.status === 'finalized').length})
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'appointments'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                    <FaCalendarAlt className="inline mr-2" />
                    Appointments
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

                {activeTab === 'vitals' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FaHeartbeat className="inline mr-2 text-red-500" />
                            Vitals Records
                        </h3>
                        {vitals.length > 0 ? (
                            <div className="space-y-4">
                                {vitals.map((vital) => (
                                    <div
                                        key={vital._id}
                                        className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Visit Date: {new Date(vital.visitDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Recorded: {new Date(vital.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setExpandedVital(expandedVital === vital._id ? null : vital._id)}
                                                className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                                            >
                                                {expandedVital === vital._id ? 'Hide Details' : 'View Details'}
                                            </button>
                                        </div>

                                        {/* Basic Vitals - Always Visible */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                            <div className="text-center p-2 bg-blue-50 rounded">
                                                <p className="text-xs text-gray-500">Height</p>
                                                <p className="font-medium">{vital.height || 'N/A'} cm</p>
                                            </div>
                                            <div className="text-center p-2 bg-green-50 rounded">
                                                <p className="text-xs text-gray-500">Weight</p>
                                                <p className="font-medium">{vital.weight || 'N/A'} kg</p>
                                            </div>
                                            <div className="text-center p-2 bg-red-50 rounded">
                                                <p className="text-xs text-gray-500">BP</p>
                                                <p className="font-medium">{vital.bloodPressure || 'N/A'}</p>
                                            </div>
                                            <div className="text-center p-2 bg-yellow-50 rounded">
                                                <p className="text-xs text-gray-500">BMI</p>
                                                <p className="font-medium">{vital.bmi || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedVital === vital._id && (
                                            <div className="mt-4 pt-4 border-t space-y-4">
                                                {/* Additional Vitals */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="text-center p-2 bg-purple-50 rounded">
                                                        <p className="text-xs text-gray-500">Heart Rate</p>
                                                        <p className="font-medium">{vital.heartRate || 'N/A'} bpm</p>
                                                    </div>
                                                    <div className="text-center p-2 bg-indigo-50 rounded">
                                                        <p className="text-xs text-gray-500">Respiratory Rate</p>
                                                        <p className="font-medium">{vital.respiratoryRate || 'N/A'} /min</p>
                                                    </div>
                                                    <div className="text-center p-2 bg-pink-50 rounded">
                                                        <p className="text-xs text-gray-500">Temperature</p>
                                                        <p className="font-medium">{vital.temperature || 'N/A'} °F</p>
                                                    </div>
                                                    <div className="text-center p-2 bg-cyan-50 rounded">
                                                        <p className="text-xs text-gray-500">O2 Saturation</p>
                                                        <p className="font-medium">{vital.oxygenSaturation || 'N/A'}%</p>
                                                    </div>
                                                </div>

                                                {/* Clinical Information */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Chief Complaint</h4>
                                                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                            {vital.chiefComplaint || 'Not recorded'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                                                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                            {vital.complaintDuration || 'Not recorded'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Allergies */}
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-xs text-gray-500">Drug Allergies</p>
                                                            <p className="text-sm text-gray-600 bg-red-50 p-2 rounded">
                                                                {vital.drugAllergies || 'None'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Food Allergies</p>
                                                            <p className="text-sm text-gray-600 bg-orange-50 p-2 rounded">
                                                                {vital.foodAllergies || 'None'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500">Environmental</p>
                                                            <p className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                                                                {vital.environmentalAllergies || 'None'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Medical History */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Current Medications</h4>
                                                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                                            {vital.currentMedications || 'None'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Chronic Illnesses</h4>
                                                        <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                                                            {vital.chronicIllnesses || 'None'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Family History */}
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Family Medical History</h4>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        <div className="text-center p-2 bg-red-50 rounded">
                                                            <p className="text-xs text-gray-500">Diabetes</p>
                                                            <p className="font-medium">{vital.familyDiabetes ? 'Yes' : 'No'}</p>
                                                        </div>
                                                        <div className="text-center p-2 bg-orange-50 rounded">
                                                            <p className="text-xs text-gray-500">Hypertension</p>
                                                            <p className="font-medium">{vital.familyHypertension ? 'Yes' : 'No'}</p>
                                                        </div>
                                                        <div className="text-center p-2 bg-purple-50 rounded">
                                                            <p className="text-xs text-gray-500">Heart Disease</p>
                                                            <p className="font-medium">{vital.familyHeartDisease ? 'Yes' : 'No'}</p>
                                                        </div>
                                                        <div className="text-center p-2 bg-pink-50 rounded">
                                                            <p className="text-xs text-gray-500">Cancer</p>
                                                            <p className="font-medium">{vital.familyCancer ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                    {vital.familyOtherConditions && (
                                                        <div className="mt-2">
                                                            <p className="text-xs text-gray-500">Other Conditions</p>
                                                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                                {vital.familyOtherConditions}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Lifestyle Habits */}
                                                <div>
                                                    <h4 className="font-medium text-gray-900 mb-2">Lifestyle Habits</h4>
                                                    <p className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                                                        {vital.lifestyleHabits || 'Not recorded'}
                                                    </p>
                                                </div>

                                                {/* Nurse Observations */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">General Appearance</h4>
                                                        <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                                            {vital.generalAppearance || 'Not recorded'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Special Remarks</h4>
                                                        <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                                                            {vital.specialRemarks || 'None'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {vital.additionalNotes && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                                                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                            {vital.additionalNotes}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FaHeartbeat className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No vitals recorded</h3>
                                <p className="mt-1 text-sm text-gray-500">No vital signs have been recorded for this patient yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'prescriptions' && (
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            <FaNotesMedical className="inline mr-2 text-blue-500" />
                            Prescriptions
                        </h3>
                        {prescriptions.filter(p => p.status === 'finalized').length > 0 ? (
                            <div className="space-y-4">
                                {prescriptions.filter(p => p.status === 'finalized').map((prescription) => (
                                    <div
                                        key={prescription._id}
                                        className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {new Date(prescription.createdAt).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Dr. {prescription.doctorId?.name || 'Unknown Doctor'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setExpandedPrescription(expandedPrescription === prescription._id ? null : prescription._id)}
                                                    className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark"
                                                >
                                                    {expandedPrescription === prescription._id ? 'Hide Details' : 'View Details'}
                                                </button>
                                                <button
                                                    onClick={() => handlePrintPrescription(prescription)}
                                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                                                >
                                                    <FaPrint className="text-xs" />
                                                    Print
                                                </button>
                                            </div>
                                        </div>

                                        {/* Basic Info - Always Visible */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <p className="text-sm text-gray-500">Consultation Type</p>
                                                <p className="font-medium">{prescription.consultationType || 'Not specified'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Follow-up Date</p>
                                                <p className="font-medium">
                                                    {prescription.followUpDate 
                                                        ? new Date(prescription.followUpDate).toLocaleDateString()
                                                        : 'Not scheduled'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        {expandedPrescription === prescription._id && (
                                            <div className="mt-4 pt-4 border-t space-y-4">
                                                {/* Clinical Notes */}
                                                {prescription.clinicalNotes && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Clinical Notes</h4>
                                                        <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                                                            {prescription.clinicalNotes}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Investigations */}
                                                {prescription.investigations && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Investigations</h4>
                                                        <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded">
                                                            {prescription.investigations}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Medications */}
                                                {prescription.medications && prescription.medications.length > 0 && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Medications</h4>
                                                        <div className="space-y-2">
                                                            {prescription.medications.map((medication, index) => (
                                                                <div key={index} className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">Medicine</p>
                                                                            <p className="font-medium">{medication.name}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">Dosage</p>
                                                                            <p className="text-sm">{medication.dosage}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">Frequency</p>
                                                                            <p className="text-sm">{medication.frequency}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">Duration</p>
                                                                            <p className="text-sm">{medication.duration}</p>
                                                                        </div>
                                                                    </div>
                                                                    {medication.instructions && (
                                                                        <div className="mt-2">
                                                                            <p className="text-xs text-gray-500">Instructions</p>
                                                                            <p className="text-sm text-gray-600">{medication.instructions}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Treatment Advice */}
                                                {prescription.treatmentAdvice && (
                                                    <div>
                                                        <h4 className="font-medium text-gray-900 mb-2">Treatment Advice</h4>
                                                        <p className="text-sm text-gray-600 bg-purple-50 p-3 rounded">
                                                            {prescription.treatmentAdvice}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FaNotesMedical className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
                                <p className="mt-1 text-sm text-gray-500">No prescriptions have been created for this patient yet.</p>
                            </div>
                        )}
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

            {/* Print Preview Modal */}
            {showPrintPreview && selectedPrescription && (
                <PrescriptionPrint
                    prescription={selectedPrescription}
                    patient={patient}
                    doctor={{ name: selectedPrescription.doctorId?.name || 'Doctor', speciality: 'General Physician', degree: 'MBBS' }}
                    onClose={closePrintPreview}
                />
            )}
        </div>
    );
};

export default PatientDetails; 