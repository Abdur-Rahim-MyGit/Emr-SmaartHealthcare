import express from 'express';
import {
    addClinicalInfo,
    getPatientClinicalInfo,
    getClinicalRecord,
    updateClinicalInfo,
    deleteClinicalInfo
} from '../controllers/clinicalInfoController.js';
import { isAuthenticatedUser, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Clinical Information Routes
router.route('/clinical-info/new')
    .post(isAuthenticatedUser, authorizeRoles('doctor', 'admin'), addClinicalInfo);

router.route('/clinical-info/patient/:patientId')
    .get(isAuthenticatedUser, getPatientClinicalInfo);

router.route('/clinical-info/:recordId')
    .get(isAuthenticatedUser, getClinicalRecord)
    .put(isAuthenticatedUser, authorizeRoles('doctor', 'admin'), updateClinicalInfo)
    .delete(isAuthenticatedUser, authorizeRoles('doctor', 'admin'), deleteClinicalInfo);

export default router; 