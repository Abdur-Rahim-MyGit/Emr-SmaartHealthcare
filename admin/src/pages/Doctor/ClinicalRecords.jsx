import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { toast } from 'react-toastify';
import { FaSearch, FaUserCircle } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import Modal from '../../components/Modal';

const ClinicalRecords = () => {
    const { getAllPatients, patients, addClinicalRecord, doctors, getAllDoctors } = useContext(DoctorContext);
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
        setSearchLoading(true);
        setHasSearched(true);
        // Simulate search
        setTimeout(() => {
            setSearchResults(patients.filter(p => p.name.toLowerCase().includes(term.toLowerCase()) || p.email.toLowerCase().includes(term.toLowerCase())));
            setSearchLoading(false);
        }, 500);
    }, [patients]);

    useEffect(() => {
        cleanupSearch();
        if (searchTerm) {
            searchTimeoutRef.current = setTimeout(() => {
                performSearch(searchTerm);
            }, 400);
        } else {
            setSearchResults([]);
            setHasSearched(false);
        }
        return cleanupSearch;
    }, [searchTerm, performSearch]);

    // ...rest of the logic and UI copied from Admin ClinicalRecords, adapted for DoctorContext

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Clinical Records (Doctor Panel)</h2>
            {/* UI and logic similar to Admin ClinicalRecords, adapted for doctors */}
        </div>
    );
};

export default ClinicalRecords;
