import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;
const PHARMACY_BASE = `${BASE_URL}${API_ROUTES.PHARMACY}`;

export async function getInventory() {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/inventory`);
    return response.data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
}

export async function addMedication(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/medications`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
}

export async function updateStock(id, stockQuantity) {
  try {
    const response = await axios.put(`${PHARMACY_BASE}/medications/${id}/stock`, { stockQuantity });
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}

export async function deleteMedication(id) {
  try {
    const response = await axios.delete(`${PHARMACY_BASE}/medications/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
}

export async function getPrescriptions() {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/prescriptions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error;
  }
}

export async function createPrescription(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/prescriptions`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error;
  }
}

export async function updatePrescriptionStatus(id, status) {
  try {
    const response = await axios.put(`${PHARMACY_BASE}/prescriptions/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating prescription status:', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/orders`);
    return response.data;
  }  catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function createOrder(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/orders`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const response = await axios.put(`${PHARMACY_BASE}/orders}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function getSuppliers() {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/suppliers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
}

export async function addSupplier(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/suppliers`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw error;
  }
}

export async function updateSupplier(id, data) {
  try {
    const response = await axios.put(`${PHARMACY_BASE}/suppliers/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
}

export async function deleteSupplier(id) {
  try {
    const response = await axios.delete(`${PHARMACY_BASE}/suppliers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
}

export async function generateStockReport(timeRange) {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/reports/stock?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error generating stock report:', error);
    throw error;
  }
}

export async function generateSalesReport(timeRange) {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/reports/sales?timeRange=${timeRange}`);
    return response.data;
  } catch (error) {
    console.error('Error generating sales report:', error);
    throw error;
  }
}

export async function dispenseMedication(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/dispense`, data);
    return response.data;
  } catch (error) {
    console.error('Error dispensing medication:', error);
    throw error;
  }
}

export async function processRefund(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/refunds`, data);
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw error;
  }
}

export async function createInvoice(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/invoices`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

export async function getStockAlerts() {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/stock-alerts`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    throw error;
  }
}

export async function addStockAdjustment(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/stock-adjustments`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding stock adjustment:', error);
    throw error;
  }
}

export async function getFormularies() {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/formularies`);
    return response.data;
  } catch (error) {
    console.error('Error fetching formularies:', error);
    throw error;
  }
}

export async function addFormulary(data) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/formularies`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding formulary:', error);
    throw error;
  }
}

export async function checkDrugInteractions(medicationIds) {
  try {
    const response = await axios.post(`${PHARMACY_BASE}/drug-interactions`, { medicationIds });
    return response.data;
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    throw error;
  }
}

export async function trackNarcotic(medicationId) {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/narcotics/${medicationId}`);
    return response.data;
  } catch (error) {
    console.error('Error tracking narcotic:', error);
    throw error;
  }
}

export async function scanBarcode(barcode) {
  try {
    const response = await axios.get(`${PHARMACY_BASE}/barcode?barcode=${barcode}`);
    return response.data;
  } catch (error) {
    console.error('Error scanning barcode:', error);
    throw error;
  }
}