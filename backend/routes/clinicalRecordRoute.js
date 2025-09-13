import express from 'express';
import { 
    createClinicalRecord, 
    getClinicalRecord, 
    updateClinicalRecord, 
    deleteClinicalRecord,
    getPatientClinicalRecords,
    getDoctorClinicalRecords 
} from '../controllers/clinicalRecordController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Create a new clinical record (Doctors only)
router.post(
    '/create',
    isAuthenticatedUser,
    authorizeRoles('doctor'),
    createClinicalRecord
);

// Get a specific clinical record (Doctors and the patient)
router.get(
    '/:id',
    isAuthenticatedUser,
    getClinicalRecord
);

// Update a clinical record (Doctors only)
router.put(
    '/:id',
    isAuthenticatedUser,
    authorizeRoles('doctor'),
    updateClinicalRecord
);

// Delete a clinical record (Doctors only)
router.delete(
    '/:id',
    isAuthenticatedUser,
    authorizeRoles('doctor'),
    deleteClinicalRecord
);

// Get all clinical records for a patient (Doctors and the patient)
router.get(
    '/patient/:patientId',
    isAuthenticatedUser,
    getPatientClinicalRecords
);

// Get all clinical records for the authenticated doctor
router.get(
    '/doctor/records',
    isAuthenticatedUser,
    authorizeRoles('doctor'),
    getDoctorClinicalRecords
);

export default router; 