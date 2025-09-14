export const scheduleAppointmentWithDoctor = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { doctor, date, time } = req.body;
        if (!doctor || !date || !time) {
            return res.status(400).json({ success: false, message: 'Doctor, date, and time are required.' });
        }
        // Find doctor by name
        const doctorDoc = await doctorModel.findOne({ name: doctor });
        if (!doctorDoc) {
            return res.status(404).json({ success: false, message: 'Doctor not found.' });
        }
        // Update appointment with doctor info
    const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            {
                $set: {
                    docId: doctorDoc._id,
                    docData: {
                        name: doctorDoc.name,
                        speciality: doctorDoc.speciality,
                        image: doctorDoc.image
                    },
                    slotDate: date,
                    slotTime: time,
                    isCompleted: false // not completed yet, just scheduled
                }
            },
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found.' });
        }
        res.json({ success: true, appointment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import patientModel from "../models/patientModel.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import clinicalRecordModel from "../models/clinicalRecordModel.js";
import Admin from "../models/adminModel.js";
import mongoose from "mongoose";

// Initialize admin if not exists
const initializeAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!adminExists) {
            // Hash password before saving
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
            const admin = new Admin({
                _id: new mongoose.Types.ObjectId(),
                name: 'System Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin'
            });
            await admin.save();
            console.log('Admin account initialized');
        }
    } catch (error) {
        console.error('Error initializing admin:', error);
    }
};

// Call initialization
initializeAdmin();

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin in database
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        // Check password
        if (password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { 
                    id: admin._id,
                    isAdmin: true,
                    email: admin.email
                }, 
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRE || '30d'
                }
            );

            // Update last login
            admin.lastLogin = new Date();
            await admin.save();

            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API to get all appointments list with detailed information
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
            .populate({
                path: 'docId',
                model: 'Doctor',
                select: 'name speciality image address'
            })
            .sort({ date: -1 })
            .lean();

        // Format appointments with comprehensive details for admin view
        const formattedAppointments = appointments.map(appointment => ({
            _id: appointment._id,
            userId: appointment.userId,
            docId: appointment.docId?._id,
            amount: appointment.amount || 0,
            slotTime: appointment.slotTime,
            slotDate: appointment.slotDate,
            date: appointment.date,
            createdAt: appointment.createdAt || appointment.date,
            cancelled: appointment.cancelled || false,
            payment: appointment.payment || false,
            isCompleted: appointment.isCompleted || false,
            docData: {
                name: appointment.docData?.name || appointment.docId?.name || 'Unknown Doctor',
                speciality: appointment.docData?.speciality || appointment.docId?.speciality || 'Unknown Speciality',
                image: appointment.docData?.image || appointment.docId?.image || 'https://ui-avatars.com/api/?name=Unknown+Doctor',
                address: appointment.docData?.address || appointment.docId?.address || 'SMAART Healthcare Center',
                location: appointment.docData?.location || 'SMAART Healthcare Center'
            },
            userData: {
                name: appointment.userData?.name || 'Unknown Patient',
                email: appointment.userData?.email || 'No email',
                phone: appointment.userData?.phone || 'No phone',
                message: appointment.userData?.message || appointment.message || ''
            }
        }));

        res.json({ success: true, appointments: formattedAppointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

    const { name, email, password, speciality, degree, experience, about, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
    if (!name || !email || !password || !speciality || !degree || !experience || !about || !address) {
            return res.json({ success: false, message: "Missing Details" })
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

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            // fees removed
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for adding Patient
const addPatient = async (req, res) => {
    try {
        const {
            uhid,
            alternateUhid,
            patientName,
            email,
            password,
            phone,
            dateOfBirth,
            gender,
            bloodGroup,
            occupation,
            address,
            medicalInfo,
            insuranceStatus,
            organDonorStatus
        } = req.body;

        // Validate required fields
        if (!uhid || !patientName || !email || !phone || !dateOfBirth || !gender || !bloodGroup || !address || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Check if patient with UHID or email already exists in patientModel
        const existingPatient = await patientModel.findOne({ 
            $or: [{ uhid }, { email }]
        });
        if (existingPatient) {
            return res.status(400).json({
                success: false,
                message: existingPatient.uhid === uhid 
                    ? 'Patient with this UHID already exists'
                    : 'Patient with this email already exists'
            });
        }

        // Check if user with this email already exists in userModel
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists'
            });
        }

        // Validate phone number format
        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format. Must be 10 digits.'
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user for login
        const user = new userModel({
            name: patientName,
            email,
            password: hashedPassword,
            phone,
            gender,
            dob: dateOfBirth,
        });
        await user.save();

        // Create new patient
        let photographUrl = '';
        if (req.file) {
            // If using local storage
            photographUrl = `/uploads/${req.file.filename}`;
            // If using cloudinary, upload and get URL here
        }
        const patient = new patientModel({
            uhid,
            alternateUhid,
            patientName,
            email,
            phone,
            dateOfBirth,
            gender,
            bloodGroup,
            occupation,
            address,
            medicalInfo: {
                ...medicalInfo,
                height: medicalInfo?.height ? Number(medicalInfo.height) : undefined,
                weight: medicalInfo?.weight ? Number(medicalInfo.weight) : undefined
            },
            insuranceStatus: insuranceStatus || 'Not Insured',
            organDonorStatus: organDonorStatus || 'No',
            photograph: photographUrl
        });

        await patient.save();

        res.status(201).json({
            success: true,
            message: 'Patient added successfully',
            patient
        });

    } catch (error) {
        console.error('Error in addPatient:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error adding patient',
            error: error.message
        });
    }
};

// Get all patients
const getAllPatients = catchAsyncErrors(async (req, res) => {
    try {
        // Get both regular users and patients
        const [users, patients] = await Promise.all([
            userModel.find({ role: 'user' }).select('-password'),
            patientModel.find()
        ]);

        // Combine the results
        const allPatients = [...users, ...patients];

        res.status(200).json({
            success: true,
            patients: allPatients
        });
    } catch (error) {
        console.error('Error in getAllPatients:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patients',
            error: error.message
        });
    }
});

