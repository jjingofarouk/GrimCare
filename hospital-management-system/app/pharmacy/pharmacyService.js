
import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getPrescriptions() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.prescriptions;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
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
    console.error('Error creating prescription:', error);
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
    console.error('Error updating prescription status:', error);
    throw error;
  }
}

export async function checkDrugInteractions(medicationIds) {
  try {
    const interactions = await prisma.drugInteraction.findMany({
      where: {
        OR: [
          { medicationId1: { in: medicationIds } },
          { medicationId2: { in: medicationIds } },
        ],
      },
      include: { medication1: true, medication2: true },
    });
    return interactions;
  } catch (error) {
    console.error('Error checking drug interactions:', error);
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
    console.error('Error creating invoice:', error);
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
    console.error('Error processing refund:', error);
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
    console.error('Error dispensing medication:', error);
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
    console.error('Error adding medication:', error);
    throw error;
  }
}

export async function getInventory() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.inventory;
  } catch (error) {
    console.error('Error fetching inventory:', error);
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
    console.error('Error updating stock:', error);
    throw error;
  }
}

export async function deleteMedication(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw error;
  }
}

export async function getStockAlerts() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.inventory.filter(item => item.stockQuantity <= item.minStockThreshold);
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    throw error;
  }
}

export async function scanBarcode(barcode) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    const medication = response.data.inventory.find(item => item.barcode === barcode);
    return medication || null;
  } catch (error) {
    console.error('Error scanning barcode:', error);
    throw error;
  }
}

export async function getFormularies() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.formularies;
  } catch (error) {
    console.error('Error fetching formularies:', error);
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
    console.error('Error adding formulary:', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
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
    console.error('Error creating order:', error);
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
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function getSuppliers() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
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
    console.error('Error adding supplier:', error);
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
    console.error('Error updating supplier:', error);
    throw error;
  }
}

export async function deleteSupplier(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
}

export async function trackNarcotic(medicationId) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}/${medicationId}`);
    return response.data;
  } catch (error) {
    console.error('Error tracking narcotic:', error);
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
    console.error('Error generating stock report:', error);
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
    console.error('Error generating sales report:', error);
    throw error;
  }
}