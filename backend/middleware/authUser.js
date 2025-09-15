import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

// user authentication middleware
const authUser = async (req, res, next) => {
    try {
        // Check for token in both formats
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
                message: "Not Authorized, please login again"
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            if (!decoded || !decoded.id) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token format"
                });
            }

            // Find user and attach to request
            const user = await userModel.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            // Attach user and userId to request
            req.user = user;
            req.userId = user._id;
            req.body.userId = user._id;

            next();
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return res.status(401).json({
                success: false,
                message: "Token expired or invalid"
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
}

export default authUser;