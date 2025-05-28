// pharmacy/pharmacyService.js
export const getInventory = async () => {
  // Simulate API call
  return [
    { id: 1, name: 'Paracetamol', category: 'Analgesics', stock: 500, price: 5.99, expiry: '2026-05-01' },
    { id: 2, name: 'Ibuprofen', category: 'Analgesics', stock: 300, price: 7.99, expiry: '2025-12-01' },
  ];
};

export const updateStock = async (id, newStock) => {
  // Simulate API call
  console.log(`Updating stock for medication ${id} to ${newStock}`);
};

export const deleteMedication = async (id) => {
  // Simulate API call
  console.log(`Deleting medication ${id}`);
};

export const getOrders = async () => {
  // Simulate API call
  return [
    { id: 1, medication: 'Paracetamol', quantity: 1000, supplier: 'MediCorp', date: '2025-05-20', status: 'Pending' },
    { id: 2, medication: 'Ibuprofen', quantity: 500, supplier: 'PharmaInc', date: '2025-05-15', status: 'Delivered' },
  ];
};

export const updateOrderStatus = async (id, status) => {
  // Simulate API call
  console.log(`Updating order ${id} status to ${status}`);
};

export const createOrder = async (order) => {
  // Simulate API call
  console.log('Creating new order:', order);
};

export const getSuppliers = async () => {
  // Simulate API call
  return [
    { id: 1, name: 'MediCorp', contact: '123-456-7890', email: 'contact@medicorp.com', address: '123 Medi St' },
    { id: 2, name: 'PharmaInc', contact: '987-654-3210', email: 'info@pharmainc.com', address: '456 Pharma Rd' },
  ];
};

export const addSupplier = async (supplier) => {
  // Simulate API call
  console.log('Adding supplier:', supplier);
};

export const updateSupplier = async (id, data) => {
  // Simulate API call
  console.log(`Updating supplier ${id}:`, data);
};

export const deleteSupplier = async (id) => {
  // Simulate API call
  console.log(`Deleting supplier ${id}`);
};

export const generateStockReport = async (timeRange) => {
  // Simulate API call
  console.log(`Generating stock report for ${timeRange}`);
};

export const generateSalesReport = async (timeRange) => {
  // Simulate API call
  console.log(`Generating sales report for ${timeRange}`);
};

export const updateSettings = async (settings) => {
  // Simulate API call
  console.log('Updating settings:', settings);
};

export const addMedication = async (medication) => {
  // Simulate API call
  console.log('Adding medication:', medication);
};
