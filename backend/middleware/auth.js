import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { catchAsyncErrors } from './catchAsyncErrors.js';

// Authenticate user and attach user to request
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    let token = req.headers.token;
    
    // Check Authorization header if token not found
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please login to access this resource"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    next();
});

// Authorize roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();
    };
}; 