import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    photograph: {
        type: String, // URL or base64
        default: ''
    },
    referringDoctor: {
        name: { type: String, default: '' },
        clinic: { type: String, default: '' }
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
        required: [true, 'UHID is required'],
        unique: true,
        index: true
    },
    // alternateUhid removed
    patientName: {
        type: String,
        required: [true, 'Patient name is required'],
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
        index: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
        index: true
    },
    dateOfBirth: {
        type: String,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'Other']
    },
    bloodGroup: {
    type: String,
    required: false,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    occupation: {
        type: String
    },
    address: {
        line1: {
            type: String,
            required: [true, 'Address line 1 is required']
        },
        line2: String,
        city: {
            type: String,
            required: [true, 'City is required']
        },
        state: {
            type: String,
            required: [true, 'State is required']
        },
        zipCode: {
            type: String,
            required: [true, 'ZIP code is required'],
            match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit ZIP code']
        }
    },
    medicalInfo: {
        height: {
            type: Number,
            min: [0, 'Height cannot be negative'],
            max: [300, 'Height cannot exceed 300 cm']
        },
        weight: {
            type: Number,
            min: [0, 'Weight cannot be negative'],
            max: [500, 'Weight cannot exceed 500 kg']
        },
        allergies: String,
        chronicConditions: String,
        currentMedications: String,
        emergencyContact: {
            name: {
                type: String,
                required: [true, 'Emergency contact name is required']
            },
            phone: {
                type: String,
                required: [true, 'Emergency contact phone is required'],
                match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
            },
            relationship: String
        }
    },
    insuranceStatus: {
        type: String,
        enum: ['Insured', 'Not Insured', 'Pending'],
        default: 'Not Insured'
    },
    organDonorStatus: {
        type: String,
        enum: ['Yes', 'No'],
        default: 'No'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound indexes for common search patterns
patientSchema.index({ patientName: 1, email: 1 });
patientSchema.index({ patientName: 1, phone: 1 });
patientSchema.index({ email: 1, phone: 1 });

// Add text index for full-text search capabilities
patientSchema.index({ 
    patientName: 'text',
    email: 'text',
    phone: 'text',
    uhid: 'text'
}, {
    weights: {
        patientName: 10,
        email: 5,
        phone: 5,
        uhid: 8
    },
    name: "PatientSearchIndex"
});

const patientModel = mongoose.model('Patient', patientSchema);

export default patientModel; 