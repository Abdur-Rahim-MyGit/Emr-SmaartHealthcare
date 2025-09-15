import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaSpinner, FaUserCircle, FaCalendarAlt, FaFileMedical, FaFilter } from 'react-icons/fa';

const PatientsList = () => {
    const { getPatients, patients } = useContext(DoctorContext);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('all');
    const [filterAge, setFilterAge] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        loadPatients();
    }, []);

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        if (isNaN(birthDate.getTime())) return 'N/A';
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        return calculatedAge >= 0 ? calculatedAge : 'N/A';
    };

    const loadPatients = async () => {
        try {
            setLoading(true);
            await getPatients();
        } catch (error) {
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredAndSortedPatients = () => {
        // Create a copy of patients array to avoid mutating the original
        let filtered = [...patients];

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter(patient => {
                const searchFields = [
                    patient?.name,
                    patient?.email,
                    patient?.phone,
                    patient?.uhid,
                    patient?.bloodGroup
                ];
                return searchFields.some(field => 
                    field && field.toLowerCase().includes(searchLower)
                );
            });
        }

        // Apply gender filter
        if (filterGender !== 'all') {
            filtered = filtered.filter(patient => 
                patient?.gender?.toLowerCase() === filterGender.toLowerCase()
            );
        }

        // Apply age filter
        if (filterAge !== 'all') {
            filtered = filtered.filter(patient => {
                const age = parseInt(patient?.age) || 0;
                switch (filterAge) {
                    case 'child':
                        return age < 18;
                    case 'adult':
                        return age >= 18 && age < 60;
                    case 'senior':
                        return age >= 60;
                    default:
                        return true;
                }
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            const aVal = a || {};
            const bVal = b || {};

            switch (sortBy) {
                case 'name':
                    comparison = (aVal.name || '').localeCompare(bVal.name || '');
                    break;
                case 'age':
                    const aAge = parseInt(aVal.age) || 0;
                    const bAge = parseInt(bVal.age) || 0;
                    comparison = aAge - bAge;
                    break;
                case 'appointments':
                    const aCount = aVal.appointments?.length || 0;
                    const bCount = bVal.appointments?.length || 0;
                    comparison = aCount - bCount;
                    break;
                default:
                    comparison = 0;
            }

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return filtered;
    };

    const filteredPatients = getFilteredAndSortedPatients();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Patients List</h1>
                <p className="text-gray-500">View and manage patient information</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-96 relative">
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, UHID, or blood group..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    </div>

                    <div className="flex gap-4">
                        <select
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        >
                            <option value="all">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>

                        <select
                            value={filterAge}
                            onChange={(e) => setFilterAge(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        >
                            <option value="all">All Ages</option>
                            <option value="child">Children (0-17)</option>
                            <option value="adult">Adults (18-59)</option>
                            <option value="senior">Seniors (60+)</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FaFilter className="text-gray-500" />
                        <span className="text-sm text-gray-600">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        >
                            <option value="name">Name</option>
                            <option value="age">Age</option>
                            <option value="appointments">Appointments</option>
                        </select>
                    </div>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            {/* Patients Grid */}
            {filteredPatients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <Link
                            key={patient._id}
                            to={`/doctor/patient-details/${patient._id}`}
                            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    {patient.avatar ? (
                                        <img
                                            src={patient.avatar}
                                            alt={patient.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium text-gray-900">{patient.name || 'No Name'}</h3>
                                    <p className="text-sm text-gray-500">{patient.uhid || 'UHID: Not assigned'}</p>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-sm text-gray-600">{patient.email || 'No email'}</p>
                                        <p className="text-sm text-gray-600">{patient.phone || 'No phone'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaCalendarAlt className="mr-2" />
                                    {patient.appointments?.length || 0} Appointments
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                    <FaFileMedical className="mr-2" />
                                    {patient.clinicalRecords?.length || 0} Records
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {patient.bloodGroup && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                        {patient.bloodGroup}
                                    </span>
                                )}
                                {patient.gender && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                        {patient.gender}
                                    </span>
                                )}
                                {(patient.age || patient.dateOfBirth) && (
                                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                        {calculateAge(patient.dateOfBirth) || patient.age || 'N/A'} years
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FaUserCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || filterGender !== 'all' || filterAge !== 'all'
                            ? 'Try adjusting your search or filters'
                            : 'No patients have been registered yet'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PatientsList; 