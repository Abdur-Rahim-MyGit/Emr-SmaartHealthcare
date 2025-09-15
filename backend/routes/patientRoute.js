import express from 'express';
import { 
    loginPatient, 
    getPatientDashboard, 
    getPatientAppointments, 
    getPatientPrescriptions, 
    getPatientBills, 
    getPatientProfile, 
    updatePatientProfile 
} from '../controllers/patientController.js';
import authPatient from '../middleware/authPatient.js';
import upload from '../middleware/multer.js';

const patientRouter = express.Router();

// Public routes
patientRouter.post("/login", loginPatient);

// Protected routes (require patient authentication)
patientRouter.get("/dashboard", authPatient, getPatientDashboard);
patientRouter.get("/appointments", authPatient, getPatientAppointments);
patientRouter.get("/prescriptions", authPatient, getPatientPrescriptions);
patientRouter.get("/bills", authPatient, getPatientBills);
patientRouter.get("/profile", authPatient, getPatientProfile);
patientRouter.put("/profile", upload.single('photograph'), authPatient, updatePatientProfile);

export default patientRouter;
