import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaHeartbeat, FaNotesMedical, FaPrescriptionBottleAlt, FaSave, FaPlus, FaTimes, FaCalendarAlt, FaStethoscope } from 'react-icons/fa';

const PatientConsultation = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const { dToken, backendUrl } = useContext(DoctorContext);
    
    const [patient, setPatient] = useState(null);
    const [vitalsRecords, setVitalsRecords] = useState([]);
    const [todayVitals, setTodayVitals] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prescriptionLoading, setPrescriptionLoading] = useState(false);
    
    // Prescription form state
    const [prescription, setPrescription] = useState({
        consultationType: 'In-person',
        clinicalNotes: '',
        investigations: '',
        medications: [{ name: '', dosage: '', quantity: '', frequency: '', duration: '' }],
        treatmentAdvice: '',
        followUpDate: '',
        status: 'Draft'
    });

    useEffect(() => {
        if (patientId && dToken) {
            fetchPatientData();
            fetchTodayVitals();
        }
    }, [patientId, dToken]);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendUrl}/api/doctor/patient-details/${patientId}`, {
                headers: { Authorization: `Bearer ${dToken}` }
            });
            
            if (response.data.success) {
                setPatient(response.data.patient);
            }
        } catch (error) {
            console.error('Error fetching patient data:', error);
            toast.error('Failed to load patient details');
        } finally {
            setLoading(false);
        }
    };

    const fetchTodayVitals = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await axios.get(`${backendUrl}/api/doctor/vitals/patient/${patientId}?date=${today}`, {
                headers: { Authorization: `Bearer ${dToken}` }
            });
            
            if (response.data.success && response.data.vitalsRecords.length > 0) {
                setTodayVitals(response.data.vitalsRecords[0]);
            }
        } catch (error) {
            console.error('Error fetching today\'s vitals:', error);
        }
    };

    const addMedication = () => {
        setPrescription(prev => ({
            ...prev,
            medications: [...prev.medications, { name: '', dosage: '', quantity: '', frequency: '', duration: '' }]
        }));
    };

    const removeMedication = (index) => {
        setPrescription(prev => ({
            ...prev,
            medications: prev.medications.filter((_, i) => i !== index)
        }));
    };

    const updateMedication = (index, field, value) => {
        setPrescription(prev => ({
            ...prev,
            medications: prev.medications.map((med, i) => 
                i === index ? { ...med, [field]: value } : med
            )
        }));
    };

    const savePrescription = async (status = 'Draft') => {
        try {
            setPrescriptionLoading(true);
            
            const prescriptionData = {
                ...prescription,
                patientId,
                status,
                consultationDate: new Date().toISOString()
            };

            console.log('Sending prescription data:', prescriptionData);

            const response = await axios.post(`${backendUrl}/api/doctor/prescription`, prescriptionData, {
                headers: { Authorization: `Bearer ${dToken}` }
            });

            console.log('Prescription response:', response.data);

            if (response.data.success) {
                toast.success(`Prescription ${status.toLowerCase()}ed successfully`);
                if (status === 'Finalized') {
                    navigate('/doctor-dashboard');
                }
            } else {
                toast.error(response.data.message || 'Failed to save prescription');
            }
        } catch (error) {
            console.error('Error saving prescription:', error);
            toast.error(error.response?.data?.message || 'Failed to save prescription');
        } finally {
            setPrescriptionLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
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
                    <button 
                        onClick={() => navigate('/doctor-dashboard')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Back to Dashboard
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
                            onClick={() => navigate('/doctor-dashboard')}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Patient Consultation</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Patient Info & Vitals */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Patient Basic Info */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <FaUser className="w-6 h-6 text-blue-500 mr-3" />
                                <h2 className="text-xl font-bold text-gray-900">Patient Information</h2>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{patient.patientName || patient.name}</p>
                                    <p className="text-gray-600">UHID: {patient.uhid || 'Not assigned'}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Age:</span>
                                        <p className="font-medium">{patient.age || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Gender:</span>
                                        <p className="font-medium">{patient.gender || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Blood Group:</span>
                                        <p className="font-medium">{patient.bloodGroup || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Today's Vitals */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <FaHeartbeat className="w-6 h-6 text-red-500 mr-3" />
                                <h2 className="text-xl font-bold text-gray-900">Today's Vitals</h2>
                            </div>
                            
                            {todayVitals ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {todayVitals.vitalSigns?.height?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">Height:</span>
                                                <p className="font-medium">{todayVitals.vitalSigns.height.value} cm</p>
                                            </div>
                                        )}
                                        {todayVitals.vitalSigns?.weight?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">Weight:</span>
                                                <p className="font-medium">{todayVitals.vitalSigns.weight.value} kg</p>
                                            </div>
                                        )}
                                        {todayVitals.vitalSigns?.bloodPressure?.systolic && (
                                            <div>
                                                <span className="text-sm text-gray-600">BP:</span>
                                                <p className="font-medium">{todayVitals.vitalSigns.bloodPressure.systolic}/{todayVitals.vitalSigns.bloodPressure.diastolic} mmHg</p>
                                            </div>
                                        )}
                                        {todayVitals.vitalSigns?.heartRate?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">Heart Rate:</span>
                                                <p className="font-medium">{todayVitals.vitalSigns.heartRate.value} bpm</p>
                                            </div>
                                        )}
                                        {todayVitals.vitalSigns?.temperature?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">Temperature:</span>
                                                <p className="font-medium">{todayVitals.vitalSigns.temperature.value}°C</p>
                                            </div>
                                        )}
                                        {todayVitals.vitalSigns?.oxygenSaturation?.value && (
                                            <div>
                                                <span className="text-sm text-gray-600">SpO2:</span>
                                                <p className="font-medium">{todayVitals.vitalSigns.oxygenSaturation.value}%</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {todayVitals.clinicalNotes?.chiefComplaint?.complaint && (
                                        <div>
                                            <span className="text-sm text-gray-600 block mb-1">Chief Complaint:</span>
                                            <p className="font-medium">{todayVitals.clinicalNotes.chiefComplaint.complaint}</p>
                                            {todayVitals.clinicalNotes.chiefComplaint.duration && (
                                                <p className="text-sm text-gray-600">Duration: {todayVitals.clinicalNotes.chiefComplaint.duration}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Allergies */}
                                    {(todayVitals.clinicalNotes?.allergies?.drug?.length > 0 || 
                                      todayVitals.clinicalNotes?.allergies?.food?.length > 0 || 
                                      todayVitals.clinicalNotes?.allergies?.environment?.length > 0) && (
                                        <div>
                                            <span className="text-sm text-gray-600 block mb-1">⚠️ Allergies:</span>
                                            <div className="space-y-1">
                                                {todayVitals.clinicalNotes.allergies.drug?.length > 0 && (
                                                    <p className="text-sm text-red-600"><strong>Drug:</strong> {todayVitals.clinicalNotes.allergies.drug.join(', ')}</p>
                                                )}
                                                {todayVitals.clinicalNotes.allergies.food?.length > 0 && (
                                                    <p className="text-sm text-red-600"><strong>Food:</strong> {todayVitals.clinicalNotes.allergies.food.join(', ')}</p>
                                                )}
                                                {todayVitals.clinicalNotes.allergies.environment?.length > 0 && (
                                                    <p className="text-sm text-red-600"><strong>Environmental:</strong> {todayVitals.clinicalNotes.allergies.environment.join(', ')}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    <FaStethoscope className="mx-auto w-8 h-8 mb-2 text-gray-300" />
                                    <p>No vitals recorded for today</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Prescription Pad */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <FaPrescriptionBottleAlt className="w-6 h-6 text-green-500 mr-3" />
                                    <h2 className="text-xl font-bold text-gray-900">Prescription Pad</h2>
                                </div>
                                <div className="text-sm text-gray-600">
                                    {patient.patientName} | UHID: {patient.uhid}
                                </div>
                            </div>

                            <form className="space-y-6">
                                {/* Consultation Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                                    <select
                                        value={prescription.consultationType}
                                        onChange={(e) => setPrescription(prev => ({ ...prev, consultationType: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="In-person">In-person</option>
                                        <option value="Teleconsultation">Teleconsultation</option>
                                    </select>
                                </div>

                                {/* Clinical Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes / Observations</label>
                                    <textarea
                                        value={prescription.clinicalNotes}
                                        onChange={(e) => setPrescription(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        rows="4"
                                        placeholder="Enter clinical observations, diagnosis, examination findings..."
                                    />
                                </div>

                                {/* Investigations */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Investigations / Lab Tests</label>
                                    <textarea
                                        value={prescription.investigations}
                                        onChange={(e) => setPrescription(prev => ({ ...prev, investigations: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        placeholder="Blood tests, X-rays, scans, etc..."
                                    />
                                </div>

                                {/* Medications */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-medium text-gray-700">Medications</label>
                                        <button
                                            type="button"
                                            onClick={addMedication}
                                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                        >
                                            <FaPlus className="mr-1" />
                                            Add Medicine
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {prescription.medications.map((med, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-2 items-end">
                                                <div className="col-span-3">
                                                    <input
                                                        type="text"
                                                        value={med.name}
                                                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Medicine name"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        value={med.dosage}
                                                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Dosage"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        value={med.quantity}
                                                        onChange={(e) => updateMedication(index, 'quantity', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Quantity"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        value={med.frequency}
                                                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Frequency"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <input
                                                        type="text"
                                                        value={med.duration}
                                                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
                                                        placeholder="Duration"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMedication(index)}
                                                        className="p-1 text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Treatment Advice */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Advice / Lifestyle Recommendations</label>
                                    <textarea
                                        value={prescription.treatmentAdvice}
                                        onChange={(e) => setPrescription(prev => ({ ...prev, treatmentAdvice: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                        placeholder="Diet recommendations, lifestyle changes, precautions..."
                                    />
                                </div>

                                {/* Follow-up Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Follow-up Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={prescription.followUpDate}
                                        onChange={(e) => setPrescription(prev => ({ ...prev, followUpDate: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <button
                                        type="button"
                                        onClick={() => savePrescription('Draft')}
                                        disabled={prescriptionLoading}
                                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Save Draft
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => savePrescription('Finalized')}
                                        disabled={prescriptionLoading}
                                        className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <FaSave className="mr-2" />
                                        Finalize Prescription
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientConsultation;
