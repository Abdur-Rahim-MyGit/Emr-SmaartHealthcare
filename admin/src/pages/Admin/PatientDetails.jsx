import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaSpinner, FaCalendarAlt, FaNotesMedical, FaFileMedical, FaArrowLeft, FaUserCircle, FaHeartbeat, FaStethoscope, FaUserMd, FaClock, FaFilter, FaSort, FaEdit, FaSave, FaTimes, FaPlus, FaEye, FaWeight, FaThermometerHalf, FaPrint } from 'react-icons/fa';
import PrescriptionPrint from '../../components/PrescriptionPrint';

const PatientDetails = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { getPatientDetails, backendUrl, aToken } = useContext(AdminContext);
    
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPatient, setEditedPatient] = useState(null);
    const [clinicalRecords, setClinicalRecords] = useState([]);
    const [vitalsRecords, setVitalsRecords] = useState([]);
    const [expandedVital, setExpandedVital] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    
    // Modal state for vitals entry
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [vitalsLoading, setVitalsLoading] = useState(false);
    const [vitalsForm, setVitalsForm] = useState({
        visitDate: new Date().toISOString().split('T')[0], // Default to today
        height: '',
        weight: '',
        systolic: '',
        diastolic: '',
        heartRate: '',
        respiratoryRate: '',
        temperature: '',
        oxygenSaturation: '',
        chiefComplaint: '',
        complaintDuration: '',
        drugAllergies: '',
        foodAllergies: '',
        environmentAllergies: '',
        currentMedications: '',
        chronicIllnesses: '',
        familyDiabetes: false,
        familyHypertension: false,
        familyHeartDisease: false,
        familyCancer: false,
        familyOther: '',
        lifestyleHabits: '', // Simplified to one general field
        generalAppearance: '',
        specialRemarks: '',
        additionalNotes: ''
    });

    useEffect(() => {
        console.log('PatientDetails useEffect - patientId:', patientId);
        console.log('PatientDetails useEffect - aToken:', aToken ? 'Present' : 'Missing');
        if (patientId && aToken) {
            fetchPatientDetails();
            fetchVitalsRecords();
            fetchPrescriptions();
        } else if (!aToken) {
            console.log('Waiting for auth token...');
        }
    }, [patientId, aToken]);

    const fetchPatientDetails = async () => {
        try {
            setLoading(true);
            console.log('Fetching patient details for ID:', patientId);
            const response = await getPatientDetails(patientId);
            console.log('Patient details response:', response);
            if (response && response.success && response.patient) {
                setPatient(response.patient);
                setClinicalRecords(response.patient.clinicalRecords || []);
                console.log('Patient data set successfully:', response.patient);
            } else {
                console.error('Invalid response structure:', response);
                throw new Error('Invalid patient data received');
            }
        } catch (error) {
            console.error('Error fetching patient details:', error);
            toast.error('Failed to load patient details');
            setPatient(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchVitalsRecords = async () => {
        try {
            if (!aToken) {
                console.log('No auth token available for vitals fetch');
                return;
            }

            console.log('Fetching vitals for patient:', patientId);
            const response = await axios.get(`${backendUrl}/api/admin/vitals/patient/${patientId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            
            console.log('Vitals fetch response:', response.data);
            
            if (response.data.success) {
                console.log('Setting vitals records:', response.data.vitalsRecords);
                setVitalsRecords(response.data.vitalsRecords || []);
            }
        } catch (error) {
            console.error('Error fetching vitals records:', error);
            setVitalsRecords([]);
        }
    };

    const fetchPrescriptions = async () => {
        try {
            if (!aToken) {
                console.log('No auth token available for prescriptions fetch');
                return;
            }

            console.log('Fetching prescriptions for patient:', patientId);
            const response = await axios.get(`${backendUrl}/api/admin/patient-prescriptions/${patientId}`, {
                headers: { Authorization: `Bearer ${aToken}` }
            });
            
            console.log('Prescriptions fetch response:', response.data);
            
            if (response.data.success) {
                setPrescriptions(response.data.prescriptions || []);
            }
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedPatient({ ...patient });
    };

    const handleSave = async () => {
        try {
            setIsEditing(false);
            toast.success('Patient details updated successfully');
        } catch (error) {
            toast.error('Failed to update patient details');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedPatient(null);
    };

    const handlePrintPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setShowPrintPreview(true);
    };

    const closePrintPreview = () => {
        setShowPrintPreview(false);
        setSelectedPrescription(null);
    };

    const handleVitalsSubmit = async (e) => {
        e.preventDefault();
        setVitalsLoading(true);
        
        try {
            const vitalsData = {
                patientId,
                uhid: patient.uhid,
                visitDate: vitalsForm.visitDate,
                vitalSigns: {
                    height: { value: parseFloat(vitalsForm.height) || 0 },
                    weight: { value: parseFloat(vitalsForm.weight) || 0 },
                    bloodPressure: {
                        systolic: parseInt(vitalsForm.systolic) || 0,
                        diastolic: parseInt(vitalsForm.diastolic) || 0
                    },
                    heartRate: { value: parseInt(vitalsForm.heartRate) || 0 },
                    respiratoryRate: { value: parseInt(vitalsForm.respiratoryRate) || 0 },
                    temperature: { value: parseFloat(vitalsForm.temperature) || 0 },
                    oxygenSaturation: { value: parseInt(vitalsForm.oxygenSaturation) || 0 }
                },
                clinicalNotes: {
                    chiefComplaint: {
                        complaint: vitalsForm.chiefComplaint,
                        duration: vitalsForm.complaintDuration
                    },
                    allergies: {
                        drug: vitalsForm.drugAllergies ? vitalsForm.drugAllergies.split(',').map(s => s.trim()) : [],
                        food: vitalsForm.foodAllergies ? vitalsForm.foodAllergies.split(',').map(s => s.trim()) : [],
                        environment: vitalsForm.environmentAllergies ? vitalsForm.environmentAllergies.split(',').map(s => s.trim()) : []
                    },
                    currentMedications: vitalsForm.currentMedications ? vitalsForm.currentMedications.split(',').map(med => ({
                        name: med.trim(),
                        dosage: '',
                        frequency: ''
                    })) : [],
                    pastMedicalHistory: {
                        chronicIllnesses: vitalsForm.chronicIllnesses ? vitalsForm.chronicIllnesses.split(',').map(s => s.trim()) : []
                    },
                    familyMedicalHistory: {
                        diabetes: vitalsForm.familyDiabetes,
                        hypertension: vitalsForm.familyHypertension,
                        heartDisease: vitalsForm.familyHeartDisease,
                        cancer: vitalsForm.familyCancer,
                        other: vitalsForm.familyOther ? vitalsForm.familyOther.split(',').map(s => s.trim()) : []
                    },
                    lifestyleHabits: {
                        general: vitalsForm.lifestyleHabits // Simplified to one general field
                    },
                    nurseObservations: {
                        generalAppearance: vitalsForm.generalAppearance,
                        specialRemarks: vitalsForm.specialRemarks,
                        additionalNotes: vitalsForm.additionalNotes
                    }
                }
            };

            const response = await axios.post(`${backendUrl}/api/admin/vitals`, vitalsData, {
                headers: { Authorization: `Bearer ${aToken}` }
            });

            if (response.data.success) {
                toast.success('Vitals recorded successfully');
                setShowVitalsModal(false);
                setVitalsForm({
                    visitDate: new Date().toISOString().split('T')[0],
                    height: '', weight: '', systolic: '', diastolic: '', heartRate: '', respiratoryRate: '',
                    temperature: '', oxygenSaturation: '', chiefComplaint: '', complaintDuration: '',
                    drugAllergies: '', foodAllergies: '', environmentAllergies: '', currentMedications: '',
                    chronicIllnesses: '', familyDiabetes: false, familyHypertension: false, familyHeartDisease: false,
                    familyCancer: false, familyOther: '', lifestyleHabits: '',
                    generalAppearance: '', specialRemarks: '', additionalNotes: ''
                });
                fetchVitalsRecords();
            }
        } catch (error) {
            console.error('Error saving vitals:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save vitals';
            toast.error(errorMessage);
        } finally {
            setVitalsLoading(false);
        }
    };

    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) {
            return 'N/A';
        }
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? age : 'N/A';
    };

    const getDisplayAge = (dob) => {
        const age = calculateAge(dob);
        return age === 'N/A' ? 'N/A' : `${age} years`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Patient Not Found</h2>
                    <p className="text-gray-500">The requested patient could not be found.</p>
                    <button 
                        onClick={() => navigate('/patient-list')}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Back to Patient List
                    </button>
                </div>
            </div>
        );
    }

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
                                <h2 className="text-2xl font-bold text-gray-900">{patient?.patientName || 'Unknown Patient'}</h2>
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
                            <p className="text-gray-900">{getDisplayAge(patient?.dateOfBirth || patient?.dob)}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <p className="text-gray-900">{patient?.gender || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                            <p className="text-gray-900">{patient?.bloodGroup || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                            <p className="text-gray-900">{patient?.occupation || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Status</label>
                            <p className="text-gray-900">{patient?.insuranceStatus || 'Not specified'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Organ Donor</label>
                            <p className="text-gray-900">{patient?.organDonorStatus || 'Not specified'}</p>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    {patient?.medicalInfo?.emergencyContact && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <p className="text-gray-900">{patient.medicalInfo.emergencyContact.name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                    <p className="text-gray-900">{patient.medicalInfo.emergencyContact.relationship || 'Not provided'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <p className="text-gray-900">{patient.medicalInfo.emergencyContact.phone || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Vitals Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <FaHeartbeat className="mr-2 text-red-500" />
                            Vitals Records
                        </h3>
                        <button
                            onClick={() => setShowVitalsModal(true)}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <FaPlus className="mr-2" />
                            Record Vitals
                        </button>
                    </div>

                    {vitalsRecords.length > 0 ? (
                        <div className="space-y-4">
                            {vitalsRecords.map((vital, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">Visit Date: {formatDate(vital.visitDate)}</p>
                                            <p className="text-sm text-gray-600">Recorded by: {vital.recordedByName}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                {vital.status || 'Draft'}
                                            </span>
                                            <button
                                                onClick={() => setExpandedVital(expandedVital === index ? null : index)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                {expandedVital === index ? 'Show Less' : 'View Details'}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                        {vital.vitalSigns?.height?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">Height:</span>
                                                <p className="font-medium">{vital.vitalSigns.height.value} cm</p>
                                            </div>
                                        )}
                                        {vital.vitalSigns?.weight?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">Weight:</span>
                                                <p className="font-medium">{vital.vitalSigns.weight.value} kg</p>
                                            </div>
                                        )}
                                        {vital.vitalSigns?.bloodPressure?.systolic && (
                                            <div>
                                                <span className="text-sm text-gray-600">BP:</span>
                                                <p className="font-medium">{vital.vitalSigns.bloodPressure.systolic}/{vital.vitalSigns.bloodPressure.diastolic} mmHg</p>
                                            </div>
                                        )}
                                        {vital.vitalSigns?.heartRate?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">Heart Rate:</span>
                                                <p className="font-medium">{vital.vitalSigns.heartRate.value} bpm</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {vital.clinicalNotes?.chiefComplaint?.complaint && (
                                        <div className="mt-3">
                                            <span className="text-sm text-gray-600">Chief Complaint:</span>
                                            <p className="font-medium">{vital.clinicalNotes.chiefComplaint.complaint}</p>
                                        </div>
                                    )}

                                    {/* Expanded Details */}
                                    {expandedVital === index && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                                            {/* Additional Vital Signs */}
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {vital.vitalSigns?.respiratoryRate?.value && (
                                                    <div>
                                                        <span className="text-sm text-gray-600">Respiratory Rate:</span>
                                                        <p className="font-medium">{vital.vitalSigns.respiratoryRate.value} breaths/min</p>
                                                    </div>
                                                )}
                                                {vital.vitalSigns?.temperature?.value && (
                                                    <div>
                                                        <span className="text-sm text-gray-600">Temperature:</span>
                                                        <p className="font-medium">{vital.vitalSigns.temperature.value}°C</p>
                                                    </div>
                                                )}
                                                {vital.vitalSigns?.oxygenSaturation?.value && (
                                                    <div>
                                                        <span className="text-sm text-gray-600">Oxygen Saturation:</span>
                                                        <p className="font-medium">{vital.vitalSigns.oxygenSaturation.value}%</p>
                                                    </div>
                                                )}
                                                {vital.vitalSigns?.bmi?.value && (
                                                    <div>
                                                        <span className="text-sm text-gray-600">BMI:</span>
                                                        <p className="font-medium">{vital.vitalSigns.bmi.value} ({vital.vitalSigns.bmi.category})</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Clinical Notes */}
                                            {vital.clinicalNotes?.chiefComplaint?.duration && (
                                                <div>
                                                    <span className="text-sm text-gray-600">Duration:</span>
                                                    <p className="font-medium">{vital.clinicalNotes.chiefComplaint.duration}</p>
                                                </div>
                                            )}

                                            {/* Allergies */}
                                            {(vital.clinicalNotes?.allergies?.drug?.length > 0 || 
                                              vital.clinicalNotes?.allergies?.food?.length > 0 || 
                                              vital.clinicalNotes?.allergies?.environment?.length > 0) && (
                                                <div>
                                                    <span className="text-sm text-gray-600 block mb-1">Allergies:</span>
                                                    <div className="space-y-1">
                                                        {vital.clinicalNotes.allergies.drug?.length > 0 && (
                                                            <p className="text-sm"><strong>Drug:</strong> {vital.clinicalNotes.allergies.drug.join(', ')}</p>
                                                        )}
                                                        {vital.clinicalNotes.allergies.food?.length > 0 && (
                                                            <p className="text-sm"><strong>Food:</strong> {vital.clinicalNotes.allergies.food.join(', ')}</p>
                                                        )}
                                                        {vital.clinicalNotes.allergies.environment?.length > 0 && (
                                                            <p className="text-sm"><strong>Environmental:</strong> {vital.clinicalNotes.allergies.environment.join(', ')}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Current Medications */}
                                            {vital.clinicalNotes?.currentMedications?.length > 0 && (
                                                <div>
                                                    <span className="text-sm text-gray-600 block mb-1">Current Medications:</span>
                                                    <div className="space-y-1">
                                                        {vital.clinicalNotes.currentMedications.map((med, medIndex) => (
                                                            <p key={medIndex} className="text-sm">{med.name}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Family History */}
                                            {vital.clinicalNotes?.familyMedicalHistory && (
                                                <div>
                                                    <span className="text-sm text-gray-600 block mb-1">Family History:</span>
                                                    <div className="flex flex-wrap gap-2">
                                                        {vital.clinicalNotes.familyMedicalHistory.diabetes && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Diabetes</span>
                                                        )}
                                                        {vital.clinicalNotes.familyMedicalHistory.hypertension && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Hypertension</span>
                                                        )}
                                                        {vital.clinicalNotes.familyMedicalHistory.heartDisease && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Heart Disease</span>
                                                        )}
                                                        {vital.clinicalNotes.familyMedicalHistory.cancer && (
                                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Cancer</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Lifestyle Habits */}
                                            {vital.clinicalNotes?.lifestyleHabits?.general && (
                                                <div>
                                                    <span className="text-sm text-gray-600 block mb-1">Lifestyle Habits:</span>
                                                    <p className="text-sm">{vital.clinicalNotes.lifestyleHabits.general}</p>
                                                </div>
                                            )}

                                            {/* Nurse Observations */}
                                            {(vital.clinicalNotes?.nurseObservations?.generalAppearance || 
                                              vital.clinicalNotes?.nurseObservations?.specialRemarks ||
                                              vital.clinicalNotes?.nurseObservations?.additionalNotes) && (
                                                <div>
                                                    <span className="text-sm text-gray-600 block mb-1">Nurse Observations:</span>
                                                    <div className="space-y-1">
                                                        {vital.clinicalNotes.nurseObservations.generalAppearance && (
                                                            <p className="text-sm"><strong>General Appearance:</strong> {vital.clinicalNotes.nurseObservations.generalAppearance}</p>
                                                        )}
                                                        {vital.clinicalNotes.nurseObservations.specialRemarks && (
                                                            <p className="text-sm"><strong>Special Remarks:</strong> {vital.clinicalNotes.nurseObservations.specialRemarks}</p>
                                                        )}
                                                        {vital.clinicalNotes.nurseObservations.additionalNotes && (
                                                            <p className="text-sm"><strong>Additional Notes:</strong> {vital.clinicalNotes.nurseObservations.additionalNotes}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FaStethoscope className="mx-auto w-12 h-12 mb-3 text-gray-300" />
                            <p>No vitals recorded yet</p>
                        </div>
                    )}
                </div>


                {/* Prescriptions Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FaUserMd className="mr-2 text-green-500" />
                        Prescriptions
                    </h3>
                    {prescriptions.filter(p => p.status?.toLowerCase() === 'finalized').length > 0 ? (
                        <div className="space-y-4">
                            {prescriptions.filter(p => p.status?.toLowerCase() === 'finalized').map((prescription, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">Consultation Date: {formatDate(prescription.consultationDate)}</p>
                                            <p className="text-sm text-gray-600">Doctor: {prescription.doctorId?.name}</p>
                                            <p className="text-sm text-gray-600">Type: {prescription.consultationType}</p>
                                        </div>
                                        <button
                                            onClick={() => handlePrintPrescription(prescription)}
                                            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                                        >
                                            <FaPrint className="text-xs" />
                                            Print
                                        </button>
                                    </div>
                                    
                                    {prescription.clinicalNotes && (
                                        <div className="mt-3">
                                            <span className="text-sm font-medium text-gray-700">Clinical Notes:</span>
                                            <p className="text-sm text-gray-600 mt-1">{prescription.clinicalNotes}</p>
                                        </div>
                                    )}
                                    
                                    {prescription.medications && prescription.medications.length > 0 && (
                                        <div className="mt-3">
                                            <span className="text-sm font-medium text-gray-700">Medications:</span>
                                            <div className="mt-1 space-y-1">
                                                {prescription.medications.map((med, medIndex) => (
                                                    <div key={medIndex} className="text-sm text-gray-600">
                                                        <span className="font-medium">{med.name}</span>
                                                        {med.dosage && <span> - {med.dosage}</span>}
                                                        {med.frequency && <span> - {med.frequency}</span>}
                                                        {med.duration && <span> - {med.duration}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {prescription.treatmentAdvice && (
                                        <div className="mt-3">
                                            <span className="text-sm font-medium text-gray-700">Treatment Advice:</span>
                                            <p className="text-sm text-gray-600 mt-1">{prescription.treatmentAdvice}</p>
                                        </div>
                                    )}
                                    
                                    {prescription.followUpDate && (
                                        <div className="mt-3">
                                            <span className="text-sm font-medium text-gray-700">Follow-up Date:</span>
                                            <p className="text-sm text-gray-600 mt-1">{formatDate(prescription.followUpDate)}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FaNotesMedical className="mx-auto w-12 h-12 mb-3 text-gray-300" />
                            <p>No prescriptions found</p>
                        </div>
                    )}
                </div>

                {/* Billing Section */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <FaFileMedical className="mr-2 text-purple-500" />
                        Billing Information
                    </h3>
                    <div className="text-center py-8 text-gray-500">
                        <p>Billing information coming soon...</p>
                    </div>
                </div>
            </div>

            {/* Vitals Modal */}
            {showVitalsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">Record Patient Vitals</h3>
                                <button
                                    onClick={() => setShowVitalsModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleVitalsSubmit} className="space-y-6">
                                {/* Visit Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-blue-500" />
                                        Visit Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
                                            <input
                                                type="date"
                                                value={vitalsForm.visitDate}
                                                onChange={(e) => setVitalsForm({...vitalsForm, visitDate: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <FaHeartbeat className="mr-2 text-red-500" />
                                        Vital Signs
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                            <input
                                                type="number"
                                                value={vitalsForm.height}
                                                onChange={(e) => setVitalsForm({...vitalsForm, height: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="170"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                            <input
                                                type="number"
                                                value={vitalsForm.weight}
                                                onChange={(e) => setVitalsForm({...vitalsForm, weight: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="70"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Systolic BP</label>
                                            <input
                                                type="number"
                                                value={vitalsForm.systolic}
                                                onChange={(e) => setVitalsForm({...vitalsForm, systolic: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="120"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Diastolic BP</label>
                                            <input
                                                type="number"
                                                value={vitalsForm.diastolic}
                                                onChange={(e) => setVitalsForm({...vitalsForm, diastolic: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="80"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                                            <input
                                                type="number"
                                                value={vitalsForm.heartRate}
                                                onChange={(e) => setVitalsForm({...vitalsForm, heartRate: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="72"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Respiratory Rate</label>
                                            <input
                                                type="number"
                                                value={vitalsForm.respiratoryRate}
                                                onChange={(e) => setVitalsForm({...vitalsForm, respiratoryRate: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="16"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={vitalsForm.temperature}
                                                onChange={(e) => setVitalsForm({...vitalsForm, temperature: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="37.0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                                            <input
                                                type="number"
                                                value={vitalsForm.oxygenSaturation}
                                                onChange={(e) => setVitalsForm({...vitalsForm, oxygenSaturation: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="98"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Chief Complaint */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Chief Complaint</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint</label>
                                            <textarea
                                                value={vitalsForm.chiefComplaint}
                                                onChange={(e) => setVitalsForm({...vitalsForm, chiefComplaint: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Describe the main complaint"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                            <input
                                                type="text"
                                                value={vitalsForm.complaintDuration}
                                                onChange={(e) => setVitalsForm({...vitalsForm, complaintDuration: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., 3 days, 2 weeks"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Allergies */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Drug Allergies</label>
                                            <input
                                                type="text"
                                                value={vitalsForm.drugAllergies}
                                                onChange={(e) => setVitalsForm({...vitalsForm, drugAllergies: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Separate with commas"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Food Allergies</label>
                                            <input
                                                type="text"
                                                value={vitalsForm.foodAllergies}
                                                onChange={(e) => setVitalsForm({...vitalsForm, foodAllergies: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Separate with commas"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Environmental Allergies</label>
                                            <input
                                                type="text"
                                                value={vitalsForm.environmentAllergies}
                                                onChange={(e) => setVitalsForm({...vitalsForm, environmentAllergies: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Separate with commas"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Medical History */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                                            <textarea
                                                value={vitalsForm.currentMedications}
                                                onChange={(e) => setVitalsForm({...vitalsForm, currentMedications: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Separate with commas"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Chronic Illnesses</label>
                                            <textarea
                                                value={vitalsForm.chronicIllnesses}
                                                onChange={(e) => setVitalsForm({...vitalsForm, chronicIllnesses: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Separate with commas"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Family Medical History */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Family Medical History</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="familyDiabetes"
                                                checked={vitalsForm.familyDiabetes}
                                                onChange={(e) => setVitalsForm({...vitalsForm, familyDiabetes: e.target.checked})}
                                                className="mr-2"
                                            />
                                            <label htmlFor="familyDiabetes" className="text-sm text-gray-700">Diabetes</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="familyHypertension"
                                                checked={vitalsForm.familyHypertension}
                                                onChange={(e) => setVitalsForm({...vitalsForm, familyHypertension: e.target.checked})}
                                                className="mr-2"
                                            />
                                            <label htmlFor="familyHypertension" className="text-sm text-gray-700">Hypertension</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="familyHeartDisease"
                                                checked={vitalsForm.familyHeartDisease}
                                                onChange={(e) => setVitalsForm({...vitalsForm, familyHeartDisease: e.target.checked})}
                                                className="mr-2"
                                            />
                                            <label htmlFor="familyHeartDisease" className="text-sm text-gray-700">Heart Disease</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="familyCancer"
                                                checked={vitalsForm.familyCancer}
                                                onChange={(e) => setVitalsForm({...vitalsForm, familyCancer: e.target.checked})}
                                                className="mr-2"
                                            />
                                            <label htmlFor="familyCancer" className="text-sm text-gray-700">Cancer</label>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Other Family History</label>
                                        <input
                                            type="text"
                                            value={vitalsForm.familyOther}
                                            onChange={(e) => setVitalsForm({...vitalsForm, familyOther: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Separate with commas"
                                        />
                                    </div>
                                </div>

                                {/* Lifestyle Habits */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Lifestyle Habits</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            General Lifestyle Information
                                        </label>
                                        <textarea
                                            value={vitalsForm.lifestyleHabits}
                                            onChange={(e) => setVitalsForm({...vitalsForm, lifestyleHabits: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            rows="4"
                                            placeholder="Include information about smoking, alcohol consumption, physical activity, diet, exercise habits, sleep patterns, etc."
                                        />
                                    </div>
                                </div>

                                {/* Nurse Observations */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Nurse Observations</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">General Appearance</label>
                                            <textarea
                                                value={vitalsForm.generalAppearance}
                                                onChange={(e) => setVitalsForm({...vitalsForm, generalAppearance: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                rows="2"
                                                placeholder="Patient's general appearance and demeanor"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Remarks</label>
                                            <textarea
                                                value={vitalsForm.specialRemarks}
                                                onChange={(e) => setVitalsForm({...vitalsForm, specialRemarks: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                rows="2"
                                                placeholder="Any special observations or concerns"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                                            <textarea
                                                value={vitalsForm.additionalNotes}
                                                onChange={(e) => setVitalsForm({...vitalsForm, additionalNotes: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                placeholder="Any additional notes or observations"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowVitalsModal(false)}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={vitalsLoading}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {vitalsLoading ? <FaSpinner className="animate-spin" /> : 'Save Vitals'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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
