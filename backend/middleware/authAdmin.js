import jwt from "jsonwebtoken"
import { catchAsyncErrors } from './catchAsyncErrors.js';

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1] || req.headers.atoken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource"
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Set user in request
            req.user = {
                id: decoded.id,
                isAdmin: decoded.isAdmin,
                email: decoded.email
            };

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    } catch (error) {
        console.error('Auth error:', error);
        res.status(500).json({
            success: false,
            message: "Authentication error"
        });
    }
};

export default authAdmin;