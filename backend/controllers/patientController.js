import Patient from '../models/Patient.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import prescriptionModel from '../models/prescriptionModel.js';
import billModel from '../models/billModel.js';
import clinicalRecordModel from '../models/clinicalRecordModel.js';
import vitalsModel from '../models/vitalsModel.js';

// Add new patient
export const addPatient = async (req, res) => {
    try {
        console.log('Received request body:', req.body);

        const {
            uhid,
            alternateUhid,
            patientName,
            email,
            password,
            phone,
            dateOfBirth,
            gender,
            bloodGroup,
            occupation,
            address,
            referringDoctor,
            insuranceStatus,
            organDonorStatus,
            governmentId,
            insuranceDetails,
            consent,
            emergencyContact
        } = req.body;

        // Validate required fields
        if (!uhid || !patientName || !email || !password || !phone || !dateOfBirth || !gender || !address) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if patient with email already exists
        const existingPatientByEmail = await Patient.findOne({ email });
        if (existingPatientByEmail) {
            return res.status(400).json({
                success: false,
                message: 'Patient with this email already exists'
            });
        }

        // Validate gender
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gender value'
            });
        }

        // Parse JSON fields
        const parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
        const parsedReferringDoctor = typeof referringDoctor === 'string' ? JSON.parse(referringDoctor) : referringDoctor;
        const parsedGovernmentId = typeof governmentId === 'string' ? JSON.parse(governmentId) : governmentId;
        const parsedInsuranceDetails = typeof insuranceDetails === 'string' ? JSON.parse(insuranceDetails) : insuranceDetails;
        const parsedConsent = typeof consent === 'string' ? JSON.parse(consent) : consent;
        const parsedEmergencyContact = typeof emergencyContact === 'string' ? JSON.parse(emergencyContact) : emergencyContact;

        // Create new patient
        const patient = new Patient({
            uhid,
            alternateUhid,
            patientName,
            email,
            password,
            phone,
            dateOfBirth: new Date(dateOfBirth.split('_').reverse().join('-')),
            gender,
            bloodGroup,
            occupation,
            address: parsedAddress,
            referringDoctor: parsedReferringDoctor,
            insuranceStatus,
            organDonorStatus,
            governmentId: parsedGovernmentId,
            insuranceDetails: parsedInsuranceDetails,
            consent: parsedConsent,
            emergencyContact: parsedEmergencyContact
        });

        // Handle file uploads
        if (req.files) {
            if (req.files.photograph) {
                patient.photograph = req.files.photograph[0].path;
            }
            if (req.files.governmentIdDocument) {
                patient.governmentId.document = req.files.governmentIdDocument[0].path;
            }
        }

        console.log('Attempting to save patient:', patient);

        await patient.save();

        console.log('Patient saved successfully');

        // Remove password from response
        const patientResponse = patient.toObject();
        delete patientResponse.password;

        res.status(201).json({
            success: true,
            message: 'Patient added successfully and can now login to frontend',
            patient: patientResponse
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

// Patient login
export const loginPatient = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find patient by email
        const patient = await Patient.findOne({ email: email.toLowerCase() });
        if (!patient) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Debug: Check if password exists
        console.log('Patient found:', patient.email);
        console.log('Patient has password:', !!patient.password);
        console.log('Password length:', patient.password ? patient.password.length : 'undefined');

        // Check if patient has a password
        if (!patient.password) {
            return res.status(401).json({
                success: false,
                message: 'Patient account not properly configured. Please contact administrator.'
            });
        }

        // Check password
        const isPasswordValid = await patient.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                patientId: patient._id,
                email: patient.email,
                uhid: patient.uhid
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Remove password from response
        const patientResponse = patient.toObject();
        delete patientResponse.password;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            patient: patientResponse
        });

    } catch (error) {
        console.error('Error in loginPatient:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// Get patient dashboard data
export const getPatientDashboard = async (req, res) => {
    try {
        const patientId = req.patientId;
        const patient = req.patient;

        // Get appointments
        const appointments = await appointmentModel.find({
            $or: [
                { 'userData.email': patient.email },
                { userId: patientId }
            ]
        })
        .populate('docId', 'name speciality image')
        .sort({ slotDate: 1 })
        .limit(10);

        // Get prescriptions
        const prescriptions = await prescriptionModel.find({ patientId: patientId })
            .populate('doctorId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get bills
        const bills = await billModel.find({ patient: patientId })
            .sort({ createdAt: -1 })
            .limit(5);

        // Get medical records
        const medicalRecords = await clinicalRecordModel.find({ patient: patientId })
            .populate('consultedDoctor', 'name')
            .sort({ encounterDate: -1 })
            .limit(5);

        // Get vitals
        const vitals = await vitalsModel.findOne({ patient: patientId })
            .sort({ createdAt: -1 });

        // Calculate stats
        const totalAppointments = await appointmentModel.countDocuments({
            $or: [
                { 'userData.email': patient.email },
                { userId: patientId }
            ]
        });

        const upcomingAppointments = appointments.filter(apt => 
            new Date(apt.slotDate) >= new Date() && !apt.cancelled
        ).length;

        const totalPrescriptions = await prescriptionModel.countDocuments({ patientId: patientId });
        const totalBills = await billModel.countDocuments({ patient: patientId });

        res.status(200).json({
            success: true,
            data: {
                patient: {
                    uhid: patient.uhid,
                    patientName: patient.patientName,
                    email: patient.email,
                    phone: patient.phone,
                    dateOfBirth: patient.dateOfBirth,
                    gender: patient.gender,
                    bloodGroup: patient.bloodGroup,
                    address: patient.address,
                    photograph: patient.photograph
                },
                stats: {
                    totalAppointments,
                    upcomingAppointments,
                    totalPrescriptions,
                    totalBills
                },
                appointments: appointments.slice(0, 5),
                prescriptions,
                bills,
                medicalRecords,
                vitals
            }
        });

    } catch (error) {
        console.error('Error in getPatientDashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

// Get patient appointments
export const getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.patientId;
        const patient = req.patient;

        console.log('Fetching appointments for patient:', {
            patientId,
            email: patient.email,
            uhid: patient.uhid
        });

        // Try multiple search criteria
        const appointmentsByEmail = await appointmentModel.find({ 'userData.email': patient.email });
        const appointmentsByUserId = await appointmentModel.find({ userId: patientId });
        const appointmentsByUhid = await appointmentModel.find({ 'userData.uhid': patient.uhid });

        console.log('Appointments found by email:', appointmentsByEmail.length);
        console.log('Appointments found by userId:', appointmentsByUserId.length);
        console.log('Appointments found by uhid:', appointmentsByUhid.length);

        const appointments = await appointmentModel.find({
            $or: [
                { 'userData.email': patient.email },
                { userId: patientId },
                { 'userData.uhid': patient.uhid }
            ]
        })
        .populate('docId', 'name speciality image address')
        .sort({ slotDate: -1 });

        console.log('Total appointments found:', appointments.length);

        res.status(200).json({
            success: true,
            appointments
        });

    } catch (error) {
        console.error('Error in getPatientAppointments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
};

// Get patient prescriptions
export const getPatientPrescriptions = async (req, res) => {
    try {
        const patientId = req.patientId;
        const patient = req.patient;

        console.log('Fetching prescriptions for patient:', {
            patientId,
            email: patient.email,
            uhid: patient.uhid
        });

        // Try multiple search criteria
        const prescriptionsByPatientId = await prescriptionModel.find({ patientId: patientId });

        console.log('Prescriptions found by patientId:', prescriptionsByPatientId.length);

        const prescriptions = await prescriptionModel.find({ patientId: patientId })
            .populate('doctorId', 'name speciality')
            .sort({ createdAt: -1 });

        console.log('Total prescriptions found:', prescriptions.length);

        res.status(200).json({
            success: true,
            prescriptions
        });

    } catch (error) {
        console.error('Error in getPatientPrescriptions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching prescriptions',
            error: error.message
        });
    }
};

// Get patient bills
export const getPatientBills = async (req, res) => {
    try {
        const patientId = req.patientId;

        const bills = await billModel.find({ patient: patientId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            bills
        });

    } catch (error) {
        console.error('Error in getPatientBills:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bills',
            error: error.message
        });
    }
};

// Get patient profile
export const getPatientProfile = async (req, res) => {
    try {
        const patient = req.patient;

        // Remove password from response
        const patientData = patient.toObject();
        delete patientData.password;

        res.status(200).json({
            success: true,
            patient: patientData
        });

    } catch (error) {
        console.error('Error in getPatientProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// Update patient profile
export const updatePatientProfile = async (req, res) => {
    try {
        const patientId = req.patientId;
        const updateData = req.body;

        // Remove sensitive fields that shouldn't be updated
        delete updateData.password;
        delete updateData.uhid;
        delete updateData.email;

        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedPatient) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            patient: updatedPatient
        });

    } catch (error) {
        console.error('Error in updatePatientProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
}; 