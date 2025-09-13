import mongoose from 'mongoose';

const clinicalInfoSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    encounterDate: {
        type: Date,
        required: true
    },
    encounterType: {
        type: String,
        required: true,
        enum: ['Initial Visit', 'Follow-up', 'Emergency', 'Routine Checkup', 'Specialist Consultation']
    },
    vitalSigns: {
        bloodPressure: {
            systolic: Number,
            diastolic: Number
        },
        temperature: Number,
        pulseRate: Number,
        respiratoryRate: Number,
        height: Number,
        weight: Number,
        bmi: Number
    },
    chiefComplaint: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    symptoms: [{
        type: String
    }],
    clinicalFindings: {
        type: String
    },
    treatmentPlan: {
        type: String,
        required: true
    },
    prescription: [{
        medication: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String
    }],
    labTests: [{
        testName: String,
        result: String,
        date: Date,
        normalRange: String,
        interpretation: String
    }],
    allergies: [{
        allergen: String,
        reaction: String,
        severity: {
            type: String,
            enum: ['Mild', 'Moderate', 'Severe']
        }
    }],
    immunizations: [{
        vaccine: String,
        date: Date,
        dueDate: Date,
        batchNumber: String
    }],
    followUpDate: Date,
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'doctor',
        required: true
    },
    doctorNotes: String,
    status: {
        type: String,
        enum: ['Active', 'Completed', 'Cancelled'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const ClinicalInfo = mongoose.models.clinicalInfo || mongoose.model('clinicalInfo', clinicalInfoSchema);
export default ClinicalInfo; 