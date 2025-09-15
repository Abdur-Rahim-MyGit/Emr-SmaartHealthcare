import vitalsModel from '../models/vitalsModel.js';
import Patient from '../models/Patient.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';

// Create new vitals record
export const createVitalsRecord = async (req, res) => {
    try {
        console.log('=== VITALS CREATION START ===');
        console.log('Received vitals data:', JSON.stringify(req.body, null, 2));
        
        const {
            patientId,
            uhid,
            visitDate,
            vitalSigns,
            clinicalNotes
        } = req.body;

        // Validate required fields
        if (!patientId && !uhid) {
            console.log('ERROR: Missing patientId and uhid');
            return res.status(400).json({
                success: false,
                message: 'Either patientId or UHID is required'
            });
        }

        // Find patient by ID or UHID
        let patient;
        if (patientId) {
            console.log('Finding patient by ID:', patientId);
            patient = await Patient.findById(patientId);
        } else {
            console.log('Finding patient by UHID:', uhid);
            patient = await Patient.findOne({ uhid });
        }

        if (!patient) {
            console.log('ERROR: Patient not found');
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        console.log('Found patient:', patient.patientName, 'UHID:', patient.uhid);

        // Create minimal vitals record first
        const vitalsData = {
            patientId: patient._id,
            uhid: patient.uhid || `UHID-${Date.now()}`,
            recordedByName: 'Admin User',
            visitDate: visitDate ? new Date(visitDate) : new Date()
        };

        // Only add vitalSigns if they exist and are valid
        if (vitalSigns && typeof vitalSigns === 'object') {
            vitalsData.vitalSigns = {};
            
            // Add each vital sign safely
            if (vitalSigns.height) vitalsData.vitalSigns.height = vitalSigns.height;
            if (vitalSigns.weight) vitalsData.vitalSigns.weight = vitalSigns.weight;
            if (vitalSigns.bloodPressure) vitalsData.vitalSigns.bloodPressure = vitalSigns.bloodPressure;
            if (vitalSigns.heartRate) vitalsData.vitalSigns.heartRate = vitalSigns.heartRate;
            if (vitalSigns.respiratoryRate) vitalsData.vitalSigns.respiratoryRate = vitalSigns.respiratoryRate;
            if (vitalSigns.temperature) vitalsData.vitalSigns.temperature = vitalSigns.temperature;
            if (vitalSigns.oxygenSaturation) vitalsData.vitalSigns.oxygenSaturation = vitalSigns.oxygenSaturation;
        }

        // Only add clinicalNotes if they exist and are valid
        if (clinicalNotes && typeof clinicalNotes === 'object') {
            vitalsData.clinicalNotes = {};
            
            if (clinicalNotes.chiefComplaint) vitalsData.clinicalNotes.chiefComplaint = clinicalNotes.chiefComplaint;
            if (clinicalNotes.allergies) vitalsData.clinicalNotes.allergies = clinicalNotes.allergies;
            if (clinicalNotes.currentMedications) vitalsData.clinicalNotes.currentMedications = clinicalNotes.currentMedications;
            if (clinicalNotes.pastMedicalHistory) vitalsData.clinicalNotes.pastMedicalHistory = clinicalNotes.pastMedicalHistory;
            if (clinicalNotes.familyMedicalHistory) vitalsData.clinicalNotes.familyMedicalHistory = clinicalNotes.familyMedicalHistory;
            if (clinicalNotes.lifestyleHabits) vitalsData.clinicalNotes.lifestyleHabits = clinicalNotes.lifestyleHabits;
            if (clinicalNotes.nurseObservations) vitalsData.clinicalNotes.nurseObservations = clinicalNotes.nurseObservations;
        }

        console.log('Final vitals data to save:', JSON.stringify(vitalsData, null, 2));

        const vitalsRecord = new vitalsModel(vitalsData);
        console.log('Created vitals model instance');
        
        const savedRecord = await vitalsRecord.save();
        console.log('Successfully saved vitals record:', savedRecord._id);

        res.status(201).json({
            success: true,
            message: 'Vitals record created successfully',
            vitalsRecord: savedRecord
        });

    } catch (error) {
        console.error('=== VITALS CREATION ERROR ===');
        console.error('Error creating vitals record:', error);
        console.error('Error stack:', error.stack);
        console.error('Request body:', req.body);
        res.status(500).json({
            success: false,
            message: 'Error creating vitals record',
            error: error.message,
            details: error.stack
        });
    }
};

// Get vitals records for a patient
export const getPatientVitals = catchAsyncErrors(async (req, res) => {
    try {
        const { patientId } = req.params;
        const { limit = 10, page = 1 } = req.query;

        const vitalsRecords = await vitalsModel
            .find({ patientId })
            .populate('recordedBy', 'name email')
            .sort({ visitDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await vitalsModel.countDocuments({ patientId });

        res.status(200).json({
            success: true,
            vitalsRecords,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching patient vitals:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patient vitals',
            error: error.message
        });
    }
});

// Get vitals records by UHID
export const getVitalsByUHID = catchAsyncErrors(async (req, res) => {
    try {
        const { uhid } = req.params;
        const { limit = 10, page = 1 } = req.query;

        const vitalsRecords = await vitalsModel
            .find({ uhid })
            .populate('recordedBy', 'name email')
            .sort({ visitDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await vitalsModel.countDocuments({ uhid });

        res.status(200).json({
            success: true,
            vitalsRecords,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Error fetching vitals by UHID:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching vitals by UHID',
            error: error.message
        });
    }
});

// Get latest vitals for a patient
export const getLatestVitals = catchAsyncErrors(async (req, res) => {
    try {
        const { patientId } = req.params;

        const latestVitals = await vitalsModel
            .findOne({ patientId })
            .populate('recordedBy', 'name email')
            .sort({ visitDate: -1 });

        if (!latestVitals) {
            return res.status(404).json({
                success: false,
                message: 'No vitals records found for this patient'
            });
        }

        res.status(200).json({
            success: true,
            vitalsRecord: latestVitals
        });

    } catch (error) {
        console.error('Error fetching latest vitals:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching latest vitals',
            error: error.message
        });
    }
});

// Update vitals record
export const updateVitalsRecord = catchAsyncErrors(async (req, res) => {
    try {
        const { recordId } = req.params;
        const updates = req.body;

        const vitalsRecord = await vitalsModel.findByIdAndUpdate(
            recordId,
            { ...updates, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).populate('recordedBy', 'name email');

        if (!vitalsRecord) {
            return res.status(404).json({
                success: false,
                message: 'Vitals record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vitals record updated successfully',
            vitalsRecord
        });

    } catch (error) {
        console.error('Error updating vitals record:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating vitals record',
            error: error.message
        });
    }
});

// Delete vitals record
export const deleteVitalsRecord = catchAsyncErrors(async (req, res) => {
    try {
        const { recordId } = req.params;

        const vitalsRecord = await vitalsModel.findByIdAndDelete(recordId);

        if (!vitalsRecord) {
            return res.status(404).json({
                success: false,
                message: 'Vitals record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Vitals record deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting vitals record:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting vitals record',
            error: error.message
        });
    }
});
