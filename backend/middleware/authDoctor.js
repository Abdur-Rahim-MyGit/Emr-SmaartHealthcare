import jwt from 'jsonwebtoken'
import doctorModel from '../models/doctorModel.js'

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.headers.token || req.headers.dtoken;
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication failed. No token provided.' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Find the doctor and attach to request
            const doctor = await doctorModel.findById(decoded.id);
            if (!doctor) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Authentication failed. Doctor not found.' 
                });
            }

            // Attach doctor to request object
            req.doctor = doctor;
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication failed. Invalid token.' 
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error during authentication' 
        });
    }
}

export default authDoctor;