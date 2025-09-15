import React from 'react';
import logoSvg from '../../../lOGOSmaart.svg';

const PrescriptionPrint = ({ prescription, patient, doctor, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">Prescription Preview</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                            Print
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Printable Content */}
                <div id="prescription-print" className="p-6 print:p-0 print:shadow-none">
                    {/* Print-only styles */}
                    <style>{`
                        @media print {
                            body * { visibility: hidden !important; }
                            #prescription-print, #prescription-print * { visibility: visible !important; }
                            #prescription-print { 
                                position: absolute; 
                                left: 0; 
                                top: 0; 
                                width: 100vw; 
                                background: #fff; 
                                z-index: 9999;
                                padding: 15px;
                                font-size: 12px;
                                line-height: 1.3;
                            }
                            .no-print { display: none !important; }
                            .print-header { margin-bottom: 15px !important; }
                            .print-section { margin-bottom: 12px !important; padding: 8px !important; }
                            .print-logo { width: 80px !important; height: 80px !important; }
                            .print-title { font-size: 14px !important; }
                            .print-text { font-size: 11px !important; }
                            .print-table { font-size: 10px !important; }
                            .print-table th, .print-table td { padding: 4px !important; }
                        }
                    `}</style>

                    {/* Header with Logo */}
                    <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-300 print-header">
                        <div className="flex items-center">
                            <img src={logoSvg} alt="SMAART Healthcare Logo" className="w-32 h-32 mr-6 print-logo" />
                            <div>
                                <p className="text-sm text-gray-600 mt-1 print-text">
                                    123-124, Nungambakkam High Rd, Thousand Lights West,<br />
                                    Thousand Lights, Chennai, Tamil Nadu 600034
                                </p>
                                <p className="text-sm text-gray-600 print-text">
                                    Email: info@smaarthealth.com | Phone: 89259 55711
                                </p>
                            </div>
                        </div>
                        <div className="ml-auto text-right">
                            <h2 className="text-2xl font-bold text-primary print-title">PRESCRIPTION</h2>
                            <p className="text-sm text-gray-600 print-text">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-600 print-text">
                                Prescription ID: {prescription._id?.slice(-8).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Doctor Information */}
                    <div className="mb-4 print-section">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 print-title">Doctor Information</h3>
                        <div className="bg-blue-50 p-4 rounded-lg print-section">
                            <p className="font-medium text-gray-800 print-text">Dr. {doctor?.name || 'Unknown Doctor'}</p>
                            <p className="text-sm text-gray-600 print-text">{doctor?.speciality || 'General Physician'}</p>
                            <p className="text-sm text-gray-600 print-text">Reg. No: {doctor?.degree || 'MBBS'}</p>
                        </div>
                    </div>

                    {/* Patient Information */}
                    <div className="mb-4 print-section">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 print-title">Patient Information</h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg print-section">
                            <div>
                                <p className="print-text"><span className="font-medium">Name:</span> {patient?.name}</p>
                                <p className="print-text"><span className="font-medium">UHID:</span> {patient?.uhid}</p>
                            </div>
                            <div>
                                <p className="print-text"><span className="font-medium">Gender:</span> {patient?.gender}</p>
                                <p className="print-text"><span className="font-medium">Age:</span> {patient?.age} years</p>
                            </div>
                        </div>
                    </div>

                    {/* Consultation Details */}
                    <div className="mb-4 print-section">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 print-title">Consultation Details</h3>
                        <div className="bg-yellow-50 p-4 rounded-lg print-section">
                            <p className="print-text"><span className="font-medium">Type:</span> {prescription.consultationType || 'In-person'}</p>
                            {prescription.clinicalNotes && (
                                <div className="mt-2">
                                    <p className="font-medium print-text">Clinical Notes:</p>
                                    <p className="text-gray-700 mt-1 print-text">{prescription.clinicalNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Investigations */}
                    {prescription.investigations && (
                        <div className="mb-4 print-section">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 print-title">Investigations Advised</h3>
                            <div className="bg-purple-50 p-4 rounded-lg print-section">
                                <p className="text-gray-700 print-text">{prescription.investigations}</p>
                            </div>
                        </div>
                    )}

                    {/* Medications - Main Section */}
                    {prescription.medications && prescription.medications.length > 0 && (
                        <div className="mb-4 print-section">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 print-title">℞ Medications Prescribed</h3>
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <table className="w-full print-table">
                                    <thead className="bg-primary text-white">
                                        <tr>
                                            <th className="text-left p-3 font-medium print-text">S.No</th>
                                            <th className="text-left p-3 font-medium print-text">Medicine Name</th>
                                            <th className="text-left p-3 font-medium print-text">Dosage</th>
                                            <th className="text-left p-3 font-medium print-text">Frequency</th>
                                            <th className="text-left p-3 font-medium print-text">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescription.medications.map((medication, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                                <td className="p-3 border-b border-gray-200 print-text">{index + 1}</td>
                                                <td className="p-3 border-b border-gray-200 font-medium print-text">
                                                    {medication.name}
                                                </td>
                                                <td className="p-3 border-b border-gray-200 print-text">{medication.dosage}</td>
                                                <td className="p-3 border-b border-gray-200 print-text">{medication.frequency}</td>
                                                <td className="p-3 border-b border-gray-200 print-text">{medication.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Medication Instructions */}
                            <div className="mt-2">
                                <h4 className="font-medium text-gray-800 mb-2 print-text">Instructions:</h4>
                                {prescription.medications.map((medication, index) => (
                                    medication.instructions && (
                                        <div key={index} className="mb-1 p-2 bg-green-50 rounded border-l-4 border-green-400 print-section">
                                            <p className="text-sm print-text">
                                                <span className="font-medium">{medication.name}:</span> {medication.instructions}
                                            </p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Treatment Advice */}
                    {prescription.treatmentAdvice && (
                        <div className="mb-4 print-section">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 print-title">Treatment Advice</h3>
                            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400 print-section">
                                <p className="text-gray-700 print-text">{prescription.treatmentAdvice}</p>
                            </div>
                        </div>
                    )}

                    {/* Follow-up */}
                    {prescription.followUpDate && (
                        <div className="mb-4 print-section">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2 print-title">Follow-up</h3>
                            <div className="bg-orange-50 p-4 rounded-lg print-section">
                                <p className="print-text"><span className="font-medium">Next Visit:</span> {new Date(prescription.followUpDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t-2 border-gray-300">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-sm text-gray-600 print-text">
                                    Generated on: {new Date().toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600 print-text">
                                    Status: <span className="font-medium capitalize">{prescription.status}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="border-t border-gray-400 pt-2 mt-8" style={{ minWidth: '200px' }}>
                                    <p className="text-sm font-medium">Dr. {doctor?.name || 'Doctor Name'}</p>
                                    <p className="text-xs text-gray-600">Digital Signature</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-600 text-center">
                            <strong>Disclaimer:</strong> This prescription is generated electronically and is valid without physical signature. 
                            Please follow the medication instructions carefully. In case of any adverse reactions, consult your doctor immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionPrint;
