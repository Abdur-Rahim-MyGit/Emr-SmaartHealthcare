import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import logoSvg from '../../assets/lOGOSmaart.svg';

const Billing = () => {
  const [patientSearch, setPatientSearch] = useState('');
  const { getAllBills } = useContext(AdminContext);
  const [allBills, setAllBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const { getAllPatients, patients, createBill } = useContext(AdminContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bill, setBill] = useState({
    lineItems: [{ description: '', qty: 1, unitPrice: 0 }],
    date: '',
    patientId: '',
    patientName: '',
    address: '',
    phone: '',
    email: '',
    remarks: '',
    discount: 0,
    tax: 0,
    shipping: 0,
    invoiceNo: '' // Add invoiceNo to initial state
  });
  const [showPrint, setShowPrint] = useState(false);

  // Load all bills for search/history
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const bills = await getAllBills();
        setAllBills(bills);
      } catch (err) {}
    };
    fetchBills();
  }, []);

  // Load patients
  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      await getAllPatients();
      setLoading(false);
    };
    loadPatients();
  }, []);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setBill({
      ...bill,
      patientId: patient._id,
      patientName: patient.name,
      address: patient.address || '',
      phone: patient.phone || '',
      email: patient.email || '',
      date: new Date().toISOString().slice(0, 10)
    });
    setShowPrint(false);
  };

  const handleChange = (e) => {
    setBill({ ...bill, [e.target.name]: e.target.value });
  };

  const handleLineItemChange = (idx, field, value) => {
    const newItems = bill.lineItems.map((item, i) =>
      i === idx ? { ...item, [field]: field === 'qty' || field === 'unitPrice' ? Number(value) : value } : item
    );
    setBill({ ...bill, lineItems: newItems });
  };

  const addLineItem = () => {
    setBill({ ...bill, lineItems: [...bill.lineItems, { description: '', qty: 1, unitPrice: 0 }] });
  };

  const removeLineItem = (idx) => {
    setBill({ ...bill, lineItems: bill.lineItems.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Calculate total
      const total = bill.lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
      const savedBill = await createBill({ ...bill, total });
      // Update bill state with invoiceNo from backend
      setBill(prev => ({ ...prev, invoiceNo: savedBill.invoiceNo }));
      setShowPrint(true);
    } catch (error) {
      toast.error('Failed to save bill');
    }
  };

  return (
    
    <div className="p-8 bg-gray-50 min-h-screen flex flex-col gap-8">
      {/* Professional Invoice Search Section - Full Width */}
      <h2 className="text-3xl font-extrabold mb-8 text-primary drop-shadow">Billing</h2>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 w-full flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Search Previous Invoices</h3>
        <input
          type="text"
          placeholder="Search by patient name, invoice number, or email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="max-h-56 overflow-y-auto">
          {searchTerm.trim() ? (
            allBills.filter(bill => {
              const term = searchTerm.toLowerCase();
              return (
                bill.patientName?.toLowerCase().includes(term) ||
                String(bill.invoiceNo).includes(term) ||
                bill.email?.toLowerCase().includes(term)
              );
            }).length > 0 ? (
              allBills.filter(bill => {
                const term = searchTerm.toLowerCase();
                return (
                  bill.patientName?.toLowerCase().includes(term) ||
                  String(bill.invoiceNo).includes(term) ||
                  bill.email?.toLowerCase().includes(term)
                );
              }).map(bill => (
                <div key={bill._id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-2 border border-gray-100">
                  <div>
                    <span className="font-medium text-base text-gray-900">{bill.patientName}</span>
                    <span className="ml-2 text-xs text-gray-500">Invoice #{bill.invoiceNo}</span>
                    <span className="ml-2 text-xs text-gray-500">{bill.email}</span>
                  </div>
                  <button
                    className="bg-primary text-white px-4 py-1 rounded-lg font-semibold shadow hover:bg-primary/90"
                    onClick={() => { setSelectedInvoice(bill); setShowPrint(false); }}
                  >Print</button>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No invoices found.</div>
            )
          ) : (
            <div className="text-gray-400 text-center py-4">Type to search invoices...</div>
          )}
        </div>
      </div>
      {/* <h2 className="text-3xl font-extrabold mb-8 text-primary drop-shadow">Billing</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Patient List with Search */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-primary mb-2">Search & Select Patient</h3>
          <input
            type="text"
            placeholder="Search patient by name or email..."
            value={patientSearch}
            onChange={e => setPatientSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-xl mb-2"
          />
          {loading ? (
            <p>Loading patients...</p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-y-auto">
              {patients.filter(patient => {
                const term = patientSearch.toLowerCase();
                return (
                  patient.name?.toLowerCase().includes(term) ||
                  patient.email?.toLowerCase().includes(term)
                );
              }).length > 0 ? (
                patients.filter(patient => {
                  const term = patientSearch.toLowerCase();
                  return (
                    patient.name?.toLowerCase().includes(term) ||
                    patient.email?.toLowerCase().includes(term)
                  );
                }).map((patient) => (
                  <li key={patient._id}>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 ${selectedPatient && selectedPatient._id === patient._id ? 'bg-primary/10 border-primary ring-2 ring-primary' : 'bg-white border-gray-300'} hover:bg-primary/5 focus:outline-none`}
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <span className="font-semibold text-lg text-gray-800">{patient.name}</span> <span className="text-xs text-gray-500">({patient.email})</span>
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center py-4">No patients found.</li>
              )}
            </ul>
          )}
        </div>

        {/* Bill Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 col-span-2 flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-primary mb-2">Bill Details</h3>
          {selectedPatient ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Name</label>
                  <input type="text" value={selectedPatient.name} disabled className="w-full px-3 py-2 border rounded-xl bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input type="text" name="address" value={bill.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="text" name="phone" value={bill.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" name="email" value={bill.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" name="date" value={bill.date} onChange={handleChange} required className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice No.</label>
                  <input type="text" name="invoiceNo" value={bill.invoiceNo} disabled className="w-full px-3 py-2 border rounded-xl bg-gray-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Line Items</label>
                <div className="space-y-2">
                  {bill.lineItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-gray-50 rounded-xl p-2 border border-gray-200">
                      <input type="text" placeholder="Description" value={item.description} onChange={e => handleLineItemChange(idx, 'description', e.target.value)} required className="flex-1 px-2 py-1 border rounded-xl" />
                      <input type="number" min="1" placeholder="Qty" value={item.qty} onChange={e => handleLineItemChange(idx, 'qty', e.target.value)} required className="w-16 px-2 py-1 border rounded-xl" />
                      <input type="number" min="0" step="0.01" placeholder="Unit Price" value={item.unitPrice} onChange={e => handleLineItemChange(idx, 'unitPrice', e.target.value)} required className="w-24 px-2 py-1 border rounded-xl" />
                      <span className="w-20 text-right font-semibold text-primary">₹{(item.qty * item.unitPrice).toFixed(2)}</span>
                      {bill.lineItems.length > 1 && (
                        <button type="button" className="text-red-500 font-bold px-2 py-1 rounded hover:bg-red-50" onClick={() => removeLineItem(idx)}>Remove</button>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="text-blue-600 mt-2 font-semibold px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100" onClick={addLineItem}>+ Add Item</button>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Remarks / Payment Instructions</label>
                <textarea name="remarks" value={bill.remarks} onChange={handleChange} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Discount</label>
                  <input type="number" name="discount" value={bill.discount} onChange={handleChange} min="0" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tax</label>
                  <input type="number" name="tax" value={bill.tax} onChange={handleChange} min="0" className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Shipping/Handling</label>
                  <input type="number" name="shipping" value={bill.shipping} onChange={handleChange} min="0" className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold shadow hover:bg-primary/90 transition-all">Generate Bill</button>
            </form>
          ) : (
            <div className="text-center py-12 text-gray-500 text-lg">Select a patient to generate a bill.</div>
          )}

          {/* Print View */}
          {(showPrint || selectedInvoice) && (
            <div id="invoice-print" className="mt-8 p-6 border rounded-lg bg-white shadow print:shadow-none print:border-none print:p-0 print:block print:relative">
              {/* Print-only styles: hide everything except this container */}
              <style>{`
                @media print {
                  body * { visibility: hidden !important; }
                  #invoice-print, #invoice-print * { visibility: visible !important; }
                  #invoice-print { position: absolute; left: 0; top: 0; width: 100vw; background: #fff; z-index: 9999; }
                }
              `}</style>
              <div className="flex items-center mb-4" style={{ borderBottom: '2px solid #eee', paddingBottom: '1rem' }}>
                <div className="flex items-center" style={{ minWidth: 180 }}>
                  <img src={logoSvg} alt="Logo" style={{ width: 80, height: 80, marginRight: 16 }} />
                  <div>
                    <h2 className="text-2xl font-bold">SMAART Healthcare</h2>
                    <p style={{ fontSize: '0.95rem', marginTop: 2 }}>123-124, Nungambakkam High Rd, Thousand Lights West, Thousand Lights, Chennai, Tamil Nadu 600034</p>
                    <p style={{ fontSize: '0.95rem' }}>Contact: info@smaarthealth.com</p>
                    <p style={{ fontSize: '0.95rem' }}>Mobile: 89259 55711</p>
                  </div>
                </div>
                <div className="ml-auto text-right" style={{ minWidth: 180 }}>
                  <h3 className="text-xl font-bold">INVOICE</h3>
                  <p>Date: {(selectedInvoice ? selectedInvoice.date : bill.date)}</p>
                  <p>Invoice No: <span style={{ fontWeight: 600 }}>{(selectedInvoice ? selectedInvoice.invoiceNo : bill.invoiceNo) || '-'}</span></p>
                </div>
              </div>
              <div className="flex gap-8 mb-4">
                <div>
                  <h4 className="font-semibold">Bill To</h4>
                  <p>{selectedInvoice ? selectedInvoice.patientName : bill.patientName}</p>
                  <p>{selectedInvoice ? selectedInvoice.address : bill.address}</p>
                  <p>{selectedInvoice ? selectedInvoice.phone : bill.phone}</p>
                  <p>{selectedInvoice ? selectedInvoice.email : bill.email}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Ship To</h4>
                  <p>{selectedInvoice ? selectedInvoice.patientName : bill.patientName}</p>
                  <p>{selectedInvoice ? selectedInvoice.address : bill.address}</p>
                  <p>{selectedInvoice ? selectedInvoice.phone : bill.phone}</p>
                  <p>{selectedInvoice ? selectedInvoice.email : bill.email}</p>
                </div>
              </div>
              <table className="w-full border mb-4">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Qty</th>
                    <th className="p-2 border">Unit Price (₹)</th>
                    <th className="p-2 border">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedInvoice ? selectedInvoice.lineItems : bill.lineItems).map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2 border">{item.description}</td>
                      <td className="p-2 border text-center">{item.qty}</td>
                      <td className="p-2 border text-right">₹{item.unitPrice.toFixed(2)}</td>
                      <td className="p-2 border text-right">₹{(item.qty * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex flex-col items-end gap-2">
                <div>Subtotal: <strong>₹{(selectedInvoice ? selectedInvoice.lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0) : bill.lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)).toFixed(2)}</strong></div>
                <div>Discount: <strong>₹{Number(selectedInvoice ? selectedInvoice.discount : bill.discount).toFixed(2)}</strong></div>
                <div>Total Tax: <strong>₹{Number(selectedInvoice ? selectedInvoice.tax : bill.tax).toFixed(2)}</strong></div>
                <div>Shipping/Handling: <strong>₹{Number(selectedInvoice ? selectedInvoice.shipping : bill.shipping).toFixed(2)}</strong></div>
                <div className="text-xl font-bold">Balance Due: <span className="text-green-700">₹{(
                  (selectedInvoice ? selectedInvoice.lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0) : bill.lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0))
                  - Number(selectedInvoice ? selectedInvoice.discount : bill.discount)
                  + Number(selectedInvoice ? selectedInvoice.tax : bill.tax)
                  + Number(selectedInvoice ? selectedInvoice.shipping : bill.shipping)
                ).toFixed(2)}</span></div>
              </div>
              <div className="mt-4 text-sm text-gray-700">{bill.remarks}</div>
              <div className="mt-4 text-sm text-gray-700">{selectedInvoice ? selectedInvoice.remarks : bill.remarks}</div>
              <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg print:hidden" onClick={() => window.print()}>{selectedInvoice ? 'Print Invoice' : 'Print Bill'}</button>
              {selectedInvoice && (
                <button className="mt-2 ml-2 text-blue-600 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 print:hidden" onClick={() => setSelectedInvoice(null)}>Back to Search</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
