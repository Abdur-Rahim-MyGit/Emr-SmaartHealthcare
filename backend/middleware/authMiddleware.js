import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Find user
        const user = await userModel.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        // Attach user to request
        req.user = user;
        req.userId = user._id;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
}; 