import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: false
    },
    userData: {
        type: Object,
        required: true
    },
    docData: {
        type: Object,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    slotTime: {
        type: String,
        required: true
    },
    slotDate: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    payment: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    paymentDetails: {
        type: Object,
        default: null
    }
}, {
    timestamps: true
});

// Create indexes for faster queries
appointmentSchema.index({ userId: 1, date: -1 });
appointmentSchema.index({ docId: 1, date: -1 });
appointmentSchema.index({ cancelled: 1 });
appointmentSchema.index({ payment: 1 });
appointmentSchema.index({ isCompleted: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;