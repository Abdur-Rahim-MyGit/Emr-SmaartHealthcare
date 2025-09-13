import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    photograph: {
        type: String, // URL or base64
        default: ''
    },
    governmentId: {
        type: {
            type: String, // Aadhaar, Passport, etc.
            default: ''
        },
        number: {
            type: String,
            default: ''
        }
    },
    insuranceDetails: {
        provider: { type: String, default: '' },
        policyNumber: { type: String, default: '' },
        validity: { type: String, default: '' }
    },
    consent: {
        dataCollection: { type: Boolean, default: false },
        clinicalTreatment: { type: Boolean, default: false },
        teleconsultation: { type: Boolean, default: false },
        dataSharing: { type: Boolean, default: false }
    },
    uhid: {
        type: String,
        required: true,
        unique: true
    },
    alternateUhid: {
        type: String
    },
    patientName: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    occupation: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    insuranceStatus: {
        type: String,
        enum: ['Insured', 'Not Insured', 'Pending']
    },
    organDonorStatus: {
        type: String,
        enum: ['Yes', 'No']
    }
}, {
    timestamps: true
});

export default mongoose.model('Patient', patientSchema); 