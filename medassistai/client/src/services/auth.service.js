import api from './api';

class AuthService {
  async login(phone, pin) {
    try {
      const response = await api.post('/auth/login', { phone, pin });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async sendPin(phone) {
    try {
      const response = await api.post('/auth/send-pin', { phone });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyPin(phone, pin) {
    try {
      const response = await api.post('/auth/verify-pin', { phone, pin });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser() {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout() {
    localStorage.removeItem('token');
    // Optional: call logout endpoint
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data.errors
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 500
      };
    }
  }
}

export default new AuthService();