// Get a single patient's details
const getPatientDetails = catchAsyncErrors(async (req, res) => {
    try {
        const { patientId } = req.params;
        
        // Try to find in userModel first
        let patient = await userModel.findById(patientId).select('-password');
        let source = 'user';
        
        // If not found in userModel, try patientModel
        if (!patient) {
            patient = await patientModel.findById(patientId);
            source = 'patient';
        }
        
        if (!patient) {
            return res.status(404).json({ 
                success: false, 
                message: 'Patient not found' 
            });
        }

        // Get appointments for this patient
        const appointments = await appointmentModel.find({ 
            $or: [
                { user: patientId },
                { patient: patientId }
            ]
        })
        .populate('doctor', 'name speciality')
        .sort({ date: -1 });

        // Get clinical records for this patient
        const clinicalRecords = await clinicalRecordModel.find({
            patient: patientId
        })
        .populate('doctor', 'name speciality')
        .sort({ createdAt: -1 });

        // Transform the data based on the source
        const transformedPatient = {
            _id: patient._id,
            patientName: source === 'user' ? patient.name : patient.patientName,
            name: source === 'user' ? patient.name : patient.patientName,
            email: patient.email,
            phone: patient.phone,
            gender: patient.gender,
            dateOfBirth: patient.dateOfBirth || patient.dob,
            bloodGroup: patient.bloodGroup,
            address: patient.address,
            uhid: source === 'patient' ? patient.uhid : undefined,
            medicalInfo: patient.medicalInfo || {},
            appointments: appointments || [],
            clinicalRecords: clinicalRecords || []
        };

        res.status(200).json({ 
            success: true, 
            patient: transformedPatient,
            source
        });
    } catch (error) {
        console.error('Error in getPatientDetails:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching patient details',
            error: error.message 
        });
    }
});

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    addPatient,
    getAllPatients,
    getPatientDetails
};