import Appointment from '../models/appointmentModel.js';
import Doctor from '../models/doctorModel.js';
import User from '../models/userModel.js';
import { catchAsyncErrors } from '../middleware/catchAsyncErrors.js';

// Book a new appointment
export const bookAppointment = catchAsyncErrors(async (req, res) => {
    const { doctorId, date, slot, symptoms } = req.body;
    const userId = req.user._id;

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Check if slot is available
    const existingAppointment = await Appointment.findOne({
        doctor: doctorId,
        date,
        slot,
        status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
        return res.status(400).json({ success: false, message: 'This slot is already booked' });
    }

    // Create new appointment
    const appointment = new Appointment({
        doctor: doctorId,
        user: userId,
        date,
        slot,
        symptoms,
    // fees removed
        status: 'pending'
    });

    await appointment.save();

    res.status(201).json({
        success: true,
        message: 'Appointment booked successfully',
        appointment
    });
});

// Get appointments based on user role
export const getAppointments = catchAsyncErrors(async (req, res) => {
    const userId = req.user._id;
    const userRole = req.user.role;
    let query = {};

    if (userRole === 'user') {
        query = { user: userId };
    } else if (userRole === 'doctor') {
        query = { doctor: userId };
    } else if (userRole === 'admin') {
        // Admin can see all appointments
    } else {
        return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const appointments = await Appointment.find(query)
    .populate('doctor', 'name speciality')
        .populate('user', 'name email phone')
        .sort({ date: -1, slot: 1 });

    res.json({
        success: true,
        appointments
    });
});

// Cancel appointment
export const cancelAppointment = catchAsyncErrors(async (req, res) => {
    const { appointmentId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify user has permission to cancel
    if (userRole === 'user' && appointment.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this appointment' });
    }

    if (appointment.status === 'completed') {
        return res.status(400).json({ success: false, message: 'Cannot cancel completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled successfully' });
});

// Update appointment status (doctor only)
export const updateAppointmentStatus = catchAsyncErrors(async (req, res) => {
    const { appointmentId } = req.params;
    const { status } = req.body;
    const doctorId = req.user._id;

    if (req.user.role !== 'doctor') {
        return res.status(403).json({ success: false, message: 'Only doctors can update appointment status' });
    }

    const appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: doctorId
    });

    if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({ 
        success: true, 
        message: 'Appointment status updated successfully', 
        appointment 
    });
}); 