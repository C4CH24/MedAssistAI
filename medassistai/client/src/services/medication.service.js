import api from './api';

class MedicationService {
  async getAllMedications() {
    try {
      const response = await api.get('/medications');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getMedication(id) {
    try {
      const response = await api.get(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async addMedication(medicationData) {
    try {
      const response = await api.post('/medications', medicationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateMedication(id, medicationData) {
    try {
      const response = await api.put(`/medications/${id}`, medicationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteMedication(id) {
    try {
      const response = await api.delete(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async checkInteractions(medicationName) {
    try {
      const response = await api.post('/ai/check-interactions', { medicationName });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAISuggestions(medicationData) {
    try {
      const response = await api.post('/ai/medication-suggestions', medicationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data.errors
      };
    } else if (error.request) {
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500
      };
    }
  }
}

export default new MedicationService();
