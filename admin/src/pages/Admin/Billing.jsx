import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { FaMoneyBillWave, FaUsers } from 'react-icons/fa';
import logoSvg from '../../../../lOGOSmaart.svg';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/30">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Billing Management</h1>
              <p className="mt-1 text-sm text-gray-500">Create and manage patient invoices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Previous Invoices Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FaMoneyBillWave className="mr-3 text-blue-600" />
              Search Previous Invoices
            </h2>
          </div>
          <div className="p-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by patient name, invoice number, or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 max-h-64 overflow-y-auto">
              {searchTerm.trim() ? (
                allBills.filter(bill => {
                  const term = searchTerm.toLowerCase();
                  return (
                    bill.patientName?.toLowerCase().includes(term) ||
                    String(bill.invoiceNo).includes(term) ||
                    bill.email?.toLowerCase().includes(term)
                  );
                }).length > 0 ? (
                  <div className="space-y-3">
                    {allBills.filter(bill => {
                      const term = searchTerm.toLowerCase();
                      return (
                        bill.patientName?.toLowerCase().includes(term) ||
                        String(bill.invoiceNo).includes(term) ||
                        bill.email?.toLowerCase().includes(term)
                      );
                    }).map(bill => (
                      <div key={bill._id} className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FaMoneyBillWave className="text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{bill.patientName}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Invoice #{bill.invoiceNo}</span>
                                <span>{bill.email}</span>
                                <span>{new Date(bill.date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          onClick={() => { setSelectedInvoice(bill); setShowPrint(false); }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                          <span>Print</span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No invoices found matching your search.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Start typing to search previous invoices...</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Selection */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaUsers className="mr-3 text-green-600" />
                Select Patient
              </h3>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search patient by name or email..."
                  value={patientSearch}
                  onChange={e => setPatientSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUsers className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading patients...</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {patients.filter(patient => {
                    const term = patientSearch.toLowerCase();
                    return (
                      patient.name?.toLowerCase().includes(term) ||
                      patient.email?.toLowerCase().includes(term)
                    );
                  }).length > 0 ? (
                    <div className="space-y-2">
                      {patients.filter(patient => {
                        const term = patientSearch.toLowerCase();
                        return (
                          patient.name?.toLowerCase().includes(term) ||
                          patient.email?.toLowerCase().includes(term)
                        );
                      }).map((patient) => (
                        <button
                          key={patient._id}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                            selectedPatient && selectedPatient._id === patient._id 
                              ? 'bg-green-50 border-green-500 ring-2 ring-green-200' 
                              : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                          }`}
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <FaUsers className="text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{patient.name}</p>
                              <p className="text-sm text-gray-500 truncate">{patient.email}</p>
                            </div>
                            {selectedPatient && selectedPatient._id === patient._id && (
                              <div className="text-green-600">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FaUsers className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">No patients found matching your search.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bill Form */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaMoneyBillWave className="mr-3 text-blue-600" />
                Bill Details
              </h3>
            </div>
            <div className="p-6">
              {selectedPatient ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
                      <input type="text" value={selectedPatient.name} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input type="text" name="address" value={bill.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input type="text" name="phone" value={bill.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input type="email" name="email" value={bill.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input type="date" name="date" value={bill.date} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice No.</label>
                      <input type="text" name="invoiceNo" value={bill.invoiceNo} disabled className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Line Items</label>
                    <div className="space-y-3">
                      {bill.lineItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <input 
                            type="text" 
                            placeholder="Description" 
                            value={item.description} 
                            onChange={e => handleLineItemChange(idx, 'description', e.target.value)} 
                            required 
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          />
                          <input 
                            type="number" 
                            min="1" 
                            placeholder="Qty" 
                            value={item.qty} 
                            onChange={e => handleLineItemChange(idx, 'qty', e.target.value)} 
                            required 
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          />
                          <input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="Unit Price" 
                            value={item.unitPrice} 
                            onChange={e => handleLineItemChange(idx, 'unitPrice', e.target.value)} 
                            required 
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                          />
                          <span className="w-24 text-right font-semibold text-blue-600">₹{(item.qty * item.unitPrice).toFixed(2)}</span>
                          {bill.lineItems.length > 1 && (
                            <button 
                              type="button" 
                              className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors" 
                              onClick={() => removeLineItem(idx)}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button" 
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors flex items-center space-x-2" 
                      onClick={addLineItem}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Add Item</span>
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Remarks / Payment Instructions</label>
                    <textarea 
                      name="remarks" 
                      value={bill.remarks} 
                      onChange={handleChange} 
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      placeholder="Enter any additional notes or payment instructions..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
                      <input 
                        type="number" 
                        name="discount" 
                        value={bill.discount} 
                        onChange={handleChange} 
                        min="0" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax (₹)</label>
                      <input 
                        type="number" 
                        name="tax" 
                        value={bill.tax} 
                        onChange={handleChange} 
                        min="0" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shipping/Handling (₹)</label>
                      <input 
                        type="number" 
                        name="shipping" 
                        value={bill.shipping} 
                        onChange={handleChange} 
                        min="0" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
                    >
                      <FaMoneyBillWave />
                      <span>Generate Bill</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Patient Selected</h3>
                  <p className="text-gray-500">Please select a patient from the list to generate a bill.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Print View */}
        {(showPrint || selectedInvoice) && (
          <div className="mt-8">
            <div id="invoice-print" className="p-6 border rounded-lg bg-white shadow print:shadow-none print:border-none print:p-0 print:block print:relative">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
