import Appointment from '../models/appointmentModel.js';

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
    res.status(201).json({ success: true, appointment });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
