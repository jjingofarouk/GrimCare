import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getUsers() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.USERS}`);
    return response.data.users.filter(user => ['PHARMACIST', 'ADMIN'].includes(user.role));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}

export async function getPrescriptions() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.prescriptions.filter(p => p.status === 'PENDING');
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw new Error('Failed to fetch prescriptions');
  }
}

export async function createPrescription(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createPrescription',
      payload: {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        notes: data.notes,
        status: 'PENDING',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw new Error('Failed to create prescription');
  }
}

export async function createUser(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.USERS}`, {
      name: data.name,
      email: data.email,
      role: data.role || 'PHARMACIST',
      password: data.password,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

export async function dispenseMedication(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'dispenseMedication',
      payload: {
        prescriptionId: parseInt(data.prescriptionId),
        medicationId: parseInt(data.medicationId),
        quantity: parseInt(data.quantity),
        patientType: data.patientType,
        dispensedById: parseInt(data.dispensedById),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error dispensing medication:', error);
    throw new Error(`Failed to dispense medication: ${error.message}`);
  }
}

export async function getInventory() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.inventory;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw new Error('Failed to fetch inventory');
  }
}

export async function checkDrugInteractions(medicationIds) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    const interactions = response.data.inventory
      .filter(item => medicationIds.includes(item.id))
      .flatMap(item => item.drugInteractions1 || []).concat(
        response.data.inventory.flatMap(item => item.drugInteractions2 || [])
      );
    return interactions;
  } catch (error) {
    console.error('Error checking drug interactions:', error);
    throw new Error('Failed to check drug interactions');
  }
}

export async function createInvoice(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createInvoice',
      payload: {
        prescriptionId: parseInt(data.prescriptionId),
        totalAmount: parseFloat(data.totalAmount),
        paymentMethod: data.paymentMethod,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw new Error('Failed to create invoice');
  }
}

export async function processRefund(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'processRefund',
      payload: {
        invoiceId: parseInt(data.invoiceId),
        reason: data.reason,
        amount: parseFloat(data.amount),
        processedById: parseInt(data.processedById),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error processing refund:', error);
    throw new Error('Failed to process refund');
  }
}

export async function addMedication(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addMedication',
      payload: {
        name: data.name,
        genericName: data.genericName,
        category: data.category,
        batchNumber: data.batchNumber,
        barcode: data.barcode,
        rfid: data.rfid,
        stockQuantity: parseInt(data.stockQuantity),
        minStockThreshold: parseInt(data.minStockThreshold) || 10,
        price: parseFloat(data.price),
        expiryDate: data.expiryDate,
        supplierId: data.supplierId ? parseInt(data.supplierId) : undefined,
        formularyId: data.formularyId ? parseInt(data.formularyId) : undefined,
        narcotic: data.narcotic || false,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error('Failed to add medication');
  }
}

export async function updateStock(id, stockQuantity) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateStock',
      payload: { stockQuantity: parseInt(stockQuantity) },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw new Error('Failed to update stock');
  }
}

export async function deleteMedication(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting medication:', error);
    throw new Error('Failed to delete medication');
  }
}

export async function getStockAlerts() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.inventory.filter(item => item.stockQuantity <= item.minStockThreshold);
  } catch (error) {
    console.error('Error fetching stock alerts:', error);
    throw new Error('Failed to fetch stock alerts');
  }
}

export async function scanBarcode(barcode) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    const medication = response.data.inventory.find(item => item.barcode === barcode);
    return medication || null;
  } catch (error) {
    console.error('Error scanning barcode:', error);
    throw new Error('Failed to scan barcode');
  }
}

export async function getFormularies() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.formularies;
  } catch (error) {
    console.error('Error fetching formularies:', error);
    throw new Error('Failed to fetch formularies');
  }
}

export async function addFormulary(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addFormulary',
      payload: {
        name: data.name,
        description: data.description,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding formulary:', error);
    throw new Error('Failed to add formulary');
  }
}

export async function getOrders() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function createOrder(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createOrder',
      payload: {
        supplierId: parseInt(data.supplierId),
        items: data.items.map(item => ({
          medicationId: parseInt(item.medicationId),
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
        })),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
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
    throw new Error('Failed to update order status');
  }
}

export async function getSuppliers() {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    return response.data.suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error('Failed to fetch suppliers');
  }
}

export async function addSupplier(data) {
  try {
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addSupplier',
      payload: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw new Error('Failed to add supplier');
  }
}

export async function updateSupplier(id, data) {
  try {
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateSupplier',
      payload: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw new Error('Failed to update supplier');
  }
}

export async function deleteSupplier(id) {
  try {
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw new Error('Failed to delete supplier');
  }
}

export async function trackNarcotic(medicationId) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}/${medicationId}`);
    return response.data.dispensingRecords || [];
  } catch (error) {
    console.error('Error tracking narcotic:', error);
    throw new Error('Failed to track narcotic');
  }
}

export async function generateStockReport(timeRange) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    const inventory = response.data.inventory;
    if (timeRange) {
      return inventory
        .filter(item => {
          const updatedAt = new Date(item.updatedAt);
          return updatedAt >= new Date(timeRange.start) && updatedAt <= new Date(timeRange.end);
        })
        .map(item => ({
          name: item.name,
          stockQuantity: item.stockQuantity,
          minStockThreshold: item.minStockThreshold,
          expiryDate: item.expiryDate,
        }));
    }
    return inventory.map(item => ({
      name: item.name,
      stockQuantity: item.stockQuantity,
      minStockThreshold: item.minStockThreshold,
      expiryDate: item.expiryDate,
    }));
  } catch (error) {
    console.error('Error generating stock report:', error);
    throw new Error('Failed to generate stock report');
  }
}

export async function generateSalesReport(timeRange) {
  try {
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}`);
    const dispensingRecords = response.data.prescriptions
      .filter(p => p.dispensingRecords.length > 0)
      .flatMap(p => p.dispensingRecords);
    if (timeRange) {
      return dispensingRecords.filter(record => {
        const dispensedDate = new Date(record.dispensedDate);
        return dispensedDate >= new Date(timeRange.start) && dispensedDate <= new Date(timeRange.end);
      });
    }
    return dispensingRecords;
  } catch (error) {
    console.error('Error generating sales report:', error);
    throw new Error('Failed to generate sales report');
  }
}