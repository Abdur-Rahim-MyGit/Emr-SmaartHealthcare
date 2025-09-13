import Patient from '../models/Patient.js';

// Add new patient
export const addPatient = async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        const {
            uhid,
            alternateUhid,
            patientName,
            dateOfBirth,
            gender,
            occupation,
            address,
            insuranceStatus,
            organDonorStatus
        } = req.body;

        // Validate required fields
        if (!uhid || !patientName || !dateOfBirth || !gender || !address) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Validate gender
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gender value'
            });
        }

        // Validate insurance status if provided
        if (insuranceStatus && !['Insured', 'Not Insured', 'Pending'].includes(insuranceStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid insurance status'
            });
        }

        // Validate organ donor status if provided
        if (organDonorStatus && !['Yes', 'No'].includes(organDonorStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid organ donor status'
            });
        }

        // Check if patient with UHID already exists
        const existingPatient = await Patient.findOne({ uhid });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: 'Patient with this UHID already exists'
            });
        }

        // Create new patient
        const patient = new Patient({
            uhid,
            alternateUhid,
            patientName,
            dateOfBirth: new Date(dateOfBirth),
            gender,
            occupation,
            address,
            insuranceStatus,
            organDonorStatus
        });

        console.log('Attempting to save patient:', patient);

        await patient.save();

        console.log('Patient saved successfully');

        res.status(201).json({
            success: true,
            message: 'Patient added successfully',
            patient
        });

    } catch (error) {
        console.error('Error in addPatient:', error);
        
        // Check for validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        // Check for duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate UHID found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error adding patient',
            error: error.message
        });
    }
}; 