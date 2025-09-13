import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile, getPatients } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
import userModel from '../models/userModel.js';
import patientModel from '../models/patientModel.js';
import appointmentModel from '../models/appointmentModel.js';
import clinicalRecordModel from '../models/clinicalRecordModel.js';
import doctorModel from '../models/doctorModel.js';

const doctorRouter = express.Router();

doctorRouter.post("/login", loginDoctor)
doctorRouter.get("/patients", authDoctor, getPatients)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)

// Add patient details endpoint
doctorRouter.get("/patient-details/:patientId", authDoctor, async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Try to find in userModel first
        let patient = await userModel.findById(patientId).select('-password');
        let source = 'user';
        
        // If not found in userModel, try patientModel
        if (!patient) {
            patient = await patientModel.findById(patientId);
            source = 'patient';
        }
        
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }

        // Get appointments for this patient
        const appointments = await appointmentModel.find({ 
            $or: [
                { userId: patientId },
                { patient: patientId }
            ]
        })
        .populate({
            path: 'docId',
            select: 'name speciality image',
            model: 'Doctor'
        })
        .sort({ date: -1 });

        // Get clinical records for this patient
        const clinicalRecords = await clinicalRecordModel.find({
            patient: patientId
        })
        .populate({
            path: 'consultedDoctor',
            select: 'name speciality image',
            model: 'Doctor'
        })
        .sort({ createdAt: -1 });

        // Transform the data based on the source
        const transformedPatient = {
            _id: patient._id,
            patientName: source === 'user' ? patient.name : patient.patientName,
            name: source === 'user' ? patient.name : patient.patientName,
            email: patient.email,
            phone: patient.phone,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth || patient.dob,
            bloodGroup: patient.bloodGroup,
            address: patient.address,
            uhid: source === 'patient' ? patient.uhid : undefined,
            medicalInfo: patient.medicalInfo || {},
            appointments: appointments.map(app => ({
                ...app.toObject(),
                doctor: app.docId
            })) || [],
            clinicalRecords: clinicalRecords || []
        };

        res.status(200).json({ 
            success: true, 
            patient: transformedPatient,
            source
        });
    } catch (error) {
        console.error('Error in getPatientDetails:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching patient details',
            error: error.message 
        });
    }
});

export default doctorRouter;