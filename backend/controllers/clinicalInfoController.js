import ClinicalInfo from '../models/clinicalInfoModel.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';

// Add new clinical information
export const addClinicalInfo = catchAsyncErrors(async (req, res) => {
    const clinicalInfo = await ClinicalInfo.create(req.body);
    res.status(201).json({
        success: true,
        clinicalInfo
    });
});

// Get clinical information by patient ID
export const getPatientClinicalInfo = catchAsyncErrors(async (req, res) => {
    const clinicalInfo = await ClinicalInfo.find({ patientId: req.params.patientId })
        .populate('doctorId', 'name speciality')
        .sort({ encounterDate: -1 });

    res.status(200).json({
        success: true,
        clinicalInfo
    });
});

// Get single clinical record
export const getClinicalRecord = catchAsyncErrors(async (req, res) => {
    const clinicalInfo = await ClinicalInfo.findById(req.params.recordId)
        .populate('doctorId', 'name speciality');

    if (!clinicalInfo) {
        return res.status(404).json({
            success: false,
            message: 'Clinical record not found'
        });
    }

    res.status(200).json({
        success: true,
        clinicalInfo
    });
});

// Update clinical information
export const updateClinicalInfo = catchAsyncErrors(async (req, res) => {
    let clinicalInfo = await ClinicalInfo.findById(req.params.recordId);

    if (!clinicalInfo) {
        return res.status(404).json({
            success: false,
            message: 'Clinical record not found'
        });
    }

    clinicalInfo = await ClinicalInfo.findByIdAndUpdate(
        req.params.recordId,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        clinicalInfo
    });
});

// Delete clinical information
export const deleteClinicalInfo = catchAsyncErrors(async (req, res) => {
    const clinicalInfo = await ClinicalInfo.findById(req.params.recordId);

    if (!clinicalInfo) {
        return res.status(404).json({
            success: false,
            message: 'Clinical record not found'
        });
    }

    await clinicalInfo.remove();

    res.status(200).json({
        success: true,
        message: 'Clinical record deleted successfully'
    });
}); 