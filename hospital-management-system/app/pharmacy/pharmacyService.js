export const getInventory = async () => {
  const response = await fetch('/api/pharmacy/inventory');
  if (!response.ok) throw new Error('Failed to fetch inventory');
  return await response.json();
};

export const addMedication = async (data) => {
  const response = await fetch('/api/pharmacy/medications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add medication');
  return await response.json();
};

export const updateStock = async (id, stockQuantity) => {
  const response = await fetch(`/api/pharmacy/medications/${id}/stock`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stockQuantity }),
  });
  if (!response.ok) throw new Error('Failed to update stock');
  return await response.json();
};

export const deleteMedication = async (id) => {
  const response = await fetch(`/api/pharmacy/medications/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete medication');
  return await response.json();
};

export const getPrescriptions = async () => {
  const response = await fetch('/api/pharmacy/prescriptions');
  if (!response.ok) throw new Error('Failed to fetch prescriptions');
  return await response.json();
};

export const createPrescription = async (data) => {
  const response = await fetch('/api/pharmacy/prescriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create prescription');
  return await response.json();
};

export const updatePrescriptionStatus = async (id, status) => {
  const response = await fetch(`/api/pharmacy/prescriptions/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update prescription status');
  return await response.json();
};

export const getOrders = async () => {
  const response = await fetch('/api/pharmacy/orders');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return await response.json();
};

export const createOrder = async (data) => {
  const response = await fetch('/api/pharmacy/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create order');
  return await response.json();
};

export const updateOrderStatus = async (id, status) => {
  const response = await fetch(`/api/pharmacy/orders/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update order status');
  return await response.json();
};

export const getSuppliers = async () => {
  const response = await fetch('/api/pharmacy/suppliers');
  if (!response.ok) throw new Error('Failed to fetch suppliers');
  return await response.json();
};

export const addSupplier = async (data) => {
  const response = await fetch('/api/pharmacy/suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add supplier');
  return await response.json();
};

export const updateSupplier = async (id, data) => {
  const response = await fetch(`/api/pharmacy/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update supplier');
  return await response.json();
};

export const deleteSupplier = async (id) => {
  const response = await fetch(`/api/pharmacy/suppliers/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete supplier');
  return await response.json();
};

export const generateStockReport = async (timeRange) => {
  const response = await fetch(`/api/pharmacy/reports/stock?timeRange=${timeRange}`);
  if (!response.ok) throw new Error('Failed to generate stock report');
  return await response.json();
};

export const generateSalesReport = async (timeRange) => {
  const response = await fetch(`/api/pharmacy/reports/sales?timeRange=${timeRange}`);
  if (!response.ok) throw new Error('Failed to generate sales report');
  return await response.json();
};

export const dispenseMedication = async (data) => {
  const response = await fetch('/api/pharmacy/dispense', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to dispense medication');
  return await response.json();
};

export const processRefund = async (data) => {
  const response = await fetch('/api/pharmacy/refunds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to process refund');
  return await response.json();
};

export const createInvoice = async (data) => {
  const response = await fetch('/api/pharmacy/invoices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create invoice');
  return await response.json();
};

export const getStockAlerts = async () => {
  const response = await fetch('/api/pharmacy/stock-alerts');
  if (!response.ok) throw new Error('Failed to fetch stock alerts');
  return await response.json();
};

export const addStockAdjustment = async (data) => {
  const response = await fetch('/api/pharmacy/stock-adjustments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add stock adjustment');
  return await response.json();
};

export const getFormularies = async () => {
  const response = await fetch('/api/pharmacy/formularies');
  if (!response.ok) throw new Error('Failed to fetch formularies');
  return await response.json();
};

export const addFormulary = async (data) => {
  const response = await fetch('/api/pharmacy/formularies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to add formulary');
  return await response.json();
};

export const checkDrugInteractions = async (medicationIds) => {
  const response = await fetch('/api/pharmacy/drug-interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicationIds }),
  });
  if (!response.ok) throw new Error('Failed to check drug interactions');
  return await response.json();
};

export const trackNarcotic = async (medicationId) => {
  const response = await fetch(`/api/pharmacy/narcotics/${medicationId}`);
  if (!response.ok) throw new Error('Failed to track narcotic');
  return await response.json();
};

export const scanBarcode = async (barcode) => {
  const response = await fetch(`/api/pharmacy/barcode?barcode=${barcode}`);
  if (!response.ok) throw new Error('Failed to scan barcode');
  return await response.json();
};