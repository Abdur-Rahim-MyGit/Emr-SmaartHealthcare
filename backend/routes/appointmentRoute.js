import express from 'express';
import { bookAppointment, getAppointments, cancelAppointment, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { isAuthenticatedUser } from '../middleware/auth.js';

const appointmentRouter = express.Router();

// Book a new appointment
appointmentRouter.post('/book', isAuthenticatedUser, bookAppointment);

// Get appointments based on user role
appointmentRouter.get('/list', isAuthenticatedUser, getAppointments);

// Cancel an appointment
appointmentRouter.post('/cancel/:appointmentId', isAuthenticatedUser, cancelAppointment);

// Update appointment status (doctor only)
appointmentRouter.post('/update-status/:appointmentId', isAuthenticatedUser, updateAppointmentStatus);

export default appointmentRouter; 