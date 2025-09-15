import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    phone: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
    },
    referringDoctor: {
        name: { type: String, default: '' },
        clinic: { type: String, default: '' }
    },
    emergencyContact: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        relationship: { type: String, required: true }
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
        line1: { type: String, required: true },
        line2: { type: String, default: '' },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
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

// Hash password before saving
patientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
patientSchema.methods.comparePassword = async function(candidatePassword) {
    if (!candidatePassword || !this.password) {
        console.log('Password comparison failed: missing password data');
        console.log('candidatePassword:', !!candidatePassword);
        console.log('this.password:', !!this.password);
        return false;
    }
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Patient', patientSchema);