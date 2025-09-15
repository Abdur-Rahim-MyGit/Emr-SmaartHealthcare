import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    consultationType: {
        type: String,
        enum: ['In-person', 'Teleconsultation'],
        default: 'In-person'
    },
    consultationDate: {
        type: Date,
        default: Date.now
    },
    clinicalNotes: {
        type: String,
        trim: true
    },
    investigations: {
        type: String,
        trim: true
    },
    medications: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        dosage: {
            type: String,
            trim: true
        },
        quantity: {
            type: String,
            trim: true
        },
        frequency: {
            type: String,
            trim: true
        },
        duration: {
            type: String,
            trim: true
        }
    }],
    treatmentAdvice: {
        type: String,
        trim: true
    },
    followUpDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Draft', 'Finalized'],
        default: 'Draft'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update the updatedAt field on save
prescriptionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const prescriptionModel = mongoose.model('Prescription', prescriptionSchema);

export default prescriptionModel;
