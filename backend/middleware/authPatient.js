import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';

const authPatient = async (req, res, next) => {
    try {
        const token = req.headers.token;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Access denied.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's a patient token
        if (!decoded.patientId) {
            return res.status(401).json({
                success: false,
                message: 'Invalid patient token'
            });
        }

        // Get patient data
        const patient = await Patient.findById(decoded.patientId).select('-password');
        
        if (!patient) {
            return res.status(401).json({
                success: false,
                message: 'Patient not found'
            });
        }

        // Add patient to request object
        req.patient = patient;
        req.patientId = patient._id;
        
        next();
    } catch (error) {
        console.error('Patient auth error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default authPatient;
