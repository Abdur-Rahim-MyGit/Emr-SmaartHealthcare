import Bill from '../models/billModel.js';
import Counter from '../models/counterModel.js';

// Create a new bill
export const createBill = async (req, res) => {
    try {
        const { patientId, patientName, lineItems, total, date, address, phone, email, remarks, discount = 0, tax = 0, shipping = 0 } = req.body;
        if (!patientId || !patientName || !Array.isArray(lineItems) || lineItems.length === 0 || !total || !date) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }
        for (const item of lineItems) {
            if (!item.description || !item.qty || !item.unitPrice) {
                return res.status(400).json({ success: false, message: 'Each line item must have description, qty, and unit price.' });
            }
        }
        // Get next invoice number
        let counter = await Counter.findOneAndUpdate(
            { name: 'invoice' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        const invoiceNo = counter.value;
        const bill = new Bill({
            patientId,
            patientName,
            lineItems,
            total,
            date,
            invoiceNo,
            address,
            phone,
            email,
            remarks,
            discount,
            tax,
            shipping
        });
        await bill.save();
        res.json({ success: true, bill });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all bills
export const getAllBills = async (req, res) => {
    try {
        const bills = await Bill.find().sort({ createdAt: -1 });
        res.json({ success: true, bills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
