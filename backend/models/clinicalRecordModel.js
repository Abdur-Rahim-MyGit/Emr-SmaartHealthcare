import mongoose from 'mongoose';

const clinicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'patientModel'
    },
    patientModel: {
        type: String,
        required: true,
        enum: ['User', 'Patient'],
        default: 'User'
    },
    consultedDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    encounterType: {
        type: String,
        required: true,
        enum: ['Initial Visit', 'Follow-up', 'Emergency', 'Routine Checkup', 'Specialist Consultation']
    },
    encounterDate: {
        type: Date,
        required: true
    },
    reasonForVisit: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    treatment: {
        type: String,
        required: true
    },
    prescription: [{
        medicine: String,
        dosage: String,
        frequency: String,
        duration: String,
        notes: String
    }],
    labTests: [{
        testName: String,
        result: String,
        date: Date,
        notes: String
    }],
    vitalSigns: {
        bloodPressure: String,
        heartRate: String,
        temperature: String,
        respiratoryRate: String,
        oxygenSaturation: String
    },
    currentClinicalStatus: {
        type: String,
        required: true,
        enum: ['Stable', 'Critical', 'Improving', 'Deteriorating', 'Resolved']
    },
    followUpDate: Date,
    notes: String,
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'creatorModel',
        required: true
    },
    creatorModel: {
        type: String,
        required: true,
        enum: ['Admin', 'Doctor'],
        default: 'Doctor'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
clinicalRecordSchema.index({ patient: 1, encounterDate: -1 });
clinicalRecordSchema.index({ consultedDoctor: 1, encounterDate: -1 });

// Check if the model exists before compiling it
const ClinicalRecord = mongoose.models.ClinicalRecord || mongoose.model('ClinicalRecord', clinicalRecordSchema);

export default ClinicalRecord; 