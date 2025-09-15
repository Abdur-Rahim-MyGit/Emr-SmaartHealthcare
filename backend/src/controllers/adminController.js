// Activate Appointment
const activateAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID is required'
            });
        }

        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        appointment.cancelled = false;
        await appointment.save();

        res.status(200).json({
            success: true,
            message: 'Appointment activated successfully'
        });
    } catch (error) {
        console.error('Error in activateAppointment:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    activateAppointment,
}; 