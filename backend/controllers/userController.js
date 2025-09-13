import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import clinicalRecordModel from "../models/clinicalRecordModel.js";
import patientModel from "../models/patientModel.js";

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password, role = 'patient' } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
            role
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Return user data (excluding password)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            phone: user.phone,
            address: user.address
        };

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userData
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        // Get user from request (set by auth middleware)
        const user = req.user;
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Format user data for response
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            phone: user.phone,
            address: user.address,
            gender: user.gender,
            dob: user.dob
        };

        res.json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {
        const { name, phone, address, profilePicture } = req.body;
        const updateData = {};

        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (profilePicture) updateData.profilePicture = profilePicture;

        const user = await userModel.findByIdAndUpdate(
            req.user.id,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            // fees removed
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to list user appointments
const listAppointment = async (req, res) => {
    try {
        const userId = req.user?._id || req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID not found'
            });
        }

        // Find all appointments for the user
        const appointments = await appointmentModel.find({ userId })
            .sort({ date: -1 }) // Sort by date in descending order
            .populate({
                path: 'docId',
                model: 'Doctor',
                select: 'name speciality image address'
            })
            .lean();

        if (!appointments) {
            return res.status(404).json({
                success: false,
                message: 'No appointments found'
            });
        }

        // Format the appointments data
        const formattedAppointments = appointments.map(appointment => ({
            _id: appointment._id,
            userId: appointment.userId,
            docId: appointment.docId?._id,
            amount: appointment.amount,
            slotTime: appointment.slotTime,
            slotDate: appointment.slotDate,
            date: appointment.date,
            cancelled: appointment.cancelled,
            payment: appointment.payment,
            isCompleted: appointment.isCompleted,
            docData: {
                name: appointment.docId?.name || 'Unknown Doctor',
                speciality: appointment.docId?.speciality || 'Unknown Speciality',
                image: appointment.docId?.image || 'https://ui-avatars.com/api/?name=Unknown+Doctor',
                address: appointment.docId?.address || 'No address available'
            }
        }));

        res.json({
            success: true,
            appointments: formattedAppointments
        });

    } catch (error) {
        console.error('Error listing appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// API to get user's medical records
const getMedicalRecords = async (req, res) => {
    try {
        // Get the logged-in user's email
        const userId = req.user?.id || req.userId || req.body.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        // Find the user by ID to get the email
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Find the patient by email
        const patient = await patientModel.findOne({ email: user.email });
        if (!patient) {
            return res.json({ success: true, records: [] });
        }
        // Fetch clinical records using the patient _id
        const records = await clinicalRecordModel.find({ patient: patient._id })
            .populate('consultedDoctor', 'name')
            .sort({ encounterDate: -1 });
        res.json({ success: true, records });
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch medical records', error: error.message });
    }
};

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    getMedicalRecords
}