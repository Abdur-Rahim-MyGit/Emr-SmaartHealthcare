import { createContext, useState } from "react";
import { toast } from "react-toastify";
import api from '../config/api';

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get patients for doctor
    const getPatients = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/api/doctor/patients');
            
            if (data.success) {
                // Transform patient data to match admin panel format
                const transformedPatients = data.patients.map(patient => ({
                    _id: patient._id,
                    name: patient.name || patient.patientName || 'Unnamed Patient',
                    email: patient.email || 'No email provided',
                    phone: patient.phone || 'No phone provided',
                    uhid: patient.uhid || 'Not assigned',
                    gender: patient.gender || 'Not specified',
                    bloodGroup: patient.bloodGroup || 'Not specified',
                    dateOfBirth: patient.dateOfBirth,
                    age: calculateAge(patient.dateOfBirth) || 'N/A',
                    appointments: patient.appointments || [],
                    clinicalRecords: patient.clinicalRecords || []
                }));
                setPatients(transformedPatients);
            } else {
                throw new Error(data.message || 'Failed to fetch patients');
            }
        } catch (error) {
            console.error('Error in getPatients:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error fetching patients';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
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

    const value = {
        patients,
        getPatients,
        loading
    };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider; 