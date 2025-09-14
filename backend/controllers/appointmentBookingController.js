import Appointment from '../models/appointmentModel.js';
import { sendAppointmentConfirmation } from '../utils/emailService.js';

export const createAppointment = async (req, res) => {
  try {
    // Accept public bookings with minimal info
    const {
      userData,
      docData,
      slotDate,
      slotTime,
      amount,
      message
    } = req.body;

    // Validate required public fields
    if (!userData || !userData.name || !userData.email || !slotDate || !docData || !docData.speciality) {
      return res.status(400).json({ success: false, message: 'Missing required fields for public booking.' });
    }

    // Create appointment with dummy userId/docId
    const appointment = new Appointment({
      userId: null,
      docId: null,
      userData,
      docData,
      amount: amount || 0,
      slotDate,
      slotTime: slotTime || '09:00',
      cancelled: false,
      payment: false,
      isCompleted: false,
      paymentDetails: null,
      message: message || ''
    });
    await appointment.save();

    // Send email confirmation
    try {
      const emailResult = await sendAppointmentConfirmation({
        userData,
        docData,
        slotDate,
        slotTime: slotTime || '09:00'
      });
      
      if (emailResult.success) {
        console.log('Appointment confirmation email sent successfully');
      } else {
        console.error('Failed to send email:', emailResult.error);
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Don't fail the appointment creation if email fails
    }

    res.status(201).json({ 
      success: true, 
      appointment,
      message: 'Appointment booked successfully! Confirmation email sent.' 
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
