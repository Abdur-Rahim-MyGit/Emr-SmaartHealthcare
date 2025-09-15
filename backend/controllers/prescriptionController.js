import prescriptionModel from '../models/prescriptionModel.js';
import Patient from '../models/Patient.js';
import userModel from '../models/userModel.js';

// Create or update prescription
const createPrescription = async (req, res) => {
    try {
        const { patientId, consultationType, clinicalNotes, investigations, medications, treatmentAdvice, followUpDate, status } = req.body;
        const doctorId = req.doctor._id;

        // Validate patient exists - check both Patient and userModel
        let patient = await Patient.findById(patientId);
        if (!patient) {
            patient = await userModel.findById(patientId);
        }
        if (!patient) {
            return res.json({ success: false, message: 'Patient not found' });
        }

        // Filter out empty medications
        const validMedications = medications ? medications.filter(med => med.name && med.name.trim() !== '') : [];

        const prescriptionData = {
            patientId,
            doctorId,
            consultationType,
            clinicalNotes,
            investigations,
            medications: validMedications,
            treatmentAdvice,
            followUpDate: followUpDate || null,
            status: status || 'Draft',
            consultationDate: new Date()
        };

        const prescription = new prescriptionModel(prescriptionData);
        await prescription.save();

        res.json({ success: true, message: 'Prescription saved successfully', prescription });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get prescriptions for a patient
const getPatientPrescriptions = async (req, res) => {
    try {
        const { patientId } = req.params;

        const prescriptions = await prescriptionModel.find({ patientId })
            .populate('doctorId', 'name speciality')
            .sort({ createdAt: -1 });

        res.json({ success: true, prescriptions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get doctor's prescriptions
const getDoctorPrescriptions = async (req, res) => {
    try {
        const doctorId = req.doctor._id;
        const { status, limit = 20 } = req.query;

        let query = { doctorId };
        if (status) {
            query.status = status;
        }

        const prescriptions = await prescriptionModel.find(query)
            .populate('patientId', 'name uhid age gender')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json({ success: true, prescriptions });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update prescription
const updatePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const doctorId = req.doctor._id;
        const updateData = req.body;

        // Find prescription and verify doctor ownership
        const prescription = await prescriptionModel.findOne({ _id: prescriptionId, doctorId });
        if (!prescription) {
            return res.json({ success: false, message: 'Prescription not found or unauthorized' });
        }

        // Filter out empty medications
        if (updateData.medications) {
            updateData.medications = updateData.medications.filter(med => med.name && med.name.trim() !== '');
        }

        const updatedPrescription = await prescriptionModel.findByIdAndUpdate(
            prescriptionId,
            updateData,
            { new: true }
        ).populate('patientId', 'name uhid age gender');

        res.json({ success: true, message: 'Prescription updated successfully', prescription: updatedPrescription });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get scheduled patients for doctor
const getScheduledPatients = async (req, res) => {
    try {
        const doctorId = req.doctor._id;
        const { date } = req.query;

        // For now, return all patients as scheduled (you can modify this based on your appointment system)
        const patients = await Patient.find({})
            .select('name patientName uhid age gender bloodGroup appointmentTime')
            .limit(20);

        res.json({ success: true, patients });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get patient details for doctor
const getPatientDetails = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findById(patientId)
            .select('-password -__v');

        if (!patient) {
            return res.json({ success: false, message: 'Patient not found' });
        }

        res.json({ success: true, patient });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get patient vitals for doctor
const getPatientVitals = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { date } = req.query;

        // Import vitals model dynamically to avoid circular dependency
        const { default: vitalsModel } = await import('../models/vitalsModel.js');

        let query = { patientId };
        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.visitDate = { $gte: startDate, $lt: endDate };
        }

        const vitalsRecords = await vitalsModel.find(query)
            .sort({ visitDate: -1 })
            .limit(10);

        res.json({ success: true, vitalsRecords });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    createPrescription,
    getPatientPrescriptions,
    getDoctorPrescriptions,
    updatePrescription,
    getScheduledPatients,
    getPatientDetails,
    getPatientVitals
};
