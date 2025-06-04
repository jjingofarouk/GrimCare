import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getPrescriptions() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.prescriptions;
  } catch (error) {
    throw error;
  }
}

export async function createPrescription(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createPrescription',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updatePrescriptionStatus(id, status) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updatePrescriptionStatus',
      payload: { status },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function checkDrugInteractions(medicationIds) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'checkDrugInteractions',
      payload: { medicationIds },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function createInvoice(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createInvoice',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function processRefund(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'processRefund',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function dispenseMedication(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'dispenseMedication',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function addMedication(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addMedication',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getInventory() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.inventory;
  } catch (error) {
    throw error;
  }
}

export async function updateStock(id, stockQuantity) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateStock',
      payload: { stockQuantity },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteMedication(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getStockAlerts() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.inventory.filter(item => item.stockQuantity <= item.minStockThreshold);
  } catch (error) {
    throw error;
  }
}

export async function scanBarcode(barcode) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    const medication = response.data.inventory.find(item => item.barcode === barcode);
    return medication || null;
  } catch (error) {
    throw error;
  }
}

export async function getFormularies() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.formularies;
  } catch (error) {
    throw error;
  }
}

export async function addFormulary(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addFormulary',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getOrders() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.orders;
  } catch (error) {
    throw error;
  }
}

export async function createOrder(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createOrder',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateOrderStatus(id, status) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateOrderStatus',
      payload: { status },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getSuppliers() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.suppliers;
  } catch (error) {
    throw error;
  }
}

export async function addSupplier(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addSupplier',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateSupplier(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateSupplier',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteSupplier(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function trackNarcotic(medicationId) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}/${medicationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function generateStockReport(timeRange) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    const inventory = response.data.inventory;
    return inventory.map(item => ({
      name: item.name,
      stockQuantity: item.stockQuantity,
    }));
  } catch (error) {
    throw error;
  }
}

export async function generateSalesReport(timeRange) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.prescriptions
      .filter(p => p.dispensingRecords.length > 0)
      .flatMap(p => p.dispensingRecords);
  } catch (error) {
    throw error;
  }
}

export async function getPharmacists() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.pharmacists;
  } catch (error) {
    throw error;
  }
}

export async function addPharmacist(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addPharmacist',
      payload: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}