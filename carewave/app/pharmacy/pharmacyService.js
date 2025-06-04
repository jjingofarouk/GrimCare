import axios from 'axios';
import api from '../api';

const { BASE_URL, API_ROUTES } = api;

export async function getUsers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.USERS}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch users');
  }
}

export async function getPharmacists() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.USERS}?role=PHARMACIST`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.users.map(u => ({
      id: u.id,
      user: { name: u.name, email: u.email },
      licenseNumber: u.pharmacist?.licenseNumber || '',
      phone: u.pharmacist?.phone || '',
      specialty: u.pharmacist?.specialty || '',
    }));
  } catch (error) {
    console.error('Error fetching pharmacists:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch pharmacists');
  }
}

export async function addPharmacist(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.USERS}`, {
      name: data.name,
      email: data.email,
      role: 'PHARMACIST',
      password: data.password,
      licenseNumber: data.licenseNumber,
      phone: data.phone,
      specialty: data.specialty,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding pharmacist:', error);
    throw new Error(error.response?.data?.error || 'Failed to add pharmacist');
  }
}

export async function updatePharmacist(id, data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.USERS}/${id}`, {
      name: data.name,
      email: data.email,
      licenseNumber: data.licenseNumber,
      phone: data.phone,
      specialty: data.specialty,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating pharmacist:', error);
    throw new Error(error.response?.data?.error || 'Failed to update pharmacist');
  }
}

export async function deletePharmacist(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.delete(`${BASE_URL}${API_ROUTES.USERS}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting pharmacist:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete pharmacist');
  }
}

export async function getPrescriptions() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=prescriptions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.prescriptions;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch prescriptions');
  }
}

export async function createPrescription(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'createPrescription',
      payload: {
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        notes: data.notes,
        status: 'PENDING',
        items: data.items.map(item => ({
          medicationId: parseInt(item.medicationId),
          quantity: parseInt(item.quantity),
          dosage: item.dosage,
          frequency: item.frequency || 'As needed',
          duration: item.duration || 'Until finished',
        })),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw new Error(error.response?.data?.error || 'Failed to create prescription');
  }
}

export async function dispenseMedication(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'dispenseMedication',
      payload: {
        prescriptionId: parseInt(data.prescriptionId),
        medicationId: parseInt(data.medicationId),
        quantity: parseInt(data.quantity),
        patientType: data.patientType,
        dispensedById: parseInt(data.dispensedById),
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error dispensing medication:', error);
    throw new Error(error.response?.data?.error || 'Failed to dispense medication');
  }
}

export async function getInventory() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=inventory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.inventory;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch inventory');
  }
}

export async function addMedication(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addMedication',
      payload: {
        name: data.name,
        genericName: data.genericName || null,
        category: data.category,
        batchNumber: data.batchNumber,
        barcode: data.barcode || null,
        rfid: data.rfid || null,
        stockQuantity: parseInt(data.stockQuantity),
        minStockThreshold: parseInt(data.minStockThreshold) || 10,
        price: parseFloat(data.price),
        expiryDate: data.expiryDate,
        supplierId: data.supplierId ? parseInt(data.supplierId) : null,
        formularyId: data.formularyId ? parseInt(data.formularyId) : null,
        narcotic: data.narcotic || false,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding medication:', error);
    throw new Error(error.response?.data?.error || 'Failed to add medication');
  }
}

export async function updateMedication(id, data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${BASE_URL}${API_ROUTES.PHARMACY}/${id}`, {
      action: 'updateMedication',
      payload: {
        name: data.name,
        genericName: data.genericName || null,
        category: data.category,
        batchNumber: data.batchNumber,
        barcode: data.barcode || null,
        rfid: data.rfid || null,
        stockQuantity: parseInt(data.stockQuantity),
        minStockThreshold: parseInt(data.minStockThreshold) || 10,
        price: parseFloat(data.price),
        expiryDate: data.expiryDate,
        supplierId: data.supplierId ? parseInt(data.supplierId) : null,
        formularyId: data.formularyId ? parseInt(data.formularyId) : null,
        narcotic: data.narcotic || false,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating medication:', error);
    throw new Error(error.response?.data?.error || 'Failed to update medication');
  }
}

export async function getFormularies() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=formularies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.formularies;
  } catch (error) {
    console.error('Error fetching formularies:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch formularies');
  }
}

export async function addFormulary(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addFormulary',
      payload: {
        name: data.name,
        description: data.description || null,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding formulary:', error);
    throw new Error(error.response?.data?.error || 'Failed to add formulary');
  }
}

export async function getSuppliers() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}${API_ROUTES.PHARMACY}?resource=suppliers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch suppliers');
  }
}

export async function addSupplier(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${BASE_URL}${API_ROUTES.PHARMACY}`, {
      action: 'addSupplier',
      payload: {
        name: data.name,
        contact: data.contact,
        email: data.email,
        address: data.address,
      },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw new Error(error.response?.data?.error || 'Failed to add supplier');
  }
}