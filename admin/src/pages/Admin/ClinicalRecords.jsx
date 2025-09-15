import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

const ClinicalRecords = () => {
    const { getAllPatients, patients, addClinicalRecord, doctors, getAllDoctors } = useContext(AdminContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [hasSearched, setHasSearched] = useState(false);
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);
    const [formData, setFormData] = useState({
        encounterType: '',
        encounterDate: new Date().toISOString().split('T')[0],
        reasonForVisit: '',
        diagnosis: '',
        treatment: '',
        currentClinicalStatus: '',
        allergyStatus: 'No known allergies',
        allergyNotes: '',
        immunizationHistory: '',
        bloodGroup: '',
        consultedDoctor: '',
        prescription: [{
            medicine: '',
            dosage: '',
            frequency: '',
            duration: ''
        }],
        vitals: {
            bloodPressure: '',
            heartRate: '',
            temperature: '',
            respiratoryRate: '',
            oxygenSaturation: '',
            weight: '',
            height: ''
        },
        notes: '',
        followUpDate: '',
        status: 'active'
    });

    // Load patients and doctors when component mounts
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            await Promise.all([getAllPatients(), getAllDoctors()]);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Cleanup function for search
    const cleanupSearch = () => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    // Optimized search function
    const performSearch = useCallback(async (term) => {
        if (!term.trim()) {
            setSearchResults([]);
            setHasSearched(false);
            return;
        }

        try {
            setSearchLoading(true);
            console.log('[Search] Initiating search with term:', term);
            
            // Filter patients based on search term
            const filteredPatients = patients.filter(patient => {
                const searchFields = [
                    patient?.patientName,
                    patient?.email,
                    patient?.phone,
                    patient?.uhid,
                    patient?.bloodGroup
                ];
                return searchFields.some(field => 
                    field && field.toLowerCase().includes(term.toLowerCase().trim())
                );
            });
            
            setSearchResults(filteredPatients);
            console.log(`[Search] Found ${filteredPatients.length} results`);
            
            if (filteredPatients.length === 0 && term.trim()) {
                toast.info('No patients found matching your search');
            }
            setHasSearched(true);
        } catch (error) {
            console.error('[Search] Error:', error);
            toast.error('Error searching for patients');
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, [patients]);

    // Debounced search
    useEffect(() => {
        cleanupSearch();
        
        if (searchTerm.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                performSearch(searchTerm);
            }, 300);
        } else {
            setSearchResults([]);
            setHasSearched(false);
        }

        return cleanupSearch;
    }, [searchTerm, performSearch]);

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (!value.trim()) {
            setSearchResults([]);
            setHasSearched(false);
        }
    };

    const selectPatient = (patient) => {
        if (!patient || !patient._id) {
            console.error('[Selection] Invalid patient data:', patient);
            toast.error('Invalid patient data');
            return;
        }

        console.log('[Selection] Selected patient:', patient);
        setSelectedPatient(patient);
        setSearchResults([]);
        setSearchTerm('');
        setFormData(prevData => ({
            ...prevData,
            encounterDate: new Date().toISOString().split('T')[0],
            patientId: patient._id,
            patientName: patient.patientName,
            patientEmail: patient.email,
            patientPhone: patient.phone
        }));
        toast.success(`Selected patient: ${patient.patientName}`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedPatient?._id) {
            toast.error('Please select a patient first');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Prepare the record data
            const recordData = {
                patient: selectedPatient._id,
                consultedDoctor: formData.consultedDoctor,
                encounterType: formData.encounterType,
                encounterDate: formData.encounterDate,
                reasonForVisit: formData.reasonForVisit,
                diagnosis: formData.diagnosis,
                treatment: formData.treatment,
                currentClinicalStatus: formData.currentClinicalStatus,
                allergyStatus: formData.allergyStatus === 'Has allergies' 
                    ? formData.allergyNotes 
                    : formData.allergyStatus,
                immunizationHistory: formData.immunizationHistory || '',
                bloodGroup: formData.bloodGroup || '',
                prescription: formData.prescription.filter(med => med.medicine.trim() !== ''),
                vitals: {
                    bloodPressure: formData.vitals.bloodPressure || '',
                    heartRate: formData.vitals.heartRate || '',
                    temperature: formData.vitals.temperature || '',
                    respiratoryRate: formData.vitals.respiratoryRate || '',
                    oxygenSaturation: formData.vitals.oxygenSaturation || '',
                    weight: formData.vitals.weight || '',
                    height: formData.vitals.height || ''
                },
                notes: formData.notes || '',
                followUpDate: formData.followUpDate || null,
                status: 'active'
            };

            const response = await addClinicalRecord(selectedPatient._id, recordData);
            
            if (response.success) {
                toast.success('Clinical record saved successfully');
                // Reset form and selected patient
                setSelectedPatient(null);
                setFormData({
                    encounterType: '',
                    encounterDate: new Date().toISOString().split('T')[0],
                    reasonForVisit: '',
                    diagnosis: '',
                    treatment: '',
                    currentClinicalStatus: '',
                    allergyStatus: 'No known allergies',
                    allergyNotes: '',
                    immunizationHistory: '',
                    bloodGroup: '',
                    consultedDoctor: '',
                    prescription: [{
                        medicine: '',
                        dosage: '',
                        frequency: '',
                        duration: ''
                    }],
                    vitals: {
                        bloodPressure: '',
                        heartRate: '',
                        temperature: '',
                        respiratoryRate: '',
                        oxygenSaturation: '',
                        weight: '',
                        height: ''
                    },
                    notes: '',
                    followUpDate: ''
                });
                setFormErrors({});
            } else {
                throw new Error(response.message || 'Failed to save clinical record');
            }
        } catch (error) {
            console.error('Error saving clinical record:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to save clinical record');
        } finally {
            setLoading(false);
        }
    };

    // Update form validation function
    const validateForm = () => {
        const errors = {};
        const requiredFields = [
            'encounterType',
            'encounterDate',
            'reasonForVisit',
            'diagnosis',
            'treatment',
            'currentClinicalStatus',
            'consultedDoctor'
        ];

        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
            }
        });

        // Validate allergy notes if "Has allergies" is selected
        if (formData.allergyStatus === 'Has allergies' && !formData.allergyNotes?.trim()) {
            errors.allergyNotes = 'Please specify the allergies';
        }

        // Validate prescription if any medicine is entered
        formData.prescription.forEach((med, index) => {
            if (med.medicine.trim() && (!med.dosage.trim() || !med.frequency.trim() || !med.duration.trim())) {
                errors[`prescription${index}`] = 'Please complete all prescription fields';
            }
        });

        setFormErrors(errors);
        
        if (Object.keys(errors).length > 0) {
            toast.error('Please fill in all required fields correctly');
            return false;
        }

        return true;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Add Clinical Record</h2>
            
            {/* Patient Search Section */}
            <div className="mb-6 relative">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            placeholder="Search patient by name, email, phone, or UHID"
                            className="w-full p-3 border rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                            disabled={loading}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"/>
                            ) : (
                                <FaSearch className="text-gray-400" />
                            )}
                        </div>
                    </div>
                    <button 
                        type="button"
                        onClick={() => {
                            setSearchTerm('');
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Clear
                    </button>
                </div>

               
                {/* Search Results Dropdown */}
                {searchTerm && !loading && (
                    <div className="absolute z-50 left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl max-h-96 overflow-y-auto">
                        {searchResults.map(patient => (
                            <div
                                key={patient._id}
                                onClick={() => selectPatient(patient)}
                                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <FaUserCircle className="text-gray-400 text-2xl flex-shrink-0 mt-1" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-gray-900 truncate">
                                                {patient.patientName}
                                            </h3>
                                            <span className="text-sm text-blue-600 font-medium ml-2">
                                                UHID: {patient.uhid}
                                            </span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-600">
                                            <p className="truncate">{patient.email}</p>
                                            {patient.phone && (
                                                <p className="mt-0.5">{patient.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {searchResults.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No patients found matching "{searchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Selected Patient Info */}
            {selectedPatient && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {selectedPatient.patientName}
                                <span className="ml-2 text-sm text-blue-600">UHID: {selectedPatient.uhid}</span>
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{selectedPatient.email}</p>
                            {selectedPatient.phone && (
                                <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setSelectedPatient(null);
                                setFormData({
                                    encounterType: '',
                                    encounterDate: new Date().toISOString().split('T')[0],
                                    reasonForVisit: '',
                                    diagnosis: '',
                                    treatment: '',
                                    currentClinicalStatus: '',
                                    allergyStatus: 'No known allergies',
                                    allergyNotes: '',
                                    immunizationHistory: '',
                                    bloodGroup: '',
                                    consultedDoctor: '',
                                    prescription: [{
                                        medicine: '',
                                        dosage: '',
                                        frequency: '',
                                        duration: ''
                                    }],
                                    vitals: {
                                        bloodPressure: '',
                                        heartRate: '',
                                        temperature: '',
                                        respiratoryRate: '',
                                        oxygenSaturation: '',
                                        weight: '',
                                        height: ''
                                    },
                                    notes: '',
                                    followUpDate: ''
                                });
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Change Patient
                        </button>
                    </div>
                </div>
            )}

            {/* Clinical Record Form */}
            {selectedPatient ? (
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-xl font-semibold mb-4">
                        Clinical Record for {selectedPatient.patientName}
                        <span className="text-sm text-gray-500 ml-2">({selectedPatient.uhid})</span>
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Consulted Doctor*</label>
                                <select
                                    value={formData.consultedDoctor}
                                    onChange={(e) => setFormData({...formData, consultedDoctor: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    required
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors?.map(doctor => (
                                        <option key={doctor._id} value={doctor._id}>
                                            {doctor.name} ({doctor.speciality})
                                        </option>
                                    ))}
                                </select>
                                {formErrors.consultedDoctor && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.consultedDoctor}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Encounter Type*</label>
                                <select
                                    value={formData.encounterType}
                                    onChange={(e) => setFormData({...formData, encounterType: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    required
                                >
                                    <option value="">Select Type</option>
                                    <option value="Initial Visit">Initial Visit</option>
                                    <option value="Follow-up">Follow-up</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Routine Checkup">Routine Checkup</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Encounter Date*</label>
                                <input
                                    type="date"
                                    value={formData.encounterDate}
                                    onChange={(e) => setFormData({...formData, encounterDate: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                <select
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
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
                        </div>

                        {/* Reason for Visit */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reason for Visit*</label>
                            <textarea
                                value={formData.reasonForVisit}
                                onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
                                className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                rows="2"
                                required
                            />
                        </div>

                        {/* Clinical Status, Allergies, and Immunization */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Clinical Status*</label>
                                <select
                                    value={formData.currentClinicalStatus}
                                    onChange={(e) => setFormData({...formData, currentClinicalStatus: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Stable">Stable</option>
                                    <option value="Critical">Critical</option>
                                    <option value="Improving">Improving</option>
                                    <option value="Deteriorating">Deteriorating</option>
                                    <option value="Under Observation">Under Observation</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Allergy Status</label>
                                <select
                                    value={formData.allergyStatus}
                                    onChange={(e) => setFormData({...formData, allergyStatus: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                >
                                    <option value="No known allergies">No Known Allergies</option>
                                    <option value="Has allergies">Has Allergies</option>
                                </select>
                                {formData.allergyStatus === 'Has allergies' && (
                                    <textarea
                                        placeholder="Please specify allergies..."
                                        value={formData.allergyNotes}
                                        onChange={(e) => setFormData({...formData, allergyNotes: e.target.value})}
                                        className="mt-2 block w-full rounded-md border border-gray-300 p-2"
                                        rows="2"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Immunization History</label>
                                <textarea
                                    value={formData.immunizationHistory}
                                    onChange={(e) => setFormData({...formData, immunizationHistory: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    rows="2"
                                    placeholder="Enter immunization details..."
                                />
                            </div>
                        </div>

                        {/* Vitals */}
                        <div>
                            <h4 className="text-lg font-medium mb-3">Vitals</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Blood Pressure</label>
                                    <input
                                        type="text"
                                        placeholder="120/80"
                                        value={formData.vitals.bloodPressure}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            vitals: {...formData.vitals, bloodPressure: e.target.value}
                                        })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Heart Rate</label>
                                    <input
                                        type="text"
                                        placeholder="BPM"
                                        value={formData.vitals.heartRate}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            vitals: {...formData.vitals, heartRate: e.target.value}
                                        })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Temperature</label>
                                    <input
                                        type="text"
                                        placeholder="°F"
                                        value={formData.vitals.temperature}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            vitals: {...formData.vitals, temperature: e.target.value}
                                        })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Weight</label>
                                    <input
                                        type="text"
                                        placeholder="kg"
                                        value={formData.vitals.weight}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            vitals: {...formData.vitals, weight: e.target.value}
                                        })}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Clinical Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Diagnosis*</label>
                                <textarea
                                    value={formData.diagnosis}
                                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Treatment*</label>
                                <textarea
                                    value={formData.treatment}
                                    onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    rows="3"
                                    required
                                />
                            </div>
                        </div>

                        {/* Prescription */}
                        <div>
                            <h4 className="text-lg font-medium mb-3">Prescription</h4>
                            {formData.prescription.map((med, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Medicine"
                                            value={med.medicine}
                                            onChange={(e) => {
                                                const newPrescription = [...formData.prescription];
                                                newPrescription[index].medicine = e.target.value;
                                                setFormData({...formData, prescription: newPrescription});
                                            }}
                                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Dosage"
                                            value={med.dosage}
                                            onChange={(e) => {
                                                const newPrescription = [...formData.prescription];
                                                newPrescription[index].dosage = e.target.value;
                                                setFormData({...formData, prescription: newPrescription});
                                            }}
                                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Frequency"
                                            value={med.frequency}
                                            onChange={(e) => {
                                                const newPrescription = [...formData.prescription];
                                                newPrescription[index].frequency = e.target.value;
                                                setFormData({...formData, prescription: newPrescription});
                                            }}
                                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Duration"
                                            value={med.duration}
                                            onChange={(e) => {
                                                const newPrescription = [...formData.prescription];
                                                newPrescription[index].duration = e.target.value;
                                                setFormData({...formData, prescription: newPrescription});
                                            }}
                                            className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                        />
                                        {index === formData.prescription.length - 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    prescription: [...formData.prescription, { medicine: '', dosage: '', frequency: '', duration: '' }]
                                                })}
                                                className="mt-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Notes and Follow-up */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Clinical Notes</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Follow-up Date</label>
                                <input
                                    type="date"
                                    value={formData.followUpDate}
                                    onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedPatient(null);
                                    setFormData({
                                        encounterType: '',
                                        encounterDate: new Date().toISOString().split('T')[0],
                                        reasonForVisit: '',
                                        diagnosis: '',
                                        treatment: '',
                                        currentClinicalStatus: '',
                                        allergyStatus: 'No known allergies',
                                        allergyNotes: '',
                                        immunizationHistory: '',
                                        bloodGroup: '',
                                        prescription: [{
                                            medicine: '',
                                            dosage: '',
                                            frequency: '',
                                            duration: ''
                                        }],
                                        vitals: {
                                            bloodPressure: '',
                                            heartRate: '',
                                            temperature: '',
                                            respiratoryRate: '',
                                            oxygenSaturation: '',
                                            weight: '',
                                            height: ''
                                        },
                                        notes: '',
                                        followUpDate: ''
                                    });
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Record'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <FaUserCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No patient selected</h3>
                    <p className="mt-1 text-sm text-gray-500">Search and select a patient to create a clinical record</p>
                </div>
            )}
        </div>
    );
};

export default ClinicalRecords;