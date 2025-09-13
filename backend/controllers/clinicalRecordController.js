import ClinicalRecord from '../models/clinicalRecordModel.js';
import User from '../models/userModel.js';
import patientModel from '../models/patientModel.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../utils/errorHandler.js';
import doctorModel from '../models/doctorModel.js';
import mongoose from 'mongoose';

// Search patients with optimizations
export const searchPatients = catchAsyncErrors(async (req, res) => {
    const { term } = req.body;

    if (!term) {
        return res.status(400).json({
            success: false,
            message: 'Search term is required'
        });
    }

    try {
        // Create text search query
        const searchQuery = {
            $or: [
                { patientName: { $regex: term, $options: 'i' } },
                { email: { $regex: term, $options: 'i' } },
                { phone: { $regex: term, $options: 'i' } },
                { uhid: { $regex: term, $options: 'i' } }
            ]
        };

        // Execute search query with optimizations
        const patients = await patientModel.find(searchQuery)
            .select('patientName email phone dateOfBirth gender bloodGroup uhid')
            .limit(10)
            .lean();

        if (!patients || patients.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                patients: [],
                message: 'No patients found matching the search criteria'
            });
        }

        // Process results
        const processedResults = patients.map(patient => ({
            _id: patient._id,
            name: patient.patientName,
            email: patient.email,
            phone: patient.phone,
            uhid: patient.uhid,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth,
            bloodGroup: patient.bloodGroup
        }));

        // Return results with metadata
        res.status(200).json({
            success: true,
            count: processedResults.length,
            patients: processedResults
        });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing search',
            error: error.message
        });
    }
});

// Create a new clinical record
export const createClinicalRecord = catchAsyncErrors(async (req, res) => {
    const clinicalRecord = await ClinicalRecord.create({
        ...req.body,
        creator: req.user.id,
        creatorModel: req.user.isAdmin ? 'Admin' : 'Doctor'
    });
    res.status(201).json({
        success: true,
        clinicalRecord
    });
});

// Get all clinical records
export const getClinicalRecords = catchAsyncErrors(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalRecords = await ClinicalRecord.countDocuments();
    const records = await ClinicalRecord.find()
        .populate('patient', 'name email phone')
        .populate('doctor', 'name email phone')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        records,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        totalRecords
    });
});

// Get a single clinical record
export const getClinicalRecord = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const clinicalRecord = await ClinicalRecord.findById(id)
        .populate('consultedDoctor', 'name speciality')
        .populate('patient', 'name');
    
    if (!clinicalRecord) {
        return res.status(404).json({
            success: false,
            message: 'Clinical record not found'
        });
    }
    
    res.status(200).json({
        success: true,
        clinicalRecord
    });
});

// Get patient's clinical records
export const getPatientClinicalRecords = catchAsyncErrors(async (req, res) => {
    const { patientId } = req.params;
    const clinicalRecords = await ClinicalRecord.find({ patient: patientId })
        .populate('consultedDoctor', 'name speciality')
        .sort({ encounterDate: -1 });
    
    res.status(200).json({
        success: true,
        clinicalRecords
    });
});

// Update clinical record
export const updateClinicalRecord = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const clinicalRecord = await ClinicalRecord.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
    );
    
    if (!clinicalRecord) {
        return res.status(404).json({
            success: false,
            message: 'Clinical record not found'
        });
    }
    
    res.status(200).json({
        success: true,
        clinicalRecord
    });
});

// Delete clinical record
export const deleteClinicalRecord = catchAsyncErrors(async (req, res) => {
    const { id } = req.params;
    const clinicalRecord = await ClinicalRecord.findByIdAndDelete(id);
    
    if (!clinicalRecord) {
        return res.status(404).json({
            success: false,
            message: 'Clinical record not found'
        });
    }
    
    res.status(200).json({
        success: true,
        message: 'Clinical record deleted successfully'
    });
});

// Get doctor's clinical records
export const getDoctorClinicalRecords = catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
        $or: [
            { consultedDoctor: req.params.doctorId },
            { createdBy: req.params.doctorId, createdByModel: 'doctor' }
        ]
    };

    const total = await ClinicalRecord.countDocuments(query);
    const clinicalRecords = await ClinicalRecord.find(query)
        .populate('patient', 'name email phone')
        .populate('consultedDoctor', 'name email phone')
        .populate('createdBy')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        clinicalRecords,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
}); 