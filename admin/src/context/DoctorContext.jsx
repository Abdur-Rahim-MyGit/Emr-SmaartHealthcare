import { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'


export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [dToken, setDToken] = useState(localStorage.getItem('dToken') || '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    // Configure axios defaults
    useEffect(() => {
        axios.defaults.baseURL = backendUrl;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
    }, [backendUrl]);

    // Initialize token and verify it's valid
    useEffect(() => {
        const initializeToken = async () => {
            const token = localStorage.getItem('dToken');
            if (token) {
                try {
                    // Set token in axios defaults
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    axios.defaults.headers.common['dtoken'] = token;

                    // Verify token by making a test request
                    const response = await axios.get('/api/doctor/profile');
                    if (response.data.success) {
                        setDToken(token);
                        setProfileData(response.data.profileData);
                    } else {
                        handleLogout();
                    }
                } catch (error) {
                    console.error('Token verification failed:', error);
                    handleLogout();
                }
            }
            setIsInitialized(true);
            setLoading(false);
        };

        initializeToken();
    }, []);

    // Update axios headers whenever token changes
    useEffect(() => {
        if (!isInitialized) return;

        if (dToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${dToken}`;
            axios.defaults.headers.common['dtoken'] = dToken;
        } else {
            delete axios.defaults.headers.common['Authorization'];
            delete axios.defaults.headers.common['dtoken'];
        }
    }, [dToken, isInitialized]);

    // Handle logout
    const handleLogout = () => {
        setDToken('');
        setDashData(null);
        setProfileData(null);
        setAppointments([]);
        setPatients([]);
        localStorage.removeItem('dToken');
        delete axios.defaults.headers.common['Authorization'];
        delete axios.defaults.headers.common['dtoken'];
        window.location.href = '/';
    };

    // Getting Doctor appointment data from Database using API
    const getAppointments = async () => {
        if (!dToken || !isInitialized) return;
        
        try {
            const { data } = await axios.get('/api/doctor/appointments');

            if (data.success) {
                setAppointments(data.appointments.reverse());
            } else {
                toast.error(data.message || 'Failed to fetch appointments');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Error fetching appointments');
            }
        }
    };

    // Getting Doctor profile data from Database using API
    const getProfileData = async () => {
        if (!dToken || !isInitialized) return;
        
        try {
            const { data } = await axios.get('/api/doctor/profile');
            
            if (data.success) {
                setProfileData(data.profileData);
            } else {
                toast.error(data.message || 'Failed to fetch profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Error fetching profile');
            }
        }
    };

    // Getting patients data
    const getPatients = async () => {
        if (!dToken || !isInitialized) {
            console.error('No token or not initialized');
            return;
        }
        
        try {
            // Ensure headers are set
            axios.defaults.headers.common['Authorization'] = `Bearer ${dToken}`;
            axios.defaults.headers.common['dtoken'] = dToken;
            
            const { data } = await axios.get('/api/doctor/patients');
            
            if (data.success) {
                // Transform and validate patient data
                const validatedPatients = data.patients.map(patient => ({
                    ...patient,
                    name: patient.patientName || patient.name || 'Unnamed Patient',
                    email: patient.email || 'No email provided',
                    phone: patient.phone || 'No phone provided',
                    uhid: patient.uhid || 'Not assigned',
                    gender: patient.gender || 'Not specified',
                    bloodGroup: patient.bloodGroup || 'Not specified',
                    age: calculateAge(patient.dateOfBirth) || 'N/A'
                }));
                setPatients(validatedPatients);
            } else {
                throw new Error(data.message || 'Failed to fetch patients');
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Error fetching patients');
            }
            throw error;
        }
    };

    // Get patient details
    const getPatientDetails = async (patientId) => {
        if (!dToken || !isInitialized) {
            console.error('No token or not initialized');
            return null;
        }
        
        try {
            // Ensure headers are set
            axios.defaults.headers.common['Authorization'] = `Bearer ${dToken}`;
            axios.defaults.headers.common['dtoken'] = dToken;
            
            const { data } = await axios.get(`/api/doctor/patient-details/${patientId}`);
            
            if (data.success) {
                return data;
            } else {
                throw new Error(data.message || 'Failed to fetch patient details');
            }
        } catch (error) {
            console.error('Error fetching patient details:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Error fetching patient details');
            }
            throw error;
        }
    };

    // Helper function to calculate age
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

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointmentId) => {
        if (!dToken || !isInitialized) return;
        
        try {
            const { data } = await axios.post('/api/doctor/cancel-appointment', { appointmentId });

            if (data.success) {
                toast.success(data.message);
                await getAppointments();
                await getDashData();
            } else {
                toast.error(data.message || 'Failed to cancel appointment');
            }
        } catch (error) {
            console.error('Error canceling appointment:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Error canceling appointment');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId) => {
        if (!dToken || !isInitialized) return;
        
        try {
            setLoading(true);
            const { data } = await axios.post('/api/doctor/complete-appointment', { appointmentId });

            if (data.success) {
                toast.success(data.message);
                await getAppointments();
                await getDashData();
            } else {
                toast.error(data.message || 'Failed to complete appointment');
            }
        } catch (error) {
            console.error('Error completing appointment:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Error completing appointment');
            }
        } finally {
            setLoading(false);
        }
    };

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        if (!dToken || !isInitialized) return;
        
        try {
            setLoading(true);
            const { data } = await axios.get('/api/doctor/dashboard');

            if (data.success) {
                setDashData(data.dashData);
            } else {
                toast.error(data.message || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                toast.error(error.response?.data?.message || 'Error fetching dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    const value = {
        dToken,
        setDToken,
        backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData,
        getDashData,
        profileData,
        setProfileData,
        getProfileData,
        patients,
        getPatients,
        getPatientDetails,
        loading,
        isInitialized
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider