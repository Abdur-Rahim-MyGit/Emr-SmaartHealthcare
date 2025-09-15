import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')
    const [isInitialized, setIsInitialized] = useState(false)

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)
    const [patients, setPatients] = useState([])
    const [clinicalRecords, setClinicalRecords] = useState([]);

    // Configure axios defaults
    axios.defaults.baseURL = backendUrl;
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    // Initialize token and verify it's valid
    useEffect(() => {
        const initializeToken = async () => {
            const token = localStorage.getItem('aToken');
            if (token) {
                try {
                    // Set token in axios defaults
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['atoken'] = token;

                    // Verify token by making a test request
                    const response = await axios.get('/api/admin/dashboard');
                    if (response.data.success) {
                        setAToken(token);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    handleLogout();
                }
            }
            setIsInitialized(true);
        };

        initializeToken();
    }, []);

    // Update axios headers whenever token changes
    useEffect(() => {
        if (!isInitialized) return;

        if (aToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${aToken}`;
            axios.defaults.headers.common['atoken'] = aToken;
        } else {
            delete axios.defaults.headers.common['Authorization'];
            delete axios.defaults.headers.common['atoken'];
        }
    }, [aToken, isInitialized]);

    // Handle logout
    const handleLogout = () => {
        setAToken('');
        localStorage.removeItem('aToken');
        delete axios.defaults.headers.common['Authorization'];
        delete axios.defaults.headers.common['atoken'];
        window.location.href = '/';
    };

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get('/api/admin/all-doctors');
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            if (error.response?.status === 401) {
                handleLogout();
            }
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post('/api/admin/change-availability', { docId });
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get('/api/admin/appointments');
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post('/api/admin/cancel-appointment', { appointmentId });
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get('/api/admin/dashboard');
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Getting all patients data from Database using API
    const getAllPatients = async () => {
        try {
            const { data } = await axios.get('/api/admin/patients');
            if (data.success) {
                // Validate and transform patient data
                const validatedPatients = data.patients.map(patient => ({
                    ...patient,
                    name: patient.patientName || 'Unnamed Patient',
                    email: patient.email || 'No email provided',
                    phone: patient.phone || 'No phone provided',
                    age: calculateAge(patient.dateOfBirth) || 'N/A',
                    gender: patient.gender || 'Not specified',
                    bloodGroup: patient.bloodGroup || 'Not specified'
                }));
                setPatients(validatedPatients);
            } else {
                throw new Error(data.message || 'Failed to fetch patients');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Error fetching patients';
            toast.error(errorMessage);
            throw error;
        }
    };

    // Helper function to calculate age from date of birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return null;
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    // Get patient details
    const getPatientDetails = async (patientId) => {
        try {
            // Ensure token is set in headers
            if (!axios.defaults.headers.common['Authorization']) {
                const token = localStorage.getItem('aToken');
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['atoken'] = token;
                } else {
                    handleLogout();
                    throw new Error('No authentication token found');
                }
            }

            const { data } = await axios.get(`/api/admin/patient-details/${patientId}`);
            
            if (data.success) {
                // Transform and validate the data
                const transformedPatient = {
                    ...data.patient,
                    name: data.patient.patientName || data.patient.name || 'Unnamed Patient',
                    email: data.patient.email || 'No email provided',
                    phone: data.patient.phone || 'No phone provided',
                    uhid: data.patient.uhid || 'Not assigned',
                    gender: data.patient.gender || 'Not specified',
                    bloodGroup: data.patient.bloodGroup || 'Not specified',
                    dateOfBirth: data.patient.dateOfBirth || data.patient.dob || null,
                    appointments: data.patient.appointments || [],
                    clinicalRecords: data.patient.clinicalRecords || [],
                    medicalInfo: {
                        ...data.patient.medicalInfo,
                        allergies: data.patient.medicalInfo?.allergies || 'None reported',
                        chronicConditions: data.patient.medicalInfo?.chronicConditions || 'None reported',
                        currentMedications: data.patient.medicalInfo?.currentMedications || 'None reported',
                        emergencyContact: data.patient.medicalInfo?.emergencyContact || {}
                    },
                    address: data.patient.address || {}
                };

                return {
                    success: true,
                    patient: transformedPatient,
                    source: data.source
                };
            } else {
                throw new Error(data.message || 'Failed to fetch patient details');
            }
        } catch (error) {
            console.error('Error in getPatientDetails:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error fetching patient details';
            toast.error(errorMessage);
            throw error;
        }
    };

    // Get patient's clinical records
    const getPatientClinicalRecords = async (patientId) => {
        try {
            const { data } = await axios.get(`/api/admin/clinical-records/${patientId}`);
            if (data.success) {
                const sortedRecords = data.clinicalRecords.sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                return sortedRecords;
            }
            throw new Error(data.message || 'Failed to fetch clinical records');
        } catch (error) {
            console.error('Error fetching clinical records:', error);
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            throw error;
        }
    };

    // Search cache to store recent results
    const searchCache = new Map();
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

    // Search patients with optimizations
    const searchPatients = async (searchTerm) => {
        try {
            if (!searchTerm?.trim()) {
                return [];
            }

            // Ensure token is set in headers
            if (!axios.defaults.headers.common['Authorization']) {
                const token = localStorage.getItem('aToken');
                if (token) {
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['atoken'] = token;
                } else {
                    handleLogout();
                    throw new Error('No authentication token found');
                }
            }

            // Make the API call
            const { data } = await axios.post('/api/admin/search-patients', { term: searchTerm.trim() });

            if (data.success) {
                return data.patients.map(patient => ({
                    _id: patient._id,
                    name: patient.name || patient.patientName || 'Unnamed Patient',
                    email: patient.email || 'No email provided',
                    phone: patient.phone || 'No phone provided',
                    uhid: patient.uhid || 'No UHID',
                    gender: patient.gender || 'Not specified',
                    dateOfBirth: patient.dateOfBirth,
                    bloodGroup: patient.bloodGroup || 'Not specified'
                }));
            } else {
                throw new Error(data.message || 'Search failed');
            }
        } catch (error) {
            console.error('[Search] Error:', error);
            toast.error(error.response?.data?.message || error.message || 'Error searching patients');
            return [];
        }
    };

    // Add new clinical record
    const addClinicalRecord = async (patientId, recordData) => {
        try {
            // Validate required fields
            const requiredFields = [
                'consultedDoctor',
                'encounterType',
                'encounterDate',
                'reasonForVisit',
                'diagnosis',
                'treatment',
                'currentClinicalStatus'
            ];
            
            for (const field of requiredFields) {
                if (!recordData[field]) {
                    throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`);
                }
            }

            // Validate prescription data if present
            if (recordData.prescription?.length > 0) {
                recordData.prescription = recordData.prescription.filter(med => {
                    const isValid = med.medicine?.trim() !== '' && 
                        med.dosage?.trim() !== '' && 
                        med.frequency?.trim() !== '' && 
                        med.duration?.trim() !== '';
                    
                    if (!isValid && (med.medicine || med.dosage || med.frequency || med.duration)) {
                        throw new Error('All prescription fields (medicine, dosage, frequency, duration) must be filled if any are provided');
                    }
                    return isValid;
                });
            }

            // Format dates
            if (recordData.followUpDate) {
                recordData.followUpDate = new Date(recordData.followUpDate).toISOString();
            }
            recordData.encounterDate = new Date(recordData.encounterDate).toISOString();

            const response = await axios.post('/api/admin/add-clinical-record', {
                patient: patientId,
                ...recordData
            });

            if (response.data.success) {
                toast.success('Clinical record added successfully');
                return response.data;
            }
            throw new Error(response.data.message || 'Failed to add clinical record');
        } catch (error) {
            console.error('Error adding clinical record:', error);
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            throw error;
        }
    };

    // Update clinical record
    const updateClinicalRecord = async (recordId, recordData) => {
        try {
            const response = await axios.put(`/api/admin/clinical-records/${recordId}`, recordData);
            if (response.data.success) {
                toast.success('Clinical record updated successfully');
                return response.data;
            }
            throw new Error(response.data.message || 'Failed to update clinical record');
        } catch (error) {
            console.error('Error updating clinical record:', error);
            throw error;
        }
    };

    // Delete clinical record
    const deleteClinicalRecord = async (recordId) => {
        try {
            const response = await axios.delete(`/api/admin/clinical-records/${recordId}`);
            if (response.data.success) {
                toast.success('Clinical record deleted successfully');
                return response.data;
            }
            throw new Error(response.data.message || 'Failed to delete clinical record');
        } catch (error) {
            console.error('Error deleting clinical record:', error);
            throw error;
        }
    };

    // Billing API
    const createBill = async (billData) => {
        try {
            const { data } = await axios.post('/api/admin/bill', billData);
            if (data.success) {
                toast.success('Bill saved successfully');
                return data.bill;
            } else {
                toast.error(data.message);
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            throw error;
        }
    };

    const getAllBills = async () => {
        try {
            const { data } = await axios.get('/api/admin/bills');
            if (data.success) {
                return data.bills;
            } else {
                toast.error(data.message);
                throw new Error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            throw error;
        }
    };

    const value = {
        aToken, setAToken,
        backendUrl,
        doctors,
        appointments,
        dashData,
        patients,
        clinicalRecords,
        getAllDoctors,
        changeAvailability,
        getAllAppointments,
        cancelAppointment,
        getDashData,
        getAllPatients,
        getPatientDetails,
        getPatientClinicalRecords,
        addClinicalRecord,
        updateClinicalRecord,
        deleteClinicalRecord,
        searchPatients,
        createBill,
        getAllBills
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider