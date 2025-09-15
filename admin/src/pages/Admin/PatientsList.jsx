import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaSpinner, FaUserCircle, FaCalendarAlt, FaFileMedical, FaFilter } from 'react-icons/fa';

const PatientsList = () => {
    const { getAllPatients, patients } = useContext(AdminContext);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('all');
    const [filterAge, setFilterAge] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                await getAllPatients();
            } catch (err) {
                toast.error('Failed to fetch patients');
            }
            setLoading(false);
        };
        fetchPatients();
    }, []);
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Patients List</h1>
                <p className="text-gray-600">View and manage patient information</p>
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
            {/* Patients List View */}
            {patients && patients.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UHID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {patients
                                .filter(patient => {
                                    const term = searchTerm.toLowerCase();
                                    return (
                                        patient.name?.toLowerCase().includes(term) ||
                                        patient.email?.toLowerCase().includes(term) ||
                                        patient.phone?.toLowerCase().includes(term) ||
                                        patient.uhid?.toLowerCase().includes(term) ||
                                        patient.bloodGroup?.toLowerCase().includes(term)
                                    );
                                })
                                .filter(patient => {
                                    if (filterGender === 'all') return true;
                                    return patient.gender?.toLowerCase() === filterGender;
                                })
                                .filter(patient => {
                                    if (filterAge === 'all') return true;
                                    const age = Number(patient.age);
                                    if (filterAge === 'child') return age >= 0 && age <= 17;
                                    if (filterAge === 'adult') return age >= 18 && age <= 59;
                                    if (filterAge === 'senior') return age >= 60;
                                    return true;
                                })
                                .sort((a, b) => {
                                    if (sortBy === 'name') {
                                        if (sortOrder === 'asc') return a.name.localeCompare(b.name);
                                        else return b.name.localeCompare(a.name);
                                    }
                                    if (sortBy === 'age') {
                                        if (sortOrder === 'asc') return a.age - b.age;
                                        else return b.age - a.age;
                                    }
                                    return 0;
                                })
                                .map((patient) => (
                                    <tr key={patient._id} className="hover:bg-blue-50 cursor-pointer" onClick={() => window.location.href = `/patient-details/${patient._id}` }>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {patient.photograph ? (
                                                <img src={patient.photograph} alt={patient.name} className="w-10 h-10 rounded-full object-cover border-2 border-blue-300" />
                                            ) : (
                                                <FaUserCircle className="w-10 h-10 text-gray-400" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{patient.name || patient.patientName || 'No Name'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.uhid || 'Not assigned'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{patient.gender || 'Not specified'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{patient.age ? patient.age + ' years' : 'N/A'}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <FaUserCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
                    <p className="mt-1 text-sm text-gray-500">No patients have been registered yet</p>
                </div>
            )}
        </div>
    );
}

export default PatientsList;