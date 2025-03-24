import axios from './axios';

// Fetch all properties
export const fetchProperties = async (token) => {
  try {
    const response = await axios.get('/crm_api/properties/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error.response?.data || error.message);
    throw error;
  }
};

// Fetch a single property by ID
export const fetchPropertyById = async (id, token) => {
  try {
    const response = await axios.get(`/crm_api/properties/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Create a new property
export const createProperty = async (propertyData, token) => {
  try {
    const response = await axios.post('/crm_api/properties/', propertyData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error.response?.data || error.message);
    throw error;
  }
};

// Update an existing property
export const updateProperty = async (id, propertyData, token) => {
  try {
    const response = await axios.put(`/crm_api/properties/${id}/`, propertyData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

// Delete a property
export const deleteProperty = async (id, token) => {
  try {
    await axios.delete(`/crm_api/properties/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error.response?.data || error.message);
    throw error;
  }
};