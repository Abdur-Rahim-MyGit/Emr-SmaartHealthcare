import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { FaSpinner, FaCalendarAlt, FaNotesMedical, FaFileMedical, FaArrowLeft, FaUserCircle, FaHeartbeat, FaStethoscope, FaUserMd, FaClock, FaFilter, FaSort, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const PatientDetails = () => {
    // Modal state for vitals entry
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [vitalsForm, setVitalsForm] = useState({
        height: '',
        weight: '',
        // ...other vitals fields...
    });

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
            {/* ...existing code for header, patient info, vitals modal, tabs, and content sections... */}
        </div>
    );
}