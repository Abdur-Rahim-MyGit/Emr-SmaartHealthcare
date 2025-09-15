import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import Patient from '../models/Patient.js';
import userModel from "../models/userModel.js";
import clinicalRecordModel from "../models/clinicalRecordModel.js";

// API for doctor Login 
const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await doctorModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Helper function to format date string
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    // If already in ISO format (YYYY-MM-DD), return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    // If in DD_MM_YYYY format, convert to YYYY-MM-DD
    const parts = dateStr.split('_');
    if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    // Fallback: return original string
    return dateStr;
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.doctor._id;
        const appointments = await appointmentModel.find({ docId })
            .populate('userId', 'name email phone')
            .sort({ date: -1 });

        // Transform appointments to match frontend expectations
            const transformedAppointments = appointments.map(app => ({
                _id: app._id,
                patientName:
                    app.userId && app.userId.name
                        ? app.userId.name
                        : (app.userData && app.userData.name ? app.userData.name : 'Unknown'),
                patientEmail:
                    app.userId && app.userId.email
                        ? app.userId.email
                        : (app.userData && app.userData.email ? app.userData.email : ''),
                date: formatDate(app.slotDate),
                time: app.slotTime,
                status: app.cancelled ? 'cancelled' : app.isCompleted ? 'completed' : 'pending',
                amount: app.amount,
                payment: app.payment,
                docData: {
                    name: req.doctor.name,
                    speciality: req.doctor.speciality,
                    image: req.doctor.image,
                    address: req.doctor.address
                }
            }));

        res.json({ success: true, appointments: transformedAppointments });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get doctor's patients (matching admin panel)
const getPatients = async (req, res) => {
    try {
        // Get both regular users and patients (matching admin implementation)
        const [users, patients] = await Promise.all([
            userModel.find({ role: 'user' }).select('-password'),
            Patient.find()
        ]);

        // Combine the results
        const allPatients = [...users, ...patients];

        res.status(200).json({
            success: true,
            patients: allPatients
        });
    } catch (error) {
        console.error('Error in getPatients:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching patients',
            error: error.message
        });
    }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.doctor._id;

        const appointment = await appointmentModel.findOne({ _id: appointmentId, docId });
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        res.json({ success: true, message: "Appointment cancelled successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to complete appointment for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const docId = req.doctor._id; // Get doctor ID from auth middleware

        const appointment = await appointmentModel.findOne({ _id: appointmentId, docId });
        if (!appointment) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { 
            status: 'completed',
            isCompleted: true
        });
        res.json({ success: true, message: "Appointment marked as completed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })
    } catch (error) {
        console.error('Error in doctorList:', error)
        res.json({ success: false, message: error.message })
    }
}

// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: 'Availablity Changed' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to change availability', error: error.message })
    }
}

// API to get doctor dashboard data
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.doctor._id;
        // Get all appointments for this doctor
        const appointments = await appointmentModel.find({ docId })
            .populate('userId', 'name email phone')
            .sort({ date: -1 });

        // Debug log appointments
        console.log('Doctor Dashboard Appointments:', appointments);

        // Calculate today's date range (midnight to midnight)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Calculate statistics with robust error handling
        const todayAppointments = appointments.filter(app => {
            if (!app.slotDate) return false;
            let appDate;
            try {
                appDate = new Date(formatDate(app.slotDate));
                if (isNaN(appDate.getTime())) {
                    // Try fallback: if slotDate is already ISO
                    appDate = new Date(app.slotDate);
                }
            } catch (err) {
                console.log('Error parsing slotDate:', app.slotDate, err);
                return false;
            }
            return appDate >= today && appDate < tomorrow;
        });

        const pendingAppointments = appointments.filter(app => !app.cancelled && !app.isCompleted);

        // Get unique patients safely
        const uniquePatients = [...new Set(appointments.map(app => app.userId && app.userId._id ? app.userId._id.toString() : null).filter(Boolean))];

        // Transform recent appointments safely
        const recentAppointments = appointments
            .filter(app => !app.cancelled)
            .slice(0, 5)
            .map(app => ({
                _id: app._id,
                patientName:
                    app.userId && app.userId.name
                        ? app.userId.name
                        : (app.userData && app.userData.name ? app.userData.name : 'Unknown'),
                date: app.slotDate ? formatDate(app.slotDate) : '',
                time: app.slotTime || '',
                status: app.isCompleted ? 'completed' : 'pending'
            }));

        const dashData = {
            totalPatients: uniquePatients.length,
            todayAppointments: todayAppointments.length,
            pendingAppointments: pendingAppointments.length,
            totalAppointments: appointments.length,
            recentAppointments
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log('Doctor Dashboard Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard data', error: error.message });
    }
}

// API to get doctor profile
const doctorProfile = async (req, res) => {
    try {
        const docId = req.doctor._id; // Get doctor ID from auth middleware
        const doctor = await doctorModel.findById(docId).select('-password');
        
        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, profileData: doctor });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.doctor._id; // Get doctor ID from auth middleware
        const updates = req.body;

        const doctor = await doctorModel.findByIdAndUpdate(
            docId,
            { $set: updates },
            { new: true }
        ).select('-password');

        if (!doctor) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        res.json({ success: true, profileData: doctor });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailablity,
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
    getPatients
}